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

// Report Details Page
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

    // Extract the reasons for success
    const successReasons = item.successReasons || []; // Assuming successReasons is part of the item object

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
                <h4 class="section-title-Report">تحليل الاشتراطات</h4><br>
                <strong>رقم الطلب:</strong> ${step4Data.summary || 'N/A'}<br>
                <strong>حالة الطلب:</strong> ${item.step3Status || 'N/A'}<br>
                <strong>الأسباب:</strong> موقعك يتناسب مع الاشتراطات	
                لمعرفة التفاصيل <a href="#" id="showSuccessReasons" on>اضغط هنا</a>
            </div>
            <div class="customInfoItem">
                <h4 class="section-title-Report">تحليل الموقع</h4><br>
                <strong>الحي:</strong> ${neighborhoodName}<br>
                <strong>الموقع:</strong> ${item.location ? `${item.location.lat}, ${item.location.lng}` : 'N/A'}<br>
                <strong>نسبة النجاح :</strong> ${successRate || 'N/A'}
            </div>
            <div class="customInfoItem">
                <h4 class="section-title-Report">تحليل المنافسين</h4><br>
                <strong>:أسماء المنافسين</strong>
                    <ul>${item.competitors ? item.competitors.map(comp => `<li><i class="fas fa-store"></i>${comp}</li>`).join('') : '<li>N/A</li>'}</ul>
            </div>
            <div class="customInfoItem">
                <h4 class="section-title-Report">تحليل استراتيجية ال15 دقيقة</h4><br>
                <strong>:المواقع القريبة</strong>
                    <ul>${item.nearby_pois && item.nearby_pois.length > 0
                    ? item.nearby_pois.map(poi => `<li><i class="fas fa-map-marker-alt"></i>${poi.name} - ${poi.type}</li>`).join('')
                    : '<li>الموقع لا يتوافق مع استراتيجية ال 15 دقيقة</li>'
                }</ul>
            </div>
        `;
    } else if (item.type === 'اقتراح') {
        successRate = item.success_rate || 0;
        competitorsCount = item.competitors ? item.competitors.length : 0;
        nearbyCount = item.nearby_pois ? item.nearby_pois.length : 0;

        const neighborhoodName = getNeighborhoodNameSync(item.location.lat, item.location.lng);

        detailsHtml += `
        <div class="customInfoItem">
            <h4 class="section-title-Report">تفاصيل الاقتراح</h4>
            <p>${item.summary || 'N/A'}</p>
            <strong>التاريخ:</strong> ${new Date(item.createdAt).toLocaleDateString() || 'N/A'}
        </div>
        <div class="customInfoItem">
            <h4 class="section-title-Report">تحليل الموقع</h4><br>
            <strong>نسبة النجاح:</strong> ${successRate || 'N/A'}<br>
            <strong>الحي:</strong> ${neighborhoodName}<br>
            <strong>الموقع:</strong> ${item.location ? `${item.location.lat}, ${item.location.lng}` : 'N/A'}
        </div>
        <div class="customInfoItem">
            <h4 class="section-title-Report">تحليل المنافسين</h4><br>
            <strong>:أسماء المنافسين</strong>
                <ul>${item.competitors ? item.competitors.map(comp => `<li><i class="fas fa-store"></i>${comp}</li>`).join('') : '<li>N/A</li>'}</ul>
        </div>
        <div class="customInfoItem">
            <h4 class="section-title-Report">تحليل استراتيجية ال15 دقيقة</h4><br>
            <strong>:المواقع القريبة</strong>
                <ul>${item.nearby_pois && item.nearby_pois.length > 0
                ? item.nearby_pois.map(poi => `<li><i class="fas fa-map-marker-alt"></i>${poi.name} - ${poi.type}</li>`).join('')
                : '<li>الموقع لا يتوافق مع استراتيجية ال 15 دقيقة</li>'
            }</ul>
        </div>
    `;
    }

    reportDetailsContent.innerHTML = detailsHtml;
    reportDetailsContainer.style.display = 'block';

// Add click event for "Click here"
const showSuccessReasonsLink = document.getElementById('showSuccessReasons');
if (showSuccessReasonsLink) {
    showSuccessReasonsLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        showSuccessReasonsPopup(item); // Pass success reasons to the popup
    });
}   
    console.log("Success Rate:", successRate);

    if (chart) {
        chart.data.datasets[0].data = [successRate, 100 - successRate];
        chart.update();
    } else {
        const ctx = document.getElementById('customChart').getContext('2d');

        // Create gradient for the first segment
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, '#3E8C74');
        gradient.addColorStop(1, '#1C4A69');

        chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['نجاح', 'فشل'],
                datasets: [{
                    data: [successRate, 100 - successRate],
                    backgroundColor: [gradient, '#f0eded'],
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

    // Update competitors chart
    if (competitorsChart) {
        competitorsChart.data.datasets[0].data = [competitorsCount, nearbyCount];
        competitorsChart.update();
    } else {
        const ctxCompetitors = document.getElementById('customCompetitorsChart').getContext('2d');
        // Set the chart canvas size explicitly
        const chartCanvas = document.getElementById('customCompetitorsChart');
        chartCanvas.width = 1860; // Set width
        chartCanvas.height = 1550; // Set height
        competitorsChart = new Chart(ctxCompetitors, {
            type: 'bar',
            data: {
                labels: ['المنافسين', 'الأماكن القريبة'],
                datasets: [{
                    data: [competitorsCount, nearbyCount],
                    backgroundColor: ['#3E8C74', '#1C4A69'],
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

// Function to display success reasons in a popup
function showSuccessReasonsPopup(item) {
    console.log('Popup item:', item); // Debugging: Check the `item` object
    const popup = document.createElement('div'); // Create the popup element
    popup.className = 'popup'; // Add CSS class for the popup

    // Set the popup content
    popup.innerHTML = `
    <div class="popup-content" style="width: 500px; max-width: 90%; height: auto; max-height: 80%; overflow-y: auto;">
        <span class="close-popup">&times;</span><!-- Close button -->
        <h3>تفاصيل أسباب النجاح</h3>
        <hr style="border: 1px solid #d9d9d972; margin: 10px 0;">
        <ul>
            ${item.step3Result
                ? item.step3Result.split(/[;,]/) // Split reasons by commas or semicolons
                      .map(reason => `
                          <li class="reason-item">
                              <span>${reason.trim()}</span>
                              <span class="check-mark">✔️</span>
                          </li>`)
                      .join('')
                : '<li>لا توجد أسباب متوفرة</li>'}
        </ul>
    </div>
