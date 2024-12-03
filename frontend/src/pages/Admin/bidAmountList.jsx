import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Admin/Navbar";
import Sidebar from "../../components/Admin/Sidebar";
import { SERVER_URL } from "../../Constants";

const BidListPage = () => {
  const [bids, setBids] = useState({});
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBids, setLoadingBids] = useState(false);
  const [openVoucher, setOpenVoucher] = useState(null);

  // Fetch vouchers data
  const fetchVouchers = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/voucher/getVouchers`);
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  // Fetch bids for a specific voucher
  const fetchBidsForVoucher = async (voucherId) => {
    setLoadingBids(true);
    try {
      const response = await axios.get(
        `${SERVER_URL}/user/vouchers/bidamount/${voucherId}`
      );
      setBids((prev) => ({
        ...prev,
        [voucherId]: response.data, // Store bids specific to voucher
      }));
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoadingBids(false);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchVouchers();
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-semibold mb-4">Vouchers</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vouchers.map((voucher) => (
              <div
                key={voucher._id}
                className={`bg-white shadow-md rounded-md p-4 transition-all duration-300 ${
                  openVoucher === voucher._id ? "h-auto" : "h-48"
                }`}
              >
                {/* Top Section: Details */}
                <div className="flex">
                  {/* Left: Details */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{voucher.voucher_name}</h2>
                    <p className="text-sm text-gray-500">{voucher.product_name}</p>
                    <p className="text-sm text-gray-500">₹{voucher.price}</p>
                    <button
                      className="mt-4 bg-gray-500 text-white px-2 py-2 rounded-md hover:bg-gray-600 text-sm"
                      onClick={() => {
                        if (openVoucher === voucher._id) {
                          setOpenVoucher(null);
                        } else {
                          setOpenVoucher(voucher._id);
                          if (!bids[voucher._id]) {
                            fetchBidsForVoucher(voucher._id);
                          }
                        }
                      }}
                    >
                      {openVoucher === voucher._id ? "Close" : "View Bid Amounts"}
                    </button>
                  </div>

                  {/* Right: Image */}
                  <div className="w-32 h-32 ml-4">
                    <img
                      src={voucher.imageUrl}
                      alt={voucher.voucher_name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </div>

                {/* Bottom Section: Bids */}
                {openVoucher === voucher._id && (
                  <div className="mt-4 border-t pt-4">
                    {loadingBids ? (
                      <p>Loading bids...</p>
                    ) : bids[voucher._id] && bids[voucher._id].length > 0 ? (
                      <ul className="list-disc pl-6">
                        {bids[voucher._id].map((bid) => (
                          <li key={bid._id} className="text-gray-700">
                            {/* Bid ID: {bid.bidId} | Amount: ₹{bid.bidAmount} */}
                            Amount : ₹{bid.bidAmount}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No bids available.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidListPage;
