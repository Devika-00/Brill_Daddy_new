import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from "../../Constants/index";
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi'; // Importing icons

// Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and Password are required.');
      return;
    }

    console.log('Attempting to log in with:', { email, password });

    try {
      const response = await axios.post(`${SERVER_URL}/admin/login`, { email, password });
      console.log('Login successful:', response.data.message);

      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminPassword', password);
      console.log('Stored credentials:', {
        adminEmail: localStorage.getItem('adminEmail'),
        adminPassword: localStorage.getItem('adminPassword')
      });

      navigate("/admin");
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 sm:p-8 md:p-12">
      <div className="bg-white shadow-2xl rounded-lg p-6 sm:p-10 md:p-12 w-full max-w-xs sm:max-w-md md:max-w-lg transform transition duration-500 hover:scale-105">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800 animate-pulse">Admin Login</h2>
        {error && <p className="text-red-600 text-center mb-4 font-semibold bg-red-100 p-2 rounded">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-5 relative">
            <label htmlFor="email" className="block text-sm sm:text-base font-medium mb-2 text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 shadow-sm">
              <FiMail className="text-gray-500 mr-3" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full focus:outline-none focus:border-purple-500 transition duration-200"
                required
              />
            </div>
          </div>
          <div className="mb-8 relative">
            <label htmlFor="password" className="block text-sm sm:text-base font-medium mb-2 text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md p-3 shadow-sm">
              <FiLock className="text-gray-500 mr-3" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:outline-none focus:border-purple-500 transition duration-200"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md px-4 py-3 w-full hover:shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105 font-semibold text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;