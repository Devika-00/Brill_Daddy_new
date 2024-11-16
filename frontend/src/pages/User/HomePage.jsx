import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import { SERVER_URL } from "../../Constants";
import axios from "axios";
import ImageOne from "../../assets/one.jpg";
import ImageTwo from "../../assets/two.jpg";
import { Clock, Package, Tag, Gift } from "lucide-react";
import { useAppSelector } from "../../Redux/Store/store";

const HomePage = () => {
 
  const [hoveredCard, setHoveredCard] = useState(false);

  const [vouchers, setVouchers] = useState([]);
  const [firstFreeVoucher, setFirstFreeVoucher] = useState(null);  // Store the first free voucher
  

  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;

  const carouselImages = [
    ImageOne,
    ImageTwo,
    ImageOne,
    ImageTwo,
    ImageOne,
    ImageTwo,
    ImageOne,
    ImageTwo,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlist, setWishlist] = useState({});

  const [products, setProducts] = useState([]);
  const [electronicProducts, setElectronicProducts] = useState([]);

  const navigate = useNavigate();

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/products`);
        const products = response.data;

        const filteredProducts = products.filter(
          (product) => product.category === "electronics"
        );
        setElectronicProducts(filteredProducts.slice(0, 5));

        // Fetch images for each product
        const productsWithImages = await Promise.all(
          products.map(async (product) => {
            if (product.images && product.images.length > 0) {
              const imageResponse = await axios.get(
                `${SERVER_URL}/user/images/${product.images[0]}`
              );
              product.imageUrl = imageResponse.data.imageUrl;
            }
            return product;
          })
        );

        setProducts(productsWithImages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        if (!userId || !token) return;

        console.log("Fetching wishlist for User ID:", userId, "Token:", token);

        const response = await axios.get(`${SERVER_URL}/user/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishlistItems = response.data.reduce((acc, item) => {
          acc[item.productId._id] = item.wishlistStatus === 'added';
          return acc;
        }, {});

        console.log("Wishlist fetched:", JSON.stringify(wishlistItems, null, 2));

        setWishlist(wishlistItems);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [userId, token]);

  const toggleFavorite = async (productId) => {
    try {
      // Ensure the user is logged in (check if userId or token exists)
      if (!userId || !token) {
        navigate("/login");
        return;
      }

      // Log the token to confirm it's being retrieved correctly
      console.log("Retrieved token:", token);
      console.log("Retrieved userId:", userId);

      const headers = {
        Authorization: `Bearer ${token}`,  // Pass token as Bearer token in headers
      };

      console.log("Toggling favorite for productId:", productId);

      // Add userId to the request body when adding/removing from wishlist
      const requestBody = {
        productId,
        userId,
        wishlistStatus: wishlist[productId] ? 'removed' : 'added',
      };

      console.log("Current wishlist state before update:", wishlist);

      if (wishlist[productId]) {
        console.log("Removing from wishlist:", productId);
        // Use DELETE to remove from wishlist, similar to your previous working route
        const response = await axios.delete(`${SERVER_URL}/user/wishlist/remove`, {
          headers,
          data: requestBody
        });

        if (response.status === 200) {
          setWishlist(prev => ({ ...prev, [productId]: false }));
          alert("Product removed from wishlist successfully!");
        } else {
          alert('Error removing product from wishlist. Please try again.');
        }
      } else {
        console.log("Adding to wishlist:", productId);
        // Use POST to add to wishlist
        const response = await axios.post(`${SERVER_URL}/user/wishlist`, requestBody, { headers });
        if (response.status === 201) {
          setWishlist(prev => ({ ...prev, [productId]: true }));
        } else {
          console.error("Error adding to wishlist:", response.data);
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("There was an issue adding/removing the item from your wishlist.");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/shopCategory?category=${encodeURIComponent(categoryName)}`);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 5;

  // Carousel Scroll Left
  const scrollLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? electronicProducts.length - productsPerPage
        : prevIndex - 1
    );
  };

  // Carousel Scroll Right
  const scrollRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + productsPerPage >= electronicProducts.length
        ? 0
        : prevIndex + 1
    );
  };

  const voucher = {
    _id: "1",
    image: "https://via.placeholder.com/150",
    name: "Holiday Sale Voucher",
    description: "Exclusive 15% off for the holiday season!",
    eligible_rebid_users: ["123"],
    rebid_active: true,
  };

  const isEligibleForFree =
    voucher.eligible_rebid_users.includes(userId) && voucher.rebid_active;

    useEffect(() => {
      const fetchVouchers = async () => {
        try {
          const response = await axios.get(`${SERVER_URL}/voucher/getVouchers`);
          const currentTime = new Date().getTime();
  
          const validVouchers = response.data.filter((voucher) => {
            const isEligibleUser = voucher.eligible_rebid_users.includes(userId);
            const isRebidActive = voucher.rebid_active && new Date(voucher.rebid_end_time).getTime() > currentTime;
            const isActiveVoucher = new Date(voucher.start_time).getTime() <= currentTime && new Date(voucher.end_time).getTime() > currentTime;
            
            return (isEligibleUser && isRebidActive) || isActiveVoucher;
          });
  
          const freeVouchers = validVouchers.filter((voucher) => voucher.price === 0).slice(0, 2);
          const paidVouchers = validVouchers.filter((voucher) => voucher.price !== 0);
  
          setVouchers([...freeVouchers, ...paidVouchers]);
  
          // Set the first free voucher to display on the home page
          if (freeVouchers.length > 0) {
            setFirstFreeVoucher(freeVouchers[0]);
          }
        } catch (error) {
          console.error("Failed to fetch vouchers:", error);
        }
      };
  
      fetchVouchers();
  
      // Set interval to fetch every minute (adjust as necessary)
      const intervalId = setInterval(fetchVouchers, 1000);
  
      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, []);

  
    const handleClaimVoucher = (voucher) => {
  
      if ( firstFreeVoucher?.price === 0 ) {
        navigate(`/eventDetail`, { state: { voucher } });
      } else {
        navigate(`/payment/${voucher._id}`, { state: { voucher } });
      }
    };

  // Calculate visible products
  const visibleProducts = electronicProducts.slice(
    currentIndex,
    currentIndex + productsPerPage
  );
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />

      {/* Image Carousel */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {carouselImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Carousel ${index}`}
              className="w-full h-80 mt-3"
            />
          ))}
        </div>
      </div>

      <div className="p-6 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Fashion Category Card */}
        <div
          onClick={() => handleCategoryClick("fashion")}
          className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 cursor-pointer"
        >
          <div className="relative h-48">
            <img
              src="https://st3.depositphotos.com/3591429/14866/i/450/depositphotos_148668333-stock-photo-credit-card-and-fashion-graphic.jpg"
              alt="Fashion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-700">Fashion</h2>
            <p className="text-gray-500 mt-2">
              Stylish clothing and accessories for every season.
            </p>
          </div>
        </div>

        {/* Electronics Category Card */}
        <div
          onClick={() => handleCategoryClick("electronics")}
          className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 cursor-pointer"
        >
          <div className="relative h-48">
            <img
              src="https://assets.architecturaldigest.in/photos/60084fc951daf9662c149bb9/16:9/w_2560%2Cc_limit/how-to-clean-gadgets-1366x768.jpg"
              alt="Electronics"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-700">Electronics</h2>
            <p className="text-gray-500 mt-2">
              Latest gadgets and devices at unbeatable prices.
            </p>
          </div>
        </div>

        {/* Voucher Card */}
