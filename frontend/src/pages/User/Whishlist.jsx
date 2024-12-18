import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { useAppSelector } from '../../Redux/Store/store';
import axios from 'axios';
import { SERVER_URL } from "../../Constants";
import { useNavigate } from 'react-router-dom'; 
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

const WishlistPage = () => {
  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;

  const [wishlistItems, setWishlistItems] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (!token) {
          console.error("No token found!");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`${SERVER_URL}/user/wishlist`, { headers });
        

        if (response.status === 200) {
          const items = Array.isArray(response.data) ? response.data : [];
          setWishlistItems(items);

          // Fetch images for each product
          const imageUrls = {};
          await Promise.all(items.map(async (item) => {
            const productId = item.productId._id;
            if (item.productId.images && item.productId.images.length > 0) {
              const imageId = item.productId.images[0];
              try {
                const imageResponse = await axios.get(`${SERVER_URL}/user/images/${imageId}`);
                if (imageResponse.status === 200) {
                  imageUrls[imageId] = imageResponse.data.imageUrl;
                }
              } catch (error) {
                console.error(`Error fetching image for product ${productId}:`, error);
              }
            }
          }));
          setImageUrls(imageUrls);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/cart/${userId}`);
        if (response.status === 200) {
          setCartItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (token) {
      fetchWishlist();
      fetchCart();
    } else {
      console.error("User not authenticated!");
    }
  }, [token, userId]);

  const handleAddToCart = async (product) => {
    try {
      const isInCart = cartItems.some((item) => item.productId._id === product._id);

      if (isInCart) {
        alert('Product is already in the cart!');
        return;
      }

      const priceToAdd = product.salePrice;
      const response = await axios.post(`${SERVER_URL}/user/cart/add`, {
        userId,
        productId: product._id,
        quantity: 1,
        price: priceToAdd,
        walletDiscountApplied: false,
        walletDiscountAmount: 0,
      });

      if (response.status === 200) {
        setCartItems((prev) => [...prev, { productId: product, quantity: 1 }]);
        alert('Product added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Could not add product to cart. Please try again.');
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(`${SERVER_URL}/user/wishlist/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId,
          productId,
        },
      });

      if (response.status === 200) {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.productId._id !== productId));
        alert('Product removed from wishlist successfully!');
      } else {
        alert('Error removing product from wishlist. Please try again.');
      }
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      alert('Could not remove product from wishlist. Please try again.');
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="container flex-grow mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Wishlist</h1>
        <div className="flex justify-center">
          <div className="w-full lg:w-3/4 space-y-6">
            {wishlistItems.length === 0 ? (
              <p className="text-center text-lg text-gray-500">No items in wishlist.</p>
            ) : (
              wishlistItems.map((item) => {
                const isInCart = cartItems.some((cartItem) => cartItem.productId._id === item.productId._id);
                return (
                  <div key={item.productId._id} className="flex flex-col lg:flex-row items-center bg-white shadow-lg rounded-lg p-4">
                    <img
                      src={item.productId.images && item.productId.images.length > 0
                        ? imageUrls[item.productId.images[0]] || "/path/to/placeholder.jpg"
                        : "/path/to/placeholder.jpg"}
                      alt={item.productId.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-grow px-4 mt-4 lg:mt-0">
                      <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                      <p className="text-gray-600">{item.productId.description}</p>
                      <p className="text-red-600 text-bold">₹{formatCurrency(item.productId.salePrice)}</p>
                      <div className="flex items-center mt-4 space-x-4">
                      <button
                          onClick={() => isInCart ? handleGoToCart() : handleAddToCart(item.productId)}
                          className={`px-4 py-2 ${isInCart ? 'bg-green-500 text-white' : 'bg-yellow-500 hover:bg-yellow-700'} rounded-lg flex items-center`}
                        >
                          {isInCart ? 'Go to Cart' : 'Add to Cart'}
                          {isInCart && <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />}
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.productId._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 flex items-center"
                        >
                          Remove
                          <FontAwesomeIcon icon={faTrash} className="ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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

export default WishlistPage;
