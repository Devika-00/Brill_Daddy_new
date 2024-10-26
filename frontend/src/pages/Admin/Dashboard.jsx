import React from 'react';
import Navbar from '../../components/Admin/Navbar';
import Sidebar from '../../components/Admin/Sidebar';


const Dashboard = () => {
  return (
    <div className="flex">
        {/* Sidebar */}
        <Sidebar />
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />
    <div className="flex-1 p-4 sm:p-6 bg-gray-100">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4 sm:mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* User Count Card */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">User Count</h2>
          <p className="text-3xl sm:text-4xl font-bold text-blue-600">1,234</p>
        </div>

        {/* Auction Participants Card */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Auction Participants</h2>
          <p className="text-3xl sm:text-4xl font-bold text-green-600">567</p>
        </div>

        {/* Orders Count Card */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Orders Count</h2>
          <p className="text-3xl sm:text-4xl font-bold text-yellow-600">89</p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Dashboard;
