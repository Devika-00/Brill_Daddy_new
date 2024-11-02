import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { useAppSelector } from '../../Redux/Store/store';
import axios from 'axios';
import { SERVER_URL } from "../../Constants";

const WishlistPage = () => {
  const user = useAppSelector((state) => state.user);
  const userId = user.id;

  const [wishlistItems, setWishlistItems] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/wishlist/${userId}`);
        setWishlistItems(response.data);

        response.data.forEach(async (item) => {
          const imageId = item.productId.images[0];
          const imageResponse = await axios.get(`${SERVER_URL}/user/images/${imageId}`);
          setImageUrls((prev) => ({ ...prev, [imageId]: imageResponse.data.imageUrl }));
        });
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      }
    };

    fetchWishlistItems();
  }, [userId]);

  const handleRemoveFromWishlist = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/user/wishlist/${userId}/${id}`);
      setWishlistItems((prevItems) => prevItems.filter((item) => item.productId._id !== id));
      console.log(`Removed item ${id} from wishlist.`);
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(`${SERVER_URL}/user/cart/add`, {
        userId,
        productId,
        quantity: 1,
      });
      if (response.status === 200) {
        alert('Product added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Could not add product to cart. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="container flex-grow mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Wishlist</h1>
        <div className="flex justify-center">
          <div className="w-full lg:w-3/4 space-y-6">
            {wishlistItems.length === 0 ? (
              <p className="text-center text-lg text-gray-500">No items in wishlist.</p>
            ) : (
              wishlistItems.map((item) => (
                <div key={item.id} className="flex flex-col lg:flex-row items-center bg-white shadow-lg rounded-lg p-4">
                  <img 
                    src={imageUrls[item.productId.images[0]]} 
                    alt={item.productId.name} 
                    className="w-32 h-32 object-cover rounded-lg" 
                  />
                  <div className="flex-grow px-4 mt-4 lg:mt-0">
                    <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                    <p className="text-gray-600">{item.productId.description}</p>
                    <p className="text-red-600 text-bold">₹{item.productId.salePrice}</p>
                    <div className="flex items-center mt-4 space-x-4">
                      <button
                        onClick={() => handleAddToCart(item.productId._id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 flex items-center"
                      >
                        Add to Cart
                        <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
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
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
