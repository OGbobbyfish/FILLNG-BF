import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapContainer from './MapContainer';
import { SearchIcon, LocationMarkerIcon, ViewListIcon, ViewGridIcon } from '@heroicons/react/solid';
import { Switch } from '@headlessui/react';

const ITEMS_PER_PAGE = 10;

export default function FuelTracker() {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching stations...');
        const response = await axios.get('http://localhost:5000/api/stations');
        console.log('Stations fetched:', response.data);
        setStations(response.data);
        setFilteredStations(response.data);
      } catch (error) {
        console.error('Error fetching stations:', error);
        setError('Failed to fetch stations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    const filtered = stations.filter(station =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStations(filtered);
    setCurrentPage(1);
  }, [searchTerm, stations]);

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  const handleUpdateStation = async (id, price, isOpen) => {
    setIsUpdating(true);
    try {
      await axios.post('http://localhost:5000/api/update_station', { id, price, is_open: isOpen });
      const updatedStations = stations.map(station => 
        station.id === id ? { ...station, price_per_litre: price, is_open: isOpen } : station
      );
      setStations(updatedStations);
      setFilteredStations(updatedStations);
      setSelectedStation(null);
    } catch (error) {
      console.error('Error updating station:', error);
      setError('Failed to update station. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleView = () => {
    setShowMap(!showMap);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);

  console.log('Rendering FuelTracker. showMap:', showMap, 'filteredStations:', filteredStations.length);

  if (isLoading) {
    console.log('Rendering loading state');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.log('Rendering error state:', error);
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Search stations..."
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-3.5 h-6 w-6 text-gray-400" />
        </div>
        <Switch
          checked={showMap}
          onChange={toggleView}
          className={`${
            showMap ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex items-center h-10 rounded-full w-20`}
        >
          <span className="sr-only">Toggle map view</span>
          <span
            className={`${
              showMap ? 'translate-x-11' : 'translate-x-1'
            } inline-block w-8 h-8 transform bg-white rounded-full transition-transform`}
          />
          {showMap ? (
            <ViewGridIcon className="h-6 w-6 text-white absolute left-2" />
          ) : (
            <ViewListIcon className="h-6 w-6 text-gray-500 absolute right-2" />
          )}
        </Switch>
      </div>
      
      {showMap ? (
        <MapContainer 
          stations={filteredStations} 
          onStationClick={handleStationClick}
        />
      ) : (
        <>
          <ul className="bg-white shadow-lg rounded-lg overflow-hidden">
            {paginatedStations.map((station) => (
              <li key={station.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-blue-600 truncate">{station.name}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-3 py-1 text-sm font-bold rounded-full bg-green-100 text-green-800">
                        ₦{station.price_per_litre.toFixed(2)}/L
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <LocationMarkerIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {station.vicinity}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
      {selectedStation && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{selectedStation.name}</h3>
              <p className="text-gray-600">{selectedStation.vicinity}</p>
            </div>
            <div className="flex items-center space-x-4">
              <input 
                type="number" 
                value={selectedStation.price_per_litre} 
                onChange={(e) => setSelectedStation({...selectedStation, price_per_litre: parseFloat(e.target.value)})}
                className="w-24 px-2 py-1 border rounded"
              />
              <Switch
                checked={selectedStation.is_open}
                onChange={(checked) => setSelectedStation({...selectedStation, is_open: checked})}
                className={`${selectedStation.is_open ? 'bg-green-600' : 'bg-red-600'} relative inline-flex items-center h-6 rounded-full w-11`}
              >
                <span className="sr-only">Station is open</span>
                <span className={`${selectedStation.is_open ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
              </Switch>
              <button
                onClick={() => handleUpdateStation(selectedStation.id, selectedStation.price_per_litre, selectedStation.is_open)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
            <button
              onClick={() => setSelectedStation(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
