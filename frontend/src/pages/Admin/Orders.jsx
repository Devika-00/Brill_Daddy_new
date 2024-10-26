import React, { useState } from 'react';
import Navbar from '../../components/Admin/Navbar';
import Sidebar from '../../components/Admin/Sidebar';

const Orders = () => {
  const initialOrders = [
    {
      orderId: 'ORD001',
      productName: 'Product 1',
      image: 'https://via.placeholder.com/100',
      details: 'Product 1 is a high-quality item designed for durability.',
      status: 'Ordered',
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png', // User image
      },
      orderDetails: {
        date: '2024-10-01',
        amount: '$50.00',
        address: '123 Street, City, Country', // Moved address to order details
      },
    },
    {
      orderId: 'ORD002',
      productName: 'Product 2',
      image: 'https://via.placeholder.com/100',
      details: 'Product 2 offers exceptional performance with cutting-edge features.',
      status: 'Shipping',
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: 'https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png', // User image
      },
      orderDetails: {
        date: '2024-10-02',
        amount: '$30.00',
        address: '456 Avenue, City, Country', // Moved address to order details
      },
    },
    {
      orderId: 'ORD003',
      productName: 'Product 3',
      image: 'https://via.placeholder.com/100',
      details: 'Product 3 is perfect for those who seek reliability and comfort.',
      status: 'Delivered',
      user: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        image: 'https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png', // User image
      },
      orderDetails: {
        date: '2024-10-03',
        amount: '$70.00',
        address: '789 Boulevard, City, Country', // Moved address to order details
      },
    },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order for modal

  // Function to handle status change
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Function to open modal with order details
  const openModal = (order) => {
    setSelectedOrder(order);
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Status options with colors
  const statusColors = {
    Ordered: 'bg-yellow-200 text-yellow-800',
    Shipping: 'bg-blue-200 text-blue-800',
    Delivered: 'bg-green-200 text-green-800',
    Returned: 'bg-red-200 text-red-800',
  };

  return (
    <div className="flex">
        {/* Sidebar */}
        <Sidebar />
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Order List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Order ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Product Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Details</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border-t">
                <td className="px-4 py-2 text-sm text-gray-600">{order.orderId}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{order.productName}</td>
                <td className="px-4 py-2">
                  <img src={order.image} alt={order.productName} className="w-16 h-16 object-cover rounded-md" />
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  <button
                    onClick={() => openModal(order)}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    className={`rounded-md px-2 py-1 ${statusColors[order.status]} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  >
                    <option value="Ordered" className="bg-yellow-100 text-yellow-900">Ordered</option>
                    <option value="Shipping" className="bg-blue-100 text-blue-900">Shipping</option>
                    <option value="Delivered" className="bg-green-100 text-green-900">Delivered</option>
                    <option value="Returned" className="bg-red-100 text-red-900">Returned</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying order details */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h4 className="font-semibold mb-2">Order Details</h4>
            <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
            <p><strong>Order Date:</strong> {selectedOrder.orderDetails.date}</p>
            <p><strong>Total Amount:</strong> {selectedOrder.orderDetails.amount}</p>
            <p><strong>Shipping Address:</strong> {selectedOrder.orderDetails.address}</p> {/* Added ordered address here */}

            <h4 className="font-semibold mt-4 mb-2">User Details</h4>
            <div className="flex items-center mb-2">
              <img src={selectedOrder.user.image} alt={selectedOrder.user.name} className="w-12 h-12 rounded-full mr-2" />
              <div>
                <p><strong>Name:</strong> {selectedOrder.user.name}</p>
                <p><strong>Email:</strong> {selectedOrder.user.email}</p>
              </div>
            </div>

            <h4 className="font-semibold mt-4 mb-2">Product Details</h4>
            <p>{selectedOrder.details}</p>

            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
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
