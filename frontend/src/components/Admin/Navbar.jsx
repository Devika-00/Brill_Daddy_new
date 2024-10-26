import React, { useState } from 'react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo - moved to the left */}
          <div className="flex ">
            <a href="/" className="text-xl font-bold text-white"></a>
          </div>

          {/* Profile Section */}
          <div className="relative">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {/* Profile Picture */}
              <img 
                src="https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png" 
                alt="Profile" 
                className="w-12 h-12 rounded-full" 
              />
              {/* Arrow */}
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</a>
                <a href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Settings</a>
                <a href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
