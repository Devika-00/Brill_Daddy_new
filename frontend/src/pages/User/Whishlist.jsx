import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash, faHeart } from '@fortawesome/free-solid-svg-icons';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';

const WishlistPage = () => {
  // Sample data for wishlist items
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Stylish Sunglasses',
      description: 'High-quality sunglasses with UV protection.',
      image: 'https://optorium.in/cdn/shop/files/1_69745283-8e15-489f-b6a0-7487f43d4e75.png?v=1697539923&width=1200',
    },
    {
      id: 2,
      name: 'Leather Wallet',
      description: 'Genuine leather wallet with multiple compartments.',
      image: 'https://5.imimg.com/data5/OF/GH/MY-7610375/handmade-men-s-short-leather-wallet.jpg',
    },
    {
      id: 3,
      name: 'Bluetooth Headphones',
      description: 'Noise-cancelling over-ear headphones with long battery life.',
      image: 'https://5.imimg.com/data5/JS/AW/BL/SELLER-65538252/sound-one-bt-06-bluetooth-headphones-black-.jpg',
    },
    {
      id: 4,
      name: 'Smartwatch',
      description: 'Feature-rich smartwatch with heart rate monitoring.',
      image: 'https://m.media-amazon.com/images/I/61ZjlBOp+rL.jpg',
    },
  ]);

  const handleAddToCart = (id) => {
    console.log(`Added item ${id} to cart.`);
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
    console.log(`Removed item ${id} from wishlist.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Wishlist</h1>
        <div className="flex justify-center">
          <div className="w-full lg:w-3/4 space-y-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex flex-col lg:flex-row items-center bg-white shadow-lg rounded-lg p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-grow px-4 mt-4 lg:mt-0">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 flex items-center"
                    >
                      Add to Cart
                      <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 flex items-center"
                    >
                      Remove
                      <FontAwesomeIcon icon={faTrash} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
