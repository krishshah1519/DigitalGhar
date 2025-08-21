// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register'; // You would create this similar to Login
import DashboardPage from './pages/DashboardPage';
import './App.css';

// A simple component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* For simplicity, Login and Register can be on the same page */}
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// A simple page to host both Login and Register forms
const AuthPage = () => (
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
    <Login />
    {/* <Register /> */}
  </div>
);


export default App;