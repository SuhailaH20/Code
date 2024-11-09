// Sidebar items and containers 
var li_items = document.querySelectorAll(".side_bar_bottom ul li");
var dashboardContainer = document.querySelector(".dashboard_container");
var locationContainer = document.querySelectorAll(".location_container"); 
var reportContainer = document.querySelector(".report_container");
var recommendationsContainer = document.querySelector(".recommendations_container");

// JavaScript function to show/hide content based on sidebar clicks
function showContent(contentId) {
    // إخفاء جميع المحتويات
    const containers = document.querySelectorAll('.content-container');
    containers.forEach(container => {
        container.classList.remove('active');
    });

    // إظهار المحتوى المطلوب
    const activeContainer = document.getElementById(contentId);
    activeContainer.classList.add('active');

    // تحديث الشريط الجانبي
    const items = document.querySelectorAll('.side_bar_bottom ul li');
    items.forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = Array.from(items).find(item => item.innerText === contentId.replace(/([a-z])([A-Z])/g, '$1 $2'));
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Hide all containers 
function hideAllContainers() {
    if (dashboardContainer) dashboardContainer.style.display = "none";
    if (locationContainer) {
        locationContainer.forEach(function(container) {
            container.style.display = "none";
        });
    }
    if (reportContainer) reportContainer.style.display = "none";
    if (recommendationsContainer) recommendationsContainer.style.display = "none";
}

// Show the dashboard container
function showDashboard() {
    hideAllContainers();
    if (dashboardContainer) dashboardContainer.style.display = "block";
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
document.addEventListener('DOMContentLoaded', () => {
    // Check if the URL has the #reports hash
    if (window.location.hash === '#reports') {
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
});


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

