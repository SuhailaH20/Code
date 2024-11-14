// buttons parts
const nextButton = document.querySelector('.btn-next');
const prevButton = document.querySelector('.btn-prev');
const submitButton = document.querySelector('.btn-submit');
const pressResult = document.querySelector('.btn-result');
const steps = document.querySelectorAll('.step');
const form_steps = document.querySelectorAll('.form-step');
const errorMessage = document.getElementById('error-message'); // Get the error message div
let active = 1;

// Add validation function
function validateStep(step) {
    const currentFields = form_steps[step - 1].querySelectorAll('input, select');
    let isValid = true;

    currentFields.forEach(field => {
        if (field.value === "") {
            field.style.border = "2px solid red"; // Highlight empty fields in red
            isValid = false;
        } else {
            // Check for latitude and longitude fields
            if (field.id === 'latitude' || field.id === 'longitude') {
                const floatRegex = /^-?\d+(\.\d+)?$/; // Regex for float numbers
                if (!floatRegex.test(field.value)) {
                    field.style.border = "2px solid red"; // Highlight invalid fields in red
                    errorMessage.textContent = 'Please enter a valid number for latitude and longitude.';
                    errorMessage.style.display = 'block';
                    isValid = false;
                } else {
                    field.style.border = ""; // Reset border if valid
                }
            } else {
                field.style.border = ""; // Reset border for non-lat/lng fields if filled
            }
        }
    });

    return isValid;
}


nextButton.addEventListener('click', () => {
    errorMessage.style.display = 'none'; // Hide any previous error messages
    if (validateStep(active)) {  // Validate the current step before proceeding
        active++;
        if (active > steps.length) {
            active = steps.length;
        }
        updateProgress();
    } else {
        errorMessage.textContent = 'لا تترك حقول فارغة';
        errorMessage.style.display = 'block'; // Show the error message in red
    }
});

// Add event listener to enable the submit button when pressResult is clicked
pressResult.addEventListener('click', () => {
    errorMessage.style.display = 'none'; // Hide any previous error messages
    if (validateStep(active)) {  // Validate the current step before proceeding
        active++;
        if (active > steps.length) {
            active = steps.length;
        }
        updateProgress();
        submitButton.disabled = false; // Enable the Submit button
    } else {
        errorMessage.textContent = 'لا تترك حقول فارغة';
        errorMessage.style.display = 'block'; // Show the error message in red
    }
});

prevButton.addEventListener('click', () => {
    errorMessage.style.display = 'none';  // Hide error message when going back
    active--;
    if (active < 1) {
        active = 1;
    }
    updateProgress();
});
// Add event listener for the submit button
submitButton.addEventListener('click', () => {
    const form = document.querySelector('form'); // Get the form element

    // Check required fields only if they are not in step 3
    if (active !== 3) {
        // Validate form before submitting (optional, based on existing validation rules)
        const requiredFields = form.querySelectorAll('input, select');
        let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            field.style.border = '2px solid red';
            isValid = false;
        } else {
            field.style.border = '';
        }
    });

        if (!isValid) {
            errorMessage.textContent = 'Please fill in all required fields.'; // Display error message
            errorMessage.style.display = 'block'; // Show the error message
            return;
        }
    }

    // Submit the form
    form.action = "/submitForm";  // Make sure the form action matches your route
    form.method = "POST";  // Ensure the method is POST
    form.submit();  // This will trigger the form submission

    // Show the report container
    showReport();

    // Remove 'active' from all items
    li_items.forEach(function (li) {
        li.classList.remove("active");
    });

    // Find the item and set it as active
    const reportItem = Array.from(li_items).find(item => {
        const itemText = item.querySelector(".item").textContent.trim();
        return itemText === "التقارير";
    });

    if (reportItem) {
        reportItem.classList.add("active");  // Add 'active' class to item
    }

    errorMessage.style.display = 'none'; // Hide any previous error messages

    // Ensure final validation before submitting
    if (validateStep(active)) {
        active++;
        if (active > steps.length) {
            active = steps.length;
        }
        updateProgress();
    } else {
        errorMessage.textContent = 'لا تترك حقول فارغة';
        errorMessage.style.display = 'block'; // Show the error message in red
    }
});

