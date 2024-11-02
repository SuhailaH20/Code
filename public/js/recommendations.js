window.onload = function () {
    window.map = L.map('map').setView([21.4858, 39.1925], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const observer = new MutationObserver(function () {
        window.map.invalidateSize();
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    setTimeout(function () {
        window.map.invalidateSize();
    }, 500);
};

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('recommendation-form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

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

            // Clear previous circles from the map
            if (Array.isArray(window.mapCircles)) {
                window.mapCircles.forEach(circle => window.map.removeLayer(circle));
            }
            window.mapCircles = []; // Reset the circles array

            // Display recommendations as cards
            data.recommendations.forEach(function (rec, index) {
                const recElement = document.createElement('div');
                recElement.className = 'recommendation-card';

                // Only display the count of nearby sites and competitors
                const nearbyCount = rec.nearby_pois.length;
                const competitorsCount = rec.competitors.length;

                // Create HTML for the recommendation card
                recElement.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex-grow: 1;">
                            <h3>${rec.summary}</h3>
                            <div class="info-row">
                                <div class="info-item">
                                    <span>نسبة النجاح</span>
                                    <span>${rec.success_rate}%</span>
                                </div>
                                <div class="info-item">
                                    <span>عدد المواقع القريبة</span>
                                    <span>${nearbyCount}</span>
                                </div>
                                <div class="info-item">
                                    <span>عدد المنافسين</span>
                                    <span>${competitorsCount}</span>
                                </div>
                            </div>
                        </div>
                        <div class="chart-container" style="width: 80px; height: 80px; margin-left: 10px;">
                            <canvas id="chart-${index}" style="max-width: 80px; max-height: 80px;"></canvas>
                        </div>
                    </div>
                `;

                // إنشاء زر "للتفاصيل اضغط هنا" وإضافته إلى recElement
                const buttonElement = document.createElement('button');
                buttonElement.className = 'link-button';
                buttonElement.textContent = 'للتفاصيل اضغط هنا';
                buttonElement.onclick = function () {
                    window.location.href = `/components/report?index=${index}&neighborhood=${neighborhood}&activity=${activity}`;
                };

                recElement.appendChild(buttonElement);
                recommendationsContainer.appendChild(recElement);

                // Add a circle to the map for each recommendation
                let color;
                if (rec.success_rate <= 40) {
                    color = 'red';
                } else if (rec.success_rate <= 70) {
                    color = 'yellow';
                } else {
                    color = 'green';
                }

                // Add a circle for each recommended location
                var circle = L.circle([rec.lat, rec.lng], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    radius: 500
                }).addTo(window.map);

                // Add a popup to the circle
                circle.bindPopup(`${rec.summary}`);

                // Store the circle in the mapCircles array
                window.mapCircles.push(circle);

                // Zoom to the recommended location
                window.map.setView([rec.lat, rec.lng], 12.5);

                // Add the pie chart
                // Add the pie chart with percentage in the center
                Chart.register({
                    id: 'centerText',
                    afterDatasetsDraw(chart) {
                        const { ctx, chartArea: { width, height } } = chart;
                        ctx.save();
                        ctx.font = 'bold 20px sans-serif'; // Adjust font size and weight as needed
                        ctx.fillStyle = '#000';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(
                            `${chart.data.datasets[0].data[0]}%`, // Display the success rate
                            width / 2,
                            height / 2
                        );
                        ctx.restore();
                    }
                });
                
                const ctx = document.getElementById(`chart-${index}`).getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['نجاح', 'فشل'],
                        datasets: [{
                            data: [rec.success_rate, 100 - rec.success_rate],
                            backgroundColor: ['#3E8C74', '#FF3B3B'],
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: false
                            }
                        },
                        cutout: '75%' // Adjusts the hole size
                    },
                    plugins: ['centerText'] // Register the custom plugin here
                });
                
            });
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    });
});