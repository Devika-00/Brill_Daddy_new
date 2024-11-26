import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaWallet, FaShoppingCart
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { SERVER_URL } from "../../Constants";
import axios from "axios";
import { useAppSelector } from "../../Redux/Store/store";
import { clearUser } from '../../Redux/Slice/userSlice';
import { useSelector, useDispatch } from "react-redux";

const OrginalNavbar = () => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productNames, setProductNames] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const token = user.token;
  const dispatch = useDispatch();
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/products`);
        setProductNames(response.data.map((product) => product.name));
      } catch (error) {
        console.error("Error fetching product names:", error);
      }
    };

    const fetchUserAddresses = async () => {
      if (user.isAuthenticated) {
        try {
          const response = await axios.get(
            `${SERVER_URL}/user/addresses/${user.id}`
          );
          setUserAddresses(response.data);
        } catch (error) {
          console.error("Error fetching user addresses:", error);
        }
      }
    };

    const fetchUserDetails = async () => {
      if (user.isAuthenticated && user.id) {
        try {
          const userDetailsResponse = await axios.get(`${SERVER_URL}/user/getUserDetails`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const addressId = userDetailsResponse.data.currentAddress; // Assuming this returns the address ID
          if (addressId) {
            const addressResponse = await axios.get(`${SERVER_URL}/user/address/${addressId}`);
            setSelectedAddress(addressResponse.data);
          }
        } catch (error) {
          // Handle specific 404 error case
          if (error.response && error.response.status === 404) {
            console.error("User not found. Please check the user ID or registration status.");
          } else {
            console.error("Error fetching user details:", error);
          }
        }
      }
    };

    fetchProducts();
    fetchUserAddresses();
    fetchUserDetails();
  }, [user.isAuthenticated, user.id]);


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = productNames.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${searchTerm}`);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion);
    setFilteredSuggestions([]);
    navigate(`/shop?search=${suggestion}`);
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
    setCurrentAddress(address);
    setSelectedAddress(address); // Update selectedAddress when a new address is selected
  };
  
  const handleSaveAddress = async () => {
    if (currentAddress) {
      try {
        const response = await axios.put(`${SERVER_URL}/user/updateAddress/${user.id}`, {
          addressId: currentAddress._id, // Send only the address ID to the backend
        });
        if (response.status === 200) {
          setSelectedAddress(currentAddress); // Update the UI with the new address
          setShowAddressModal(false); // Close the modal
        }
      } catch (error) {
        console.error("Error updating address:", error);
      }
    }
  };

  const handleWalletClick = () => {
    navigate("/wallet"); // Navigate to wallet page
  };

  const handleCartClick = () => {
    navigate("/cart");// Navigate to cart page
  };


  const handleOptionSelect = (option) => {
    setShowModal(false);
    switch (option) {
      case "Your Account":
        navigate("/profile");
        break;
      case "Your Orders":
        navigate("/orderList");
        break;
      case "Your Wishlist":
        navigate("/wishlist");
        break;
      case "Keep Shopping":
        navigate("/shop");
        break;
      case "Shopping List":
        navigate("/orderList");
        break;
      case "Home":
        navigate("/");
        break;
        case "Sign Out":
            dispatch(clearUser()); // clear the user data in Redux
            navigate("/login"); // navigate to login page
            break;
      default:
        break;
    }
  };


  return (
    <>
      <nav className="flex flex-col md:flex-row justify-between items-center bg-white p-4 shadow h-32">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-24 ml-3" />
          </Link>
          <div className="flex items-center">
          {user.isAuthenticated && (
  <span
    id="user-address"
    className="ml-10 cursor-pointer text-gray-700 hover:text-blue-500 hover:border hover:border-blue-500 p-1 rounded"
    onClick={handleAddressModalToggle}
  >
    {selectedAddress.userName ? (
      <>
        <div>{selectedAddress.userName}</div>
        <div>{selectedAddress.addressLine}</div>
        <div>{selectedAddress.state}</div>
      </>
    ) : (
      "Select Address"
    )}
  </span>
)}
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
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Hindi
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Bengali
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Tamil
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Telugu
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center mx-auto mt-2 ml-3 md:mt-0">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full md:w-[800px]"
          >
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded pl-10 pr-4 py-2 w-full"
            />
            {filteredSuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded shadow-md z-20">
                {filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>
        <div className="flex items-center ml-4 mr-5 mt-2 md:mt-0 relative">
          {user.isAuthenticated ? (
            <>
              <div className="relative flex items-center">
                <FaUser className="text-gray-700 mr-1" />
                <span
                  onClick={handleModalToggle}
                  className="cursor-pointer text-gray-700 hover:text-blue-500 hover:border hover:border-blue-500 p-1 rounded mr-8"
                >
                  Account
                </span>
                
                <FaWallet onClick={handleWalletClick} className="text-yellow-700 ml-4 cursor-pointer hover:text-yellow-500 text-2xl mr-8" />
                <FaShoppingCart onClick={handleCartClick} className="text-green-700 ml-4 cursor-pointer hover:text-green-500 text-2xl mr-4" />
             
                {showModal && (
                  <div className="absolute bg-white border border-gray-300 rounded shadow-md w-48 mt-96 z-20">
                    <div className="px-4 py-2 font-bold">Your Account</div>
                    <a
                      onClick={() => handleOptionSelect("Your Account")}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Your Account
                    </a>
                    <a
                      onClick={() => handleOptionSelect("Your Orders")}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Your Orders
                    </a>
                    <a
                      onClick={() => handleOptionSelect("Your Wishlist")}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Your Wishlist
                    </a>
                    <a
                      onClick={() => handleOptionSelect("Keep Shopping")}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Keep Shopping
                    </a>
                    <a
                      onClick={() => handleOptionSelect("Shopping List")}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Shopping List
                    </a>
                    <a
                      onClick={() => handleOptionSelect("Home")}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Home
                    </a>
                    <a
                      onClick={() => handleOptionSelect("Sign Out")}
                      className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout 
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
      <Link to="/login" className="flex items-center text-blue-900 hover:text-blue-500 mr-10">
        <FaUser className="text-blue-900  hover:text-blue-500 mr-1" />
        Sign In
      </Link>
      <FaShoppingCart 
        className="text-green-700 ml-4 cursor-pointer hover:text-green-500 text-2xl mr-4" 
        onClick={() => navigate('/login')} 
      />
    </>
          )}
        </div>
      </nav>

      {showAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h3 className="font-bold text-lg mb-4">Select Address</h3>
            <ul className="space-y-4 max-h-60 overflow-y-auto">
            {userAddresses.length === 0 ? (
        // Display message when no addresses are available
        <p className="text-gray-600">No address available. Create an address from your account.</p>
      ) : (
        <ul className="space-y-4 max-h-60 overflow-y-auto">
          {userAddresses.map((address, index) => (
            <li key={index} className="border rounded-lg p-4 flex items-center space-x-2">
              <input
                type="radio"
                name="address"
                value={address.addressLine}
                checked={currentAddress?.addressLine === address.addressLine}
                onChange={() => handleAddressSelect(address)}
              />
              <div>
                <div className="font-semibold">{address.userName}</div>
                <div>{address.addressLine}</div>
                <div>{address.state}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveAddress}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={handleAddressModalToggle}
                className="text-blue-500 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrginalNavbar;
