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
        const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);

        console.log('Orders fetched:', response.data); // Debugging log

        const imageUrlsMap = {};
        for (const order of response.data) {
          for (const item of order.cartItems) {
            const imageId = item.productId.images[0];
            if (imageId) {
              const imageResponse = await axios.get(`${SERVER_URL}/user/images/${imageId}`);
              imageUrlsMap[imageId] = imageResponse.data.imageUrl;
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
  };

  useEffect(() => {
    if (selectedOrder) {
      setNewStatus(
        selectedOrder.orderStatus === 'Cancelled'
          ? 'Cancelled'
          : selectedOrder.orderStatus === 'Returned'
            ? 'Returned'
            : selectedOrder.selectedItem.status
      );
    }
  }, [selectedOrder]);

  const closeModal = () => {
    setSelectedOrder(null);
    setNewStatus('');
  };

  const statusColors = {
    Pending: 'bg-yellow-200 text-yellow-800',
    Shipped: 'bg-blue-200 text-blue-800',
    'Out for Delivery': 'bg-orange-200 text-orange-800',
    Delivered: 'bg-green-200 text-green-800',
    'Pending Cancel': 'bg-red-200 text-red-800',
    Cancelled: 'bg-red-200 text-red-800',
    Returned: 'bg-purple-200 text-purple-800',
  };

  const handleStatusChange = async () => {
    if (selectedOrder) {
      try {
        // If the order is cancelled, automatically update product status to 'Cancelled'
        const updatedStatus = selectedOrder.orderStatus === 'Cancelled'
          ? 'Cancelled'
          : selectedOrder.orderStatus === 'Returned'
            ? 'Returned'
            : newStatus;

        // Update both the order and the product's status in the database
        await axios.put(`${SERVER_URL}/admin/orders/${selectedOrder._id}`, {
          orderStatus: updatedStatus, // Automatically track the 'Cancelled' status based on the database value
          productId: selectedOrder.selectedItem.productId._id,
        });

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id
              ? {
                ...order,
                orderStatus: updatedStatus,
                cartItems: order.cartItems.map((item) =>
                  item.productId._id === selectedOrder.selectedItem.productId._id
                    ? { ...item, status: updatedStatus }
                    : item
                ),
              }
              : order
          )
        );
        closeModal();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  console.log(orders,"ooooooooooooooooooooooo")

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
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Product Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.cartItems.map((item) => {
                    // Ensure product status matches the order status
                    const itemStatus = item.status;

                    return (
                      <tr key={item._id} className={`border-t cursor-pointer transition-transform duration-150 `}>
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
                          <span className = 'px-2 py-1 rounded-md'>
                            {itemStatus}
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
                    );
                  })
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
                {selectedOrder.orderStatus === 'Cancelled' && selectedOrder.cancellation && (
                  <div className="mt-4">
                    <p><strong>Cancellation Reason:</strong> {selectedOrder.cancellation.reason}</p>
                  </div>
                )}

                <div className="mt-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Change Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-between">
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    Close
                  </button>
                  <button onClick={handleStatusChange} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
