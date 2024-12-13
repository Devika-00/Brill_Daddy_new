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
import ChatBotButton from "../../components/User/chatBot";
import RelatedProductsCarousel from "../../components/User/ReleatedProductCarseoul";

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '';
  
  // Convert to string and split decimal parts
  const [integerPart, decimalPart] = value.toString().split('.');
  
  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Recombine with decimal part if exists
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
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
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0].thumbnailUrl);
        }
        fetchRelatedProducts(response.data.category);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchRelatedProducts = async (category) => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/user/relatedProducts?category=${category}&exclude=${id}`
        );

        const relatedProductsWithImages = await Promise.all(
          response.data.map(async (product) => {
            if (product.images && product.images.length > 0) {
              try {
                const imageResponse = await axios.get(
                  `${SERVER_URL}/user/images/${product.images[0]}`
                );
                return {
                  ...product,
                  imageUrl: imageResponse.data.imageUrl,
                  thumbnailUrl: imageResponse.data.thumbnailUrl
                };
              } catch (imageError) {
                console.error(`Error fetching image for product ${product._id}:`, imageError);
                return product;
              }
            }
            return product;
          })
        );

        setRelatedProducts(relatedProductsWithImages);
      } catch (error) {
        console.error("Error fetching related products:", error);
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
        productId: id,
        userId,
        wishlistStatus: wishlist[id] ? "removed" : "added",
      };

      if (wishlist[id]) {
        const response = await axios.delete(
          `${SERVER_URL}/user/wishlist/remove`,
          {
            headers,
            data: requestBody,
          }
        );
        if (response.status === 200) {
          setWishlist((prev) => ({ ...prev, [id]: false }));
          setWishlistMessage("Product successfully removed from wishlist");
          setShowDialog(true); // Show dialog box
          setTimeout(() => setShowDialog(false), 2000);
        }
      } else {
        const response = await axios.post(
          `${SERVER_URL}/user/wishlist`,
          requestBody,
          { headers }
        );
        if (response.status === 201) {
          setWishlist((prev) => ({ ...prev, [id]: true }));
          setWishlistMessage("Product successfully added to wishlist");
          setShowDialog(true); // Show dialog box
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
      const applicableDiscount = Math.min(tenPercentDiscount, walletBalance);
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
        quantity: 1,
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
    (item) => item.productId._id === product._id
  );
  const isProductWithDiscountInCart = cartItems.some(
    (item) =>
      item.productId._id === product._id && item.walletDiscountApplied === true
  );
  const isProductWithoutDiscountInCart = cartItems.some(
    (item) =>
      item.productId._id === product._id && item.walletDiscountApplied === false
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
      (isProductWithDiscountInCart || isProductWithoutDiscountInCart)
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

  console.log(relatedProducts,"aaaaaaaaaaaaaaaaaaaaaaaa");

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
        <OrginalNavbar />
        <NavbarWithMenu />
  
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mx-2 lg:mx-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              {/* Product Images Section */}
              <div className="flex flex-col space-y-4 lg:space-y-6">
                <div
                  className="relative overflow-hidden rounded-2xl bg-gray-50 shadow-lg group mx-auto"
                  onMouseEnter={() => setIsImageZoomed(true)}
                  onMouseLeave={() => setIsImageZoomed(false)}
                >
                  <div className="aspect-w-4 aspect-h-3 max-h-80 sm:max-h-[400px]">
                    <img
                      src={mainImage}
                      alt="Product"
                      className={`w-96 h-96 object-contain transition-all duration-500 mt-5 ${
                        isImageZoomed ? "scale-125" : "scale-100"
                      }`}
                    />
                  </div>
                </div>
  
                {/* Thumbnails */}
                <div className="flex space-x-2 overflow-x-auto pb-2 justify-center">
                  {product.images[0].imageUrl.map((img, index) => (
                    <div
                      key={index}
                      className={`relative rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 ${
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
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Product Details Section */}
              <div className="flex flex-col space-y-4 lg:space-y-6 relative">
                {/* Favorite Button */}
                <button
                  className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-white border border-gray-400 rounded-full ${
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
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                </div>
  
                <div className="space-y-4">
                  <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
  
                  <div className="flex flex-wrap items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <span className="text-xl sm:text-3xl font-bold text-red-600">
                      ₹{formatCurrency(product.salePrice)}
                    </span>
                    <span className="text-sm sm:text-xl text-gray-400 line-through">
                      ₹{formatCurrency(product.productPrice)}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-semibold">
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
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <label className="text-sm sm:text-base text-green-700">
                        Apply With Wallet Discount ₹{walletOfferPrice}
                      </label>
                    </div>
                  )}
  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Category:</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Brand:</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm">
                        {product.brand}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Color:</span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs sm:text-sm">
                        {product.color}
                      </span>
                    </div>
                  </div>
                </div>
  
                {/* Features */}
                <div className="grid grid-cols-2 gap-4 py-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faTruck} className="text-blue-500" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500" />
                    <span>1 Year Warranty</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faUndo} className="text-blue-500" />
                    <span>7 Days Return</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCheck} className="text-blue-500" />
                    <span>Genuine Product</span>
                  </div>
                </div>
  
                {/* Action Buttons */}
                {product.quantity <= 0 ? (
                  <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-center font-bold text-sm sm:text-xl animate-pulse">
                    Product Out Of Stock
                  </div>
                ) : (
                  <div className="flex flex-wrap space-x-2">
                    {renderAddToCartButton()}
                    <button className="flex-1 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg">
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                      <span>Buy Now</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <RelatedProductsCarousel 
  relatedProducts={relatedProducts}
  formatCurrency={formatCurrency}
  navigate={navigate}
/>
  
        <Footer />
        <div className="fixed bottom-8 right-8 z-50">
          <ChatBotButton />
        </div>
      </div>
    </>
  );
  
};

export default SingleProduct;
