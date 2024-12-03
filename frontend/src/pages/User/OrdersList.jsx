import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { useAppSelector } from '../../Redux/Store/store';
import axios from 'axios';
import { SERVER_URL } from "../../Constants";
import ChatBotButton from "../../components/User/chatBot";
import { ArrowRight } from 'lucide-react';

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '';
  
  const [integerPart, decimalPart] = value.toString().split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});
  const user = useAppSelector((state) => state.user);
  const userId = user.id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/orders/${userId}`);
        setOrders(response.data);

        const imageUrlsMap = {};
        for (const order of response.data) {
          for (const item of order.cartItems) {
            const imageId = item.productId.images[0];
            const imageResponse = await axios.get(`${SERVER_URL}/user/images/${imageId}`);
            imageUrlsMap[imageId] = imageResponse.data.imageUrl;
          }
        }
        setImageUrls(imageUrlsMap);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }; 

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const handleProductClick = (orderId, productId) => {
    navigate(`/orderDetails/${orderId}/${productId}`);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-500';
      case 'Shipped':
        return 'text-orange-500';
      case 'Delivered':
        return 'text-green-600';
      case 'Cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const sortedOrders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white py-0 overflow-hidden">
      <OrginalNavbar />
      <NavbarWithMenu />
      
      <div className="flex-grow container mx-auto px-4 py-6 md:px-6 lg:px-8 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-gray-800">Order History</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-lg">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 text-lg">No Orders Found</p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6 w-full max-w-6xl">
            {sortedOrders.map((order) =>
              order.cartItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleProductClick(order._id, item.productId._id)}
                  className="flex flex-col md:flex-row items-center justify-between 
                    bg-white shadow-md p-4 rounded-lg cursor-pointer 
                    hover:shadow-lg transition space-y-4 md:space-y-0 
                    hover:scale-[1.01] duration-200 w-full mx-auto"
                >
                  {/* Product Image - Full width on mobile, fixed width on desktop */}
                  <div className="w-full md:w-1/6 flex justify-center mb-4 md:mb-0">
                    <img
                      src={imageUrls[item.productId.images[0]]}
                      alt={item.productId.name}
                      className="w-32 h-32 md:w-24 md:h-24 object-cover rounded-lg shadow-sm"
                    />
                  </div>

                  {/* Product Info - Centered on mobile, left-aligned on desktop */}
                  <div className="w-full md:w-1/3 text-center md:text-left">
                    <h4 className="text-lg md:text-xl font-semibold text-gray-800">{item.productId.name}</h4>
                    <p className="text-gray-600 text-sm md:text-base">{item.productId.color}</p>
                  </div>

                  {/* Price and Quantity - Centered on mobile */}
                  <div className="w-full md:w-1/6 text-center">
                    <p className="text-xl font-semibold text-blue-700">₹{formatCurrency(item.price)}</p>
                    <p className="text-gray-500 italic text-sm">Quantity: {item.quantity}</p>
                  </div>

                  {/* Delivery Info - Right-aligned on both mobile and desktop */}
                  <div className="w-full md:w-1/4 text-center md:text-right">
                    <p className={`${getStatusClassName(item.status)} font-semibold text-sm md:text-base`}>
                      {item.status === 'Delivered'
                        ? `Delivered on ${new Date(order.deliveryDate).toLocaleDateString()}`
                        : `${item.status}`}
                    </p>
                    <p className="text-gray-500 italic text-xs md:text-sm">
                      {item.status === 'Delivered' 
                        ? 'Your item is delivered' 
                        : `Your Order is ${item.status}`}
                    </p>
                    <div className="mt-2 flex justify-center md:justify-end items-center">
                      <ArrowRight className="text-blue-500 w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <Footer />
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBotButton />
      </div>
    </div>
  );
};

export default OrdersList;