const updateProgress = () => {
    steps.forEach((step, i) => {
        if (i === active - 1) {
            step.classList.add('active');
            form_steps[i].classList.add('active');
            form_steps[i].style.display = 'block';
        } else {
            step.classList.remove('active');
            form_steps[i].classList.remove('active');
            form_steps[i].style.display = 'none';
        }
    });

    if (active === 3) {
        const isValid = validateSiteData(); // Validate site data if in the third step

        // Manage button visibility based on validation result
        if (isValid) {
            prevButton.disabled = true;
            prevButton.style.display = 'inline-block';
            nextButton.style.display = 'inline-block';
        } else {
            nextButton.disabled = true;
            nextButton.style.display = 'inline-block';
            submitButton.style.display = 'inline-block'; // Show submit button
        }
    } else if (active === 4) {
        nextButton.style.display = 'none';
        prevButton.style.display = 'none';
        pressResult.style.display = 'inline-block';
        submitButton.style.display = 'inline-block';
        submitButton.disabled = true;
    } else {
        if (active === 1) {
            prevButton.disabled = true;
            nextButton.style.display = 'inline-block';
            submitButton.style.display = 'none';
        } else {
            prevButton.disabled = false;
            nextButton.style.display = 'inline-block';
            submitButton.style.display = 'none';
        }
    }
};


// Add event listener to the "Report" button
const reportButton = document.getElementById("reportButton");
reportButton.addEventListener("click", () => {
    // Update the URL hash to #reports
    window.location.hash = "#reports";
    
    // Trigger the section display code
    showReportsSection();
});

// Function to handle displaying the reports section
function showReportsSection() {
    // Hide other sections and show the #reports section
    document.querySelectorAll('.content-container').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('reports').classList.add('active');
    
    // Make the "التقارير" sidebar item active
    li_items.forEach(item => item.classList.remove("active"));
    const reportSidebarItem = Array.from(li_items).find(item =>
        item.querySelector(".item").textContent.trim() === "التقارير"
    );
    if (reportSidebarItem) {
        reportSidebarItem.classList.add("active");
    }
}

// Trigger showReportsSection if URL hash is #reports when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#reports') {
        showReportsSection();
    }
});


// Trigger the appropriate section display function if URL hash is present when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#report') {
        showReportSection();
    } else if (window.location.hash === '#recommendations') {
        showRecommendationsSection();
    } else if (window.location.hash === '#formContent') {
        showFormContentSection();
    }
});


//Result..
function validateSiteData() {
    const activityType = document.getElementById("activityType").value;
    const partOfLargerBuilding = document.getElementById("partOfLargerBuilding").value;
    const buildingType = document.getElementById("buildingType").value;
    const parkingSpaces = parseInt(document.getElementById("parkingSpaces").value, 10);
    const onCommercialStreet = document.getElementById("onCommercialStreet").value;
    const logisticsArea = document.getElementById("logisticsArea").value;
    const warehouseArea = document.getElementById("warehouseArea").value;

    const Reasons = [];
    const successMessages = ["موقعك يتناسب مع الاشتراطات"]; // Success message

    // تحقق من الشروط المختلفة
    if (activityType === "closedStoreCity") {
        if (partOfLargerBuilding === "yes") {
            if (buildingType !== "mixed") {
                Reasons.push(".(تجاري سكني) إذا كان النشاط ضمن جزء من مبنى، يجب أن يكون ضمن المباني التجارية والمختلطة");
            }
            if (onCommercialStreet === "no") {
                Reasons.push(".يجب أن يكون النشاط على الشوارع التجارية");
            }
        } else {
            if (parkingSpaces < Math.ceil(100 / 70)) {
                Reasons.push(".يجب توفير موقف سيارات واحد لكل 70 م2 للمتجر المغلق المستقل");
            }
        }
    }

    if (activityType === "closedStoreOutsideCity") {
        if (partOfLargerBuilding === "yes") {
            if (logisticsArea === "no" && warehouseArea === "no") {
                Reasons.push(".يجب أن يكون الموقع في منطقة الخدمات اللوجستية أو منطقة المستودعات");
            }
            if (onCommercialStreet === "no") {
                Reasons.push(".يجب أن يكون النشاط على الشوارع التجارية");
            }
        } else {
            if (logisticsArea === "no" && warehouseArea === "no") {
                Reasons.push(".يجب أن يكون الموقع في منطقة الخدمات اللوجستية أو منطقة المستودعات");
            }
            if (parkingSpaces < Math.ceil(100 / 70)) {
                Reasons.push(".يجب توفير موقف سيارات واحد لكل 70 م2 للمتجر المغلق المستقل");
            }
        }
    }
    
    // Show Result
    const resultContainer = document.getElementById("resultMessage");
    [document.getElementById('step3Result').value, document.getElementById('step3Status').value] = 
    Reasons.length > 0 
    ? [Reasons.join(', '), "مرفوض"] 
    : [successMessages.join(', '), "مقبول"];

    resultContainer.className = ''; // Reset any previous styles
    // Store requests in localStorage
    const currentRequests = JSON.parse(localStorage.getItem('requests')) || [];
    const newRequest = {
        reasons: Reasons,
        createdAt: new Date().toISOString(), // Store the creation date
        success: Reasons.length === 0, // Determine success or failure
        successMessages: successMessages // Add success message
    };
    currentRequests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(currentRequests));

    if (Reasons.length > 0) {
        resultContainer.innerHTML = `<p>موقعك لا يتوافق مع الاشتراطات لمعرفة الأسباب:</p>`;
        resultContainer.classList.add('Reasons');
        return false; // Return false if not valid
    } else {
        resultContainer.innerHTML = `<p>${successMessages.join(', ')}</p>`; // Display success message
        resultContainer.classList.add('success');
        return true; // Return true if valid
    }
}


