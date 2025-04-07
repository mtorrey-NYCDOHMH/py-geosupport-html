// Mark Torrey, from ChatGPT 2025-03-12 16:33
// extracts column names from uploaded CSV
// hands the file to py-upload.sh bash script for processing
// handles the file download after processing
document.getElementById("csvFile").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split("\n");
        if (lines.length > 0) {
            const headers = lines[0].split(",");
            const dropdown = document.getElementById("column");
            dropdown.innerHTML = "";
            headers.forEach(header => {
                const option = document.createElement("option");
                option.value = header.trim();
                option.textContent = header.trim();
                dropdown.appendChild(option);
            });
        }
    };
    reader.readAsText(file);
});

function uploadFile() {
    const fileInput = document.getElementById("csvFile");
    const columnSelect = document.getElementById("column");
    const statusText = document.getElementById("status");

    if (!fileInput.files.length) {
        alert("Please select a file first.");
        return;
    }

    const file = fileInput.files[0];
    const selectedColumn = columnSelect.value;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("column", selectedColumn);

    fetch("/cgi-bin/py-upload.sh", {
        method: "POST",
        body: formData
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
        statusText.innerText = "File processed successfully. Downloading...";
    })
    .catch(error => {
        console.error("Error:", error);
        statusText.innerText = "Error processing file.";
    });
}
