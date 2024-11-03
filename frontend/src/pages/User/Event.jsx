import React, { useState, useEffect } from 'react';
import { Gift, Award, Sparkles, Clock, ChevronRight } from 'lucide-react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { SERVER_URL } from '../../Constants';
import axios from 'axios';

const EventPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/voucher/getVouchers`);
        setVouchers(response.data); // Assuming response.data contains the array of vouchers
      } catch (error) {
        console.error('Failed to fetch vouchers:', error);
        // Display a message to the user or set a state to show an error message
      }
    };
    fetchVouchers();
  }, []);

  const winners = [
    { id: 'W001', prize: 'Gold Winner', date: '2024-03-01' },
    { id: 'W002', prize: 'Silver Winner', date: '2024-03-01' },
    { id: 'W003', prize: 'Bronze Winner', date: '2024-03-01' },
    { id: 'W004', prize: 'Lucky Draw', date: '2024-03-01' },
    { id: 'W005', prize: 'Special Prize', date: '2024-03-01' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Winners Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-bold">Winners</h2>
              </div>
              <div className="space-y-4">
                {winners.map((winner) => (
                  <div
                    key={winner.id}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-100 transition-transform hover:scale-105"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{winner.prize}</p>
                        <p className="text-sm text-gray-500">ID: {winner.id}</p>
                      </div>
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vouchers Section */}
          <div className="lg:col-span-2">
            {/* Vouchers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vouchers.map((voucher) => (
                <div
                  key={voucher._id}
                  className="relative group"
                  onMouseEnter={() => setHoveredCard(voucher._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`bg-blue-500 rounded-xl p-6 transform transition-all duration-300 
                    ${hoveredCard === voucher._id ? 'scale-105' : 'scale-100'} shadow-lg`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <img src="https://via.placeholder.com/150" alt="Voucher" className="mb-4 rounded-md" />
                        <h3 className="text-xl font-bold text-white mt-4">{voucher.voucher_name}</h3>
                        <p className="text-white text-opacity-90 mt-2">{voucher.details}</p>
                      </div>
                      <div className="text-3xl font-bold text-white">{voucher.price}</div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center text-white text-opacity-90">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">Valid until {new Date(voucher.end_time).toLocaleDateString()}</span>
                      </div>
                      <button className="flex items-center text-white hover:text-opacity-75 transition-colors">
                        <span className="mr-1">Claim</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventPage;
