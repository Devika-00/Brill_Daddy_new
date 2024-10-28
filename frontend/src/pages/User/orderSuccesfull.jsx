import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';

const OrderSuccessful = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 mb-4 text-5xl">✔️</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase! Your order is on its way. You can view your order details or go back to the home page.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/user/orders')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              View Order
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccessful;
