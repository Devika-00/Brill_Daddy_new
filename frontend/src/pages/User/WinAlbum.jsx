import React, { useState, useEffect } from 'react';
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import axios from 'axios';
import { Clock, Tag, Gift, Trophy } from 'lucide-react';
import { useAppSelector } from "../../Redux/Store/store";
import { SERVER_URL } from "../../Constants";
import ChatBotButton from "../../components/User/chatBot";

const WinnerAlbumPage = () => {
  const [winnerDetails, setWinnerDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;

  useEffect(() => {
    const fetchWinnerDetails = async () => {
      try {
        const winnerResponse = await axios.get(`${SERVER_URL}/user/winners/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const winners = winnerResponse.data;

        if (!winners || winners.length === 0) {
          setWinnerDetails([]);
          setLoading(false);
          return;
        }

        const voucherRequests = winners.map((winner) =>
          axios.get(`${SERVER_URL}/user/vouchers/${winner.voucherId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );

        const voucherResponses = await Promise.all(voucherRequests);

        const detailedWinners = winners.map((winner, index) => ({
          ...winner,
          voucher: voucherResponses[index]?.data || {},
        }));

        setWinnerDetails(detailedWinners);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch winner details');
        setLoading(false);
      }
    };

    if (userId) {
      fetchWinnerDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!winnerDetails.length) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No winning items found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {winnerDetails.map((winner) => (
            <div
              key={winner._id}
              className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden"
            >
              {/* Winner Details */}
              <div className="w-full md:w-2/3 p-4 space-y-4">
                <h1 className="text-lg font-bold text-gray-800">
                  <Trophy className="inline-block mr-2 text-yellow-500" />
                  Congratulations! You've Won
                </h1>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Tag className="mr-2 text-blue-500" />
                    <span>
                      <strong>Product:</strong> {winner.voucher[0]?.product_name || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Gift className="mr-2 text-green-500" />
                    <span>
                      <strong>Voucher:</strong> {winner.voucher[0]?.voucher_name || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="mr-2 text-purple-500" />
                    <span>
                      <strong>Won At:</strong> {new Date(winner.wonAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Tag className="mr-2 text-red-500" />
                    <span>
                      <strong>Winning Amount:</strong> {winner.winningAmount}
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Voucher Details</h3>
                  <p className="text-gray-700 text-xs">
                    {winner.voucher[0]?.details || 'No additional details available'}
                  </p>
                </div>
              </div>

              {/* Product Image */}
              <div className="w-full md:w-1/3 flex items-center justify-center  p-4 mr-3">
                <img
                  src={winner.voucher[0]?.imageUrl || '/placeholder-image.png'}
                  alt={winner.voucher[0]?.product_name || 'Winner Item'}
                  className="max-w-full h-40 object-contain rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      <div className="fixed bottom-8 right-8 z-50">
        <ChatBotButton />
      </div>
    </div>
  );
};

export default WinnerAlbumPage;
