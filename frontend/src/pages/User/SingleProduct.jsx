import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faMoneyBillWave, faStar, faCheck, faTruck, faShieldAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { SERVER_URL } from "../../Constants";
import { useAppSelector } from '../../Redux/Store/store';

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWalletDiscount, setUseWalletDiscount] = useState(false);
  const [walletOfferPrice, setWalletOfferPrice] = useState(null);

  const user = useAppSelector((state) => state.user);
  const userId = user.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/products/${id}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0].thumbnailUrl);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/wallet/${userId}`);
        setWalletBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    fetchProduct();
    fetchWalletBalance();
  }, [id, userId]);

  useEffect(() => {
    if (product) {
      const tenPercentDiscount = product.salePrice * 0.1;
      const applicableDiscount = Math.min(tenPercentDiscount, walletBalance);
      const discountedPrice = product.salePrice - applicableDiscount;
      setWalletOfferPrice(discountedPrice);
    }
  }, [product, walletBalance]);

  const handleAddToCart = async () => {
    try {
      const priceToAdd = useWalletDiscount && walletOfferPrice ? walletOfferPrice : product.salePrice;
      const walletDiscountAmount = useWalletDiscount ? product.salePrice - walletOfferPrice : 0;

      const response = await axios.post(`${SERVER_URL}/user/cart/add`, {
        userId,
        productId: product._id,
        quantity: 1,
        price: priceToAdd,
        walletDiscountApplied: useWalletDiscount,
        walletDiscountAmount
      });
      
      if (response.status === 200) {
        alert('Product added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Could not add product to cart. Please try again.');
    }
  };


  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
        <OrginalNavbar />
        <NavbarWithMenu />
        
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 ml-14 mr-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images Section */}
              <div className="flex flex-col space-y-6">
                <div 
                  className="relative overflow-hidden rounded-2xl bg-gray-50 shadow-lg group max-w-2xl mx-auto"
                  onMouseEnter={() => setIsImageZoomed(true)}
                  onMouseLeave={() => setIsImageZoomed(false)}
                >
                  <div className="aspect-w-4 aspect-h-3 max-h-[400px]">
                    <img 
                      src={mainImage} 
                      alt="Product" 
                      className={`w-96 h-96 object-contain transition-all duration-500 ${
                        isImageZoomed ? 'scale-125' : 'scale-100'
                      }`}
                    />
                  </div>
                  {/* Zoom indicator */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    </span>
                  </div>
                </div>
                
                {/* Thumbnails */}
                <div className="flex space-x-4 overflow-x-auto pb-2 justify-center">
                  {product.images[0].imageUrl.map((img, index) => (
                    <div
                      key={index}
                      className={`relative rounded-lg mt-4 overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 ${
                        selectedThumbnail === index ? 'ring-2 ring-blue-500 scale-105' : ''
                      }`}
                      onClick={() => {
                        setMainImage(img);
                        setSelectedThumbnail(index);
                      }}
                    >
                      <img 
                        src={img}
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details Section */}
              <div className="flex flex-col space-y-6">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
                    ))}
                    <span className="text-gray-500">(150 Reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <span className="text-3xl font-bold text-red-600">₹{product.salePrice}</span>
                    <span className="text-xl text-gray-400 line-through">₹{product.productPrice}</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {product.discount}% OFF
                    </span>
                  </div>

                   {/* Wallet Offer Section */}
                   {walletOfferPrice && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={useWalletDiscount}
                        onChange={() => setUseWalletDiscount(!useWalletDiscount)}
                        className="h-5 w-5"
                      />
                      <label className="text-green-700">
                        Apply With Wallet Discount ₹{walletOfferPrice}
                      </label>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Category:</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{product.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Brand:</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">{product.brand}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Color:</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full">{product.color}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FontAwesomeIcon icon={faTruck} className="text-blue-500" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />
                    <span>1 Year Warranty</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FontAwesomeIcon icon={faUndo} className="text-blue-500" />
                    <span>7 Days Return</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FontAwesomeIcon icon={faCheck} className="text-blue-500" />
                    <span>Genuine Product</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {product.quantity <= 0 ? (
                  <div className="bg-red-100 text-red-600 px-6 py-4 rounded-lg text-center font-bold text-xl animate-pulse">
                    Product Out Of Stock
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 px-6 py-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                      <span>Add to Cart</span>
                    </button>
                    <button 
                      className="flex-1 px-6 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                      <span>Buy Now</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default SingleProduct;