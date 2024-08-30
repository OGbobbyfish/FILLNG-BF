from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app)

DB_NAME = 'lagos_stations.db'

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS stations
                 (id INTEGER PRIMARY KEY, name TEXT, vicinity TEXT, 
                  lat REAL, lng REAL, price_per_litre REAL, 
                  is_open INTEGER, last_updated TEXT)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/stations', methods=['GET'])
def get_stations():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT * FROM stations")
    stations = [dict(id=row[0], name=row[1], vicinity=row[2], 
                     geometry=dict(location=dict(lat=row[3], lng=row[4])),
                     price_per_litre=row[5], is_open=bool(row[6]), last_updated=row[7]) 
                for row in c.fetchall()]
    conn.close()
    return jsonify(stations)

@app.route('/api/update_station', methods=['POST'])
def update_station():
    data = request.json
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''UPDATE stations SET price_per_litre = ?, is_open = ?, last_updated = CURRENT_TIMESTAMP
                 WHERE id = ?''', (data['price'], data['is_open'], data['id']))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)
