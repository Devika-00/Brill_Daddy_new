import React from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';

const EventPage = () => {
  const winners = ['W001', 'W002', 'W003', 'W004', 'W005'];

  const vouchers = [
    {
      id: 'V001',
      image: 'https://img.freepik.com/premium-vector/professional-gift-voucher-coupon-design_771884-3.jpg',
      description: '10% Off on Electronics',
    },
    {
      id: 'V002',
      image: 'https://img.freepik.com/premium-vector/professional-gift-voucher-coupon-design_771884-3.jpg',
      description: 'Buy 1 Get 1 Free on Apparel',
    },
    {
      id: 'V003',
      image: 'https://img.freepik.com/premium-vector/professional-gift-voucher-coupon-design_771884-3.jpg',
      description: '20% Discount on Groceries',
    },
    {
      id: 'V004',
      image: 'https://img.freepik.com/premium-vector/professional-gift-voucher-coupon-design_771884-3.jpg',
      description: 'Flat ₹500 Off on Furniture',
    },
    {
      id: 'V005',
      image: 'https://img.freepik.com/premium-vector/professional-gift-voucher-coupon-design_771884-3.jpg',
      description: 'Free Shipping on Orders Above ₹1000',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white py-0"> {/* Removed extra padding */}
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 mt-5">Event Page</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2"> {/* Decreased gap from 8 to 4 */}
          {/* Winners List */}
          <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-sm mx-auto h-96 sticky top-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Winners</h2>
            <ul className="space-y-2">
              {winners.map((winnerId, index) => (
                <li key={index} className="border border-gray-300 p-2 rounded-lg text-center font-medium">
                  Winner ID: {winnerId}
                </li>
              ))}
            </ul>
          </div>

          {/* Event Vouchers */}
          <div className="bg-white shadow-md rounded-lg p-4 w-full mx-auto ">
            <h2 className="text-xl font-semibold mb-4 text-center">Event Vouchers</h2>
            <ul className="space-y-4">
              {vouchers.map((voucher) => (
                <li key={voucher.id} className="border border-gray-300 p-2 rounded-lg flex flex-col items-center">
                  <img
                    src={voucher.image}
                    alt={`Voucher ${voucher.id}`}
                    className="w-full h-48 mb-2 object-cover"
                  />
                  <p className="text-gray-600 text-center">{voucher.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventPage;