window.onload = function () {
    console.log("Waiting for 'Get Result' button click to initialize map...");
};

// Function triggered by clicking the get result button
// It retrieves the latitude and longitude values from the input fields displays the map container
// initializes or updates the map and fetches recommendations based on coordinates provided by user 
// Function triggered by clicking the "Get Result" button
async function getResult() {
    console.log("getResult function triggered");

    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    if (!latitude || !longitude) {
        errorMessage.textContent = "Please enter both latitude and longitude."; // Display error message
        errorMessage.style.display = 'block'; // Show the error message
        return;
    }

    // Show the map container when "Get Result" is clicked
    document.getElementById("map2").style.display = "block";

    // Initialize the map only if it hasn't been created yet
    if (!window.map2 || typeof window.map2.addLayer !== 'function') {
        console.log("Initializing map2...");
        document.getElementById("map2").innerHTML = ""; // Clear any existing content
    
        // Create the map centered on the provided coordinates
        window.map2 = L.map('map2').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(window.map2);
    
        // Add the click event listener on window.map2 to capture coordinates
        window.map2.on('click', function(e) {
            const { lat, lng } = e.latlng;
            document.getElementById('latitude').value = lat.toFixed(4);
            document.getElementById('longitude').value = lng.toFixed(4);
            alert(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        });
    } else {
        // If map already exists, just update its view
        window.map2.setView([latitude, longitude], 13);
    }
    

    const url = `/get_recommendations?lat=${latitude}&lng=${longitude}`;
    console.log("Fetching data from URL:", url);

    // Fetch recommendations based on latitude and longitude
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Data received:", data);

        // Display error if there's an issue with the data
        if (data.error) {
            document.getElementById('resultMessage1').innerHTML = `<p>${data.error}</p>`;
            console.log("Error displayed:", data.error);
            return;
        }
        // Display the recommendations on the map and in the container
        displayRecommendations(data);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        document.getElementById('resultMessage1').innerHTML = `<p>Error fetching recommendations. ${error.message}</p>`;
    }
}

// displays recommendation data on the map as circles markers with colors
// and display recommendation cards
function displayRecommendations(data) {
    const recommendationsContainer = document.getElementById('resultMessage1');
    recommendationsContainer.innerHTML = ''; // Clear previous messages, if any

    // Clear previous circles from map
    if (Array.isArray(window.mapCircles)) {
        window.mapCircles.forEach(circle => window.map2.removeLayer(circle));
    }
    window.mapCircles = [];

    // Loop through recommendations and add them to the map only
    data.recommendations.forEach((rec) => {
        // Set marker color based on success rate
        const color = rec.success_rate <= 40 ? 'red' : rec.success_rate <= 70 ? 'yellow' : 'green';
        
        // Add a circle marker for each recommendation on the map
        const circle = L.circle([rec.lat, rec.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: 500
        }).addTo(window.map2);

        // Create detailed content for the popup
        const popupContent = `
            <h4>${rec.summary}</h4>
            <p><strong>نسبة النجاح:</strong> ${rec.success_rate} %</p>
            <p><strong>عدد المواقع القريبة:</strong> ${rec.nearby_pois.length}</p>
            <p><strong>عدد المنافسين:</strong> ${rec.competitors.length}</p>
        `;
        
        // Assuming `data` contains the recommendations as a summary
        document.getElementById('step4Result').value = JSON.stringify(data.recommendations);

        // Bind popup to each circle marker with detailed content
        circle.bindPopup(popupContent);
        window.mapCircles.push(circle);
    });

    console.log("Updated innerHTML of resultMessage:", recommendationsContainer.innerHTML);
}