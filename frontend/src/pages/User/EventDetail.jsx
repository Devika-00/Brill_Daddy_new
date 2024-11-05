import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import axios from 'axios';
import { useAppSelector } from '../../Redux/Store/store';
import { SERVER_URL } from "../../Constants";

const EventDetail = () => {
  const location = useLocation();
  const { voucher } = location.state || {};
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const userId = user.id;

  const winners = ['W001', 'W002', 'W003', 'W004', 'W005'];
  const [bidAmount, setBidAmount] = useState(null);
  const [bidId, setBidId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmEnabled, setConfirmEnabled] = useState(false);

  const handleBid = () => {
    if (bidAmount === null) {
      setErrorMessage('Please enter a value.');
      return;
    }
    const uniqueId = 'BID-' + Math.random().toString(36).substr(2, 9);
    setBidId(uniqueId);
    setConfirmEnabled(true);
    setErrorMessage('');
  };

  const handleConfirm = async () => {
    try {
      const voucherId = voucher._id;
      const response = await axios.post(`${SERVER_URL}/bid/confirmBid`, {
        userId,
        voucherId,
        bidAmount,
        bidId,
      });
      if (response.status === 201) {
        navigate('/event');
      }
    } catch (error) {
      setErrorMessage('Failed to submit bid. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Event Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Winners Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <div className="flex items-center gap-2 mb-6">
              <svg 
                className="w-6 h-6 text-yellow-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-800">Winners Gallery</h2>
            </div>

            <div className="space-y-3">
              {winners.map((winnerId, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4"
                >
                  <div className="bg-yellow-200 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    <span className="font-semibold text-yellow-700">{index + 1}</span>
                  </div>
                  <span className="text-lg font-medium text-gray-700">{winnerId}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Voucher and Bidding Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <div className="flex items-center gap-2 mb-6">
              <svg 
                className="w-6 h-6 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-800">Place Your Bid</h2>
            </div>

            {voucher ? (
              <div className="space-y-6">
                <div>
                  <img
                    src={voucher.imageUrl}
                    alt={`Voucher ${voucher._id}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-lg">
                      {voucher.details}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="number"
                      value={bidAmount === null ? '' : bidAmount}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : parseFloat(parseFloat(e.target.value).toFixed(1));
                        setBidAmount(value);
                        setErrorMessage('');
                        setConfirmEnabled(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your bid amount"
                      step="0.1"
                    />
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                      onClick={handleBid}
                      disabled={bidAmount === null}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg 
                               hover:from-green-600 hover:to-emerald-700 transition-all duration-200 
                               disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      Place Bid
                    </button>

                    {confirmEnabled && (
                      <button
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg 
                                 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                      >
                        Confirm Bid
                      </button>
                    )}
                  </div>
                </div>

                {bidId && (
                  <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Your Bid Details
                    </h3>
                    <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm">
                      <span className="text-gray-600">Bid ID:</span>
                      <span className="font-mono font-medium text-gray-800">{bidId}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No voucher available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer className="mt-8" />
    </div>
  );
};

export default EventDetail;