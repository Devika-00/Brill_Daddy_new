import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { SERVER_URL } from "../../Constants";

const OrderDetails = () => {
  const { id, productId } = useParams();
  const [order, setOrder] = useState(null);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/orders/${id}`);
        
        // Filter to find the specific item in cartItems with the matching productId
        const filteredOrder = {
          ...response.data,
          cartItems: response.data.cartItems.filter((item) => item.productId._id === productId),
        };
        setOrder(filteredOrder);

        const imageUrlsMap = {};
        for (const item of filteredOrder.cartItems) {
          const imageId = item.productId.images[0];
          const imageResponse = await axios.get(`${SERVER_URL}/user/images/${imageId}`);
          imageUrlsMap[imageId] = imageResponse.data.imageUrl;
        }
        setImageUrls(imageUrlsMap);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (id && productId) fetchOrderDetails();
  }, [id, productId]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white py-4">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Address and More Actions */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
          <p className="text-gray-700">{order.selectedAddressId.userName}</p>
          <p className="text-gray-700">{order.selectedAddressId.addressLine}</p>
          <p className="text-gray-700">{order.selectedAddressId.street}, {order.selectedAddressId.state}, {order.selectedAddressId.pincode}</p>
          <p className="text-gray-700">{order.selectedAddressId.flatNumber}</p>
          <p className="text-gray-700">Phone: {order.selectedAddressId.phoneNumber}</p>
          <p className="text-gray-700">Type: {order.selectedAddressId.addressType}</p>

          <hr className="my-6 border-gray-300" />

          <h4 className="text-lg font-semibold mb-2">More Actions</h4>
          <p className="text-blue-600 mb-4 cursor-pointer">Download Invoice</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Download
          </button>
        </div>

        {/* Right Side: Product Details and Progress Bar */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {order.cartItems.map((item) => (
            <div key={item.productId._id} className="flex flex-col items-center md:items-start md:flex-row mb-4">
              <img
                src={imageUrls[item.productId.images[0]]}
                alt={item.productId.name}
                className="w-32 h-32 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
              />
              
              <div>
                <h3 className="text-xl font-semibold">{item.productId.name}</h3>
                <p className="text-gray-600">{item.productId.description}</p>
                <p className="text-gray-800 font-semibold mt-2">${item.price} x {item.quantity}</p>
              </div>
            </div>
          ))}
          
          {/* Order Status */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className={`w-2.5 h-2.5 rounded-full ${order.orderStatus === 'Pending' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
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
