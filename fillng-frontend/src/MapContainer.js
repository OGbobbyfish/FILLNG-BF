import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';
import MapControls from './components/MapControls';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const MapContainer = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [center, setCenter] = useState({ lat: 6.447, lng: 3.4738889 });
  const [searchBox, setSearchBox] = useState(null);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stations');
        setStations(response.data);
        setFilteredStations(response.data);
      } catch (error) {
        console.error('Error fetching gas stations:', error);
      }
    };

    fetchStations();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error('Error: The Geolocation service failed.');
        }
      );
    } else {
      console.error('Error: Your browser doesn\'t support geolocation.');
    }
  };

  const handleMarkerClick = (station) => {
    setSelectedStation(station);
  };

  const handlePlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry) {
        setCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  const handleSort = (sortBy) => {
    let sorted = [...filteredStations];
    switch (sortBy) {
      case 'price':
        sorted.sort((a, b) => a.price_per_litre - b.price_per_litre);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price_per_litre - a.price_per_litre);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    setFilteredStations(sorted);
  };

  const handleSearch = (searchTerm) => {
    const filtered = stations.filter(station => 
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.vicinity.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStations(filtered);
  };

  const getDirections = (destination) => {
    if (userLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={['places']}
    >
      <div className="relative">
        <MapControls onSearch={handleSearch} />
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
          )}
          {filteredStations.map((station, index) => (
            <Marker
              key={index}
              position={{
                lat: station.geometry.location.lat,
                lng: station.geometry.location.lng
              }}
              onClick={() => handleMarkerClick(station)}
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
                <h2 className="text-lg font-bold mb-2">{selectedStation.name}</h2>
                <p className="mb-1">Price: ₦{selectedStation.price_per_litre.toFixed(2)}/litre</p>
                {selectedStation.rating && <p className="mb-1">Rating: {selectedStation.rating}</p>}
                {selectedStation.vicinity && <p className="mb-2">Address: {selectedStation.vicinity}</p>}
                <button
                  onClick={() => getDirections({
                    lat: selectedStation.geometry.location.lat,
                    lng: selectedStation.geometry.location.lng
                  })}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Get Directions
                </button>
              </div>
            </InfoWindow>
          )}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapContainer;