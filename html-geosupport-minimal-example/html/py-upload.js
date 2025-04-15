// Mark Torrey, from ChatGPT 2025-04-14
// extracts column names from uploaded CSV
// hands the file to py-upload.py python script for processing
// handles the file download after processing
document.getElementById("csvFile").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const headers = e.target.result.split("\n")[0].split(",");
        ["building", "street", "zip"].forEach(id => {
            const dropdown = document.getElementById(`${id}_col`);
            dropdown.innerHTML = "";
            headers.forEach(header => {
                const option = document.createElement("option");
                option.value = header.trim();
                option.textContent = header.trim();
                dropdown.appendChild(option);
            });
        });
    };
    reader.readAsText(file);
});

function uploadFile() {
    const file = document.getElementById("csvFile").files[0];
    const buildingCol = document.getElementById("building_col").value;
    const streetCol = document.getElementById("street_col").value;
    const zipCol = document.getElementById("zip_col").value;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("building_col", buildingCol);
    formData.append("street_col", streetCol);
    formData.append("zip_col", zipCol);

    fetch("/cgi-bin/py-upload.py", {
        method: "POST",
        body: formData,
    })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "processed-py.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            document.getElementById("status").innerText = "Done!";
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("status").innerText = "Error during upload.";
        });
}
