import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin credentials from localStorage
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminPassword');

    // Check if credentials are removed successfully
    const email = localStorage.getItem('adminEmail');
    const password = localStorage.getItem('adminPassword');
    console.log('Admin credentials removed:', { email, password });

    // Close dropdown and navigate to admin login
    setIsDropdownOpen(false);
    navigate("/adminlogin");
  };

  return (
    <nav className="bg-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex">
            <a href="/" className="text-xl font-bold text-white"></a>
          </div>

          <div className="relative">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img 
                src="https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png" 
                alt="Profile" 
                className="w-12 h-12 rounded-full" 
              />
              <svg 
                className="w-5 h-5 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;