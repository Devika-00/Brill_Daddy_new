import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';

const OrdersList = () => {
  const navigate = useNavigate();

  const orders = [
    {
      id: 1,
      image: 'https://via.placeholder.com/100',
      productName: 'Product Name 1',
      address: '123 Street, City, State, ZIP',
      price: '$29.99',
      colour: "red",
      deliveryStatus: 'Delivered',
      deliveryDate: 'October 20, 2024',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/100',
      productName: 'Product Name 2',
      address: '456 Avenue, City, State, ZIP',
      price: '$59.99',
      colour: "black",
      deliveryStatus: 'Delivered',
      deliveryDate: 'October 18, 2024',
    },
    // Add more orders as needed
  ];

  const handleProductClick = (id) => {
    navigate(`/orderDetails/${id}`); // Navigates to order details with the order ID
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white py-0">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold text-center mb-6">Order History</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleProductClick(order.id)}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center md:items-stretch md:space-x-6 cursor-pointer hover:shadow-lg transition"
            >
              {/* Product Image */}
              <div className="w-full md:w-1/4 flex justify-center md:justify-start mb-4 md:mb-0">
                <img src={order.image} alt={order.productName} className="w-24 h-24 object-cover rounded-lg" />
              </div>

              {/* Product Info */}
              <div className="w-full md:w-1/3 text-center md:text-left space-y-1">
                <h3 className="text-lg font-semibold">{order.productName}</h3>
                <p className="text-gray-600">{order.colour}</p>
              </div>

              {/* Price */}
              <div className="w-full md:w-1/4 text-center md:text-left space-y-1">
                <p className="text-xl font-semibold">{order.price}</p>
              </div>

              {/* Delivery Status and Date */}
              <div className="w-full md:w-1/4 text-center md:text-left space-y-1">
                <p className="text-green-600 font-semibold">{order.deliveryStatus}</p>
                <p className="text-gray-500 text-sm">Delivered on {order.deliveryDate}</p>
                <p className="text-gray-500 italic text-sm">Item is delivered.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrdersList;
