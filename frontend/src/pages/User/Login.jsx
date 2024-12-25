import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../../components/User/Topbar';
import UserNavbar from '../../components/User/UserNavbar';
import Footer from '../../components/User/Footer';
import logo from "../../assets/logo.png";
import { SERVER_URL } from '../../Constants';
import { setUser } from '../../Redux/Slice/userSlice';
import { useAppDispatch } from '../../Redux/Store/store';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [timer, setTimer] = useState(120);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleOtpRequest = async () => {
    if (!identifier) {
      setErrorMessage("Please enter phone or email.");
      return;
    }

    setLoadingOtp(true);

    try {
      const response = await axios.post(`${SERVER_URL}/user/sendOtp`, { identifier });
      if (response.data.message === 'OTP sent successfully') {
        alert('OTP sent!');
        setIsOtpSent(true);
        setOtpSentTime(new Date());
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please check your input.');
    } finally {
      setLoadingOtp(false); // Hide loading indicator once OTP is sent or error occurs
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    if (!identifier || !otp) {
      setErrorMessage('Both fields are required.');
      return;
    }

    setLoadingLogin(true); // Start loading for login
    setLoginDisabled(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await axios.post(`${SERVER_URL}/user/verify-otp`, { identifier, otp });
      console.log(response);
      if (response.data.message === 'OTP verified, login successful') {
        setShowSuccessDialog(true);
        setTimeout(() => setShowSuccessDialog(false), 2000);
        const { token, username, id } = response.data;

        localStorage.setItem("access_token", token);
        dispatch(
          setUser({
            id,
            username,
            isAuthenticated: true,
            token,
          })
        );
        navigate('/');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.response && error.response.status === 500) {
        setIsNetworkError(true);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Simulate 10-second delay for network error
        setIsNetworkError(false);
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } finally {
      setLoadingLogin(false); // Stop loading indicator for login
      setLoginDisabled(false);
    }
  };

  useEffect(() => {
    if (isOtpSent && otpSentTime) {
      const timerInterval = setInterval(() => {
        const elapsed = new Date() - otpSentTime;
        const remainingTime = Math.max(120 - Math.floor(elapsed / 1000), 0);
        setTimer(remainingTime);

        if (remainingTime === 0) {
          setResendEnabled(true);
        }
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [isOtpSent, otpSentTime]);

  const handleResendOtp = () => {
    setResendEnabled(false);
    setTimer(120); // Reset the timer immediately
    setOtpSentTime(new Date()); // Update the OTP sent time to restart the timer
    handleOtpRequest(); // Send the OTP
  };
  

  const renderInputIcon = () => {
    if (!identifier) return null;

    // Check if the input is an email or phone number based on the first character
    const isPhone = /^[\d+]/.test(identifier);
    if (isPhone) {
      return (
        <FaPhoneAlt
          className="absolute left-4 top-1/2 transform -translate-y-1/5 text-gray-500 w-6 h-6" // Increase the width and height here
        />
      );
    } else {
      return (
        <FaEnvelope
          className="absolute left-4 top-1/2 transform -translate-y-1/5 text-gray-500 w-6 h-6" // Increase the width and height here
        />
      );
    }
  };

  const validateIdentifier = (value) => {
    let error = '';
    if (!value) {
      error = 'Please enter phone or email.';
    } else if (/^\d/.test(value)) {
      if (!/^\d{10}$/.test(value) && !/^\+?\d{1,3}(\s?)\d{10}$/.test(value)) {
        error = 'Phone number must be a 10-digit number (with optional country code with space).';
      }
    } else if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(value)) {
      // Email validation
      if (!value.toLowerCase().includes('@gmail')) {
        error = 'Only Gmail addresses are allowed.';
      }
    } else {
      error = 'Please enter a valid phone number or email.';
    }
    return error;
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <UserNavbar />
      <div className="flex flex-col md:flex-row flex-1 justify-center items-center px-4">
        <div className="flex flex-col justify-center items-center md:items-start md:w-1/2 w-full md:px-10 md:ml-20 mt-4 md:mt-10">
          <h2 className="text-3xl text-blue-900 font-bold mb-6">Login</h2>
          <form className="w-full max-w-md" onSubmit={handleOtpVerification}>
            <div className="mb-4 w-full relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifier">
                Phone or Email
              </label>
              {renderInputIcon()}
              <input
                type="text"
                id="identifier"
                placeholder="Enter your phone number or email"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  const error = validateIdentifier(e.target.value);
                  setErrorMessage(error);
                }}
                className="shadow appearance-none border rounded w-full py-3 pl-12 pr-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

            {!isOtpSent ? (
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleOtpRequest}
                disabled={loginDisabled}
              >
                {loadingOtp ? (
                  <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full"></div>
                ) : (
                  "Get OTP"
                )}
              </button>
            ) : (
              <>
                <div className="mb-4 w-full">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter the OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                  disabled={loginDisabled}
                >
                  {loadingLogin ? (
                    <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full"></div>
                  ) : (
                    "Login"
                  )}
                </button>
                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${!resendEnabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={handleResendOtp}
                    disabled={!resendEnabled}
                  >
                    {resendEnabled ? "Resend OTP" : `Resend OTP (${timer}s)`}
                  </button>
                </div>
              </>
            )}

            <p className="text-center mt-4">
              Create new account?{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-bold ml-1"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </button>
            </p>
          </form>
          {isNetworkError && (
            <div className="text-red-500 mt-2">Network error. Retrying...</div>
          )}
          {showSuccessDialog && (
            <div className="bg-green-500 text-white py-2 px-4 mt-4 rounded">
              Login successful!
            </div>
          )}
        </div>
        <div className="hidden md:block h-3/4 mt-14 mr-3 w-px bg-gray-300" />
        <div className="hidden md:flex flex-col justify-center items-center bg-white text-blue-950 md:w-1/2 p-10">
          <img src={logo} alt="Logo" className="h-28 w-auto inline-block" />
          <p className="text-lg text-center">
            Welcome back! Please log in to continue exploring our services. We are glad to have you back!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
