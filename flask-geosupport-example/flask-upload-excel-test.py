
from flask import Flask, request, render_template, redirect, session
import pandas as pd
import os

app = Flask(__name__)
app.secret_key = 'dev'  # replace in production

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files.get('file')
        if not file or file.filename == '':
            return 'No file selected', 400
        try:
            df = pd.read_excel(file, engine='openpyxl')
        except Exception as e:
            return f'Error reading Excel file: {e}', 400
        session['data'] = df.to_json()  # store in session
        cols = df.columns.tolist()
        return render_template('select_columns.html', columns=cols)
    return render_template('upload.html')

@app.route('/select', methods=['POST'])
def select_columns():
    house = request.form.get('house')
    street = request.form.get('street')
    zipc = request.form.get('zip')
    return f'Selected columns: house={house}, street={street}, zip={zipc}'

if __name__ == "__main__":
    app.run(debug=True)


