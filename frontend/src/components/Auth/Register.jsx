import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.post('/register/', formData);
      setSuccess('Registration successful! Please log in.');
      
      setTimeout(() => {
        // You can add logic here to switch to the login tab/view
      }, 2000);
    } catch (err) {
      // Handle different types of errors from the backend
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const errorMessages = Object.values(errorData).flat().join(' ');
        setError(errorMessages || 'Registration failed. Please try again.');
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="password" name="password2" placeholder="Confirm Password" onChange={handleChange} required />
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default Register;