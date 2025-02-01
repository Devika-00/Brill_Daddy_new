import React, { useState, useEffect } from "react";
import axios from "axios";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { useAppSelector } from "../../Redux/Store/store";
import { SERVER_URL } from "../../Constants";
import { Gift, Tag, DollarSign, IndianRupeeIcon } from "lucide-react";
import ChatBotButton from "../../components/User/chatBot";

const BidProductsPage = () => {
  const [groupedBids, setGroupedBids] = useState({});
  const [voucherDetails, setVoucherDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/bids/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const grouped = response.data; // Grouped data by voucherId
        setGroupedBids(grouped);

        // Fetch voucher details for each voucherId
        const voucherIds = Object.keys(grouped);
        const voucherPromises = voucherIds.map((id) =>
          axios.get(`${SERVER_URL}/user/vouchers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const voucherResponses = await Promise.all(voucherPromises);

        console.log(
          "Voucher Response Data:",
          voucherResponses.map((res) => res.data)
        );

        const details = voucherResponses.flatMap((res) => {
            // Ensure that res.data is an array and has at least one item
            if (Array.isArray(res.data) && res.data.length > 0) {
              return res.data[0]; // If it's valid, return the first item
            }
            return []; // Return an empty array if the data is not valid
          })
          .reduce((acc, voucher) => {
            if (voucher && voucher._id) { // Ensure the voucher has an _id
              const voucherId = voucher._id;
              acc[voucherId] = voucher;
            }
            return acc;
          }, {});



        
          console.log("Mapped Voucher Details:", details);

        setVoucherDetails(details);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bids or voucher details:", err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchBids();
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

  if (Object.keys(groupedBids).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No bids found.
      </div>
    );
  }

  console.log(groupedBids, "kkkkkkkkkkkkkkkkkkkkkkkk");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Your Voucher Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedBids).map(([voucherId, bids]) => {
            const details = voucherDetails[voucherId]; // Match voucherDetails by voucherId

            return (
              <div
                key={voucherId}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col ml-10"
              >
                <div className="p-4 flex-grow">
                  {/* Voucher Details */}
                  {details ? (
                    <div className="flex items-center mb-4">
                      <img
                        src={details.imageUrl} // Use correct backend response field
                        alt={details.product_name} // Use correct backend response field
                        className="w-16 h-16 rounded-md object-cover mr-4"
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-700">
                          {details.product_name}
                        </h2>
                        <p className="text-gray-600 text-sm">
                          Product Price:{" "}
                          <span className="font-medium">₹{details.productPrice}</span>
                        </p>
                        <p className="text-gray-600 text-sm">
                          Voucher Price:{" "}
                          <span className="font-medium">₹{details.price}</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-500">
                      Details not found for this voucher.
                    </p>
                  )}

                  {/* List of Bid Amounts */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-600 mb-2">
                      Your Bids:
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      {bids.map((bid) => (
                        <li key={bid._id} className="flex items-center">
                          <IndianRupeeIcon className="mr-2 text-green-500 h-4" />
                        Amount:{" "}
                          <span className="ml-1 font-medium">
                            ₹{bid.bidAmount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
      <div className="fixed bottom-8 right-8 z-50">
        <ChatBotButton />
      </div>
    </div>
  );
};

export default BidProductsPage;
