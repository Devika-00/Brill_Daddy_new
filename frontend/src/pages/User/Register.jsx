import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/User/Topbar';
import UserNavbar from '../../components/User/UserNavbar';
import Footer from '../../components/User/Footer';
import logo from "../../assets/logo.png";
import { SERVER_URL } from '../../Constants';

const Register = () => {
  const navigate = useNavigate();
  
  // State to capture form inputs
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
  });

  // Update form data as user types
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Make API call to the backend with form data
      const response = await axios.post(`${SERVER_URL}/user/register`, formData); 
      console.log('Registration successful:', response.data);

      // Redirect to another page (e.g., login) upon successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <UserNavbar />
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Side: Logo and Description */}
        <div className="hidden md:flex flex-col justify-center items-center bg-white text-blue-950 md:w-1/2 p-10">
          <img src={logo} alt="Logo" className="h-28 w-auto inline-block" />
          <p className="text-lg text-center">
            Welcome! Create an account to start exploring our services. We are excited to have you on board!
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block h-3/4 mt-14 mr-3 w-px bg-gray-300" />

        {/* Right Side: Register Form */}
        <div className="flex flex-col justify-center items-start md:items-center md:w-1/2 p-10">
          <h2 className="text-3xl text-blue-600 font-bold mb-6">Create an Account</h2>
          <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-6 w-full">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Sign Up
              </button>
            </div>

            <p className="text-center">
              Already have an account? 
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-bold"
                onClick={() => navigate('/login')} // Redirect to login page
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
