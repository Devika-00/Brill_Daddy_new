import React, { useState } from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { AiOutlineUser, AiOutlineHome, AiOutlineShoppingCart, AiOutlineHeart, AiOutlineLogout } from 'react-icons/ai';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleTabClick = (tab) => setActiveTab(tab);
  const toggleAddressModal = () => setShowAddressModal(!showAddressModal);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
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
              <p className="text-lg font-semibold">Hello, Username</p>
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
            <button className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-100">
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
                  <input type="text" className="w-full border p-2 rounded-lg" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-gray-700">Gender</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="gender" className="form-radio" />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="gender" className="form-radio" />
                      <span>Female</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Email Address</label>
                  <input type="email" className="w-full border p-2 rounded-lg" placeholder="Email" />
                </div>
                <div>
                  <label className="block text-gray-700">Mobile Number</label>
                  <input type="text" className="w-full border p-2 rounded-lg" placeholder="Mobile number" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manageAddress' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Manage Address</h2>
              <button
                onClick={toggleAddressModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
              >
                Add Address
              </button>
              {/* Existing Address List */}
              <div className="space-y-4">
                <p>Sample Address 1</p>
                <p>Sample Address 2</p>
              </div>

              {/* Add Address Modal */}
              {showAddressModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h3 className="text-xl font-semibold mb-4">Add Address</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-gray-700">User Name</label>
                        <input type="text" className="w-full border p-2 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-gray-700">Address Line</label>
                        <input type="text" className="w-full border p-2 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-gray-700">Pincode</label>
                        <input type="text" className="w-full border p-2 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-gray-700">Street</label>
                        <input type="text" className="w-full border p-2 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-gray-700">State</label>
                        <input type="text" className="w-full border p-2 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-gray-700">Flat Number</label>
                        <input type="text" className="w-full border p-2 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-gray-700">Address Type</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="addressType" className="form-radio" />
                            <span>Home</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="addressType" className="form-radio" />
                            <span>Work</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="addressType" className="form-radio" />
                            <span>Others</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex space-x-4 mt-4">
                        <button type="button" onClick={toggleAddressModal} className="bg-green-500 text-white px-4 py-2 rounded-lg">Save</button>
                        <button type="button" onClick={toggleAddressModal} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
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
    </div>
  );
};

export default Profile;
