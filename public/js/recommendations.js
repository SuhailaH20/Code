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
                // Display recommendations
                data.recommendations.forEach(function (rec) {
                    const recElement = document.createElement('div');
                    recElement.innerHTML = `
        <h3>${rec.summary}</h3>
        <p>Number of Competitors: ${rec.competitors_count}</p>
        <p>Success Rate: ${rec.success_rate}%</p>
        <p>Nearby POIs: ${rec.nearby_pois.map(poi => `${poi.name} - ${poi.type}`).join(', ')}</p>
    `;
                    recommendationsContainer.appendChild(recElement);
                });

                // Display competitors list
                if (data.competitors && data.competitors.length > 0) {
                    const competitorsContainer = document.createElement('div');
                    competitorsContainer.innerHTML = '<h3>Competitors:</h3>';
                    data.competitors.forEach(function (comp) {
                        const compElement = document.createElement('p');
                        compElement.textContent = `${comp.title} (Lat: ${comp['location/lat']}, Lng: ${comp['location/lng']})`;
                        competitorsContainer.appendChild(compElement);
                    });
                    recommendationsContainer.appendChild(competitorsContainer);
                }
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    });
});
