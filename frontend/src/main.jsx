import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 👇 Add the Toaster component here */}
    <Toaster
      position="top-right"
      toastOptions={{
        className: '',
        style: {
          margin: '40px',
          background: '#333',
          color: '#fff',
          zIndex: 1,
        },
        duration: 5000,
      }}
    />
    <App />
  </StrictMode>,
);