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
            link.addEventListener("click", function (e) {
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

// Register the plugin outside the function to avoid multiple registrations
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

            // Use the latest successRate from chart data
            const successData = chart.data.datasets[0].data[0];
            const percentage = Math.round(successData); // Calculate percentage based on chart data
            ctx.fillText(
                `${percentage}%`, // Show percentage in the center
                width / 2,
                height / 2
            );
            ctx.restore();
        }
    }
});

function showReportDetails(item) {
    document.getElementById('customReportContainer').style.display = 'none'; // Hide the main report container

    const reportDetailsContainer = document.getElementById('customReportDetailsContainer');
    const reportDetailsContent = document.getElementById('reportDetailsContent');

    let detailsHtml = ''; // Initialize details HTML
    let step4Data = {}; // Initialize step4Data

    let successRate = 0; // Default successRate to 0
    let competitorsCount = 0;
    let nearbyCount = 0;

    if (item.type === 'طلب مدخل') { // Check if item is an input request
        if (item.step4Result) {
            try {
                step4Data = JSON.parse(item.step4Result)[0];
                successRate = step4Data.success_rate || 0;
                competitorsCount = step4Data.competitors ? step4Data.competitors.length : 0;
                nearbyCount = step4Data.nearby_pois ? step4Data.nearby_pois.length : 0;
            } catch (error) {
                console.error("Error parsing step4Result:", error);
            }
        }

        const neighborhoodName = getNeighborhoodNameSync(item.location.lat, item.location.lng);

        detailsHtml += `
            <div class="customInfoItem">
                <strong>رقم الطلب:</strong> ${step4Data.summary || 'N/A'}
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
                <strong>اسم الحي:</strong> ${neighborhoodName}
            </div>
            <div class="customInfoItem">
                <strong>التاريخ:</strong> ${new Date(item.createdAt).toLocaleDateString() || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>أسماء المنافسين:</strong>
                <ul>${step4Data.competitors && step4Data.competitors.length > 0 ?
                    step4Data.competitors.map(comp => `<li><i class="fas fa-store"></i> ${comp}</li>`).join('')
                    : '<li>N/A</li>'}</ul>
            </div>
            <div class="customInfoItem">
                <strong>المواقع القريبة:</strong>
                <ul>${step4Data.nearby_pois && step4Data.nearby_pois.length > 0 ?
                    step4Data.nearby_pois.map(poi => `<li><i class="fas fa-map-marker-alt"></i> ${poi.name} - ${poi.type}</li>`).join('')
                    : '<li>N/A</li>'}</ul>
            </div>
        `;
    } else if (item.type === 'اقتراح') {
        successRate = item.success_rate || 0;
        competitorsCount = item.competitors ? item.competitors.length : 0;
        nearbyCount = item.nearby_pois ? item.nearby_pois.length : 0;

        const neighborhoodName = getNeighborhoodNameSync(item.location.lat, item.location.lng);

        detailsHtml += `
            <div class="customInfoItem">
                <strong>ملخص:</strong> ${item.summary || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>نسبة النجاح:</strong> ${successRate || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>الموقع:</strong> ${item.location ? `${item.location.lat}, ${item.location.lng}` : 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>اسم الحي:</strong> ${neighborhoodName}
            </div>
            <div class="customInfoItem">
                <strong>التاريخ:</strong> ${new Date(item.createdAt).toLocaleDateString() || 'N/A'}
            </div>
            <div class="customInfoItem">
                <strong>أسماء المنافسين:</strong>
                <ul>${item.competitors ? item.competitors.map(comp => `<li><i class="fas fa-store"></i>${comp}</li>`).join('') : '<li>N/A</li>'}</ul>
            </div>
            <div class="customInfoItem">
                <strong>المواقع القريبة:</strong>
                <ul>${item.nearby_pois && item.nearby_pois.length > 0
                    ? item.nearby_pois.map(poi => `<li><i class="fas fa-map-marker-alt"></i>${poi.name} - ${poi.type}</li>`).join('')
                    : '<li>الموقع لا يتوافق مع استراتيجية ال 15 دقيقة</li>'
                }</ul>
            </div>
        `;
    }

    reportDetailsContent.innerHTML = detailsHtml;
    reportDetailsContainer.style.display = 'block';

    console.log("Success Rate:", successRate);

    if (chart) {
        chart.data.datasets[0].data = [successRate, 100 - successRate];
        chart.update();
    } else {
        const ctx = document.getElementById('customChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'doughnut',
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

    if (competitorsChart) {
        competitorsChart.data.datasets[0].data = [competitorsCount, nearbyCount];
        competitorsChart.update();
    } else {
        const ctxCompetitors = document.getElementById('customCompetitorsChart').getContext('2d');
        competitorsChart = new Chart(ctxCompetitors, {
            type: 'bar',
            data: {
                labels: ['المنافسون', 'الأماكن القريبة'],
                datasets: [{
                    data: [competitorsCount, nearbyCount],
                    backgroundColor: ['#3E8C74', '#FF3B3B'],
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
    document.getElementById('customReportContainer').style.display = 'block';
    const reportDetailsContainer = document.getElementById('customReportDetailsContainer');
    reportDetailsContainer.style.display = 'none';
}
function printCustomReport() {
    const reportContainer = document.getElementById('customReportDetailsContainer');

    if (reportContainer) {
        // Make the customReportDetailsContainer visible
        reportContainer.style.display = 'block';

        // Hide sidebar and any other elements
        document.getElementById('sidebar').style.display = 'none';

        // Trigger the print dialog
        window.print();

        // Restore visibility after printing (if needed)
        reportContainer.style.display = 'none';
        document.getElementById('sidebar').style.display = 'block';
    }
}
