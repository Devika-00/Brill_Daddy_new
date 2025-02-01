import React, { useState } from 'react';
import { FaHome, FaUsers, FaBoxOpen, FaClipboardList, FaGift, FaTags, FaStar, FaAward, FaMoneyBill, FaImage } from 'react-icons/fa'; 
import logo from "../../assets/logo.png"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`flex ${isOpen ? 'w-56' : 'w-20'} bg-gray-200 h-screen transition-width duration-300`}>
      <div className="flex flex-col justify-start w-full h-screen text-gray-500">
        {/* Top Section */}
        <div className="flex flex-col space-y-4 mt-6">
          {/* Logo Section */}
          <div className="flex items-center justify-between px-7">
            <h1 className={`text-2xl font-bold ${isOpen ? '' : 'hidden'}`}></h1>
            <img src={logo} alt="Logo" className="h-14" />
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="focus:outline-none text-gray-500">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d={isOpen ? 'M4 6h16M4 12h16M4 18h16' : 'M6 18L18 6M6 6l12 12'} />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-4 ml-5">
            <a href="/admin" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaHome className="text-xl" /> {/* Home icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Home</span>
            </a>
            <a href="/users" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaUsers className="text-xl" /> {/* Users icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Users</span>
            </a>
            <a href="/products" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaBoxOpen className="text-xl" /> {/* Products icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Products</span>
            </a>
            <a href="/orders" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaClipboardList className="text-xl" /> {/* Orders icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Orders</span>
            </a>
            <a href="/vouchers" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaGift className="text-xl" /> {/* Voucher icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Vouchers</span>
            </a>
            <a href="/category" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaTags className="text-xl" /> {/* Voucher icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Category</span>
            </a>
            <a href="/brand" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaStar className="text-xl" /> {/* Voucher icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Brands</span>
            </a>
            <a href="/bidAmounts" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaAward className="text-xl" /> {/* Voucher icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Bid Amount</span>
            </a>
            <a href="/refundUsers" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaMoneyBill className="text-xl" /> {/* Voucher icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Refund Users</span>
            </a>
            <a href="/imageCarousel" className="flex items-center space-x-4 p-2 hover:bg-gray-300 rounded-lg">
              <FaImage className="text-xl" /> {/* Voucher icon */}
              <span className={`${isOpen ? '' : 'hidden'}`}>Image Carousel</span>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
