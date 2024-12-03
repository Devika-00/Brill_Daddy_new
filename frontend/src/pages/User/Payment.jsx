import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';

const PaymentPage = () => {
  const location = useLocation(); 
  const { voucher } = location.state || {}; 
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    // Logic to process payment goes here
    console.log("Processing payment for card:", cardNumber);
    alert("Payment successful!");

    // Pass voucher information when navigating to the event detail page
    navigate("/eventdetail", { state: { voucher } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white flex flex-col">
      <OrginalNavbar />
      <NavbarWithMenu />
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Payment Information</h2>

          {voucher && (
            <div className="mb-6 text-center">
              <img 
                src={voucher.imageUrl} 
                alt={`Voucher ${voucher._id}`} 
                className="w-full h-80 object-cover rounded-lg mb-4 shadow-md"
              />
              <p className="text-gray-600 text-sm">{voucher.details}</p>
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Pay Now
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;