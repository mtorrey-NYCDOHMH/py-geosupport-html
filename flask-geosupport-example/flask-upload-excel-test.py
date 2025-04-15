
from flask import Flask, request, render_template, redirect
import pandas as pd
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400
        try:
            df = pd.read_excel(file, engine='openpyxl')
        except Exception as e:
            return f'Error reading Excel file: {e}', 400
        preview = df.head().to_html(classes='table')
        return f'<h2>Preview</h2>{preview}<br><a href="/">Upload another</a>'
    return render_template('upload.html')

if __name__ == "__main__":
    app.run(debug=True)
