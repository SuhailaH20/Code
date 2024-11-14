// Add event listener to the "Report" button
const report_Button = document.getElementById("report-Button");
report_Button.addEventListener("click", () => {
    // Update the URL hash to #report
    window.location.hash = "#report";
    showReportSection();
    displayLatestReports();
});

// Function to handle displaying the report section
function showReportSection() {
    document.querySelectorAll('.content-container').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('reports').classList.add('active');

    // Activate the correct sidebar item
    li_items.forEach(item => item.classList.remove("active"));
    const reportSidebarItem = Array.from(li_items).find(item =>
        item.querySelector(".item").textContent.trim() === "التقارير"
    );
    if (reportSidebarItem) {
        reportSidebarItem.classList.add("active");
    }
}

// Add event listener to the "Recommendations" button
const recommendationsButton = document.getElementById("recommendationsButton");
recommendationsButton.addEventListener("click", () => {
    // Update the URL hash to #recommendations
    window.location.hash = "#recommendations";
    showRecommendationsSection();
});

// Function to handle displaying the recommendations section
function showRecommendationsSection() {
    document.querySelectorAll('.content-container').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('recommendations').classList.add('active');

    // Activate the correct sidebar item
    li_items.forEach(item => item.classList.remove("active"));
    const recommendationsSidebarItem = Array.from(li_items).find(item =>
        item.querySelector(".item").textContent.trim() === "اقتراحات"
    );
    if (recommendationsSidebarItem) {
        recommendationsSidebarItem.classList.add("active");
    }
}

// Add event listener to the "FormContent" button
const formContentButton = document.getElementById("formContentButton");
formContentButton.addEventListener("click", () => {
    // Update the URL hash to #formContent
    window.location.hash = "#formContent";
    showFormContentSection();
});

// Function to handle displaying the formContent section
function showFormContentSection() {
    document.querySelectorAll('.content-container').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('formContent').classList.add('active');

    // Activate the correct sidebar item
    li_items.forEach(item => item.classList.remove("active"));
    const formContentSidebarItem = Array.from(li_items).find(item =>
        item.querySelector(".item").textContent.trim() === "تقديم طلب جديد"
    );
    if (formContentSidebarItem) {
        formContentSidebarItem.classList.add("active");
    }
}

// Displays the latest reports by processing data from input requests and recommendations tables
async function displayLatestReports() {
    // Get the tables containing input requests and recommendations
    const inputRequestsTable = document.getElementById('inputRequestsTable');
    const recommendationsTable = document.getElementById('recommendationsTable');
    
    let allReports = [];
    let approvedCount = 0;
    let disapprovedCount = 0;
    
    // Process reports from the input requests table
    if (inputRequestsTable && inputRequestsTable.getElementsByTagName('tbody')[0]) {
        // Get all rows from the table body
        const inputRows = Array.from(inputRequestsTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr'));
        
        // Loop through each row to extract report data
        for (const row of inputRows) {
            const cells = row.getElementsByTagName('td');
            if (cells.length >= 6) { // Ensure the row has enough cells
                const detailsLink = cells[5].querySelector('a'); // Get the details link in the 6th cell
                if (detailsLink) {
                    try {
                        // Parse the data attached to the link
                        const itemData = JSON.parse(detailsLink.getAttribute('data-item'));
                        if (itemData.type === 'طلب مدخل') { // Check if it's an input request
                            const neighborhoodName = await getNeighborhoodName(itemData.location.lat, itemData.location.lng);
                            allReports.push({
                                type: 'طلب مدخل',
                                district: neighborhoodName || 'غير محدد',
                                status: itemData.step3Status || 'غير محدد',
                                date: new Date(itemData.createdAt),
                                rawData: itemData
                            });
                            if (itemData.step3Status === "مقبول") {
                                approvedCount++;
                            } else if (itemData.step3Status === "مرفوض") {
                                disapprovedCount++;
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing input data:', e);
                    }
                }
            }
        }
    }
    
    // Process reports from the recommendations table
    if (recommendationsTable && recommendationsTable.getElementsByTagName('tbody')[0]) {
        // Get all rows from the table body
        const recommendationRows = Array.from(recommendationsTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr'));
        
        // Loop through each row to extract recommendation data
        for (const row of recommendationRows) {
            const cells = row.getElementsByTagName('td');
            if (cells.length >= 6) { // Ensure the row has enough cells
                const detailsLink = cells[5].querySelector('a'); // Get the details link in the 6th cell
                if (detailsLink) {
                    try {
                        // Parse the data attached to the link
                        const itemData = JSON.parse(detailsLink.getAttribute('data-item'));
                        if (itemData.type === 'اقتراح') { // Check if it's a recommendation
                            const neighborhoodName = await getNeighborhoodName(itemData.location.lat, itemData.location.lng);
                            allReports.push({
                                type: 'اقتراح',
                                district: neighborhoodName || 'غير محدد',
                                successRate: itemData.success_rate ? `${itemData.success_rate}%` : 'غير محدد',
                                date: new Date(itemData.createdAt),
                                rawData: itemData
                            });
                        }
                    } catch (e) {
                        console.error('Error parsing recommendation data:', e);
                    }
                }
            }
        }
    }
    
    // Sort all reports by date (newest first)
    allReports.sort((a, b) => b.date - a.date);
    
    // Get the container for displaying reports
    const reportsContainer = document.getElementById('reportsContainer');
    if (!reportsContainer) {
        console.error('Reports container not found!');
        return;
    }
    
    // Clear the container content
    reportsContainer.innerHTML = '';

    // Check if there are no reports and show a message
    if (allReports.length === 0) {
        reportsContainer.innerHTML = `
        <p class="no-reports">لا يوجد تقارير</p>
        `;
        return;
    }
    
    // Get the latest three reports to display
    const latestReports = allReports.slice(0, 3);
    
    // Display each report as a card
    latestReports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
        
        // Format the display for status or success rate
        let statusOrSuccessDisplay;
        if (report.type === 'اقتراح') {
            statusOrSuccessDisplay = `نسبة النجاح: ${report.successRate.replace(' ', '')}`;
        } else {
            statusOrSuccessDisplay = `حالة الطلب: ${report.status}`;
        }
        
        // Create the HTML content for the report card
        reportCard.innerHTML = `
            <i class="fas fa-caret-left arrow-icon"></i>
            <p class="report-detail">الحي: ${report.district}</p>
            <p class="report-detail">${statusOrSuccessDisplay}</p>
            <p class="report-detail">التاريخ: ${report.date.toLocaleDateString()}</p>
        `;
        
        // Add a click event to show detailed report information
        reportCard.addEventListener('click', () => {
            window.location.hash = "#report";
            showReportSection();
            hideReportDetails();
            showReportDetails(report.rawData);
        });
        
        // Append the report card to the container
        reportsContainer.appendChild(reportCard);
    });

    // Update the dashboard counts
    updateDashboardCounts(allReports.length, approvedCount, disapprovedCount);
}

// Function to update the dashboard counts
function updateDashboardCounts(total, approved, disapproved) {
    document.getElementById('totalRequestsCount').textContent = total;
    document.getElementById('approvedRequestsCount').textContent = approved;
    document.getElementById('disapprovedRequestsCount').textContent = disapproved;
}

// Add event listener to display reports once the DOM is loaded
document.addEventListener('DOMContentLoaded', displayLatestReports);
