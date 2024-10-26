import React, { useState } from 'react';

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-900 p-4"> {/* Dark blue background */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Mobile Menu Icon */}
        <div className="md:hidden"> {/* Visible only on small screens */}
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-10 text-white text-base font-bold text-sm ml-auto mr-96"> {/* Adjusted to move links to the right */}
          <a href="/" className="hover:text-gray-300 transition duration-300 ease-in-out">Home</a>
          <a href="/shop" className="hover:text-gray-300 transition duration-300 ease-in-out">Shop</a>
          <a href="/about-us" className="hover:text-gray-300 transition duration-300 ease-in-out">About Us</a>
          <a href="/contact" className="hover:text-gray-300 transition duration-300 ease-in-out">Contact</a>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-950 p-4"> {/* Darker shade for mobile menu */}
          <a href="/" className="block text-white py-2 text-base font-bold hover:text-gray-300 transition duration-300 ease-in-out">Home</a>
          <a href="/shop" className="block text-white py-2 text-base font-bold hover:text-gray-300 transition duration-300 ease-in-out">Shop</a>
          <a href="/about-us" className="block text-white py-2 text-base font-bold hover:text-gray-300 transition duration-300 ease-in-out">About Us</a>
          <a href="/contact" className="block text-white py-2 text-base font-bold hover:text-gray-300 transition duration-300 ease-in-out">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
