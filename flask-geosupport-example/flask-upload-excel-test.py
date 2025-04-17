
from flask import Flask, request, render_template, redirect, url_for, session
import pandas as pd
import os
from werkzeug.utils import secure_filename
from geosupport import Geosupport, GeosupportError

app = Flask(__name__)
app.secret_key = 'your_secret_key'
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

g = Geosupport()

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            df = pd.read_excel(filepath)
            session['filepath'] = filepath
            return render_template('select.html', columns=df.columns)
    return render_template('upload.html')

@app.route('/select', methods=['POST'])
def select():
    session['house_col'] = request.form['house_col']
    session['street_col'] = request.form['street_col']
    session['zip_col'] = request.form['zip_col']
    return redirect(url_for('geocode_data'))

@app.route('/geocode')
def geocode_data():
    df = pd.read_json(session['data_json'])

    house_col = session['house_col']
    street_col = session['street_col']
    zip_col = session['zip_col']

    def try_geocode(row):
        try:
            result = g.address(house_number=str(row[house_col]),
                               street_name=row[street_col],
                               zip_code=str(row[zip_col]))
            return result.get('Latitude'), result.get('Longitude')
        except Exception:
            return None, None

    df[['Latitude', 'Longitude']] = df.apply(try_geocode, axis=1, result_type='expand')
    return render_template('results.html', tables=[df.to_html(index=False)], titles=['Geocoding Results'])

if __name__ == '__main__':
    app.run(debug=True)


