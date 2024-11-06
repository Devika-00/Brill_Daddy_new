import React, { useState, useEffect } from "react";
import { Gift, Award, Sparkles, Clock } from "lucide-react";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { SERVER_URL } from "../../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Redux/Store/store";

const EventPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [winners, setWinners] = useState([]);
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user);
  const userId = user.id;

  const gradients = [
    "bg-gradient-to-r from-purple-500 to-indigo-600",
    "bg-gradient-to-r from-pink-500 to-rose-500",
    "bg-gradient-to-r from-green-500 to-emerald-500",
    "bg-gradient-to-r from-amber-500 to-orange-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
  ];

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/voucher/getVouchers`);
        const currentTime = new Date().getTime();

        // Filter vouchers that have started and are not expired
        const validVouchers = response.data.filter(
          (voucher) =>
            new Date(voucher.start_time).getTime() <= currentTime &&
            new Date(voucher.end_time).getTime() > currentTime
        );
        setVouchers(validVouchers);

        // Fetch winners
        const winnersResponse = await axios.get(
          `${SERVER_URL}/voucher/getWinners`
        );
        const validWinners = winnersResponse.data.filter(
          (winner) => new Date(winner.endTime).getTime() > currentTime
        );
        setWinners(validWinners);
      } catch (error) {
        console.error("Failed to fetch vouchers or winners:", error);
      }
    };

    fetchVouchers();

    // Set interval to fetch every minute (adjust as necessary)
    const intervalId = setInterval(fetchVouchers, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  console.log(winners, "bbbbbbbbbbbbbbbbbbbbbbbbb");

  const handleClaimVoucher = (voucher) => {
    navigate(`/payment/${voucher._id}`, { state: { voucher } });
  };

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

          {/* Vouchers Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vouchers.length > 0 ? (
                vouchers.map((voucher, index) => (
                  <div
                    key={voucher._id}
                    className="relative group"
                    onMouseEnter={() => setHoveredCard(voucher._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className={`${
                        gradients[index % gradients.length]
                      } rounded-xl p-6 transform transition-all duration-300
            ${
              hoveredCard === voucher._id
                ? "scale-105 shadow-2xl"
                : "scale-100 shadow-lg"
            }`}
                    >
                      {/* Price Tag */}
                      <div className="absolute -right-2 -top-2 transform rotate-12">
                        <div className="bg-yellow-400 text-gray-900 font-bold px-8 py-2 rounded-lg shadow-lg relative">
                          <div className="absolute -bottom-2 right-0 w-0 h-0 border-t-8 border-l-8 border-transparent border-yellow-600" />
                          ₹{voucher.price}
                        </div>
                      </div>

                      <div className="flex flex-col h-full">
                        <div className="flex-grow">
                          <div className="relative w-full h-40 mb-2 flex items-center justify-center overflow-hidden rounded-lg">
                            <img
                              src={voucher.imageUrl}
                              alt="Voucher"
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300 mb-2"
                              style={{ width: "200px", height: "150px" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </div>
                          <h3 className="text-xl font-bold text-white mt-4">
                            {voucher.voucher_name}
                          </h3>
                          <p className="text-white text-opacity-90 mt-2">
                            {voucher.details}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center text-white text-opacity-90">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              Valid until{" "}
                              {new Date(voucher.end_time).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
                            onClick={() => handleClaimVoucher(voucher)}
                          >
                            <span className="mr-1">Claim Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-blue-900 font-bold text-lg">No Vouchers</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventPage;
