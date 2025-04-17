
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
@app.route('/geocode')
def geocode_data():
    filepath = session.get('filepath')
    if not filepath or not os.path.exists(filepath):
        return 'File missing', 400
    df = pd.read_excel(filepath)
    house_col = session.get('house_col')
    street_col = session.get('street_col')
    zip_col = session.get('zip_col')

    if not all([house_col, street_col, zip_col]):
        return 'Missing column selection', 400

    def try_geocode(row):
        try:
            result = g.address(
                house_number=str(row[house_col]),
                street_name=row[street_col],
                zip_code=str(row[zip_col])
            )
            return {
                # Just asking for XY and error columns back, but it is possible to get any geosupport field:
                'Latitude': result.get('Latitude'),
                'Longitude': result.get('Longitude'),
                'Geosupport Error': None
            }
        except Exception as e:
            return {
                'Latitude': None,
                'Longitude': None,
                'Geosupport Error': str(e)
            }

    geo_results = df.apply(try_geocode, axis=1, result_type='expand')
    df = pd.concat([df, geo_results], axis=1)
    os.remove(filepath) # Remove the saved uploaded file from /tmp

    return df.to_html() # This very simply renders the returned dataframe as an html page in the user's browser.

# This is necessary to run this file on the command line. You can turn off debugging, or comment this whole thing if it is run from Apache
if __name__ == "__main__":
    app.run(debug=True)

