import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { SERVER_URL } from "../../Constants";

const OrderDetails = () => {
  const { id, productId } = useParams();
  const [order, setOrder] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/order/${id}`);
        
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

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const element = invoiceRef.current;

    doc.setFontSize(18);
    doc.text("Invoice", 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Order ID: ${id}`, 10, 30);
    doc.text(`Shipping Address:`, 10, 35);
    doc.text(`${order.selectedAddressId.userName}`, 10, 40);
    doc.text(`${order.selectedAddressId.addressLine}`, 10, 45);
    doc.text(`${order.selectedAddressId.street}, ${order.selectedAddressId.state}, ${order.selectedAddressId.pincode}`, 10, 50);
    doc.text(`${order.selectedAddressId.flatNumber}`, 10, 55);
    doc.text(`Phone: ${order.selectedAddressId.phoneNumber}`, 10, 60);

    const startY = 90;
    doc.text("Product Name", 10, startY);
    doc.text("Description", 70, startY);
    doc.text("Price", 130, startY);
    doc.text("Quantity", 160, startY);
    doc.text("Total", 190, startY);

    let rowIndex = startY + 10;
    order.cartItems.forEach(item => {
      doc.text(item.productId.name, 10, rowIndex);
      doc.text(item.productId.description, 70, rowIndex);
      doc.text(`$${item.price.toFixed(2)}`, 130, rowIndex);
      doc.text(`${item.quantity}`, 160, rowIndex);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 190, rowIndex);
      rowIndex += 10;
    });

    const totalAmount = order.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    doc.text(`Total Amount: $${totalAmount}`, 10, rowIndex + 10);

    doc.save(`Order_${id}_Invoice.pdf`);
  };

  if (!order) return <p>Loading...</p>;

  const totalAmount = order.cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0).toFixed(2);

  // Order status mapping
  const statusMapping = {
    "Pending": 25,
    "Shipped": 50,
    "Out for Delivery": 75,
    "Delivered": 100,
  };

  // Calculate the average progress percentage based on each product's status
  const progressPercentage = order.cartItems.reduce((totalProgress, item) => {
    return totalProgress + (statusMapping[item.status] || 0);
  }, 0) / order.cartItems.length;

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
          <button
            onClick={handleDownloadInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download Invoice
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
                <p className="text-gray-800 font-semibold mt-2">₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
          
          {/* Order Status Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
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
