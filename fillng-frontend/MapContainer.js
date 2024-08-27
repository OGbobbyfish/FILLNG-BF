import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 6.4478,
  lng: 3.4723,
};

const MapContainer = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/stations');
        setStations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gas stations:', error);
        setError('Failed to fetch gas stations. Please try again later.');
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const onMarkerClick = (station) => {
    setSelectedStation(station);
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="h-screen w-full flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        {stations.map((station, index) => (
          <Marker
            position={{ lat: 6.4478, lng: 3.4723 }}  // Hardcoded location
            icon={{ url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }}

          />
        ))}
      </GoogleMap>

      {selectedStation && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{selectedStation.name}</h2>
          <p className="text-lg">Price: N{selectedStation.price_per_litre}/litre</p>
          <p>{selectedStation.vicinity}</p>
        </div>
      )}
    </LoadScript>
  );
};

export default MapContainer;
