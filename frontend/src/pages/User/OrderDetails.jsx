import React from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';

const OrderDetails = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white py-4">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Address and More Actions */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
          <p className="text-gray-700">John Doe</p>
          <p className="text-gray-700">123 Main Street</p>
          <p className="text-gray-700">City, State, ZIP</p>
          <p className="text-gray-700">Country</p>
          <p className="text-gray-700">Phone: +1234567890</p>

          <hr className="my-6 border-gray-300" />

          <h4 className="text-lg font-semibold mb-2">More Actions</h4>
          <p className="text-blue-600 mb-4 cursor-pointer">Download Invoice</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Download
          </button>
        </div>

        {/* Right Side: Product Details and Progress Bar */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center md:items-start md:flex-row">
            {/* Product Image */}
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-32 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
            />
            
            {/* Product Details */}
            <div>
              <h3 className="text-xl font-semibold">Product Name</h3>
              <p className="text-gray-600">Product description goes here.</p>
              <p className="text-gray-800 font-semibold mt-2">$49.99</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
              <div className="flex-1 h-0.5 bg-green-600"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
              <div className="flex-1 h-0.5 bg-green-600"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Order Confirmed</span>
              <span>Shipped</span>
              <span>Out for Delivery</span>
              <span>Delivered</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetails;
