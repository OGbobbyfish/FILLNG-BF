import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 6.5244,
  lng: 3.3792
};

function MapContainer({ stations, onStationClick }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
  });

  const [map, setMap] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={{
              lat: station.geometry.location.lat,
              lng: station.geometry.location.lng
            }}
            onClick={() => {
              setSelectedStation(station);
              onStationClick(station);
            }}
          />
        ))}
        {selectedStation && (
          <InfoWindow
            position={{
              lat: selectedStation.geometry.location.lat,
              lng: selectedStation.geometry.location.lng
            }}
            onCloseClick={() => setSelectedStation(null)}
          >
            <div>
              <h3 className="font-bold">{selectedStation.name}</h3>
              <p>{selectedStation.vicinity}</p>
              <p className="font-semibold text-green-600">₦{selectedStation.price_per_litre.toFixed(2)}/L</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default MapContainer;