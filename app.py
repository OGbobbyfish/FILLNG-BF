from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

GOOGLE_PLACES_API_KEY = 'AIzaSyA_-GywyNWz1i-BMhnQPe6qZLA38yY1H-s'

@app.route('/api/stations', methods=['GET'])
def get_stations():
    latitude = 6.4478
    longitude = 3.4723
    radius = 5500  # in meters

    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius={radius}&type=gas_station&key={GOOGLE_PLACES_API_KEY}"
    response = requests.get(url)
    stations = response.json().get('results', [])

    # Add price information (fixed at N600/litre)
    for station in stations:
        station['price_per_litre'] = 600

    return jsonify(stations)

if __name__ == '__main__':
    app.run(debug=True)
