from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

GOOGLE_PLACES_API_KEY = 'AIzaSyA_-GywyNWz1i-BMhnQPe6qZLA38yY1H-s'
LOCATION = (6.4478, 3.4723)
RADIUS = 3500  # in meters
FUEL_PRICE = 600  # fixed price

@app.route('/stations', methods=['GET'])
def get_gas_stations():
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={LOCATION[0]},{LOCATION[1]}&radius={RADIUS}&type=gas_station&key={GOOGLE_API_KEY}"
    response = requests.get(url)
    stations = response.json().get('results', [])
    
    # Add fixed price to each station
    for station in stations:
        station['price'] = FUEL_PRICE

    return jsonify(stations)

if __name__ == '__main__':
    app.run(debug=True)
