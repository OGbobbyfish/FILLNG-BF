import React from 'react';

const Pagination = ({ stationsPerPage, totalStations, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalStations / stationsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    console.log('Pagination component:', { stationsPerPage, totalStations, currentPage, pageNumbers });
  
    if (pageNumbers.length <= 1) {
      return null; // Don't render pagination if there's only one page
    }
  
    return (
      <nav className="flex justify-center mt-6">
        <ul className="flex space-x-2">
          {pageNumbers.map(number => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  
  export default Pagination;