import React, { useState } from 'react';
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from 'react-icons/fa';

const Login = ({ setAuthError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(""); 
    try {
      const response = await api.post("/token/", {
        username,
        password
      });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      setAuthError('Invalid username or password.');
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-4 pl-12 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>
      <div className="relative w-full">
        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-4 pl-12 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>
      <button type="submit" className="w-full p-4 border-none rounded-lg bg-blue-600 text-white font-bold cursor-pointer transition-colors hover:bg-blue-700">
        Login
      </button>
    </form>
  );
};

export default Login;