import React, { useState } from 'react';
import { FaSearch, FaWallet, FaShoppingCart, FaUser, FaTimes } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';

const OrginalNavbar = () => {
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("123 Main St, City");
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/shop?search=${searchTerm}`);
    };

    const handleLanguageDropdown = () => {
        setShowLanguageDropdown(!showLanguageDropdown);
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleAddressModalToggle = () => {
        setShowAddressModal(!showAddressModal);
    };

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        setShowAddressModal(false);
    };

    const handleOptionSelect = (option) => {
        setShowModal(false);
        switch (option) {
            case 'Your Account':
                navigate('/profile');
                break;
            case 'Your Orders':
                navigate('/orderList');
                break;
            case 'Your Wishlist':
                navigate('/wishlist');
                break;
            case 'Keep Shopping':
                navigate('/shop');
                break;
            case 'Shopping List':
                navigate('/orderList');
                break;
            case 'Home':
                navigate('/');
                break;    
            case 'Sign Out':
                navigate('/logout');
                break;
            default:
                break;
        }
    };

    return (
        <>
            <nav className="flex flex-col md:flex-row justify-between items-center bg-white p-4 shadow h-24">
                <div className="flex items-center justify-between w-full md:w-auto">
                <Link to="/"> {/* Update the path to your logo page */}
                        <img src={logo} alt="Logo" className="h-16 ml-3" />
                    </Link>
                    <div className="flex items-center">
                        <span 
                            id="user-address" 
                            className="ml-10 cursor-pointer text-gray-700 hover:text-blue-500 hover:border hover:border-blue-500 p-1 rounded"
                            onClick={handleAddressModalToggle}
                        >
                            {selectedAddress}
                        </span>
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrIJbX-6MVfN4u1_xWs8A7eADfLg1lU9k7oA&s" 
                            alt="India Flag" 
                            className="h-5 ml-4" 
                        />
                        <div className="relative inline-block">
                            <button onClick={handleLanguageDropdown} className="text-gray-700">
                                ENG 
                            </button>
                            {showLanguageDropdown && (
                                <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-md z-20">
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">Hindi</a>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">Bengali</a>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">Tamil</a>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">Telugu</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center mx-auto mt-2 ml-3 md:mt-0">
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-[800px]">
                        <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded pl-10 pr-4 py-2 w-full"
                        />
                    </form>
                </div>
                <div className="flex items-center ml-4 mr-5 mt-2 md:mt-0 relative">
                    <div className="relative flex items-center">
                        <FaUser className="text-gray-700 mr-1" />
                        <span 
                            onClick={handleModalToggle}
                            className="cursor-pointer text-gray-700 hover:text-blue-500 hover:border hover:border-blue-500 p-1 rounded"
                        >
                            Account
                        </span>
                        {showModal && (
                            <div className="absolute bg-white border border-gray-300 rounded shadow-md w-48 mt-96 z-20">
                                <div className="px-4 py-2 font-bold">Your Account</div>
                                <a 
                                    onClick={() => handleOptionSelect('Your Account')} 
                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Your Account
                                </a>
                                <a 
                                    onClick={() => handleOptionSelect('Your Orders')} 
                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Your Orders
                                </a>
                                <a 
                                    onClick={() => handleOptionSelect('Your Wishlist')} 
                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Your Wishlist
                                </a>
                                <a 
                                    onClick={() => handleOptionSelect('Keep Shopping')} 
                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Keep Shopping
                                </a>
                                <a 
                                    onClick={() => handleOptionSelect('Shopping List')} 
                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Shopping List
                                </a>
                                <a 
                                    onClick={() => handleOptionSelect('Home')} 
                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Home
                                </a>
                                <a 
                                    onClick={() => handleOptionSelect('Sign Out')} 
                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    Sign Out
                                </a>

                            </div>
                        )}
                    </div>
                    <div className="flex items-center ml-10 cursor-pointer hover:bg-gray-100 p-1 rounded">
                        <FaWallet className="h-6 w-6 text-green-500" />
                        <span className="text-gray-700 ml-1"></span>
                    </div>
                    <div className="flex items-center ml-10 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => navigate('/cart')}>
                        <FaShoppingCart className="h-6 w-6 text-blue-500" />
                        <span className="text-gray-700 ml-1"></span>
                    </div>
                </div>
            </nav>

            {showAddressModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
                    <div className="bg-white rounded shadow-lg p-6 relative">
                        <FaTimes 
                            onClick={handleAddressModalToggle} 
                            className="absolute top-2 right-2 cursor-pointer text-gray-500" 
                        />
                        <h2 className="text-lg font-semibold mb-4">Select Address</h2>
                        <ul>
                            <li 
                                onClick={() => handleAddressSelect('123 Main St, City')} 
                                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                123 Main St, City
                            </li>
                            <li 
                                onClick={() => handleAddressSelect('456 Elm St, Town')} 
                                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                456 Elm St, Town
                            </li>
                            <li 
                                onClick={() => handleAddressSelect('789 Oak St, Village')} 
                                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                789 Oak St, Village
                            </li>
                            <li 
                                onClick={() => handleAddressSelect('321 Pine St, Suburb')} 
                                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                321 Pine St, Suburb
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrginalNavbar;
