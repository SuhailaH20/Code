// This function handles pagination for a specified table by showing a limited number of rows per page.
function paginateTable(tableId, paginationId, rowsPerPage = 4) {
    // Get the table and pagination elements by their IDs.
    const table = document.getElementById(tableId);
    const pagination = document.getElementById(paginationId);
    
    // Retrieve all rows from the table's tbody and calculate the total pages needed.
    const rows = Array.from(table.getElementsByTagName("tbody")[0].getElementsByTagName("tr"));
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // Function to display only the rows for a specified page number.
    function displayPage(pageNumber) {
        rows.forEach((row, index) => {
            // Display rows that belong to the current page and hide others.
            row.style.display = (index >= (pageNumber - 1) * rowsPerPage && index < pageNumber * rowsPerPage) ? "" : "none";
        });
    }

    // Function to create pagination links dynamically based on the total number of pages.
    function createPaginationLinks() {
        pagination.innerHTML = ""; // Clear existing links if any.
        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement("a");
            link.href = "#"; // Prevent default navigation.
            link.innerText = i; // Set link text to the page number.
            link.classList.add("page-link"); // Add a class for styling.
            
            // Add a click event listener to update the table when a page is clicked.
            link.addEventListener("click", function(e) {
                e.preventDefault();
                displayPage(i); // Display the selected page.
                updateActiveLink(i); // Highlight the active link.
            });
            pagination.appendChild(link); // Add the link to the pagination container.
        }
    }

    // Function to update the active link's appearance based on the current page.
    function updateActiveLink(activePage) {
        const links = pagination.getElementsByClassName("page-link");
        Array.from(links).forEach((link, index) => {
            // Toggle the "active" class to highlight the link of the current page.
            link.classList.toggle("active", index + 1 === activePage);
        });
    }

    // Initialize the pagination by displaying the first page and creating the pagination links.
    displayPage(1); // Show the first page by default.
    createPaginationLinks(); // Create the pagination links based on the number of pages.
    updateActiveLink(1); // Highlight the first page link as active.
}

// When the document is fully loaded, initialize pagination for both tables.
document.addEventListener("DOMContentLoaded", () => {
    paginateTable("inputRequestsTable", "inputRequestsPagination"); // Initialize for the input requests table.
    paginateTable("recommendationsTable", "recommendationsPagination"); // Initialize for the recommendations table.
});

//Report Details Page
let chart; // Variable to hold the success rate chart
let competitorsChart; // Variable to hold the competitors chart

