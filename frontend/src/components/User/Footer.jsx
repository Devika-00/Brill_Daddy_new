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
    <footer className="bg-blue-900 text-white py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Side: Quick Links */}
          <div className="space-y-3 text-center md:text-left md:ml-20">
            <h4 className="text-base font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/about" className="text-sm hover:underline transition-colors duration-300">About BrillDaddy</Link>
              <span 
                onClick={() => handleNavigation('/event')}
                className="text-sm hover:underline cursor-pointer transition-colors duration-300"
              >
                Events
              </span>
              <span 
                onClick={() => handleNavigation('/orderList')}
                className="text-sm hover:underline cursor-pointer transition-colors duration-300"
              >
                Orders
              </span>
              <Link to="/terms" className="text-sm hover:underline transition-colors duration-300">Terms & Conditions</Link>
              <Link to="/privacyPolicy" className="text-sm hover:underline transition-colors duration-300">Privacy Policy</Link>
              <Link to="/refundPolicy" className="text-sm hover:underline transition-colors duration-300">Refund Policy</Link>
            </div>
          </div>

          {/* Middle Section: Social Media and App Download */}
          <div className="flex flex-col items-center">
            <div className="text-center">
              <h4 className="text-base font-semibold mb-3">Connect With Us</h4>
              <div className="flex justify-center space-x-4 mb-4">
                <FaFacebook 
                  size={20} 
                  className="hover:text-blue-500 cursor-pointer transition-colors duration-300" 
                  onClick={() => window.open('https://facebook.com', '_blank')}
                />
                <FaPinterest 
                  size={20} 
                  className="hover:text-red-500 cursor-pointer transition-colors duration-300" 
                  onClick={() => window.open('https://pinterest.com', '_blank')}
                />
                <FaInstagram 
                  size={20} 
                  className="hover:text-pink-500 cursor-pointer transition-colors duration-300" 
                  onClick={() => window.open('https://instagram.com', '_blank')}
                />
              </div>

              <h4 className="text-base font-semibold mb-3">Download App</h4>
              <div className="flex justify-center space-x-4">
                <SiGoogleplay 
                  size={24} 
                  className="hover:text-green-500 cursor-pointer transition-colors duration-300"
                  onClick={() => window.open('https://play.google.com', '_blank')}
                />
                <SiAppstore 
                  size={24} 
                  className="hover:text-gray-300 cursor-pointer transition-colors duration-300"
                  onClick={() => window.open('https://apps.apple.com', '_blank')}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Payment Methods */}
          <div className="flex flex-col items-center md:items-center md:mr-2">
            <h4 className="text-base font-semibold mb-3">Secure Payments</h4>
            <div className="flex flex-wrap justify-center space-x-3">
              <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-xs text-gray-700">Visa</span>
              </div>
              <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-xs text-gray-700">MC</span>
              </div>
              <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-xs text-gray-700">PP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="mt-2 pt-2 border-t border-blue-700 text-center">
          <p className="text-xs">&copy; 2024 BrillDaddy. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;