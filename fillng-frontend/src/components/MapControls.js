import React, { useState } from 'react';

const MapControls = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && typeof onSearch === 'function') {
      onSearch(searchTerm);
    } else {
      console.error('onSearch is not a function');
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for gas stations"
          className="px-2 py-1 border rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors">
          Search
        </button>
      </form>
    </div>
  );
};

export default MapControls;
