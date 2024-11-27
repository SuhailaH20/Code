import logging
from flask import Flask, render_template, jsonify, request
import pandas as pd
from sklearn.cluster import KMeans
from geopy.distance import geodesic
from sklearn.metrics import accuracy_score
import sqlite3
import requests
import pandas as pd

app = Flask(__name__)

# Load the dataset
data = pd.read_csv('cafe.csv')

# Ensure 'location/lat' and 'location/lng' columns are strings before cleaning
data['location/lat'] = data['location/lat'].astype(str).str.replace(',', '').astype(float)
data['location/lng'] = data['location/lng'].astype(str).str.replace(',', '').astype(float)

# Initialize the database and its tables
def init_db():
    conn = sqlite3.connect('recommendations.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS selected_locations (
                    id INTEGER PRIMARY KEY,
                    lat REAL,
                    lng REAL,
                    activity_type TEXT
                )''')
    conn.commit()
    conn.close()

init_db()

# Function to check if a location is within Jeddah
def is_within_jeddah(lat, lng):
    jeddah_bounds = {
        "north": 21.85,
        "south": 21.25,
        "east": 39.5,
        "west": 38.9
    }
    return jeddah_bounds["south"] <= lat <= jeddah_bounds["north"] and jeddah_bounds["west"] <= lng <= jeddah_bounds["east"]

# Train the KMeans model and filter data by activity type
def get_kmeans_clusters(filtered_data, n_clusters=10):
    if filtered_data.empty:
        return [], filtered_data
    
    coordinates = filtered_data[['location/lat', 'location/lng']]
    n_clusters = min(n_clusters, len(coordinates))
    
    if n_clusters < 1:
        return [], filtered_data
    
    kmeans = KMeans(n_clusters=n_clusters)
    kmeans.fit(coordinates)
    
    filtered_data = filtered_data.copy()
    filtered_data.loc[:, 'cluster'] = kmeans.labels_
    return kmeans.cluster_centers_, filtered_data

# Analyze competitors in the selected neighborhood
def analyze_competitors(neighborhood, activity_type):
    competitors = data[(data['neighborhood'] == neighborhood) & (data['categoryName'] == activity_type)]
    return competitors

# Function to fetch POIs from OpenStreetMap (parks, malls, etc.)
def fetch_pois_from_osm(lat, lng, radius=1.25):
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
      node["leisure"="park"](around:{radius * 1000},{lat},{lng});
      node["amenity"="school"](around:{radius * 1000},{lat},{lng});
      node["amenity"="university"](around:{radius * 1000},{lat},{lng});
      node["amenity"="hospital"](around:{radius * 1000},{lat},{lng});
      node["amenity"="gym"](around:{radius * 1000},{lat},{lng});
      node["amenity"="hotel"](around:{radius * 1000},{lat},{lng});
      node["amenity"="fuel"](around:{radius * 1000},{lat},{lng});
      node["amenity"="bank"](around:{radius * 1000},{lat},{lng});
    );
    out body;
    """
    logging.debug(f"Overpass query: {overpass_query}")
    response = requests.get(overpass_url, params={'data': overpass_query})
    
    if response.status_code != 200:
        logging.error(f"Error fetching POIs: {response.text}")
        return []

    try:
        data = response.json()
    except ValueError as e:
        logging.error(f"Error decoding JSON response: {e}")
        return []

    pois = []
    for element in data['elements']:
        tags = element.get('tags', {})
        logging.debug(f"Tags for element: {tags}")  # Log tags for debugging
        name = tags.get('name', 'Unknown')
        poi_type = tags.get('leisure') or tags.get('shop') or tags.get('amenity', 'POI')
        
        # تحقق من أن الاسم ليس "Unknown" قبل الإضافة
        if name != 'Unknown':
            pois.append({
                'lat': element['lat'],
                'lng': element['lon'],
                'name': name,
                'type': poi_type
            })
    
    logging.debug(f"Fetched POIs: {pois}")
    return pois


def get_places_within_15_minutes(lat, lng, pois):
    walking_radius_km = 1.25  # 15-minute walk = 1.25 km
    nearby_pois = set()  # استخدم مجموعة لتجنب التكرار

    logging.debug(f"Checking nearby POIs for location ({lat}, {lng}) with a walking radius of {walking_radius_km} km.")

    for poi in pois:
        poi_location = (poi['lat'], poi['lng'])
        distance = geodesic((lat, lng), poi_location).kilometers
        logging.debug(f"Checking POI: {poi['name']} at distance: {distance:.2f} km")
        
        if distance <= walking_radius_km:
            nearby_pois.add((poi['name'], poi['type']))  # إضافة الاسم والنوع كمجموعة لتجنب التكرار
            logging.debug(f"POI {poi['name']} added: {distance:.2f} km within 15 minutes")

    # تحويل المجموعة إلى قائمة
    nearby_pois_list = [{'name': name, 'type': poi_type} for name, poi_type in nearby_pois]
    logging.debug(f"Nearby POIs within 15 minutes: {nearby_pois_list}")
    return nearby_pois_list

# Function to calculate nearby competitors
def count_competitors(lat, lng, radius=0.5):
    competitor_count = 0
    competitor_names = []  # قائمة لتخزين أسماء المنافسين
    
    for _, row in data.iterrows():
        competitor_location = (row['location/lat'], row['location/lng'])
        distance = geodesic((lat, lng), competitor_location).kilometers
        if distance <= radius:
            competitor_count += 1
            competitor_names.append(row['title'])  # افترض أن 'title' هو اسم المنافس

    return competitor_count, competitor_names  # إرجاع عدد المنافسين وأسمائهم

@app.route('/get_recommendations', methods=['GET'])
def get_recommendations():
    activity_type = request.args.get('activity_type')
    neighborhood = request.args.get('neighborhood')
    lat = request.args.get('lat', type=float)  # استقبل إحداثيات latitude
    lng = request.args.get('lng', type=float)  # استقبل إحداثيات longitude

    # إذا تم إدخال إحداثيات، استخدمها مباشرة
    if lat is not None and lng is not None:
        # تحقق مما إذا كانت الإحداثيات داخل جدة
        if not is_within_jeddah(lat, lng):
            return jsonify({"error": "Location is out of bounds."})

        # حساب عدد المنافسين والمعلومات الأخرى
        num_competitors, competitor_names = count_competitors(lat, lng)
        pois = fetch_pois_from_osm(lat, lng)  # جلب POIs من OpenStreetMap
        nearby_pois = get_places_within_15_minutes(lat, lng, pois)

        # تحديد معدل النجاح
        if num_competitors >= 4:
            success_rate = 40
        elif 2 <= num_competitors <= 3:
            success_rate = 70
        else:
            success_rate = 90

        recommendation = {
            'id': 0,  # استخدم 0 للموقع المدخل
            'lat': lat,
            'lng': lng,
            'summary': f'تحليل .',
            'competitors_count': num_competitors,
            'competitors': competitor_names,
            'success_rate': success_rate,
            'nearby_pois': nearby_pois
        }

        recommendations = [recommendation]  # قائمة الاقتراحات تحتوي على اقتراح واحد
    else:
        # إذا لم يتم إدخال إحداثيات، استخدم الفلترة كما هو الحال السابق
        filtered_data = data[(data['neighborhood'] == neighborhood) & (data['categoryName'] == activity_type)]
        centers, filtered_data = get_kmeans_clusters(filtered_data, n_clusters=5)

        if len(centers) == 0:
            return jsonify({"error": "No recommendations found for this activity."})

        recommendations = []
        success_rate_categories = {40: [], 70: [], 90: []}
        recommendation_counter = 1  # عداد التوصيات

        for i, center in enumerate(centers):
            if is_within_jeddah(center[0], center[1]):
                num_competitors, competitor_names = count_competitors(center[0], center[1])
                pois = fetch_pois_from_osm(center[0], center[1])
                nearby_pois = get_places_within_15_minutes(center[0], center[1], pois)

                if num_competitors >= 4:
                    success_rate = 40
                elif 2 <= num_competitors <= 3:
                    success_rate = 70
                else:
                    success_rate = 90

                recommendation = {
                    'id': recommendation_counter,
                    'lat': center[0],
                    'lng': center[1],
                    'summary': f'الاقتراح {recommendation_counter} - افضل موقع للنشاط "{activity_type}".',
                    'competitors_count': num_competitors,
                    'competitors': competitor_names,
                    'success_rate': success_rate,
                    'nearby_pois': nearby_pois
                }

                success_rate_categories[success_rate].append(recommendation)
                recommendation_counter += 1  # زيادة العداد بعد كل توصية

        for rate in [90, 70, 40]:
            if success_rate_categories[rate]:
                recommendations.extend(success_rate_categories[rate])

        # تعيين العداد إلى 1 مرة أخرى
        recommendation_counter = 1

        # تحديث التوصيات بأرقام مرتبة
        for recommendation in recommendations:
            recommendation['id'] = recommendation_counter
            recommendation['summary'] = f'الاقتراح {recommendation_counter} - افضل موقع للنشاط "{activity_type}".'
            recommendation_counter += 1

        recommendations = recommendations[:3]

    # تحليل المنافسين في الحي المحدد
    competitors = analyze_competitors(neighborhood, activity_type)
    competitors_list = competitors[['title', 'location/lat', 'location/lng']].to_dict(orient='records')

    return jsonify({
        "recommendations": recommendations,
        "competitors": competitors_list
    })
    
# API endpoint to save the selected location
@app.route('/select_location', methods=['POST'])
def select_location():
    data = request.get_json()
    lat = data.get('lat')
    lng = data.get('lng')
    activity_type = data.get('activity_type')
    
    if not lat or not lng or not activity_type:
        return jsonify({"error": "Missing data"}), 400
    
    conn = sqlite3.connect('recommendations.db')
    c = conn.cursor()
    c.execute("INSERT INTO selected_locations (lat, lng, activity_type) VALUES (?, ?, ?)", (lat, lng, activity_type))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Location selected successfully"})


@app.route('/location_info', methods=['GET'])
def location_info():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    activity_type = request.args.get('activity_type')
    
    location_info = {
        'lat': lat,
        'lng': lng,
        'activity_type': activity_type,
        'message': 'This location has been selected.'
    }
    
    return render_template('location_info.html', location=location_info)

# Main route to display the busniess types and neighborhoods
@app.route('/')
def index():
    # Extract unique activity types from 'categoryName' column
    activity_types = data['categoryName'].unique().tolist()

    # Extract unique neighborhoods and filter to include only those in Jeddah
    neighborhoods = data[data['city'] == 'Jeddah']['neighborhood'].unique().tolist()

    # Return the JSON response
    return jsonify(activities=activity_types, neighborhoods=neighborhoods)


if __name__ == '__main__':
    app.run(port=5001, debug=True)