<div className="relative group"
     onMouseEnter={() => setHoveredCard(true)}
     onMouseLeave={() => setHoveredCard(false)}>
  <div className={`bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl shadow-lg overflow-hidden 
                   transform transition-all duration-300 ${hoveredCard ? 'scale-105 shadow-2xl' : 'scale-100'}`}>
    
    {/* Free Badge */}
    {firstFreeVoucher && firstFreeVoucher.price === 0 && (
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-green-600 text-white font-bold px-4 py-1 rounded-sm shadow-lg transform rotate-3">
          FREE
        </div>
      </div>
    )}

              {/* Image Section */}
              <div className="relative w-full h-40 flex items-center justify-center overflow-hidden">
                <img
                  src={firstFreeVoucher?.imageUrl}
                  alt={firstFreeVoucher?.voucher_name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {firstFreeVoucher?.voucher_name || "Special Offer"}
                </h3>
                
                <div className="bg-white/10 rounded-lg p-3 space-y-2 mb-4">
                  <div className="flex items-center text-white">
                    <Package className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {firstFreeVoucher?.product_name || "Premium Product"}
                    </span>
                  </div>
                  <div className="flex items-center text-white">
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      Worth ₹{firstFreeVoucher?.productPrice || "1000"}
                    </span>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white/90">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Valid until {firstFreeVoucher ? new Date(firstFreeVoucher.end_time).toLocaleDateString() : "Dec 31, 2024"}
                    </span>
                  </div>
                  
                  <button 
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center"
                    onClick={() => handleClaimVoucher(firstFreeVoucher)}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    <span>Claim Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Show All Vouchers Link */}
            <div className="text-center mt-4">
              <Link 
                to="/event" 
                className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer inline-flex items-center"
              >
                <span>Show all vouchers</span>
                <FaArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
    

      {/* Products Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 ml-36">
          Products
        </h2>
      </div>

      {/* Product Cards Container */}
      <div className="p-6 grid gap-8 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-5 mx-auto max-w-7xl">
        {/* Product Cards */}
        {products.map((product) => (
          <Link key={product.id} to={`/singleProduct/${product._id}`}>
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 "
            >
              {/* Favorite Button */}
              <button
                className={`absolute top-4 right-4 p-2 bg-white border border-gray-400 rounded-full ${wishlist[product._id] ? "text-red-500" : "text-gray-500"}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(product._id);
                }}
              >
                <FaHeart />
              </button>

              <img
                src={product.imageUrl || product.image}
                alt={product.name}
                className="w-full h-48 object-cover mb-4"
              />

              <div className="p-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-2">
                  {product.description || "No description available."}
                </p>
                <p className="text-sm text-gray-500 mt-1 mb-2">
                  {product.category}
                </p>

                <div className="flex items-center">
                  <p className="text-gray-500 line-through mr-2">
                    {product.productPrice}
                  </p>
                  <span className="text-lg text-bold text-green-500 mr-2">
                    {product.salePrice}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {product.discount}% off
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View More Button */}
      <div className="flex justify-center mt-6">
        <Link
          to="/shop"
          className=" text-blue-950 py-2 px-4 rounded hover:bg-blue-200 transition duration-300"
        >
          View More
        </Link>
      </div>

      {/* Products Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4 ml-36 mt-4">
          Electronics
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative flex items-center">
        {/* Left Scroll Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg"
        >
          <FaArrowLeft />
        </button>

        {/* Product Cards Container */}
        <div className="p-6 grid gap-8 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-5 mx-auto max-w-7xl">
          {/* Product Cards */}
          {electronicProducts.map((product) => (
            <Link key={product.id} to={`/singleProduct/${product._id}`}>
              <div
                key={product.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 relative"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-700">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 mt-2 line-through">
                    {product.productPrice}
                  </p>
                  <span className="text-lg text-bold text-green-500 mr-2">
                    {product.salePrice}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {product.discount}% off
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Scroll Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg"
        >
          <FaArrowRight />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
