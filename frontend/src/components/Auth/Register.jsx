import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const Register = ({ onRegisterSuccess, setAuthError }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (formData.password !== formData.password2) {
      setAuthError("Passwords do not match.");
      return;
    }

    try {
      await api.post('/register/', formData);
      onRegisterSuccess('Registration successful! Please log in.');
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const errorMessages = Object.values(errorData).flat().join(' ');
        setAuthError(errorMessages || 'Registration failed. Please try again.');
      } else {
        setAuthError('An unknown error occurred.');
      }
    }
  };

  const inputClass = "w-full p-4 pl-12 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input className={inputClass} type="text" name="first_name" placeholder="First Name" onChange={handleChange} />
        </div>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input className={inputClass} type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />
        </div>
      </div>
      <div className="relative">
        <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input className={inputClass} type="text" name="username" placeholder="Username" onChange={handleChange} required />
      </div>
      <div className="relative">
        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input className={inputClass} type="email" name="email" placeholder="Email" onChange={handleChange} required />
      </div>
      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input className={inputClass} type="password" name="password" placeholder="Password" onChange={handleChange} required />
      </div>
      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input className={inputClass} type="password" name="password2" placeholder="Confirm Password" onChange={handleChange} required />
      </div>

      <button className="w-full p-4 mt-2 border-none rounded-lg bg-green-600 text-white font-bold cursor-pointer transition-colors hover:bg-green-700" type="submit">
        Create Account
      </button>
    </form>
  );
};

export default Register;