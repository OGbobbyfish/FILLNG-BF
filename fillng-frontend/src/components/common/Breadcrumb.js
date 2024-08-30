import React from 'react';

const Breadcrumb = ({ items }) => (
  <nav className="text-sm breadcrumbs">
    <ul className="flex space-x-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {index > 0 && <span className="mx-2 text-gray-500">/</span>}
          {item.link ? (
            <a href={item.link} className="text-blue-600 hover:underline">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  </nav>
);

export default Breadcrumb;



