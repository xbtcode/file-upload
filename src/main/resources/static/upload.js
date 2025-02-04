let isUploadInProgress = false;

function updateButtonStates() {
    const browseButton = document.querySelector('.custom-file-upload');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');

    browseButton.style.opacity = isUploadInProgress ? '0.5' : '1';
    browseButton.style.cursor = isUploadInProgress ? 'not-allowed' : 'pointer';
    uploadButton.disabled = isUploadInProgress;
    fileInput.disabled = isUploadInProgress;
}

function uploadFile(file, progressCell, statusCell) {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://nebunie1.go.ro:8080/upload', true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    let startTime = Date.now();
    let lastUploadedSize = 0;

    // Set upload in progress
    isUploadInProgress = true;
    updateButtonStates();

    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            updateProgressBar(progressCell, percentComplete);

            // Calculate and display upload speed
            const currentTime = Date.now();
            const timeElapsed = (currentTime - startTime) / 1000;
            const uploadedSize = e.loaded - lastUploadedSize;
            const uploadSpeed = uploadedSize / timeElapsed;
            const speedMBps = (uploadSpeed / (1024 * 1024)).toFixed(2);
            
            statusCell.textContent = `Uploading (${speedMBps} MB/s)`;
            
            lastUploadedSize = e.loaded;
            startTime = currentTime;
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            updateProgressBar(progressCell, 100);
            statusCell.textContent = 'Uploaded';
            statusCell.className = 'status-success';
        } else {
            statusCell.textContent = 'Failed';
            statusCell.className = 'status-error';
        }
        // Reset upload state
        isUploadInProgress = false;
        updateButtonStates();
    };

    xhr.onerror = function() {
        statusCell.textContent = 'Failed';
        statusCell.className = 'status-error';
        // Reset upload state
        isUploadInProgress = false;
        updateButtonStates();
    };

    xhr.send(formData);
}

function uploadFiles() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    const fileTable = document.getElementById('fileTableBody');

    if (files.length === 0) return;

    fileTable.innerHTML = '';

    Array.from(files).forEach(file => {
        const row = fileTable.insertRow();
        
        const nameCell = row.insertCell(0);
        nameCell.textContent = file.name;
        
        const sizeCell = row.insertCell(1);
        sizeCell.textContent = formatFileSize(file.size);
        
        const progressCell = row.insertCell(2);
        progressCell.className = 'progress-cell';
        progressCell.appendChild(createProgressBar());
        
        const statusCell = row.insertCell(3);
        statusCell.textContent = 'Pending';
        statusCell.className = 'status-pending';

        uploadFile(file, progressCell, statusCell);
    });

    // Reset file input
    fileInput.value = '';
}
