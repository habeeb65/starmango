import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('Main.jsx is loading...') // Debug logging

// Add fallback content to the page even before React renders
document.getElementById('root').innerHTML = '<div style="padding: 20px; text-align: center;"><p>Loading application...</p></div>';

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('React rendering completed');
} catch (error) {
  console.error('Error rendering React application:', error);
  
  // Show error on screen
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: red; text-align: center;">
      <h2>Error Loading Application</h2>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `;
} 