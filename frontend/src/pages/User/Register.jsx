import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import TopBar from '../../components/User/Topbar';
import UserNavbar from '../../components/User/UserNavbar';
import Footer from '../../components/User/Footer';
import logo from "../../assets/logo.png";
import { SERVER_URL } from '../../Constants';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateInput = (id, value) => {
    let error = '';
    if (!value) {
      if (id === 'username') error = 'Username is required.';
      if (id === 'email') error = 'Email is required.';
      if (id === 'phone') error = 'Phone number is required.';
    } else {
      switch (id) {
        case 'username':
          if (!/^[A-Za-z\s]+$/.test(value)) {
            error = 'Username can only contain letters and spaces.';
          } else if (value.length > 20) {
            error = 'Username cannot exceed 20 characters (including spaces).';
          }
          break;
        case 'email':
          if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(value)) {
            error = 'Please enter a valid email address.';
          } else if (value.toLowerCase().includes('@gmail') === false) {
            error = 'Only Gmail addresses are allowed.';
          }
          break;
        case 'phone':
          if (!/^(\+\d{1,3}\s)?\d{10}$/.test(value)) {
            error = 'Phone number must be a 10-digit number (with optional country code).';
          }
          break;
        default:
          break;
      }
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: error,
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    validateInput(id, value);
  };

  const fetchLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
      return;
    }

    if (!Object.values(validationErrors).every((err) => err === '')) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const location = await fetchLocation();
      const userData = { ...formData, location };

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000));
      const responsePromise = axios.post(`${SERVER_URL}/user/register`, userData);
      const response = await Promise.race([timeoutPromise, responsePromise]);

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        setSuccessMessage(''); // Hide message after 2 seconds
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.message === 'timeout') {
        setErrorMessage('Please connect to the internet and try again.');
      } else if (error.response?.status === 409) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Email already in use. Please choose a different email.',
        }));
      } else {
        setErrorMessage('Registration failed. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <UserNavbar />
      <div className="flex flex-col md:flex-row flex-1">
        <div className="hidden md:flex flex-col justify-center items-center bg-white text-blue-950 md:w-1/2 p-10">
          <img src={logo} alt="Logo" className="h-28 w-auto inline-block" />
          <p className="text-lg text-center">
            Welcome! Create an account to start exploring our services. We are excited to have you on board!
          </p>
        </div>
        <div className="hidden md:block h-3/4 mt-14 mr-3 w-px bg-gray-300" />
        <div className="flex flex-col justify-center items-start md:items-center md:w-1/2 p-10">
          <h2 className="text-3xl text-blue-600 font-bold mb-6">Create an Account</h2>
          <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <div className="flex items-center shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight">
                <FaUser className="mr-2 text-gray-500" />
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                />
              </div>
              {validationErrors.username && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
              )}
            </div>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <div className="flex items-center shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight">
                <FaEnvelope className="mr-2 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <div className="flex items-center shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight">
                <FaPhoneAlt className="mr-2 text-gray-500" />
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full focus:outline-none"
                />
              </div>
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              )}
            </div>
            <div className="mb-6 w-full">
            <button
                type="submit"
                className={`${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
            {successMessage && (
              <div className="bg-green-500 text-white p-4 rounded-md shadow-lg mb-4 text-center">
                {successMessage}
              </div>
            )}
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            <p className="text-center">
              Already have an account?
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-bold"
                onClick={() => navigate('/login')}
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
