import React, { useState, useEffect } from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';

const Checkout = () => {
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: '',
    pinCode: '',
    location: '',
    street: '',
    state: '',
    flatNumber: '',
    phoneNumber: '',
    addressType: 'home'
  });

  // Set a dummy address when the component mounts
  useEffect(() => {
    const dummyAddress = {
      name: 'John Doe',
      pinCode: '123456',
      location: 'City Center',
      street: '123 Main St',
      state: 'State Name',
      flatNumber: 'Flat 1A',
      phoneNumber: '1234567890',
      addressType: 'home'
    };
    setAddresses([dummyAddress]);
  }, []);

  const handleAddAddress = () => {
    setAddresses([...addresses, newAddress]);
    setShowModal(false);
    setNewAddress({
      name: '',
      pinCode: '',
      location: '',
      street: '',
      state: '',
      flatNumber: '',
      phoneNumber: '',
      addressType: 'home'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />
      
      <div className="checkout-area mt-5 ml-5 mr-5">
        <div className="container mx-auto">

          {/* Checkout Heading */}
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <form action="/checkout/place-order" method="post">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Address Section */}
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

                {/* Addresses List */}
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
                            />
                            <label htmlFor={`address${index}`} className="form-check-label">
                              <h5 className="font-semibold">{address.name}</h5>
                              <p>{`${address.street}, ${address.location}, ${address.state}, ${address.pinCode}`}</p>
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

              {/* Order Summary Section */}
              <div className="bg-white p-4 shadow-md rounded">
                <h3 className="text-lg font-semibold mb-4">Your Order</h3>
                <div className="table-responsive">
                  <table className="min-w-full bg-white">
                    <tbody>
                      {/* Example product item */}
                      <tr className="border-b">
                        <td className="py-2 px-4">
                          <p>Product Title <strong className="ml-2">× 2</strong></p>
                        </td>
                        <td className="py-2 px-4 text-right">
                          ₹ 500.00
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th className="py-2 px-4 text-left">Cart Subtotal</th>
                        <td className="py-2 px-4 text-right">₹ 1000.00</td>
                      </tr>
                      <tr>
                        <th className="py-2 px-4 text-left">Discount</th>
                        <td className="py-2 px-4 text-right">₹ 100.00</td>
                      </tr>
                      <tr>
                        <th className="py-2 px-4 text-left">Order Total</th>
                        <td className="py-2 px-4 text-right">₹ 900.00</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Payment Methods */}
                <div className="mt-4">
                  <label htmlFor="payment-method-select" className="block text-sm font-medium text-gray-700">
                    Select Payment Method:
                  </label>
                  <div className="flex flex-col gap-2 mt-2">
                    <button className="btn bg-black text-white px-4 py-2 rounded">CASH ON DELIVERY</button>
                    <button className="btn bg-blue-500 text-white px-4 py-2 rounded">Pay with Razorpay</button>
                    <button className="btn bg-green-500 text-white px-4 py-2 rounded" style={{ display: 'none' }}>Pay With Wallet</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Address</h2>
            <form>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  className="p-2 border rounded"
                  placeholder="Name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  placeholder="Pin Code"
                  value={newAddress.pinCode}
                  onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  placeholder="Location"
                  value={newAddress.location}
                  onChange={(e) => setNewAddress({ ...newAddress, location: e.target.value })}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  placeholder="Street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  placeholder="Flat Number"
                  value={newAddress.flatNumber}
                  onChange={(e) => setNewAddress({ ...newAddress, flatNumber: e.target.value })}
                />
                <input
                  type="text"
                  className="p-2 border rounded"
                  placeholder="Phone Number"
                  value={newAddress.phoneNumber}
                  onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Address Type</h3>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressType"
                      value="home"
                      checked={newAddress.addressType === 'home'}
                      onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
                    />
                    <span className="ml-2">Home</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressType"
                      value="work"
                      checked={newAddress.addressType === 'work'}
                      onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
                    />
                    <span className="ml-2">Work</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressType"
                      value="other"
                      checked={newAddress.addressType === 'other'}
                      onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
                    />
                    <span className="ml-2">Other</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="btn bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleAddAddress}
                >
                  Save Address
                </button>
                <button
                  type="button"
                  className="btn bg-red-500 text-white px-4 py-2 rounded ml-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Checkout;
