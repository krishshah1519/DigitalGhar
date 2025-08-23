import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardPage from './pages/DashboardPage';
import FolderDetailPage from './pages/FolderDetailPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
        <main>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                    <Sidebar>
                  <DashboardPage />
                  </Sidebar>
                </PrivateRoute>
              }
            />

            <Route
              path="/folder/:folderId"
              element={
                <PrivateRoute>
                    <Sidebar>
                  <FolderDetailPage />
                  </Sidebar>
                </PrivateRoute>
              }
            />
            <Route path="/profile" element={
                <PrivateRoute>
                    <Sidebar>
                        <ProfilePage />
                    </Sidebar>
                </PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const onRegisterSuccess = (message) => {
    setAuthSuccess(message);
    setAuthError('');

    setTimeout(() => {
      setIsLoginView(true);
      setAuthSuccess('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div className="bg-gray-800 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-md text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">
            {isLoginView ? "Welcome Back!" : "Join Digital Ghar"}
          </h2>
          <p className="text-base text-gray-400">
            {isLoginView ? "Please log in to continue" : "Create an account to get started"}
          </p>
        </div>

        {isLoginView ? (
          <Login setAuthError={setAuthError} />
        ) : (
          <Register onRegisterSuccess={onRegisterSuccess} setAuthError={setAuthError} />
        )}

        {authError && <p className="text-red-400 text-sm text-center mt-4">{authError}</p>}
        {authSuccess && <p className="text-green-400 text-sm text-center mt-4">{authSuccess}</p>}

        <button
          className="bg-transparent text-blue-400 mt-6 text-sm cursor-pointer hover:underline"
          onClick={() => {
            setIsLoginView(!isLoginView);
            setAuthError('');
            setAuthSuccess('');
          }}
        >
          {isLoginView
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default App;