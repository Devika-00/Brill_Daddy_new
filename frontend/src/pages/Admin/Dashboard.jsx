import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { SERVER_URL } from "../../Constants";
import Navbar from '../../components/Admin/Navbar';
import Sidebar from '../../components/Admin/Sidebar';
import axios from 'axios';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [counts, setCounts] = useState({
    userCount: 0,
    auctionCount: 0,
    auctionUniqueParticipants: 0,
    orderCount: 0,
    orderStatusCounts: {},
    userRegistrationDates: [],
    auctionDates: [],
    orderDates: [],
  });
  const [timeframe, setTimeframe] = useState("year");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/admin/dashboardCounts`);
        setCounts(response.data);

        // Log dates for debugging
        console.log('User Registration Dates:', response.data.userRegistrationDates);
        console.log('Auction Dates:', response.data.auctionDates);
        console.log('Order Dates:', response.data.orderDates);
        
        console.log('Auction Unique Participants:', response.data.auctionUniqueParticipants);

        // Log the order status counts and their associated dates
        console.log('Order Status Counts:', response.data.orderStatusCounts);
        Object.keys(response.data.orderStatusCounts).forEach(status => {
          console.log(`${status} Count:`, response.data.orderStatusCounts[status].count);
          console.log(`${status} Dates:`, response.data.orderStatusCounts[status].dates);
        });
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const filterDataByTimeframe = (dates) => {
    const now = moment();
    return dates.filter(date => {
      const dateMoment = moment(date);
      if (timeframe === "day") {
        return now.isSame(dateMoment, 'day');
      } else if (timeframe === "week") {
        return now.isSame(dateMoment, 'week');
      } else if (timeframe === "month") {
        return now.isSame(dateMoment, 'month');
      } else if (timeframe === "year") {
        return now.isSame(dateMoment, 'year');
      }
      return false;
    });
  };

  const filteredUserCount = filterDataByTimeframe(counts.userRegistrationDates).length;
  const filteredAuctionCount = filterDataByTimeframe(counts.auctionDates).length;
  const filteredOrderCount = filterDataByTimeframe(counts.orderDates).length;
  const orderStatusCounts = counts.orderStatusCounts || {};
  const auctionUniqueParticipants = counts.auctionUniqueParticipants || 0;

  // Filter order status counts based on timeframe
  const filteredOrderStatusCounts = Object.keys(counts.orderStatusCounts || {}).reduce((acc, status) => {
    const statusData = counts.orderStatusCounts[status];
    const filteredDates = filterDataByTimeframe(statusData?.dates || []);
    acc[status] = {
      count: filteredDates.length,
      dates: filteredDates,
    };
    return acc;
  }, {});

  const orderStatusLabels = Object.keys(filteredOrderStatusCounts);
  const orderStatusValues = orderStatusLabels.map(status => filteredOrderStatusCounts[status]?.count || 0);


  // Bar Chart Data
  const barData = {
    labels: ['User Count', 'Auction Counts', 'Auction Participants', 'Orders Count', ...Object.keys(filteredOrderStatusCounts)],
    datasets: [
      {
        label: `Counts (${timeframe})`,
        data: [filteredUserCount, filteredAuctionCount, auctionUniqueParticipants, filteredOrderCount, ...Object.values(filteredOrderStatusCounts).map(item => item.count)],
        backgroundColor: ['#4F46E5', '#22C55E', '#34D399', '#EAB308', ...Object.keys(filteredOrderStatusCounts).map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`)],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
      title: {
        display: true,
        text: `Dashboard Counts (${timeframe.toUpperCase()})`,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
        },
      },
    },
  };

// Pie Chart Data
const pieData = {
  labels: ['User Count', 'Auction Counts', 'Auction Participants', 'Orders Count', ...orderStatusLabels],
  datasets: [
    {
      data: [
        filteredUserCount,
        filteredAuctionCount,
        auctionUniqueParticipants,
        filteredOrderCount,
        ...orderStatusLabels.map(status => filteredOrderStatusCounts[status]?.count || 0),
      ],
      backgroundColor: [
        '#6366F1', '#34D399', '#FBBF24',
        ...orderStatusLabels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
      ],
      hoverBackgroundColor: [
        '#4338CA', '#10B981', '#F59E0B',
        ...orderStatusLabels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
      ],
    },
  ],
};


  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
      legend: {
        display: true,
        position: 'right',
      },
    },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-4 sm:p-6 bg-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4 sm:mb-6">Dashboard</h1>

          {/* First Row: Existing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* User Count Card */}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">User Count</h2>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">{filteredUserCount}</p>
            </div>

            {/* Auction Participants Card */}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">Auction Counts</h2>
              <p className="text-3xl sm:text-4xl font-bold text-green-600">{filteredAuctionCount}</p>
            </div>

            {/* Orders Count Card */}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">Orders Count</h2>
              <p className="text-3xl sm:text-4xl font-bold text-yellow-600">{filteredOrderCount}</p>
            </div>
          </div>

          {/* Second Row: Order Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {/* Dynamic Order Status Cards */}
            {orderStatusLabels.map((status, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700">{status} Orders</h2>
                <p className="text-3xl sm:text-4xl font-bold text-gray-500">
                  {filteredOrderStatusCounts[status]?.count || 0}
                </p>
              </div>
            ))}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">Auction Unique Participants</h2>
              <p className="text-3xl sm:text-4xl font-bold text-teal-600">{auctionUniqueParticipants}</p>
            </div>
          </div>

          {/* Graphs Section */}
          <div className="mt-8">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setTimeframe("day")}
                className={`px-4 py-2 rounded-md font-semibold ${timeframe === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Day
              </button>
              <button
                onClick={() => setTimeframe("week")}
                className={`px-4 py-2 rounded-md font-semibold ${timeframe === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeframe("month")}
                className={`px-4 py-2 rounded-md font-semibold ${timeframe === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeframe("year")}
                className={`px-4 py-2 rounded-md font-semibold ${timeframe === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Year
              </button>
            </div>

            {/* Bar Chart and Pie Chart in One Row with Two Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div
                  style={{
                    height: '500px',
                    width: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div
                  style={{
                    height: '500px',
                    width: '500px',
                    margin: 'auto',
                    overflow: 'hidden',
                  }}
                >
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
