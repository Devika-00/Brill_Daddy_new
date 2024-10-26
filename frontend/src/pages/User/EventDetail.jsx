import React, { useState } from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';

const EventDetail = () => {
  const winners = ['W001', 'W002', 'W003', 'W004', 'W005'];

  // Displaying only one voucher
  const voucher = {
    id: 'V001',
    image: 'https://img.freepik.com/premium-vector/professional-gift-voucher-coupon-design_771884-3.jpg',
    description: '10% Off on Electronics',
  };

  const [bidAmount, setBidAmount] = useState(null); // Set initial bidAmount to null
  const [bidId, setBidId] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleBid = () => {
    if (bidAmount === null) {
      setErrorMessage('Please enter a value.'); // Set error message if no value is entered
      return;
    }
    const uniqueId = 'BID-' + Math.random().toString(36).substr(2, 9); // Generate a unique bid ID
    setBidId(uniqueId);
    setErrorMessage(''); // Clear error message on successful bid
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="container mx-auto px-4 py-8"> {/* Adjusted padding */}
        <h1 className="text-3xl font-bold text-center mb-8">Event Detail Page</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Winners List */}
          <div className="bg-white shadow-md rounded-lg p-4 w-96 ml-24 h-96">
            <h2 className="text-xl font-semibold mb-4 text-center">Winners</h2>
            <ul className="space-y-2">
              {winners.map((winnerId, index) => (
                <li key={index} className="border border-gray-300 p-2 rounded-lg text-center font-medium">
                  Winner ID: {winnerId}
                </li>
              ))}
            </ul>
          </div>

          {/* Event Voucher and Bid Section */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-center">Event Voucher</h2>
            <div className="border-b border-gray-300 pb-4 mb-4 text-center">
              <img src={voucher.image} alt={`Voucher ${voucher.id}`} className="w-full h-48 mb-2 object-cover" />
              <p className="text-gray-600 mb-2">{voucher.description}</p>
            </div>

            {/* Bid Section */}
            <div className="flex items-center justify-center mt-4">
              <input
                type="number"
                value={bidAmount === null ? '' : bidAmount} // Display empty string if bidAmount is null
                onChange={(e) => {
                  setBidAmount(e.target.value === '' ? null : Number(e.target.value)); // Set bidAmount to null if input is empty
                  setErrorMessage(''); // Clear error message when user types
                }}
                className="border border-gray-300 rounded-lg p-2 w-1/2 text-center"
                placeholder="Enter the value"
                step="0.01"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-center mt-2">{errorMessage}</p> // Display error message in red
            )}
            <button
              onClick={handleBid}
              className="mt-4 bg-green-500 text-white py-1 px-5 rounded-lg w-16 ml-72"
              disabled={bidAmount === null} // Disable button if bidAmount is null
            >
              Bid
            </button>

            {/* Display Unique Bid ID */}
            {bidId && (
              <div className="mt-4 bg-gray-200 p-4 rounded-lg text-center">
                <p className="font-semibold">Your Bid ID:</p>
                <p className="text-lg">{bidId}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer className="mt-0" /> {/* Ensure there's no margin at the bottom */}
    </div>
  );
};

export default EventDetail;
