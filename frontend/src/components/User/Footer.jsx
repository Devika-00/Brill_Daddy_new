import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaPinterest } from 'react-icons/fa';
import { SiGoogleplay, SiAppstore } from 'react-icons/si';
import { useAppSelector } from "../../Redux/Store/store";

const Footer = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  const handleNavigation = (path) => {
    if (!isAuthenticated && (path === '/events' || path === '/orders')) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-blue-900 text-white py-8 mt-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        
        {/* Left Side: Links */}
        <div className="mb-6 md:mb-0">
          <div className="flex flex-col space-y-3 text-left ml-24">
            <Link to="/about" className="hover:underline">About BrillDaddy</Link>
            <span 
              onClick={() => handleNavigation('/event')}
              className="hover:underline cursor-pointer"
            >
              Events
            </span>
            <span 
              onClick={() => handleNavigation('/orderList')}
              className="hover:underline cursor-pointer"
            >
              Orders
            </span>
            <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/faqs" className="hover:underline">FAQs</Link>
          </div>
        </div>

        {/* Middle Section: Social Media and App Download */}
        <div className="mb-6 md:mb-0">
          <div className="flex flex-col items-center">
            <h4 className="mb-4">Follow us on</h4>
            <div className="flex space-x-4 mb-4">
              <FaFacebook size={24} className="hover:text-blue-800 cursor-pointer" />
              <FaPinterest size={24} className="hover:text-red-600 cursor-pointer" />
              <FaInstagram size={24} className="hover:text-pink-500 cursor-pointer" />
            </div>
            <div className="border-t border-gray-300 w-full mb-4" />
            <h4 className="mb-2">Download</h4>
            <div className="flex space-x-4">
              <SiGoogleplay size={32} className="hover:text-green-500 cursor-pointer" />
              <SiAppstore size={32} className="hover:text-black cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Right Side: Payment Logos */}
        <div className='mr-20'>
          <h4 className="mb-4">Payment</h4>
          <div className="flex flex-wrap space-x-4">
            {/* Add other payment logos here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
