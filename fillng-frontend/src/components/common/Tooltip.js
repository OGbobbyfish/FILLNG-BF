import React, { useState } from 'react';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 p-2 -mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;