import React, { useState, useEffect } from "react";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; 
import { useAppSelector } from '../../Redux/Store/store';
import axios from "axios";
import { SERVER_URL } from "../../Constants";
import ChatBotButton from "../../components/User/chatBot";

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '';
  
  // Convert to string and split decimal parts
  const [integerPart, decimalPart] = value.toString().split('.');
  
  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Recombine with decimal part if exists
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

const Cart = () => {
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user);
  const userId = user.id;

  const [cartItems, setCartItems] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const GST_PERCENT = 18;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/cart/${userId}`);
        setCartItems(response.data);

        // Fetching images for cart items
        response.data.forEach(async (item) => {
          const imageId = item.productId.images[0];
          const imageResponse = await axios.get(`${SERVER_URL}/user/images/${imageId}`);
          setImageUrls((prev) => ({ ...prev, [imageId]: imageResponse.data.imageUrl }));
        });
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
  
    fetchCartItems();
  }, [userId]);

  // Function to calculate total
  const calculateTotal = () => {
    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = (subTotal * GST_PERCENT) / 100;
    const total = subTotal + gst;
    return { subTotal, gst, total };
  };

  const { subTotal, gst, total } = calculateTotal();

  const updateQuantity = async (id, amount) => {
    const updatedCartItems = cartItems.map((item) =>
      item.productId._id === id
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item
    );
  
    const updatedItem = updatedCartItems.find(item => item.productId._id === id);
    if (updatedItem) {
      try {
        await axios.put(`${SERVER_URL}/user/cart/${userId}/${id}`, { quantity: updatedItem.quantity });
        setCartItems(updatedCartItems); // Update local state only after successful DB update
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity. Please try again.');
      }
    }
  };

  console.log(cartItems,"ddddddddddddddd")

  const removeItemFromCart = async (id) => {
    try {
      // Send a DELETE request to remove the item from the cart
      const response = await axios.delete(`${SERVER_URL}/user/cart/${userId}/${id}`);
      
      // Check if the item removal was successful
      if (response.status === 200) {
        // Update the state to remove the item from the cart items
        setCartItems((prevItems) => 
          prevItems.filter((item) => item.productId._id !== id)
        );
        alert("Product removed from the cart and wallet updated");

        window.location.reload();
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await axios.post(`${SERVER_URL}/user/wishlist/${userId}`, { productId });
      alert("Product added to wishlist");
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };

  const handleBuyNow = () => {
    navigate("/checkout", { state: { total, gst, cartItems } }); // Pass total and cart items to checkout
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="container mx-auto flex-grow px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>
        <div className="flex justify-center">
          <div className="w-full lg:w-3/4 space-y-6">
            {/* Conditional rendering for cart items */}
            {cartItems.length === 0 ? (
              <div className="text-center text-lg text-gray-600">
                No items in Cart
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.productId._id} className="flex flex-col lg:flex-row items-center bg-white shadow-lg rounded-lg p-4">
                  <img 
                    src={imageUrls[item.productId.images[0]]} 
                    alt={item.productId.name} 
                    className="w-32 h-32 object-cover rounded-lg" 
                  />
                  <div className="flex-grow px-4 mt-4 lg:mt-0">
                    <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                    <p className="text-gray-600">{item.productId.description}</p>
                    <p className="text-gray-800 font-bold mt-2"> ₹{formatCurrency(item.price)}</p>
                    <div className="flex items-center mt-4 space-x-4">
                      <button
                        onClick={() => addToWishlist(item.productId._id)} 
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700">
                        Add to Wishlist <FontAwesomeIcon icon={faHeart} className="ml-2" />
                      </button>
                      <button 
                        onClick={() => removeItemFromCart(item.productId._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
                        Remove <FontAwesomeIcon icon={faTrash} className="ml-2" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                    <span>Quantity:</span>
                    {item.walletDiscountApplied ? (
                      <span className="px-4 py-1 border border-gray-300 rounded-lg">
                        {item.quantity}
                      </span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId._id, -1)}
                          className="px-2 py-1 bg-gray-200 rounded-lg"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border border-gray-300 rounded-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId._id, 1)}
                          className="px-2 py-1 bg-gray-200 rounded-lg"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Total and Checkout */}
        {cartItems.length > 0 && (  // Only show order summary if there are items
          <div className="mt-8 flex justify-center">
            <div className="w-full lg:w-3/4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="flex justify-between items-center mt-4">
                <span>Subtotal:</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>GST ({GST_PERCENT}%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
              </div>
              {/* Buy Now Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <div className="fixed bottom-8 right-8 z-50">
        <ChatBotButton />
      </div>
    </div>
  );
};

export default Cart;
