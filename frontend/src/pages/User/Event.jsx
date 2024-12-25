import React, { useState, useEffect } from "react";
import { Gift, Award, Sparkles, Clock, Tag, Package } from "lucide-react";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { SERVER_URL } from "../../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Redux/Store/store";
import ChatBotButton from "../../components/User/chatBot";
import CountdownTimer from "../../components/User/CountDownTimer";

const EventPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [vouchers, setVouchers] = useState([]);

  const [winners, setWinners] = useState([]);
  const navigate = useNavigate();
  const [firstFreeVoucher, setFirstFreeVoucher] = useState(null);
  const [eligibleFreeVouchers, setEligibleFreeVouchers] = useState([]);


  const user = useAppSelector((state) => state.user);
  const userId = user.id;

  const gradients = [
    "bg-gradient-to-r from-purple-500 to-indigo-600",
    "bg-gradient-to-r from-pink-500 to-rose-500",
    "bg-gradient-to-r from-green-500 to-emerald-500",
    "bg-gradient-to-r from-amber-500 to-orange-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-purple-500 to-indigo-600",
    "bg-gradient-to-r from-pink-500 to-rose-500",
  ];

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/voucher/getVouchers`);
        console.log(response,"nnnnnnnnnnnnnnnnnnnnn")
        const currentTime = new Date().getTime();

        const validVouchers = response.data.filter((voucher) => {
          const isEligibleUser = voucher.eligible_rebid_users.includes(userId);
          const isRebidActive = voucher.rebid_active && new Date(voucher.rebid_end_time).getTime() > currentTime;
          const isActiveVoucher = new Date(voucher.start_time).getTime() <= currentTime && new Date(voucher.end_time).getTime() > currentTime;
          
          return (isEligibleUser && isRebidActive) || isActiveVoucher;
        });

        const freeVouchers = validVouchers.filter((voucher) => voucher.price === 0).slice(0, 2);
        const paidVouchers = validVouchers.filter((voucher) => voucher.price !== 0);

        setVouchers([...freeVouchers, ...paidVouchers]);

        // Fetch eligible free vouchers
        const freeVoucherResponse = await axios.get(
          `${SERVER_URL}/voucher/getEligibleFreeVouchers`
        );
        setEligibleFreeVouchers(freeVoucherResponse.data.eligibleVouchers);

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

 

  const handleClaimVoucher = (voucher) => {
    const isEligibleForFree = voucher.eligible_rebid_users.includes(userId) && voucher.rebid_active;

    if (isEligibleForFree || voucher.price === 0 ) {
      navigate(`/eventDetail`, { state: { voucher } });
    } else {
      navigate(`/payment/${voucher._id}`, { state: { voucher } });
    }
  };

  console.log(vouchers,"aaaaaaaaaaaaaaaaaa");
  console.log(winners,"bbbbbbbbbbbbbbbb");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
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

          {/* Vouchers Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
              {vouchers.length > 0 ? (
                vouchers.map((voucher, index) => {
                  // Check if the voucher is eligible for free claiming
                  const isEligibleForFree = voucher.eligible_rebid_users.includes(userId) && voucher.rebid_active;

                  return (
                    <div
                      key={voucher._id}
                      className="relative group"
                      onMouseEnter={() => setHoveredCard(voucher._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => handleClaimVoucher(voucher)}
                    >
                      <div
                        className={`${
                          gradients[index % gradients.length]
                        } rounded-xl p-6 transform transition-all duration-300 ${
                          hoveredCard === voucher._id
                            ? "scale-105 shadow-2xl"
                            : "scale-100 shadow-lg"
                        }`}
                      >
                        {/*counter */}
                        <CountdownTimer voucher={voucher} />

                        {/* Price or Free Tag */}
                        <div className="absolute -right-2 -top-2 transform rotate-12">
                          <div
                            className={`${
                              isEligibleForFree  || voucher.price === 0 ? "bg-green-500" : "bg-yellow-400"
                            } text-gray-900 font-bold px-8 py-2 rounded-lg shadow-lg relative`}
                          >
                            <div className="absolute -bottom-2 right-0 w-0 h-0 border-t-8 border-l-8 border-transparent border-yellow-600" />
                            {isEligibleForFree || voucher.price === 0 ? "Free" : `₹${voucher.price}`}
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <div className="flex-grow">
                            {/* Image */}
                            <div className="relative w-full h-40 mb-2 flex items-center justify-center overflow-hidden rounded-lg">
                              <img
                                src={voucher.imageUrl}
                                alt="Voucher"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300 mb-2 ml-8"
                                style={{ width: "200px", height: "150px" }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>

                            {/* Voucher Name and Details */}
                            <h3 className="text-xl font-bold text-white mt-2 mb-1">
                              {voucher.voucher_name}
                            </h3>
                            <div className="bg-white/10 rounded-lg p-3 space-y-2">
                              <div className="flex items-center text-white">
                                <Package className="w-4 h-4 mr-2" />
                                <span className="font-medium">
                                  {voucher.product_name || "Product Name"}
                                </span>
                              </div>
                              <div className="flex items-center text-white">
                                <Tag className="w-4 h-4 mr-2" />
                                <span className="font-medium">
                                  MRP: ₹{voucher.productPrice || "N/A"}
                                </span>
                              </div>
                            </div>
                            {/* <p className="text-white text-opacity-90 mt-2">
                              {voucher.details}
                            </p> */}
                          </div>

                          {/* Validity and Claim Button */}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center text-white text-opacity-90">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm">
                                Valid until {new Date(voucher.end_time).toLocaleDateString()}
                              </span>
                            </div>
                            <button
                            className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:scale-105 transition-transform duration-300 flex items-center"
                            onClick={() => handleClaimVoucher(voucher)}
                          >
                            <Gift className="w-4 h-4 mr-2" />
                            Claim now
                          </button>
                          </div>
                        </div>
                      </div>
                      {/* Optional: Free Voucher Badge */}
                      {/* {isEligibleForFree || voucher.price === 0 && (
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-sm px-2 py-1 rounded-md">
                          Free Voucher!
                        </div>
                      )} */}
                    </div>
                  );
                })
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
      <div className="fixed bottom-8 right-8 z-50">
        <ChatBotButton />
      </div>
    </div>
  );
};

export default EventPage;
