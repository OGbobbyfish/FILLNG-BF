import React, { useState } from 'react';
import MapContainer from './MapContainer';
import LoadingSpinner from './components/LoadingSpinner.js';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleMapLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="App">
      {isLoading && <LoadingSpinner />}
      <MapContainer onLoad={handleMapLoad} />
    </div>
  );
}

export default App;