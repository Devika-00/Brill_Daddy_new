import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { useAppSelector } from '../../Redux/Store/store';
import axios from 'axios';
import { SERVER_URL } from "../../Constants";

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
        const response = await axios.get(`${SERVER_URL}/user/orders`, { params: { userId } });
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white py-0">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold text-center mb-6">Order History</h2>

        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              order.cartItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleProductClick(order._id, item.productId._id)}
                  className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition ml-2"
                >
                  {/* Product Image */}
                  <div className="w-1/6">
                    <img
                      src={imageUrls[item.productId.images[0]]}
                      alt={item.productId.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="w-1/3">
                    <h4 className="text-lg font-semibold">{item.productId.name}</h4>
                    <p className="text-gray-600">{item.productId.color}</p>
                  </div>

                  {/* Price and Quantity */}
                  <div className="w-1/6 text-center">
                    <p className="text-xl font-semibold">${item.price}</p>
                    <p className="text-gray-500 italic">Quantity: {item.quantity}</p>
                  </div>

                  {/* Delivery Info */}
                  <div className="w-1/4 text-right mr-5">
                    <p className="text-green-600 font-semibold">Delivered on {new Date(order.deliveryDate).toLocaleDateString()}</p>
                    <p className="text-gray-500 italic">Your item is delivered</p>
                  </div>
                </div>
              ))
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersList;
