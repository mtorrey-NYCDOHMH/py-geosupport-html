# NOTE: Because geosupport requires environment variables set externally to python, you need to run `to-set-geosupport-env-vars.sh` instead of this file, That bash script will call this file after setting the environment variables.

import os
import uuid
import tempfile # needed for the stuff that sets the tmp file permissions
from flask import Flask, request, render_template, redirect, url_for, session
from werkzeug.utils import secure_filename
from geosupport import Geosupport # geocoder package, have to install manually.
import pandas as pd
# Note you need to install openpyxl to upload excel files too, though it's not imported.

app = Flask(__name__)
app.secret_key = 'your_secret_key' # This needs to be set to something random for production
BASE_TMP_DIR = '/tmp/secure_geosupport_uploads' 
os.makedirs(BASE_TMP_DIR, exist_ok=True) # create a base directory for the app in /tmp
os.chmod(BASE_TMP_DIR, 0o700)

app.config['BASE_TMP_DIR'] = BASE_TMP_DIR

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

        # Create a unique session-specific subdirectory
        session_id = str(uuid.uuid4())
        session_dir = os.path.join(app.config['BASE_TMP_DIR'], session_id)
        os.makedirs(session_dir, exist_ok=True)
        os.chmod(session_dir, 0o700)

        session['upload_dir'] = session_dir
        # Now you use session['upload_dir'] anywhere you want to reference the session upload dir

        # Save uploaded file with secure permissions
        filename = secure_filename(file.filename)
        filepath = os.path.join(session_dir, filename)

        old_umask = os.umask(0o177)
        try:
            file.save(filepath)
        finally:
            os.umask(old_umask)

        session['filepath'] = filepath
        return redirect(url_for('select_columns'))

    return render_template('upload.html')

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

    # Store valid results in file
    first_valid = os.path.join(session['upload_dir'], 'valid_addresses.csv')
    df_valid.to_csv(first_valid, index=False)

    return render_template('geocode_result.html', valid=df_valid, error=df_error) # calls geocode_result template for user to review data successfully geocoded, and edit lines that failed.

@app.route('/retry', methods=['POST'])
def retry():
    house_col = session.get('house_col')
    street_col = session.get('street_col')
    zip_col = session.get('zip_col')
    upload_dir = session.get('upload_dir')

    if not upload_dir:
        return 'Session upload directory missing.', 500

    # Reconstruct DataFrame from form inputs
    keys = request.form.keys()
    row_indices = set(k.split('_')[-1] for k in keys if '_' in k)
    columns = set(k.rsplit('_', 1)[0] for k in keys)

    data = []
    for idx in row_indices:
        row = {col: request.form.get(f'{col}_{idx}') for col in columns}
        data.append(row)
    df_retry = pd.DataFrame(data)

    # Retry geocoding
    latitudes = []
    longitudes = []
    errors = []

    for _, row in df_retry.iterrows():
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

    df_retry['Latitude'] = latitudes
    df_retry['Longitude'] = longitudes
    df_retry['Geosupport Error'] = errors

    # Load old valid data from file
    valid_path = os.path.join(upload_dir, 'valid_addresses.csv')
    if os.path.exists(valid_path):
        df_valid_old = pd.read_csv(valid_path)
    else:
        df_valid_old = pd.DataFrame(columns=df_retry.columns)

    # Split new valid and invalid rows
    df_valid_new = df_retry[df_retry['Geosupport Error'].isna()]
    df_error = df_retry[df_retry['Geosupport Error'].notna()]

    # Combine and save valid addresses
    df_valid_combined = pd.concat([df_valid_old, df_valid_new], ignore_index=True)
    df_valid_combined.to_csv(valid_path, index=False)

    # Ensure consistent column order
    df_error = df_error[df_valid_combined.columns]

    return render_template('geocode_result.html', valid=df_valid_combined, error=df_error)


# NOTE: Make sure you delete the user session stuff from /tmp after the user download results


# This is necessary to run this file on the command line. You can turn off debugging, or comment this whole thing if it is run from Apache
if __name__ == "__main__":
    app.run(debug=True)

