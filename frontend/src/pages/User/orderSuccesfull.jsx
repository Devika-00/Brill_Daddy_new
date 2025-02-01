import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import axios from 'axios';
import { SERVER_URL } from "../../Constants";
import { useLocation } from 'react-router-dom';

const OrderSuccessful = () => {
  const location = useLocation();
  const { orderedItems, userId } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    // Function to update quantity in the backend
    const updateQuantities = async () => {
      console.log("loggingggg");
      try {
        // Update the quantities of the ordered items
        await Promise.all(
          orderedItems.map(item =>
            axios.post(`${SERVER_URL}/user/updateQuantity`, {
              productId: item.productId,
              quantity: item.quantity,
            })
          )
        );
        console.log("Quantity updated successfully");

        // Clear the cart items for the user after successful quantity update
        await axios.delete(`${SERVER_URL}/user/clearCart/${userId}`);
        console.log("Cart cleared successfully");

      } catch (error) {
        console.error("Error updating quantity or clearing cart:", error);
      }
    };

    // Call the update function when the component mounts
    if (orderedItems && orderedItems.length > 0) {
      updateQuantities();
    }
  }, [orderedItems, userId]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
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
              aria-label="Return to Home Page"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/orderList')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              aria-label="View Your Orders"
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
