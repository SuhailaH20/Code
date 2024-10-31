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
            recommendationsContainer.innerHTML = '';

            if (data.error) {
                recommendationsContainer.innerHTML = `<p>${data.error}</p>`;
            } else {
                // Display recommendations as cards
                data.recommendations.forEach(function (rec) {
                    const recElement = document.createElement('div');
                    recElement.className = 'recommendation-card';
                    recElement.innerHTML = `
                        <h3>${rec.summary}</h3>
                        <div class="info-row">
                            <div class="info-item">
                                <span>نسبة النجاح</span>
                                <span>${rec.success_rate}%</span>
                            </div>
                            <div class="info-item">
                                <span>المواقع القريبة</span>
                                <span>${rec.nearby_pois.map(poi => `${poi.name} - ${poi.type}`).join(', ')}</span>
                            </div>
                            <div class="info-item">
                                <span>المنافسين</span>
                                <span>${rec.competitors.join(', ')}</span>
                            </div>
                             <div class="info-item">
                                <span>عدد المنافسين</span>
                                <span>${rec.competitors_count}</span>
                            </div>
                        </div>
                    `;
                    recommendationsContainer.appendChild(recElement);
                });

                // Create or update the pie chart with the success rate data
                createOrUpdateChart(data.recommendations);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    });
});