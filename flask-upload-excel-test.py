# NOTE: Because geosupport requires environment variables set externally to python, you need to run `to-set-geosupport-env-vars.sh` instead of this file, That bash script will call this file after setting the environment variables.

import os
import uuid
import tempfile # needed for the stuff that sets the tmp file permissions
import io
import time # needed for checking file times for deleting old files
import shutil # needed for rmtree for deleting session folder
from flask import Flask, request, render_template, redirect, url_for, session, send_file
from werkzeug.utils import secure_filename
from geosupport import Geosupport # geocoder package, have to install manually.
import pandas as pd
# Note you need to install openpyxl to upload excel files too, though it's not imported.

app = Flask(__name__)
app.secret_key = 'your_secret_key' # This needs to be set to something random for production, required by Flask for saving session keys
BASE_TMP_DIR = '/tmp/secure_geosupport_uploads' 
os.makedirs(BASE_TMP_DIR, exist_ok=True) # create a base directory for the app in /tmp
os.chmod(BASE_TMP_DIR, 0o700)

app.config['BASE_TMP_DIR'] = BASE_TMP_DIR

g = Geosupport()

## Test submitting house number + street name to the street_name field in 1B:
#result = g['1B']({'street_name': '2102 AMSTERDAM AVENUE', 'zip_code': '10032'})
#print(result)

### Home page to upload file:
@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':

        # Delete session dirs more than 2 hours old
        # The idea being that if someone left data in /tmp withouth clicking the 'end session' button, this will take care of it.
        # (Alternatively, this could be done with a cron job, but I like having it here so I don't have to remember there's a separate process running for security)
        # (move this above if request.method line if you want it to run every time the page is loaded. This runs on the upload button being clicked.)
        now = time.time()
        for name in os.listdir(BASE_TMP_DIR):
            path = os.path.join(BASE_TMP_DIR, name)
            if os.path.isdir(path):
                if now - os.path.getmtime(path) > 2 * 60 * 60:
                    try:
                        shutil.rmtree(path)
                    except Exception:
                        pass

        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400

        # Create a unique session-specific subdirectory
        session_id = str(uuid.uuid4())
        session_dir = os.path.join(app.config['BASE_TMP_DIR'], session_id)
        os.makedirs(session_dir, exist_ok=True) # create the uuid session-specific subdir in /tmp on the system
        os.chmod(session_dir, 0o700)

        session['upload_dir'] = session_dir
        # Now you use session['upload_dir'] anywhere you want to reference the session upload dir

        # Save uploaded file with secure permissions
        filename = secure_filename(file.filename) # cleans the file name of abusable stuff like ../, from werkseug.utils
        filepath = os.path.join(session_dir, filename)

        # TODO: make sure this works and is secure on multi-user system.
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
        session['geocode_mode'] = request.form['geocode_mode']  # 'zip' or 'boro'
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
    geocode_mode = session.get('geocode_mode', 'zip')  # default to 'zip'

    gdf = pd.DataFrame()
    latitudes = []
    longitudes = []
    errors = []

    for _, row in df.iterrows():
        try:
            house_number = row[house_col] if house_col else ''
            if geocode_mode == 'boro': # If user selected geocode by boro, use the boro data (held in the zip_col)
                result = g.address(
                    house_number=house_number,
                    street_name=row[street_col],
                    borough=row[zip_col]
                )
            else:
                result = g.address( # Otherwise, use the actual zip code data in the zip_col
                    house_number=house_number,
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

    # Save initial error results for download
    error_path = os.path.join(session['upload_dir'], 'last_error_cache.csv')
    df_error.to_csv(error_path, index=False)

    # Get count of rows for successfully geocded and failed:
    valid_count = len(df_valid)
    error_count = len(df_error)

    return render_template('geocode_result.html', valid=df_valid, error=df_error, valid_count=valid_count, error_count=error_count) # calls geocode_result template for user to review data successfully geocoded, and edit lines that failed.


@app.route('/retry', methods=['POST'])
def retry():
    house_col = session.get('house_col')
    street_col = session.get('street_col')
    zip_col = session.get('zip_col')
    upload_dir = session.get('upload_dir')

    if not upload_dir:
        return 'Session upload directory missing.', 500

    # Get selected mode from form:
    geocode_mode = request.form.get('geocode_mode', 'zip')

    # Reconstruct DataFrame from form inputs
    import re

    pattern = re.compile(r'^(.*)_(\d+)$')
    row_indices = set()
    columns = set()

    for key in request.form.keys():
        match = pattern.match(key)
        if match:
            col, idx = match.groups()
            columns.add(col)
            row_indices.add(idx)

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
            house_number = row[house_col] if house_col else ''
            street_name = row[street_col]
            loc_value = row[zip_col]

            if geocode_mode == 'boro':
                result = g.address(
                    house_number=house_number,
                    street_name=street_name,
                    borough=loc_value
                )
            else:
                result = g.address(
                    house_number=house_number,
                    street_name=street_name,
                    zip_code=loc_value
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

    # Save error table to reuse during download
    df_error.to_csv(os.path.join(upload_dir, 'last_error_cache.csv'), index=False)

    # Get count of rows for successfully geocded and failed:
    valid_count = len(df_valid_combined)
    error_count = len(df_error)

    return render_template('geocode_result.html', valid=df_valid_combined, error=df_error,
                           valid_count=valid_count, error_count=error_count)


@app.route('/download', methods=['GET'])
def download_results():
    upload_dir = session.get('upload_dir')
    if not upload_dir:
        return 'No session data available.', 400

    valid_path = os.path.join(upload_dir, 'valid_addresses.csv')
    error_path = os.path.join(upload_dir, 'last_error_cache.csv')

    if not os.path.exists(valid_path) and not os.path.exists(error_path):
        return 'No results available.', 400

    df_valid = pd.read_csv(valid_path) if os.path.exists(valid_path) else pd.DataFrame()
    df_error = pd.read_csv(error_path) if os.path.exists(error_path) else pd.DataFrame(columns=df_valid.columns)

    # Combine: errors first
    df_all = pd.concat([df_error, df_valid], ignore_index=True)

    # Write to a temporary Excel file
    tmp_excel_path = os.path.join(upload_dir, 'geocoding_results.xlsx')
    df_all.to_excel(tmp_excel_path, index=False, engine='openpyxl')

    # Prepare file to send
    response = send_file(tmp_excel_path, as_attachment=True, download_name='geocoding_results.xlsx')

    return response

# This route deletes the user files and returns them to the upload page to start over.
@app.route('/end', methods=['POST'])
def end_session():
    upload_dir = session.get('upload_dir')

    # Clear session and delete upload dir
    session.clear()
    if upload_dir and os.path.exists(upload_dir):
        shutil.rmtree(upload_dir, ignore_errors=True)

    return redirect(url_for('upload_file')) # return user to upload_file function

# This is necessary to run this file on the command line. You can turn off debugging, or comment this whole thing if it is run from Apache
if __name__ == "__main__":
    app.run(debug=True) # by default, runs on localhost:5000
    # If you want to run for remote system, uncomment:
    #app.run(host='stgapprcode.health.dohmh.nycnet', port=5000)
    # NOTE: You'll get a `Name or service not known` error if this is set incorrectly.

