// buttons parts
const nextButton = document.querySelector('.btn-next');
const prevButton = document.querySelector('.btn-prev');
const submitButton = document.querySelector('.btn-submit');
const pressResult = document.querySelector('.btn-result');
const steps = document.querySelectorAll('.step');
const form_steps = document.querySelectorAll('.form-step');
const errorMessage = document.getElementById('error-message'); // Get the error message div
const errorMessageStep2 = document.getElementById('error-message-step2'); // Get the error message div
const partOfLargerBuilding = document.getElementById("partOfLargerBuilding");
const buildingType = document.getElementById("buildingType");
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

// Function to handle step 2 logic
function handleStepTwo() {
    let isValid = true;

    // Select all fields in step 2
    const stepTwoFields = document.querySelectorAll('.form-two input, .form-two select');

    stepTwoFields.forEach(field => {
        // Validate only enabled fields
        if (!field.disabled) {
            if (field.value.trim() === "") {
                field.style.border = "2px solid red"; // Highlight invalid fields in red
                isValid = false;
            } else {
                field.style.border = ""; // Reset border for fields
            }
        } else {
            field.style.border = ""; // Ensure disabled fields have no red border
        }
    });

    // Display error message if validation fails
    if (!isValid) {
        errorMessageStep2.textContent = 'لا تترك حقول فارغة'; // Error message
        errorMessageStep2.style.display = 'block'; // Show error message
    } else {
        errorMessageStep2.style.display = 'none'; // Hide error message
    }

    return isValid; // Return validation status
}

// Add an event listener to handle changes in the values regarding the part Of Larger Building question
partOfLargerBuilding.addEventListener('change', () => {
    if (partOfLargerBuilding.value === "no") { 
        buildingType.disabled = true; // Disable the field
        buildingType.value = ""; 
        buildingType.style.border = ""; // Clear any validation
    } else if (partOfLargerBuilding.value === "yes") { 
        buildingType.disabled = false; // Enable the field
    }
});

