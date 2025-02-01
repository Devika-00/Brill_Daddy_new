import React, { useState, useEffect } from "react";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import axios from "axios"; // Import axios
import { useAppSelector } from "../../Redux/Store/store";
import { SERVER_URL } from "../../Constants";
import ChatBotButton from "../../components/User/chatBot";

const Wallet = () => {
  const user = useAppSelector((state) => state.user);
  const userId = user.id;

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchWalletData = async () => {
      try {
        // Fetch wallet data using the userId
        const response = await axios.get(`${SERVER_URL}/user/wallet/${userId}`);
        const data = response.data; // The data returned by the API
        setBalance(data.balance || 0);
        
        const sortedTransactions = (data.transactions || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setTransactions(sortedTransactions);
      } catch (err) {
        setError("Failed to fetch wallet data");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Balance Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Current Balance
            </h2>
            <div className="text-3xl md:text-4xl font-bold text-gray-900">
              ₹{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Transactions Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Recent Transactions
            </h2>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-gray-500">No transaction history</div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "credit"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(transaction.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                ))
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

export default Wallet;
