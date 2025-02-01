import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faMoneyBillWave,
  faStar,
  faCheck,
  faTruck,
  faShieldAlt,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { SERVER_URL } from "../../Constants";
import { useAppSelector } from "../../Redux/Store/store";
import { FaHeart } from "react-icons/fa";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWalletDiscount, setUseWalletDiscount] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [walletOfferPrice, setWalletOfferPrice] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/products/${id}`);
        setProduct(response.data);
        if (response.data.images) {
          setMainImage(response.data.images.thumbnailUrl);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/wallet/${userId}`);
        setWalletBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        if (!userId || !token) return;
        const response = await axios.get(`${SERVER_URL}/user/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishlistItems = response.data.reduce((acc, item) => {
          acc[item.productId._id] = item.wishlistStatus === "added";
          return acc;
        }, {});
        setWishlist(wishlistItems);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchProduct();
    fetchWalletBalance();
    fetchWishlist();
    fetchCartItems();
  }, [id, userId, token]);

  const toggleFavorite = async () => {
    try {
      if (!userId || !token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const requestBody = {
        productId: _id,
        userId,
        wishlistStatus: wishlist[id] ? "removed" : "added",
      };

      if (wishlist[_id]) {
        const response = await axios.delete(
          `${SERVER_URL}/user/wishlist/remove`,
          {
            headers,
            data: requestBody,
          }
        );
        if (response.status === 200) {
          setWishlist((prev) => ({ ...prev, [_id]: false }));
          setTimeout(() => setShowDialog(false), 2000);
        }
      } else {
        const response = await axios.post(
          `${SERVER_URL}/user/wishlist`,
          requestBody,
          { headers }
        );
        if (response.status === 201) {
          setWishlist((prev) => ({ ...prev, [_id]: true }));
          setTimeout(() => setShowDialog(false), 2000);
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  // Calculate wallet discount only when product and wallet balance are available
  useEffect(() => {
    if (product && walletBalance > 0) {
      const tenPercentDiscount = product.salePrice * 0.1;
      const discountedPrice = product.salePrice - applicableDiscount;
      setWalletOfferPrice(discountedPrice);
    }
  }, [product, walletBalance]);

  const handleAddToCart = async () => {
    try {
      const priceToAdd =
        useWalletDiscount && walletOfferPrice
          ? walletOfferPrice
          : product.salePrice;
      const walletDiscountAmount = useWalletDiscount
        ? product.salePrice - walletOfferPrice
        : 0;

      const response = await axios.post(`${SERVER_URL}/user/cart/add`, {
        userId,
        productId: product._id,
        price: priceToAdd,
        walletDiscountApplied: useWalletDiscount,
        walletDiscountAmount,
      });

      if (response.status === 200) {
        alert("Product added to cart successfully!");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Could not add product to cart. Please try again.");
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };


  const isProductInCart = cartItems.some(
    (item) => item.productId.id === product._id
  );
  const isProductWithDiscountInCart = cartItems.some(
    (item) =>
      item.productId.id === product.id && item.walletDiscountApplied === true
  );
  const isProductWithoutDiscountInCart = cartItems.some(
    (item) =>
      item.productId.id === product.id && item.walletDiscountApplied === false
  );

  // Conditional rendering of the button based on the cart status
  const renderAddToCartButton = () => {
    if (useWalletDiscount) {
      // If wallet checkbox is selected, show "Add to Cart" button
      return (
        <button
          onClick={handleAddToCart}
          className="flex-1 px-6 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-x"
        >
          Add to Cart
        </button>
      );
    } else if (
      isProductInCart &&
      (isProductWithDiscountInCart)
    ) {
      // If product is in the cart (with or without a discount), show "Go to Cart" button
      return (
        <button
          onClick={handleGoToCart}
          className="flex-1 px-6 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-x"
        >
          Go to Cart
        </button>
      );
    } else {
      // Default case: show "Add to Cart" button
      return (
        <button
          onClick={handleAddToCart}
          className="flex-1 px-6 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-x"
        >
          Add to Cart
        </button>
      );
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
                        isImageZoomed ? "scale-125" : "scale-100"
                      }`}
                    />
                  </div>
                  {/* Zoom indicator */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"></span>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex space-x-4 overflow-x-auto pb-2 justify-center">
                  {product.images[0].imageUrl.map((img, index) => (
                    <div
                      key={index}
                      className={`relative rounded-lg mt-4 overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 ${
                        selectedThumbnail === index
                          ? "ring-2 ring-blue-500 scale-105"
                          : ""
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
              <div className="flex flex-col space-y-6 relative">
                {/* Favorite Button */}
                <button
                  className={`absolute top-4 right-4 p-2 bg-white border border-gray-400 rounded-full ${
                    wishlist[id] ? "text-red-500" : "text-gray-500"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite();
                  }}
                >
                  <FaHeart />
                </button>

                <div className="border-b pb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className="text-yellow-400"
                      />
                    ))}
                    <span className="text-gray-500">(150 Reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <span className="text-3xl font-bold text-red-600">
                      ₹{product.salePrice}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.productPrice}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {product.discount}% OFF
                    </span>
                  </div>

                  {walletBalance > 0 && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={useWalletDiscount}
                        onChange={() =>
                          setUseWalletDiscount(!useWalletDiscount)
                        }
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
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Brand:</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {product.brand}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Color:</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full">
                        {product.color}
                      </span>
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
                    <FontAwesomeIcon
                      icon={faShieldAlt}
                      className="text-blue-500"
                    />
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
                    
                  {renderAddToCartButton()}
               
                    <button className="flex-1 px-6 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                      <span>Buy Now</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {showDialog && (
              <div
                className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-center px-4 py-6 rounded-md`}
              >
                <div
                  className={`bg-white py-4 px-6 rounded-xl text-xl ${
                    wishlistMessage.includes("added")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {wishlistMessage}
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default SingleProduct;
