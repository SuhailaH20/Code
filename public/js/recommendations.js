// Add OpenStreetMap tiles
var map = L.map('map').setView([21.5, 39.2], 10);

// Set up the OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Ensure the map is fully loaded and visible
map.whenReady(function() {
    map.invalidateSize();
});

/*
const submitButton = document.querySelector('.btn-submit1');
const errorMessage1 = document.getElementById('error-message1');
const form1 = document.getElementById('recommendation-form');

function validateForm1() {
    const fields = form1.querySelectorAll('select');
    let isValid = true;
    fields.forEach(field => {
        if (field.value === "") {
            field.style.border = "2px solid red";
            isValid = false;
        } else {
            field.style.border = "";
        }
    });
    console.log('Validation result:', isValid); // Log validation result
    return isValid;
}

submitButton.addEventListener('click', (event) => {
    errorMessage1.style.display = 'none';
    console.log('Submit button clicked'); // Log button click
    if (!validateForm1()) {
        event.preventDefault();
        errorMessage1.textContent = 'لا تترك حقول فارغة';
        errorMessage1.style.display = 'block';
    }
});
*/