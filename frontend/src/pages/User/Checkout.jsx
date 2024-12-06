//frontend/src/pages/User/Checkout.jsx
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
  const { total, gst, cartItems } = location.state; // Access passed cart data
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
  
  const [errors, setErrors] = useState({
    userName: '',
    addressLine: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        if (errors.userName || errors.addressLine) {
      alert('Please resolve the errors before submitting.');
      return;
    }
    try {
      const response = await axios.post(`${SERVER_URL}/user/addAddress`, { 
        ...addressData, 
        userId 
      });

      setIsLoading(true);
      setErrorMessage("");

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
        setErrorMessage("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("Network error, please try again.");
    } finally {
      setTimeout(() => {
        setIsLoading(false); // Stop loading after 20 seconds
      }, 20000);
    }
  };

  // const handlePlaceOrder = async () => {
  //   if (!selectedAddress || !paymentMethod) {
  //     alert("Please select both an address and a payment method before placing the order.");
  //     return;
  //   }
  
  //   try {
  //     const orderData = {
  //       userId,
  //       total,
  //       cartItems,
  //       selectedAddressId: selectedAddress._id,
  //       paymentMethod,
  //       paid: paymentMethod === "COD" ? false : true,
  //       orderStatus: "Pending"  
  //     };
  //     await axios.post(`${SERVER_URL}/user/checkout/placeorder`, orderData);
  //     navigate('/orderSuccessful', { state: { orderedItems: cartItems, userId } });
  //   } catch (error) {
  //     console.error('Error placing order:', error);
  //     alert('Failed to place order');
  //   }
  // };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !paymentMethod) {
        alert("Please select both an address and a payment method before placing the order.");
        return;
    }

    if (paymentMethod === "Razorpay") {
        try {
            // Call backend to create order
            const { data } = await axios.post(`${SERVER_URL}/user/checkout/createOrder`, {
                amount: total,
                receipt: `receipt_${Date.now()}`
            });

            const options = {
                key: "rzp_test_Je6Htj61yVkGEb", // Replace with Razorpay Key ID
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Brill daddy",
                description: "Order Payment",
                order_id: data.order.id,
                handler: async (response) => {
                    // Verify the payment signature
                    const verifyResponse = await axios.post(`${SERVER_URL}/user/checkout/verifyPayment`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (verifyResponse.data.success) {
                        // Place the order
                        const orderData = {
                            userId,
                            total,
                            cartItems,
                            selectedAddressId: selectedAddress._id,
                            paymentMethod,
                            paid: true,
                            orderStatus: "Paid",
                        };
                        await axios.post(`${SERVER_URL}/user/checkout/placeorder`, orderData);
                        navigate('/orderSuccessful', { state: { orderedItems: cartItems, userId } });
                    } else {
                        alert('Payment verification failed. Please try again.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone,
                },
                notes: {
                    address: selectedAddress.addressLine,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Error during payment:', error);
            alert('Payment failed. Please try again.');
        }
    } else {
        // Handle COD
        const orderData = {
            userId,
            total,
            cartItems,
            selectedAddressId: selectedAddress._id,
            paymentMethod,
            paid: false,
            orderStatus: "Pending",
        };
        await axios.post(`${SERVER_URL}/user/checkout/placeorder`, orderData);
        navigate('/orderSuccessful', { state: { orderedItems: cartItems, userId } });
    }
};
  

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'userName') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = 'Name should only contain letters.';
      }
    }
  
    if (name === 'addressLine') {
      if (value.length > 50) {
        error = 'Address cannot exceed 50 characters.';
      }
    }
  
    if (name === 'street') {
      if (value.length > 10) {
        error = 'Street should not exceed 10 characters.';
      }
    }
  
    if (name === 'state') {
      if (!/^[a-zA-Z]*$/.test(value)) {
        error = 'State should only contain letters.';
      }
    }
  
    if (name === 'pincode') {
      if (!/^\d{1,7}$/.test(value)) {
        error = 'Pincode must be a maximum of 7 digits and should not contain letters.';
      }
    }
  
    if (name === 'flatNumber') {
      if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1,10}$/.test(value)) {
        error = 'Flat Number must contain letters, numbers, and special characters, and should not exceed 10 characters.';
      }
    }
  
    if (name === 'phoneNumber') {
      if (!/^\d{1,10}$/.test(value.replace(/[^0-9]/g, ''))) {
        error = 'Phone Number must be a maximum of 10 digits. Letters are not allowed.';
      }
    }
  
    setErrors({ ...errors, [name]: error });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setAddressData({ ...addressData, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
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
                            ₹{item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th className="py-2 px-4 text-left">GST</th>
                        <td className="py-2 px-4 text-right">₹{gst}</td>
                      </tr>
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

          {/* Modal for adding address */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleAddAddress(); }}>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="userName"
                        placeholder="Name"
                        value={addressData.userName}
                        onChange={handleInputChange}
                        className="border rounded-lg p-2 w-full"
                        required
                      />
                      {errors.userName && (
                        <p className="text-red-600 text-sm mt-1">{errors.userName}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        name="addressLine"
                        placeholder="Address Line"
                        value={addressData.addressLine}
                        onChange={handleInputChange}
                        className="border rounded-lg p-2 w-full"
                        required
                      />
                      {errors.addressLine && (
                        <p className="text-red-600 text-sm mt-1">{errors.addressLine}</p>
                      )}
                    </div>

                    {/* Remaining form fields */}
                    <div>
                    <input
                      type="text"
                      name="street"
                      placeholder="Street"
                      value={addressData.street}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                                          {errors.street && (
                        <p className="text-red-600 text-sm mt-1">{errors.street}</p>
                      )}
                    </div>
                    <div>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={addressData.state}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                                                              {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                    <div>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={addressData.pincode}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                                                              {errors.pincode && (
                        <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                    <div>
                    <input
                      type="text"
                      name="flatNumber"
                      placeholder="Flat Number"
                      value={addressData.flatNumber}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                    />
                                                              {errors.flatNumber && (
                        <p className="text-red-600 text-sm mt-1">{errors.flatNumber}</p>
                      )}
                    </div>
                    <div>
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={addressData.phoneNumber}
                      onChange={handleInputChange}
                      className="border rounded-lg p-2 w-full"
                      required
                    />
                                                              {errors.phoneNumber && (
                        <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
                      )}
                    </div>
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
                            className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors ${
                              isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-700"
                            }`}
                            disabled={isLoading}
                          >
                            {isLoading ? "Saving..." : "Save Address"}
                          </button>
                          {errorMessage && (
                            <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
                          )}
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
