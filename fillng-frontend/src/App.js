import React from 'react';
import FuelTracker from './FuelTracker';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">FILLNG</h1>
          <p className="text-white text-lg">Find the best fuel prices near you</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <FuelTracker />
      </main>
    </div>
  );
}

export default App;