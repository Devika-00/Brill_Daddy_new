import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Admin/Navbar';
import Sidebar from '../../components/Admin/Sidebar';
import { SERVER_URL } from "../../Constants";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/admin/orders`);
        setOrders(response.data);

        const imageUrlsMap = {};
        for (const order of response.data) {
          for (const item of order.cartItems) {
            const imageId = item.productId.images[0]; // Assuming images is an array and you want the first image
            if (imageId) {
              const imageResponse = await axios.get(`${SERVER_URL}/user/images/${imageId}`);
              imageUrlsMap[imageId] = imageResponse.data.imageUrl; // Store the image URL
            }
          }
        }
        setImageUrls(imageUrlsMap);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const openModal = (order, item) => {
    setSelectedOrder({ ...order, selectedItem: item });
    setNewStatus(order.orderStatus); // Set current status as default in modal
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setNewStatus('');
  };

  const statusColors = {
    Pending: 'bg-yellow-200 text-yellow-800',
    Shipped: 'bg-blue-200 text-blue-800',
    'Out for Delivery': 'bg-orange-200 text-orange-800',
    Delivered: 'bg-green-200 text-green-800',
  };

  

  const handleStatusChange = async () => {
    if (selectedOrder) {
      try {
        await axios.put(`${SERVER_URL}/admin/orders/${selectedOrder._id}`, {
          orderStatus: newStatus,
        });
        setOrders((prevOrders) => 
          prevOrders.map((order) => 
            order._id === selectedOrder._id ? { ...order, orderStatus: newStatus } : order
          )
        );
        closeModal();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Order List</h2>
          <div className="overflow-x-hidden">
            <table className="min-w-full bg-white border border-gray-200 table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Product Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Order Date</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Details and Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.cartItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t cursor-pointer transition-transform duration-150"
                    >
                      <td className="px-4 py-2 text-sm text-gray-600">{order._id}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.productId?.name}</td>
                      <td className="px-4 py-2">
                        <img
                          src={imageUrls[item.productId.images[0]] || '/path/to/default/image.png'}
                          alt={item.productId?.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">${item.price}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`${statusColors[order.orderStatus]} px-2 py-1 rounded-md`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => openModal(order, item)}
                          className="text-blue-500 hover:underline"
                        >
                          View Details
                          <div className="text-blue-500 text-sm">Change Status</div>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h4 className="font-semibold mb-2">Order Details</h4>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ${selectedOrder.total}</p>
                <p><strong>Shipping Address:</strong> {selectedOrder.selectedAddressId?.street}</p>

                <h4 className="font-semibold mt-4 mb-2">Selected Product</h4>
                <p><strong>Product Name:</strong> {selectedOrder.selectedItem.productId?.name}</p>
                <p><strong>Quantity:</strong> {selectedOrder.selectedItem.quantity}</p>
                <p><strong>Price:</strong> ${selectedOrder.selectedItem.price}</p>
                <p><strong>Description:</strong> {selectedOrder.selectedItem.productId?.description}</p>

                <h4 className="font-semibold mt-4 mb-2">Change Status</h4>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 mb-4"
                >
                  <option value="Pending" >Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>

                <button
                  onClick={handleStatusChange}
                  className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 ml-3"
                 
                >
                  Update Status
                </button>

                <button
                  onClick={closeModal}
                  className="mt-4 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 ml-3"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
