// Sidebar items and containers
var li_items = document.querySelectorAll(".side_bar_bottom ul li");
var dashboardContainer = document.querySelector(".dashboard_container");
var locationContainer = document.querySelectorAll(".location_container");
var reportContainer = document.querySelector(".report_container");
var recommendationsContainer = document.querySelector(".recommendations_container");

// Hide all containers 
function hideAllContainers() {
    dashboardContainer.style.display = "none";
    locationContainer.forEach(function(container) {
        container.style.display = "none";
    });
    reportContainer.style.display = "none";
    recommendationsContainer.style.display = "none";
}

// Show the dashboard container
function showDashboard() {
    hideAllContainers();
    dashboardContainer.style.display = "block";
}

// Show the location containers
function showLocation() {
    hideAllContainers();
    locationContainer.forEach(function(container) {
        container.style.display = "block";
    });
}

// Show the report container
function showReport() {
    hideAllContainers();
    reportContainer.style.display = "block";
}

// Show the recommendations container
function showRecommendations() {
    hideAllContainers();
    recommendationsContainer.style.display = "block";
}

// event listeners to sidebar items
li_items.forEach(function(li_main){
    li_main.addEventListener("click", function(){
        li_items.forEach(function(li){
            li.classList.remove("active");
        });
        li_main.classList.add("active");

        // determine which container to show based on active item
        var itemText = li_main.querySelector(".item").textContent.trim();
        if (itemText.includes("لوحة التحكم")) {
            showDashboard();
        } else if (itemText.includes("طلب تحليل الموقع")) {
            showLocation();
        } else if (itemText.includes("التقارير")) {
            showReport();
        } else if (itemText.includes("اقتراحات")) {
            showRecommendations();
        } else {
            hideAllContainers();
        }
    });
});

// dashboard container by default
showDashboard();


// buttons parts
const nextButton = document.querySelector('.btn-next');
const prevButton = document.querySelector('.btn-prev');
const submitButton = document.querySelector('.btn-submit');
const pressButton = document.querySelector('.btn-press');
const steps = document.querySelectorAll('.step');
const form_steps = document.querySelectorAll('.form-step');
let active = 1;

nextButton.addEventListener('click', () => { 
    active++;
    if (active > steps.length) {
        active = steps.length;
    }
    updateProgress();
})

prevButton.addEventListener('click', () => { 
    active--;
    if (active < 1) {
        active = 1;
    }
    updateProgress();
})
submitButton.addEventListener('click', () => {
    active++;
    if (active > steps.length) {
        active = steps.length;
    }
    updateProgress();
})

const updateProgress = () => { 
    console.log('step length =>' + steps.length);
    console.log('active =>' + active);

    // toggle active class for steps
    steps.forEach((step, i) => {
        if (i == active - 1) {
            step.classList.add('active');
            form_steps[i].classList.add('active');
            console.log('i =>'+ i);
        }
        else {
            step.classList.remove('active');
            form_steps[i].classList.remove('active');
        }
    });
    //enable disable next and prev and submit and press buttons
    if (active === 1) {
        prevButton.disabled = true;
    }
    else if (active === steps.length) {
        nextButton.disabled = true;
    }
    else {
        submitButton.disabled = false;
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
}
