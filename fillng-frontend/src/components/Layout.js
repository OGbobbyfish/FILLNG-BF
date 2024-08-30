import React from 'react';
import './globals.css';

export default function Layout({ children }) {
  return (
    <div 
      className="antialiased" 
      style={{ fontFamily: 'var(--font-heading), var(--font-body)' }}
    >
      {children}
    </div>
  );
}
