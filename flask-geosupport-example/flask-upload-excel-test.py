
from flask import Flask, request, render_template, redirect, url_for, session
import pandas as pd
from geosupport import Geosupport
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your_secret_key'
UPLOAD_FOLDER = '/tmp'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

g = Geosupport()

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        session['filepath'] = filepath
        return redirect(url_for('select_columns'))
    return render_template('upload.html')

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
    return render_template('select.html', columns=columns)

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
            return g.address(
                house_number=str(row[house_col]),
                street_name=row[street_col],
                zip_code=str(row[zip_col])
            )
        except:
            return None

    df['geocode'] = df.apply(try_geocode, axis=1)
    return df.to_html()

if __name__ == "__main__":
    app.run(debug=True)

