document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const fileTableBody = document.querySelector("#fileTable tbody");

    let selectedFiles = [];

    fileInput.addEventListener("change", function () {
        fileTableBody.innerHTML = ""; // Clear table
        selectedFiles = Array.from(fileInput.files); // Store selected files

        selectedFiles.forEach((file, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${file.name}</td>
                <td>${(file.size / 1024).toFixed(2)}</td>
                <td><progress id="progress-${index}" value="0" max="100"></progress></td>
            `;
            fileTableBody.appendChild(row);
        });
    });

    uploadBtn.addEventListener("click", function () {
        if (selectedFiles.length === 0) {
            alert("Please select files first.");
            return;
        }

        selectedFiles.forEach((file, index) => {
            uploadFile(file, index);
        });
    });

    function uploadFile(file, index) {
        const formData = new FormData();
        formData.append("files", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/files/upload", true);

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                document.getElementById(`progress-${index}`).value = percentComplete;
            }
        };

        xhr.onload = function () {
            if (xhr.status === 200) {
                document.getElementById(`progress-${index}`).value = 100;
            } else {
                alert(`Failed to upload ${file.name}`);
            }
        };

        xhr.onerror = function () {
            alert(`Error uploading ${file.name}`);
        };

        xhr.send(formData);
    }
});
