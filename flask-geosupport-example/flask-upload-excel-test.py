
import os
import pandas as pd
from flask import Flask, request, render_template, redirect, url_for, session
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "your-secret-key"
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        file = request.files["file"]
        if not file:
            return "No file uploaded", 400
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        session["filepath"] = filepath
        return redirect(url_for("select_columns"))
    return render_template("upload.html")

@app.route("/select", methods=["GET", "POST"])
def select_columns():
    filepath = session.get("filepath")
    if not filepath or not os.path.exists(filepath):
        return redirect(url_for("upload_file"))
    df = pd.read_excel(filepath)
    if request.method == "POST":
        session["house_col"] = request.form["house_col"]
        session["street_col"] = request.form["street_col"]
        session["zip_col"] = request.form["zip_col"]
        return redirect(url_for("geocode_data"))
    columns = df.columns.tolist()
    return render_template("select_columns.html", columns=columns)

@app.route("/geocode")
def geocode_data():
    filepath = session.get("filepath")
    if not filepath or not os.path.exists(filepath):
        return redirect(url_for("upload_file"))
    df = pd.read_excel(filepath)
    # basic preview with selected columns
    cols = [session["house_col"], session["street_col"], session["zip_col"]]
    preview = df[cols].head().to_html()
    return preview

if __name__ == "__main__":
    app.run(debug=True)
