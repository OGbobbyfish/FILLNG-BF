import React, { useState, useEffect } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from 'axios';

const MapContainer = ({ google }) => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/gas-stations');
        setStations(response.data);
      } catch (error) {
        console.error('Error fetching gas stations:', error);
      }
    };

    fetchStations();
  }, []);

  const onMarkerClick = (props, marker, e) => {
    setSelectedStation(props);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Map
        google={google}
        zoom={14}
        initialCenter={{ lat: 6.4478, lng: 3.4723 }}
      >
        {stations.map((station, index) => (
          <Marker
            key={index}
            position={{ lat: station.lat, lng: station.lng }}
            onClick={onMarkerClick}
            name={station.name}
            price={station.price}
          />
        ))}
      </Map>
      {selectedStation && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          <h2>{selectedStation.name}</h2>
          <p>Price: N{selectedStation.price}/litre</p>
        </div>
      )}
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(MapContainer);