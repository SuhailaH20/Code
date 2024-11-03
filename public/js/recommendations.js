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
                                    <span>${rec.nearby_pois.length}</span>
                                </div>
                                <div class="info-item">
                                    <span>عدد المنافسين</span>
                                    <span>${rec.competitors.length}</span>
                                </div>
                            </div>
                        </div>
                        <div class="chart-container" style="width: 80px; height: 80px; margin-left: 10px;">
                            <canvas id="chart-${index}" style="max-width: 80px; max-height: 80px;"></canvas>
                        </div>
                    </div>
                `;

                // Create button and add onclick functionality to save recommendation
                const buttonElement = document.createElement('button');
                buttonElement.className = 'link-button';
                buttonElement.textContent = 'للتفاصيل اضغط هنا';
                buttonElement.onclick = async function () {
                    try {
                        const recommendationData = {
                            summary: rec.summary,
                            success_rate: rec.success_rate,
                            nearby_pois: rec.nearby_pois,
                            competitors: rec.competitors,
                            lat: rec.lat,
                            lng: rec.lng
                        };
                        console.log("Sending recommendation data:", recommendationData); // Check data before sending
                
                        await fetch('/saveRecommendation', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ recommendation: recommendationData })
                        });
                
                        window.location.href = `/components/report?index=${index}&neighborhood=${neighborhood}&activity=${activity}`;
                    } catch (error) {
                        console.error('Error saving recommendation:', error);
                    }
                };
                
                recElement.appendChild(buttonElement);
                recommendationsContainer.appendChild(recElement);

                // Add a circle to the map for each recommendation
                const color = rec.success_rate <= 40 ? 'red' : rec.success_rate <= 70 ? 'yellow' : 'green';
                const circle = L.circle([rec.lat, rec.lng], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    radius: 500
                }).addTo(window.map);

                circle.bindPopup(`${rec.summary}`);
                window.mapCircles.push(circle);

                window.map.setView([rec.lat, rec.lng], 12.5);

                // Add the pie chart
                Chart.register({
                    id: 'centerText',
                    afterDatasetsDraw(chart) {
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
                            legend: { display: false },
                            tooltip: { enabled: false }
                        },
                        cutout: '75%'
                    },
                    plugins: ['centerText']
                });
            });
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    });
});
