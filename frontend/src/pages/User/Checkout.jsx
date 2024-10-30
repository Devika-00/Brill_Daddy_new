import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import axios from 'axios';
import { useAppSelector } from '../../Redux/Store/store';
import { SERVER_URL } from "../../Constants";

const Checkout = () => {
  const location = useLocation();
  const { total, cartItems } = location.state; // Access passed cart data
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  
  const navigate = useNavigate();

  const [addressData, setAddressData] = useState({
    userName: '',
    addressLine: '',
    street: '',
    pincode: '',
    state: '',
    flatNumber: '',
    addressType: 'Home',
    phoneNumber: ''
  });
  


  const user = useAppSelector((state) => state.user);
  const userId = user.id;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/addresses/${userId}`); 
        console.log(response.data);
        setAddresses(response.data); // Assuming the API returns an array of addresses
      } catch (error) {
        console.error('Error fetching addresses:', error);
        alert('Failed to load addresses');
      }
    };
    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/user/addAddress`, { 
        ...addressData, 
        userId 
      });

      if (response.status === 200) {
        // Fetch updated addresses after saving
        const updatedAddresses = await axios.get(`${SERVER_URL}/user/addresses/${userId}`);
        setAddresses(updatedAddresses.data);
        setShowModal(false);
        // Reset address data
        setAddressData({
          userName: '',
          addressLine: '',
          street: '',
          pincode: '',
          state: '',
          flatNumber: '',
          addressType: 'Home',
          phoneNumber: ''
        });
      } else {
        console.error('Failed to save address');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  console.log(selectedAddress,"llllllllllllll")

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !paymentMethod) {
      alert("Please select both an address and a payment method before placing the order.");
      return;
    }
  
    try {
      const orderData = {
        userId,
        total,
        cartItems,
        selectedAddressId: selectedAddress._id,
        paymentMethod,
        paid: paymentMethod === "COD" ? false : true,
        orderStatus: "Pending"  
      };
      await axios.post(`${SERVER_URL}/user/checkout/placeorder`, orderData);
      navigate('/orderSuccessful', { state: { orderedItems: cartItems, userId } });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="checkout-area mt-5 ml-5 mr-5">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <form onSubmit={(e) => { e.preventDefault(); }}>
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="bg-white p-4 shadow-md rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">ADDRESS</h3>
                  <button
                    className="btn btn-dark bg-black text-white px-3 py-2 rounded"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    Add
                  </button>
                </div>

                <div className="different-address">
                  <div className="grid gap-4">
                    {addresses.map((address, index) => (
                      <div className="col-span-1" key={index}>
                        <div className="bg-gray-100 p-4 rounded shadow">
                          <div className="form-check">
                            <input
                              className="form-check-input mr-2"
                              type="radio"
                              name="addressId"
                              id={`address${index}`}
                              required
                              onChange={() => setSelectedAddress(address)}
                            />
                            <label htmlFor={`address${index}`} className="form-check-label">
                              <h5 className="font-semibold">{address.userName}</h5>
                              <p>{`${address.addressLine}, ${address.street}, ${address.state}, ${address.pincode}`}</p>
                              <p>Mobile: {address.phoneNumber}</p>
                              <p>Type: {address.addressType}</p>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 shadow-md rounded">
                <h3 className="text-lg font-semibold mb-4">Your Order</h3>
                <div className="table-responsive">
                  <table className="min-w-full bg-white">
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr className="border-b" key={index}>
                          <td className="py-2 px-4">
                            <p>{item.productId.name} <strong className="ml-2">× {item.quantity}</strong></p>
                          </td>
                          <td className="py-2 px-4 text-right">
                            ₹{item.productId.salePrice * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th className="py-2 px-4 text-left">Order Total</th>
                        <td className="py-2 px-4 text-right">₹{total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold">Payment Options</h3>
                  <div className="mt-2">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="ml-2">Cash on Delivery</span>
                    </label>
                  </div>
                  <div className="mt-2">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Razorpay"
                        checked={paymentMethod === "Razorpay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="ml-2">Razorpay</span>
                    </label>
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handlePlaceOrder}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Address Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleAddAddress(); }}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="userName"
                      placeholder="Name"
                      value={addressData.userName}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                    <input
                      type="text"
                      name="addressLine"
                      placeholder="Address Line"
                      value={addressData.addressLine}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                    <input
                      type="text"
                      name="street"
                      placeholder="Street"
                      value={addressData.street}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={addressData.state}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={addressData.pincode}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                    <input
                      type="text"
                      name="flatNumber"
                      placeholder="Flat Number"
                      value={addressData.flatNumber}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                    />
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={addressData.phoneNumber}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                    <select
                      name="addressType"
                      value={addressData.addressType}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
