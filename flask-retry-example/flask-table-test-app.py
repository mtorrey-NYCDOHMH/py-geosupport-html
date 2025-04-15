
from flask import Flask, request, render_template

app = Flask(__name__)

# Simulated failed geocoded row(s)
FAILED_ROWS = [
    {"house_number": "123", "street": "Fake St", "zip": "10001", "error": "Invalid address"},
]

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html", failed_rows=FAILED_ROWS)

@app.route("/retry", methods=["POST"])
def retry():
    count = int(request.form["row_count"])
    results = []

    for i in range(1, count + 1):
        house_number = request.form[f"house_number_{i}"]
        street = request.form[f"street_{i}"]
        zip_code = request.form[f"zip_{i}"]

        # Fake geocode retry logic
        if street.lower() == "main st":
            results.append({
                "house_number": house_number,
                "street": street,
                "zip": zip_code,
                "status": "✅ Success"
            })
        else:
            results.append({
                "house_number": house_number,
                "street": street,
                "zip": zip_code,
                "status": "❌ Failed"
            })

    return render_template("results.html", results=results)

if __name__ == "__main__":
    app.run(debug=True)
