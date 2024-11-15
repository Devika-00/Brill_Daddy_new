import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../../components/User/Topbar';
import UserNavbar from '../../components/User/UserNavbar';
import Footer from '../../components/User/Footer';
import logo from "../../assets/logo.png";
import { SERVER_URL } from '../../Constants';
import { setUser } from '../../Redux/Slice/userSlice';
import { useAppDispatch } from '../../Redux/Store/store';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Stores email or phone
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleOtpRequest = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/user/sendOtp`, { identifier });
      if (response.data.message === 'OTP sent successfully') {
        alert('OTP sent!');
        setIsOtpSent(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please check your input.');
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/user/verify-otp`, { identifier, otp });
      console.log(response);
      if (response.data.message === 'OTP verified, login successful') {
        alert('Login successful');
        const {token, username, id} = response.data;

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
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <UserNavbar />
      <div className="flex flex-col md:flex-row flex-1 justify-center items-center px-4">
        <div className="flex flex-col justify-center items-center md:items-start md:w-1/2 w-full md:px-10 md:ml-20 mt-4 md:mt-10">
          <h2 className="text-3xl text-blue-900 font-bold mb-6">Login</h2>
          <form className="w-full max-w-md" onSubmit={handleOtpVerification}>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifier">
                Phone or Email
              </label>
              <input
                type="text"
                id="identifier"
                placeholder="Enter your phone number or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {!isOtpSent ? (
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleOtpRequest}
              >
                Get OTP
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Login
                </button>
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