function showReportDetails(item) {
    document.getElementById('customReportContainer').style.display = 'none'; // Hide the main report container
    
    const reportDetailsContainer = document.getElementById('customReportDetailsContainer'); 
    const reportDetailsContent = document.getElementById('reportDetailsContent');

    let detailsHtml = ''; // Initialize details HTML
    if (item.type === 'طلب مدخل') { // Check if item is an input request
        // Parse step4Result to extract necessary data
        let step4Data = {};
        if (item.step4Result) {
            try {
                step4Data = JSON.parse(item.step4Result)[0]; // Assuming the data is in the first item of the array
            } catch (error) {
                console.error("Error parsing step4Result:", error);
            }
        }
    
        detailsHtml += `
            <div class="customInfoItem">
                <strong>رقم الطلب:</strong> ${item.id || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>حالة الطلب:</strong> ${item.step3Status || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>الأسباب:</strong> ${item.step3Result || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>الموقع:</strong> ${item.location ? `${item.location.lat}, ${item.location.lng}` : 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>التاريخ:</strong> ${new Date(item.createdAt).toLocaleDateString() || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>أسماء المنافسين:</strong>
                <ul>${step4Data.competitors && step4Data.competitors.length > 0 ? step4Data.competitors.map(comp => `<li>${comp}</li>`).join('') : '<li>N/A</li>'}</ul>
            </div>
            <div class="customInfoItem">
                <strong>المواقع القريبة:</strong>
                <ul>${step4Data.nearby_pois && step4Data.nearby_pois.length > 0 ? step4Data.nearby_pois.map(poi => `<li>${poi.name} - ${poi.type}</li>`).join('') : '<li>N/A</li>'}</ul>
            </div>
        `;
    }
    else if (item.type === 'اقتراح') { // Check if item is a recommendation
        detailsHtml += `
            <div class="customInfoItem">
                <strong>ملخص:</strong> ${item.summary || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>نسبة النجاح:</strong> ${item.success_rate || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>الموقع:</strong> ${item.location ? `${item.location.lat}, ${item.location.lng}` : 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>التاريخ:</strong> ${new Date(item.createdAt).toLocaleDateString() || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>أسماء المنافسين:</strong>
                <ul>${item.competitors ? item.competitors.map(comp => `<li>${comp}</li>`).join('') : '<li>N/A</li>'}</ul>
            </div>
            <div class="customInfoItem">
                <strong>المواقع القريبة:</strong>
                <ul>${item.nearby_pois ? item.nearby_pois.map(poi => `<li>${poi.name} - ${poi.type}</li>`).join('') : '<li>N/A</li>'}</ul>
            </div>
        `;
    }

    reportDetailsContent.innerHTML = detailsHtml; // Set the inner HTML of the details content
    reportDetailsContainer.style.display = 'block'; // Show the details container

    // Update success rate and chart
    const successRate = item.success_rate || 0; 

    // Add the pie chart
    Chart.register({
        id: 'centerText',
        afterDatasetsDraw(chart) {
            if (chart.config.type === 'doughnut') { // Apply only to doughnut chart
                const { ctx, chartArea: { width, height } } = chart;
                ctx.save();
                ctx.font = 'bold 20px sans-serif';
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    `${chart.data.datasets[0].data[0]}%`,
                    width / 2,
                    height / 2
                );
                ctx.restore();
            }
        }
    });

    // Create or update the success rate chart
    if (chart) {
        chart.data.datasets[0].data = [successRate, 100 - successRate];
        chart.update(); // Refresh the chart
    } else { 
        const ctx = document.getElementById('customChart').getContext('2d'); 
        chart = new Chart(ctx, {
            type: 'doughnut', // Set chart type to doughnut
            data: {
                labels: ['نجاح', 'فشل'],
                datasets: [{
                    data: [successRate, 100 - successRate], 
                    backgroundColor: ['#3E8C74', '#FF3B3B'],
                }]
            },
            options: {
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: {
                    legend: { display: false }, 
                    tooltip: { enabled: false } 
                },
                cutout: '75%' 
            }
        });
    }

    // Data for competitors chart
    const competitorsCount = item.competitors ? item.competitors.length : 0; 
    const nearbyCount = item.nearby_pois ? item.nearby_pois.length : 0; 

    // Create or update the competitors chart
    if (competitorsChart) { 
        competitorsChart.data.datasets[0].data = [competitorsCount, nearbyCount];
        competitorsChart.update(); // Refresh the chart
    } else { 
        const ctxCompetitors = document.getElementById('customCompetitorsChart').getContext('2d'); 
        competitorsChart = new Chart(ctxCompetitors, {
            type: 'bar', // Set chart type to bar
            data: {
                labels: ['المنافسون', 'الأماكن القريبة'], 
                datasets: [{
                    data: [competitorsCount, nearbyCount], // Data for competitors chart
                    backgroundColor: ['#3E8C74', '#FF3B3B'], // Colors for the chart bars
                }]
            },
            options: {
                responsive: true, 
                scales: {
                    y: {
                        beginAtZero: true 
                    }
                },
                plugins: {
                    legend: { display: false } 
                }
            }
        });
    }    
}

function hideReportDetails() {
    document.getElementById('customReportContainer').style.display = 'block'; // Show the main report container
    const reportDetailsContainer = document.getElementById('customReportDetailsContainer'); // Get details container
    reportDetailsContainer.style.display = 'none'; // Hide details container
}