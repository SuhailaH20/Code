// Add OpenStreetMap tiles
window.onload = function() {
    var map = L.map('map').setView([21.4858, 39.1925], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Use MutationObserver to detect changes and resize the map
    const observer = new MutationObserver(function() {
        map.invalidateSize();
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    setTimeout(function() {
        map.invalidateSize();
    }, 500);
};
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('recommendation-form');
    
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const neighborhood = document.getElementById('neighborhood').value;
        const activity = document.querySelector('select[name="activity"]').value;

        try {
            const response = await fetch(`/get_recommendations?neighborhood=${neighborhood}&activity_type=${activity}`);
            const data = await response.json();

            const recommendationsContainer = document.getElementById('recommendations-container');
            recommendationsContainer.innerHTML = ''; // Clear previous recommendations

            if (data.error) {
                recommendationsContainer.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            // Display recommendations as cards
            data.recommendations.forEach(function (rec, index) {
                const recElement = document.createElement('div');
                recElement.className = 'recommendation-card';

                // Only display the count of nearby POIs and competitors
                const nearbyCount = rec.nearby_pois.length;
                const competitorsCount = rec.competitors.length;

                // Generate recommendation card HTML with button for "للتفاصيل اضغط هنا"
                recElement.innerHTML = `
                    <h3>${rec.summary}</h3>
                    <div class="info-row">
                        <div class="info-item">
                            <span>نسبة النجاح</span>
                            <span>${rec.success_rate}%</span>
                        </div>
                        <div class="info-item">
                            <span>عدد المواقع القريبة</span>
                            <span>${nearbyCount}</span>
                            ${nearbyCount > 2 ? `<button onclick="window.location.href='/components/report?type=nearby&index=${index}&neighborhood=${neighborhood}&activity=${activity}'" class="link-button">للتفاصيل اضغط هنا</button>` : ''}
                        </div>
                        <div class="info-item">
                            <span>عدد المنافسين</span>
                            <span>${competitorsCount}</span>
                            ${competitorsCount > 2 ? `<button onclick="window.location.href='/components/report?type=competitors&index=${index}&neighborhood=${neighborhood}&activity=${activity}'" class="link-button">للتفاصيل اضغط هنا</button>` : ''}
                        </div>
                    </div>
                `;
                recommendationsContainer.appendChild(recElement);
            });
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    });
});
