import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Import the global CSS file which includes Tailwind directives and custom styles.
// This is critical for initializing Tailwind's output.
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
