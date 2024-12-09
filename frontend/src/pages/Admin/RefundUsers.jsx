import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../Constants/index";
import Navbar from "../../components/Admin/Navbar";
import Sidebar from "../../components/Admin/Sidebar";

const RefundUsers = () => {
  const [refundUsers, setRefundUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefundUsers = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/admin/refundUsers`);
        console.log(data, "wwwwwwwwwwwwwwwww");
        setRefundUsers(data);
      } catch (error) {
        console.error("Error fetching refund users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefundUsers();
  }, []);

  const handleActionChange = async (orderId, productId, newAction) => {
    try {
      // Implement the API call to update refund status
      const response = await axios.put(
        `${SERVER_URL}/admin/updateRefundStatus`,
        {
          orderId,
          productId,
          newAction,
        }
      );

      window.location.reload();

      console.log("Refund status updated successfully");
    } catch (error) {
      console.error("Error updating refund status:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-6">Refund Users</h1>
          {refundUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">User</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Phone</th>
                    <th className="border px-4 py-2">Product</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Payment Method</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {refundUsers.map((order) =>
                    order.cartItems
                      .filter((item) => {
                        // Include items based on specific conditions
                        if (
                          order.paymentMethod === "COD" &&
                          item.status === "Returned"
                        ) {
                          return true;
                        }
                        if (
                          order.paymentMethod === "Razorpay" &&
                          ["Cancelled", "Returned"].includes(item.status)
                        ) {
                          return true;
                        }
                        return false;
                      })
                      .map((item, index) => (
                        <tr
                          key={`${order._id}-${index}`}
                          className="hover:bg-gray-100"
                        >
                          <td className="border px-4 py-2">
                            {order.userId?.username || "N/A"}
                          </td>
                          <td className="border px-4 py-2">
                            {order.userId?.email || "N/A"}
                          </td>
                          <td className="border px-4 py-2">
                            {order.userId?.phone || "N/A"}
                          </td>
                          <td className="border px-4 py-2">
                            {item.productId?.name || "N/A"}
                          </td>
                          <td className="border px-4 py-2">{item.status}</td>
                          <td className="border px-4 py-2">
                            {order.paymentMethod}
                          </td>
                          <td className="border px-4 py-2">
                            <select
                              value={
                                item.refundAmountStatus || " "
                              }
                              onChange={(e) =>
                                handleActionChange(
                                  order._id,
                                  item.productId._id,
                                  e.target.value
                                )
                              }
                              className={`w-full p-1 rounded ${
                                item.refundAmountStatus === "Completed"
                                  ? "text-green-600"
                                  : item.refundAmountStatus === "Pending"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              <option
                                value={item.refundAmountStatus}
                                className="text-yellow-600"
                              >
                                {item.refundAmountStatus}
                              </option>
                              <option
                                value="Refund Pending"
                                className="text-red-600"
                              >
                                Refund Pending
                              </option>
                              <option
                                value="Refund Completed"
                                className="text-green-600"
                              >
                                Refund Completed
                              </option>
                            </select>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-lg">No refund users found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundUsers;
