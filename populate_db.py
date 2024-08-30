import sqlite3
import requests
import time

DB_NAME = 'lagos_stations.db'
API_KEY = 'AIzaSyA_-GywyNWz1i-BMhnQPe6qZLA38yY1H-s'

# Define the bounds for Lagos
LAGOS_BOUNDS = {
    'southwest': {'lat': 6.3936419, 'lng': 3.0982732},
    'northeast': {'lat': 6.7027984, 'lng': 3.5269485}
}

# Lekki coordinates
LEKKI_LAT = 6.4698
LEKKI_LNG = 3.5852

def fetch_stations():
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    stations = []
    next_page_token = None

    while True:
        if next_page_token:
            url = f"{base_url}?pagetoken={next_page_token}&key={API_KEY}"
        else:
            url = f"{base_url}?location={LEKKI_LAT},{LEKKI_LNG}&radius=60000&type=gas_station&key={API_KEY}"

        response = requests.get(url)
        data = response.json()
        
        if 'results' in data:
            # Filter results to only include stations within Lagos bounds
            for station in data['results']:
                lat = station['geometry']['location']['lat']
                lng = station['geometry']['location']['lng']
                if (LAGOS_BOUNDS['southwest']['lat'] <= lat <= LAGOS_BOUNDS['northeast']['lat'] and
                    LAGOS_BOUNDS['southwest']['lng'] <= lng <= LAGOS_BOUNDS['northeast']['lng']):
                    stations.append(station)
        
        next_page_token = data.get('next_page_token')
        
        if not next_page_token:
            break
        
        # Wait 2 seconds before the next request (API requirement)
        time.sleep(2)

    return stations

def get_existing_stations():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT name FROM stations")
    existing_stations = set(row[0] for row in c.fetchall())
    conn.close()
    return existing_stations

def add_new_stations(stations):
    existing_stations = get_existing_stations()
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    new_stations_count = 0

    for station in stations:
        if station['name'] not in existing_stations:
            c.execute('''INSERT INTO stations 
                         (name, vicinity, lat, lng, price_per_litre, is_open, last_updated)
                         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)''',
                      (station['name'], station.get('vicinity', ''),
                       station['geometry']['location']['lat'],
                       station['geometry']['location']['lng'],
                       0, 1))  # Default price to 0 and is_open to True
            new_stations_count += 1

    conn.commit()
    conn.close()
    return new_stations_count

if __name__ == '__main__':
    stations = fetch_stations()
    new_stations_added = add_new_stations(stations)
    print(f"Added {new_stations_added} new stations to the database.")
    print(f"Total stations fetched: {len(stations)}")
