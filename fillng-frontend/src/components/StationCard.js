import React from 'react';
import { motion } from 'framer-motion';
import Tooltip from './common/Tooltip';

const StationCard = ({ station, onSelect, onGetDirections }) => (
  <motion.div 
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
    onClick={() => onSelect(station)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onSelect(station);
      }
    }}
    tabIndex={0}
    role="button"
    aria-label={`Select ${station.name}`}
  >
    <h3 className="font-semibold text-xl mb-2 text-blue-600">{station.name}</h3>
    <p className="text-gray-600 mb-4">{station.vicinity}</p>
    <div className="flex justify-between items-center">
      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
        ₦{station.price_per_litre.toFixed(2)}/litre
      </span>
      <Tooltip content="Open in Google Maps">
        <button
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onGetDirections(station);
          }}
          aria-label={`Get directions to ${station.name}`}
        >
          Get Directions
        </button>
      </Tooltip>
    </div>
  </motion.div>
);

export default StationCard;