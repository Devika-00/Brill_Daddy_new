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
    navigate("/eventdetail", { state: { voucher } }); // Update the route and state
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mt-10 ml-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Payment Information</h2>

        {voucher && (
          <div className="mb-4 text-center">
            <img src={voucher.imageUrl} alt={`Voucher ${voucher._id}`} className="w-full h-48 mb-2 object-cover" />
            <p className="text-gray-600 mb-2">{voucher.details}</p>
          </div>
        )}

        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
          </div>
          <div className="flex mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                className="border border-gray-300 p-2 w-full rounded-md"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="border border-gray-300 p-2 w-full rounded-md"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Pay Now
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