`;

    document.body.appendChild(popup);

    // Event to close the popup when the close button is clicked
    popup.querySelector('.close-popup').addEventListener('click', function () {
        document.body.removeChild(popup); // Remove the popup
    });

    // Close the popup when clicking anywhere outside the content
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            document.body.removeChild(popup); // Remove the popup
        }
    });
}

// Function to show rejection reasons in a popup
function showRejectionReasonsPopup(reasons) {
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Set the popup content for rejection reasons
    popup.innerHTML = `
    <div class="popup-content" style="width: 700px; max-width: 90%; height: auto; max-height: 80%; overflow-y: auto;">
        <span class="close-popup">&times;</span>
        <h3>تفاصيل أسباب الرفض</h3>
        <hr style="border: 1px solid #d9d9d972; margin: 10px 0;"> <!-- إضافة خط هنا -->
        <ul>
            ${reasons
                ? reasons.split(/[;,]/) // Split reasons by commas or semicolons
                      .map(reason => `
                          <li class="reason-item">
                              <span>${reason.trim()}</span>
                              <span class="check-mark">❌</span>
                          </li>`)
                      .join('')
                : '<li>لا توجد أسباب متوفرة</li>'}
        </ul>
    </div>
`;

    document.body.appendChild(popup); // Append the popup to the body

    // Event to close the popup when the close button is clicked
    popup.querySelector('.close-popup').addEventListener('click', function () {
        document.body.removeChild(popup); // Remove the popup
    });

    // Close the popup when clicking anywhere outside the content
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            document.body.removeChild(popup); // Remove the popup
        }
    });
}

// Add click event for all "اضغط هنا" links
document.addEventListener('DOMContentLoaded', () => {
    const showRejectionReasonsLinks = document.querySelectorAll('.show-rejection-reasons');
    showRejectionReasonsLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const reasons = this.getAttribute('data-reasons');
            showRejectionReasonsPopup(reasons); // Pass reasons to the popup
        });
    });
});

function hideReportDetails() {
    document.getElementById('customReportContainer').style.display = 'block';
    const reportDetailsContainer = document.getElementById('customReportDetailsContainer');
    reportDetailsContainer.style.display = 'none'; // Hide the report details container
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

document.addEventListener('DOMContentLoaded', function () {
    const inputRequestsTable = document.getElementById('inputRequestsTable');
    const recommendationsTable = document.getElementById('recommendationsTable');
    const noReportsMessage = document.getElementById('noReportsMessage');
    const inputRequestsContainer = document.getElementById('inputRequestsContainer');
    const recommendationsContainer = document.getElementById('recommendationsContainer');
    const recommendationsTitle = document.getElementById('recommendationsTitle');
    const inputRequestsTitle = document.getElementById('inputRequestsTitle');
  
    const inputRequestsCount = inputRequestsTable.querySelectorAll('tbody tr').length;
    const recommendationsCount = recommendationsTable.querySelectorAll('tbody tr').length;
  
    // Check if there are no reports
    if (inputRequestsCount === 0 && recommendationsCount === 0) {
        noReportsMessage.style.display = 'block'; // Show no reports message
        inputRequestsContainer.style.display = 'none'; // Hide input requests container
        recommendationsContainer.style.display = 'none'; // Hide recommendations container
        inputRequestsTitle.style.display = 'none'; // Hide input requests title
        recommendationsTitle.style.display = 'none'; // Hide recommendations title
    } else {
        noReportsMessage.style.display = 'none'; // Hide no reports message
        
        // Show relevant tables based on the counts
        if (inputRequestsCount > 0) {
            inputRequestsContainer.style.display = 'block'; // Show input requests if they exist
            inputRequestsTitle.style.display = 'block'; // Show input requests title
        } else {
            inputRequestsContainer.style.display = 'none'; // Hide input requests container
            inputRequestsTitle.style.display = 'none'; // Hide input requests title
        }
  
        if (recommendationsCount > 0) {
            recommendationsContainer.style.display = 'block'; // Show recommendations if they exist
            recommendationsTitle.style.display = 'block'; // Show recommendations title
        } else {
            recommendationsContainer.style.display = 'none'; // Hide recommendations container
            recommendationsTitle.style.display = 'none'; // Hide recommendations title
        }
    }
});