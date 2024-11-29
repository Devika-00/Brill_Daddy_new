//frontend/src/pages/User/Profile.jsx
import React, { useState, useEffect } from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { AiOutlineUser, AiOutlineHome, AiOutlineShoppingCart, AiOutlineHeart, AiOutlineLogout, AiFillDelete, AiFillEdit, AiOutlineTrophy} from 'react-icons/ai';
import { useAppSelector } from '../../Redux/Store/store';
import { SERVER_URL } from "../../Constants";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../Redux/Slice/userSlice';
import { useNavigate } from 'react-router-dom';
import ChatBotButton from "../../components/User/chatBot";

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressData, setAddressData] = useState({
    userName: '',
    addressLine: '',
    pincode: '',
    street: '',
    state: '',
    flatNumber: '',
    phoneNumber: '',
    addressType: 'Home',
  });
  const [addresses, setAddresses] = useState([]); // State for storing fetched addresses
  const [selectedAddressId, setSelectedAddressId] = useState(null); // State for selected address
  const [userInfo, setUserInfo] = useState([]);

  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTabClick = (tab) => setActiveTab(tab);
  const toggleAddressModal = () => setShowAddressModal(!showAddressModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  const handleAddressSave = async () => {
    try {
      if (selectedAddressId) {
        // Call the edit address endpoint if an address is selected
        const response = await axios.put(`${SERVER_URL}/user/editAddress/${selectedAddressId}`, {
          ...addressData,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );

        if (response.status === 200) {
          fetchAddresses();
          setShowAddressModal(false);
          setSelectedAddressId(null);
        } else {
          console.error('Failed to update address');
        }
      } else {
        // Otherwise, add a new address
        const response = await axios.post(`${SERVER_URL}/user/addAddress`, {
          ...addressData,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );

        if (response.status === 200) {
          fetchAddresses();
          setShowAddressModal(false);
        } else {
          console.error('Failed to save address');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/user/addresses/${userId}`);
      if (response.status === 200) {
        setAddresses(response.data); // Assuming response.data is an array of addresses
      } else {
        console.error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {

      const response = await axios.get(`${SERVER_URL}/user/${userId}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUserInfo(response.data);
      } else {
        console.error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const editAddress = (address) => {
    // Load the selected address data into the form and set the selected address ID
    setAddressData(address);
    setSelectedAddressId(address._id);
    setShowAddressModal(true);
  };

  // Delete address handler
  const handleAddressDelete = async (addressId) => {
    try {
      const response = await axios.delete(`${SERVER_URL}/user/deleteAddress/${addressId}`, { data: { userId } });
      if (response.status === 200) {
        // Remove deleted address from state
        setAddresses(addresses.filter(address => address._id !== addressId));
      } else {
        console.error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser()); // Clear user data from Redux
    navigate("/login"); // Navigate to the login page
  };

  // Fetch addresses when the component mounts or when activeTab changes
  useEffect(() => {
    if (activeTab === 'manageAddress') {
      fetchAddresses();
    }
    fetchUserInfo();
  }, [activeTab]);



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto p-4 space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src="https://via.placeholder.com/50"
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-lg font-semibold">Hello, {user.name}</p>
            </div>
          </div>
          <div className="space-y-4">
            <button
              className={`flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-100 ${activeTab === 'personalInfo' && 'bg-blue-100'}`}
              onClick={() => handleTabClick('personalInfo')}
            >
              <AiOutlineUser className="text-lg" />
              <span>Personal Information</span>
            </button>
            <button
              className={`flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-100 ${activeTab === 'manageAddress' && 'bg-blue-100'}`}
              onClick={() => handleTabClick('manageAddress')}
            >
              <AiOutlineHome className="text-lg" />
              <span>Manage Address</span>
            </button>
            <button
              className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-100"
              onClick={() => window.location.href = '/winalbum'}
            >
              <AiOutlineTrophy className="text-lg" />
              <span>Win Album</span>
            </button>
            <button
              className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-100"
              onClick={() => window.location.href = '/bidProducts'}
            >
              <AiOutlineTrophy className="text-lg" />
              <span>Attempt Products</span>
            </button>
            <button
              className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-100"
              onClick={() => window.location.href = '/orderList'}
            >
              <AiOutlineShoppingCart className="text-lg" />
              <span>My Orders</span>
            </button>
            <button
              className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-100"
              onClick={() => window.location.href = '/wishlist'}
            >
              <AiOutlineHeart className="text-lg" />
              <span>My Wishlist</span>
            </button>
            <button 
              className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-100"
              onClick={handleLogout} // Logout logic embedded
            >
              <AiOutlineLogout className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-3/4 bg-white p-6 rounded-lg shadow-md">
          {activeTab === 'personalInfo' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input type="text" className="w-full border p-2 rounded-lg" placeholder="Your name" value={userInfo.username} />
                </div>
                <div>
                  <label className="block text-gray-700">Email Address</label>
                  <input type="email" className="w-full border p-2 rounded-lg" placeholder="Email" value={userInfo.email} />
                </div>
                <div>
                  <label className="block text-gray-700">Mobile Number</label>
                  <input type="text" className="w-full border p-2 rounded-lg" placeholder="Mobile number" value={userInfo.phone} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manageAddress' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Manage Address</h2>
              <button
            onClick={() => {
              toggleAddressModal();
              setSelectedAddressId(null);
              setAddressData({
                userName: '',
                addressLine: '',
                pincode: '',
                street: '',
                state: '',
                flatNumber: '',
                phoneNumber: '',
                addressType: 'Home',
              });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2"
          >
            Add Address
          </button>

              {/* Address Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {addresses.map((address) => (
                  <div key={address._id} className="bg-gray-100 shadow-lg rounded-lg p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-800">{address.userName} - {address.addressLine}</h3>
                      <button onClick={() => editAddress(address)} className="text-blue-600 hover:bg-blue-100 rounded-full p-2 transition duration-200" aria-label="Edit address">
                          <AiFillEdit className="text-2xl" />
                        </button>
                      <button
                        onClick={() => handleAddressDelete(address._id)}
                        className="text-red-600 hover:bg-red-100 rounded-full p-2 transition duration-200"
                        aria-label="Delete address"
                      >
                        <AiFillDelete className="text-2xl" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-700">{`${address.addressLine}, ${address.street}, ${address.state}, ${address.pincode}`}</p>
                      <p className="text-gray-700">{`Flat No: ${address.flatNumber}`}</p>
                      <p className="text-gray-700">{`${address.addressType}`}</p>
                    </div>
                  </div>
                ))}
              </div>


              {/* Add Address Modal */}
              {showAddressModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h3 className="text-xl font-semibold mb-4">Add Address</h3>
                    <form className="space-y-1">
                      {['userName', 'addressLine', 'pincode', 'street', 'state', 'flatNumber', 'phoneNumber'].map((field) => (
                        <div key={field}>
                          <label className="block text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                          <input
                            type="text"
                            name={field}
                            value={addressData[field]}
                            onChange={handleInputChange}
                            className="w-full border p-2 rounded-lg"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-gray-700">Address Type</label>
                        <select
                          name="addressType"
                          value={addressData.addressType}
                          onChange={handleInputChange}
                          className="w-full border p-2 rounded-lg"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={toggleAddressModal}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddressSave}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          {selectedAddressId ? 'Update Address' : 'Add Address'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <div className="fixed bottom-8 right-8 z-50">
        <ChatBotButton />
      </div>
    </div>
  );
};

export default Profile;
