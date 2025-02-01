import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import axios from "axios";
import { useAppSelector } from "../../Redux/Store/store";
import { SERVER_URL } from "../../Constants";
import { Award, Sparkles, Tag, DollarSign, Ticket, Timer, } from "lucide-react";
import ChatBotButton from "../../components/User/chatBot";

const EventDetail = () => {
  const location = useLocation();
  const { voucher } = location.state || {};
  const [winners, setWinners] = useState([]);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const userId = user.id;


  const [bidAmount, setBidAmount] = useState("");
  const [bidId, setBidId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmEnabled, setConfirmEnabled] = useState(false);

  // Calculated minimum and maximum bid amounts
  const minBidAmount = 0.1;
  const maxBidAmount = voucher?.productPrice || 0;

  const handleBidAmountChange = (newAmount) => {
    // Ensure the new amount is within the specified range
    if (newAmount >= minBidAmount && newAmount <= maxBidAmount) {
      setBidAmount(parseFloat(newAmount.toFixed(1)));
      setErrorMessage("");
      setConfirmEnabled(false);
    } else {
      // Set error message if out of range
      setErrorMessage(`Bid amount must be between ₹${minBidAmount} and ₹${maxBidAmount}`);
    }
  };

  const handleIncrement = () => {
    const newAmount = Math.min(bidAmount + 0.1, maxBidAmount);
    handleBidAmountChange(newAmount);
  };

  const handleDecrement = () => {
    const newAmount = Math.max(bidAmount - 0.1, minBidAmount);
    handleBidAmountChange(newAmount);
  };

  const handleBid = () => {
    if (bidAmount < minBidAmount || bidAmount > maxBidAmount) {
      setErrorMessage(`Bid amount must be between ₹${minBidAmount} and ₹${maxBidAmount}`);
      return;
    }
    
    const uniqueId = "BID-" + Math.random().toString(36).substr(2, 9);
    setBidId(uniqueId);
    setConfirmEnabled(true);
    setErrorMessage("");
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
        navigate("/event");
      }
    } catch (error) {
      setErrorMessage("Failed to submit bid. Please try again.");
    }
  };



  

 

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/voucher/getWinners`, {
          params: { voucherId: voucher._id },
        });
        const currentTime = new Date().getTime();
        const validWinners = response.data.filter(
          (winner) => new Date(winner.endTime).getTime() > currentTime
        );
        setWinners(validWinners);
      } catch (error) {
        console.error("Failed to fetch winners:", error);
      }
    };

    if (voucher?._id) {
      fetchWinners();
    }
  }, [voucher]);

  if (!voucher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Event Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Winners Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 backdrop-blur-lg bg-opacity-95">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-bold">Winners</h2>
              </div>
              <div className="space-y-4">
                {winners.length > 0 ? (
                  winners.map((winner) => (
                    <div
                      key={winner.id}
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-100 transition-transform hover:scale-105"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {winner.prize}
                          </p>
                          <p className="text-sm text-gray-500 font-bold">
                            ID: {winner.winningBidId.bidId}
                          </p>
                          <p className="text-sm text-gray-500">
                            Name: {winner.userId.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            State: {winner.userId.currentAddress.state}
                          </p>
                        </div>
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No winners selected</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Voucher Details Card */}
            <div className="bg-white backdrop-blur-lg bg-opacity-95 rounded-xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="space-y-8">
                  {/* Top Section: Image and Details Side by Side */}
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side - Voucher Image */}
                    <div className="lg:w-1/2">
                      <div className="relative rounded-xl overflow-hidden shadow-lg group h-72">
                        <img
                          src={voucher.imageUrl}
                          alt="Voucher"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white font-semibold">
                            {voucher.details}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="lg:w-1/2 grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg transform hover:scale-102 transition-all duration-200 hover:bg-gray-100">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Tag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Product Name
                          </p>
                          <p className="text-gray-900 font-semibold truncate">
                            {voucher.product_name || "Premium Product"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg transform hover:scale-102 transition-all duration-200 hover:bg-gray-100">
                        <div className="bg-green-100 p-2 rounded-full">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Product Price
                          </p>
                          <p className="text-gray-900 font-semibold">
                            ₹{voucher.productPrice}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg transform hover:scale-102 transition-all duration-200 hover:bg-gray-100">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Ticket className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Voucher Value
                          </p>
                          <p className="text-gray-900 font-semibold">
                            ₹{voucher.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bidding Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 space-y-4">
        <div className="relative">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Your Bid Amount
          </label>
          <div className="flex items-center">
            <div className="relative flex-grow mr-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => {
                  const value = parseFloat(parseFloat(e.target.value).toFixed(1));
                  handleBidAmountChange(value);
                }}
                className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter amount"
                step="0.1"
                min={minBidAmount}
                max={maxBidAmount}
              />
            </div>
            
          </div>
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

        <div className="flex gap-4 justify-end">
          <button
            onClick={handleBid}
            disabled={bidAmount < minBidAmount || bidAmount > maxBidAmount}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
            hover:from-blue-700 hover:to-purple-700 transition-all duration-200 
            disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl
            transform hover:-translate-y-0.5"
          >
            Submit
          </button>
        </div>
      </div>

            {/* Bid Confirmation Section */}
            {bidId && (
              <div className="bg-gradient-to-r from-green-50 to-green-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Bid Confirmation
                </h3>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-gray-600">Unique ID:</span>
                  <span className="font-mono font-medium text-gray-800">
                    {bidId}
                  </span>
                </div>
                {confirmEnabled && (
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleConfirm}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg 
          hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium
          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer className="mt-8" />
      <div className="fixed bottom-8 right-8 z-50">
        <ChatBotButton />
      </div>
    </div>
  );
};

export default EventDetail;