// Add an event listener for the next button
nextButton.addEventListener('click', () => {
    errorMessage.style.display = 'none'; // Hide previous error messages

    // Check if active step is step 2
    if (document.querySelector('.form-two').classList.contains('active')) {
        if (handleStepTwo()) {
            // Proceed to the next step if step 2 validation passes
        active++;
            updateProgress(); // Update progress function for step transitions
        }
    } else {
        // Handle other steps if not step 2
        if (validateStep(active)) {
            active++;
            updateProgress();
        } else {
            errorMessage.textContent = 'لا تترك حقول فارغة'; //Error message
            errorMessage.style.display = 'block';
        }
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

    // If it's step 3, no validation needed for fields
    if (active === 3) {
        const enabledFields = form.querySelectorAll('input:enabled, select:enabled');
        let isValid = false;  // Assume it's not valid

        // Check if any enabled field has a value
        enabledFields.forEach(field => {
            if (field.value.trim()) {
                isValid = true; // Allow submission if there's at least one filled field
            }
        });

        // Submit form if valid, otherwise show an error
        if (isValid) {
            form.action = "/submitForm";  
            form.method = "POST";  
            form.submit();  
        } else {
            errorMessage.textContent = 'Please fill in at least one enabled field.';
            errorMessage.style.display = 'block'; 
        }
        return; // Exit for step 3
    }
    
    // For other steps, validate only enabled fields
    const requiredFields = form.querySelectorAll('input:enabled, select:enabled');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.border = '2px solid red'; // Highlight invalid fields
            isValid = false;
        } else {
            field.style.border = ''; // Reset border for valid fields
        }
    });

    if (!isValid) {
        errorMessage.textContent = 'لا تترك حقول فارغة'; // Error message
        errorMessage.style.display = 'block'; // Show the error message
        return; // Stop form submission if validation fails
    }

    // If form is valid, proceed to submit
    form.action = "/submitForm";  // Ensure the form action matches your route
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
            
            // Show the map if we are at step 4 
            if (active === 4) {
                const mapContainer = document.getElementById("map2");
                mapContainer.style.display = "block"; // Show map container
            
                // Reposition error message for step 4
                const errorMessageContainer = document.getElementById('error-message');
                if (errorMessageContainer) {
                    mapContainer.parentNode.insertBefore(errorMessageContainer, mapContainer);
                    errorMessageContainer.style.display = 'none'; // Ensure it starts hidden
                }
            
                // Handle map initialization or update
                const latitude = parseFloat(document.getElementById("latitude").value) || 0;
                const longitude = parseFloat(document.getElementById("longitude").value) || 0;
            
                if (!window.map2 || typeof window.map2.addLayer !== 'function') {
                    window.map2 = L.map("map2").setView([21.4858, 39.1925], 13);
                    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: "© OpenStreetMap contributors",
                    }).addTo(window.map2);
                
                    window.map2.on('click', function (e) {
                        const { lat, lng } = e.latlng;
                        document.getElementById('latitude').value = lat.toFixed(4);
                        document.getElementById('longitude').value = lng.toFixed(4);
                
                        // Create a popup at the clicked location
                        const popup = L.popup()
                            .setLatLng(e.latlng)
                            .setContent(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
                            .openOn(window.map2);
                    });
                } else {
                    window.map2.setView([latitude, longitude], 13);
                }
                
            }
            
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
    const successReasons = [];
    const successMessages = ["موقعك يتناسب مع الاشتراطات"];

    // Compliance validation
    if (activityType === "closedStoreCity") {
        if (partOfLargerBuilding === "yes") {
            if (buildingType === "mixed"  ||buildingType==="commercial") {
                successReasons.push("النشاط ضمن المباني التجارية اوالمختلطة(تجاري سكني).");
            } else {
                Reasons.push(". (تجاري سكني) إذا كان النشاط ضمن جزء من مبنى، يجب أن يكون ضمن المباني التجارية اوالمختلطة");
            }
            if (onCommercialStreet === "yes") {
                successReasons.push("النشاط يقع على شارع تجاري.");
            } else {
                Reasons.push(". يجب أن يكون النشاط على الشوارع التجارية");
            }
        } else {
            if (parkingSpaces >= Math.ceil(100 / 70)) {
                successReasons.push("يوجد عدد كافٍ من مواقف السيارات.");
            } else {
                Reasons.push(". يجب توفير موقف سيارات واحد لكل 70 م2 للمتجر المغلق المستقل");
            }
        }
    }

    if (activityType === "closedStoreOutsideCity") {
        if (partOfLargerBuilding === "yes") {
            if (logisticsArea === "yes" || warehouseArea === "yes") {
                successReasons.push("الموقع في منطقة الخدمات اللوجستية أو المستودعات.");
            } else {
                Reasons.push(". يجب أن يكون الموقع في منطقة الخدمات اللوجستية أو منطقة المستودعات");
            }
            if (onCommercialStreet === "yes") {
                successReasons.push("النشاط يقع على شارع تجاري.");
            } else {
                Reasons.push(". يجب أن يكون النشاط على الشوارع التجارية");
            }
        } else {
            if (logisticsArea === "yes" || warehouseArea === "yes") {
                successReasons.push("الموقع في منطقة الخدمات اللوجستية أو المستودعات.");
            } else {
                Reasons.push(". يجب أن يكون الموقع في منطقة الخدمات اللوجستية أو منطقة المستودعات");
            }
            if (parkingSpaces >= Math.ceil(100 / 70)) {
                successReasons.push("يوجد عدد كافٍ من مواقف السيارات.");
            } else {
                Reasons.push(". يجب توفير موقف سيارات واحد لكل 70 م2 للمتجر المغلق المستقل");
            }
        }
    }

    // Generate Checklist Display
    const resultContainer = document.getElementById("resultMessage");
    const checklistHTML = `
        <h3>نتائج التحقق</h3>
        <ul>
            ${successReasons.map(reason => `<li style="color: green;"> ${reason}✔️</li>`).join("")}
            ${Reasons.map(reason => `<li style="color: red;"> ${reason}❌</li>`).join("")}
        </ul>
    `;

    [document.getElementById('step3Result').value, document.getElementById('step3Status').value] = 
    Reasons.length > 0 
    ? [Reasons.join(', '), "مرفوض"] 
    : [successReasons.join(', '), "مقبول"];

    resultContainer.className = '';
    resultContainer.innerHTML = checklistHTML;

    // Store requests in localStorage
    const currentRequests = JSON.parse(localStorage.getItem('requests')) || [];
    const newRequest = {
        reasons: Reasons,
        createdAt: new Date().toISOString(),
        success: Reasons.length === 0,
        successMessages: successMessages
    };
    currentRequests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(currentRequests));

    // Validation Status
    return Reasons.length === 0;
}



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
            <p><strong>نسبة النجاح:</strong> %${rec.success_rate}</p>
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