
# NOTE: Because geosupport requires environment variables set externally to python, you need to run `to-set-geosupport-env-vars.sh` instead of this file, That bash script will call this file after setting the environment variables.

from flask import Flask, request, render_template, redirect, url_for, session
import pandas as pd
from geosupport import Geosupport # geocoder package, have to install manually.
import os
import tempfile # needed for the stuff that sets the tmp file permissions
from werkzeug.utils import secure_filename
# Note you need to install openpyxl to upload excel files too, though it's not imported.

app = Flask(__name__)
app.secret_key = 'your_secret_key' # This needs to be set to something random for production
UPLOAD_FOLDER = '/tmp'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

g = Geosupport()

### Home page to upload file:
@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400

        filename = secure_filename(file.filename)

        # Set restrictive umask so file is created with 0600 permissions
        old_umask = os.umask(0o177)
        try:
            with tempfile.NamedTemporaryFile(delete=False, dir=app.config['UPLOAD_FOLDER'], suffix='.xlsx') as tmp:
                file.save(tmp.name)
                session['filepath'] = tmp.name
        finally:
            os.umask(old_umask)

        return redirect(url_for('select_columns'))
    return render_template('upload.html') # calls upload.html in templates/

### Select building num, street name, and zip columns for geocoding:
@app.route('/select', methods=['GET', 'POST'])
def select_columns():
    filepath = session.get('filepath')
    if not filepath or not os.path.exists(filepath):
        return 'No file uploaded', 400
    df = pd.read_excel(filepath)
    if request.method == 'POST':
        session['house_col'] = request.form['house_col']
        session['street_col'] = request.form['street_col']
        session['zip_col'] = request.form['zip_col']
        return redirect(url_for('geocode_data'))
    columns = df.columns.tolist()
    return render_template('select.html', columns=columns) # calls select.html in templates/

### Do the actual geocoding:
@app.route('/geocode', methods=['GET', 'POST'])
def geocode_data():
    filepath = session.get('filepath')
    if not filepath:
        return 'No file uploaded', 400

    df = pd.read_excel(filepath)
    house_col = session['house_col']
    street_col = session['street_col']
    zip_col = session['zip_col']

    gdf = pd.DataFrame()
    latitudes = []
    longitudes = []
    errors = []

    for _, row in df.iterrows():
        try:
            result = g.address(
                house_number=row[house_col],
                street_name=row[street_col],
                zip_code=row[zip_col]
            )
            latitudes.append(result.get('Latitude'))
            longitudes.append(result.get('Longitude'))
            errors.append(None)
        except Exception as e:
            latitudes.append(None)
            longitudes.append(None)
            errors.append(str(e))

    df['Latitude'] = latitudes
    df['Longitude'] = longitudes
    df['Geosupport Error'] = errors

    df_valid = df[df['Geosupport Error'].isna()]
    df_error = df[df['Geosupport Error'].notna()] 

    os.remove(filepath) # Remove the saved uploaded file from /tmp

    return render_template('geocode_result.html', valid=df_valid, error=df_error) # calls geocode_result template for user to review data successfully geocoded, and edit lines that failed.

# This is necessary to run this file on the command line. You can turn off debugging, or comment this whole thing if it is run from Apache
if __name__ == "__main__":
    app.run(debug=True)

