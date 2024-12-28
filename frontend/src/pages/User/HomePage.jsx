import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import { SERVER_URL, makeApiCall } from "../../Constants";
import axios from "axios";
import { Clock, Package, Tag, Gift } from "lucide-react";
import { useAppSelector } from "../../Redux/Store/store";
import ChatBotButton from "../../components/User/chatBot";
import ProductCarousel from "../../components/User/ProductCoursel";
import VouchersCarousel from "../../components/User/VoucherCoursel";
import ResponsiveCarousel from "../../components/User/AddCoursel";

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "";
  const [integerPart, decimalPart] = value.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

// Dialog Box Component
const WishlistDialog = ({ message, onClose, onGoToWishlist }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close the dialog automatically after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="mb-4">{message}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            onGoToWishlist(); // Navigate to Wishlist
          }}
        >
          Go to Wishlist
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [visibleCount, setVisibleCount] = useState(10);

  const [hoveredCard, setHoveredCard] = useState(false);

  const [vouchers, setVouchers] = useState([]);
  const [firstFreeVoucher, setFirstFreeVoucher] = useState(null); // Store the first free voucher
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const scrollContainerRef = useRef(null);
  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;

  const [wishlist, setWishlist] = useState({});
  const [dialogMessage, setDialogMessage] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const [products, setProducts] = useState([]);
  const [electronicProducts, setElectronicProducts] = useState([]);
  const [categoriesAndProducts, setCategoriesAndProducts] = useState({});
  const [carouselImages, setCarouselImages] = useState([]);

  const navigate = useNavigate();

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await makeApiCall('user/products');
        // Ensure we have an array of products
        const productsArray = Array.isArray(response) ? response : [];
        
        // Map through products only if we have an array
        const productsWithImages = productsArray.map(product => ({
          ...product,
          imageUrl: product.images?.[0] || null
        }));
        
        setProducts(productsWithImages);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Set empty array on error
      }
    };

    const fetchWishlist = async () => {
      try {
        const response = await makeApiCall('user/wishlist');
        setWishlist(response || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await makeApiCall('user/carousel');
        // Ensure we have an array of images
        const imagesArray = Array.isArray(response) ? response : [];
        setCarouselImages(imagesArray);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
        setCarouselImages([]); // Set empty array on error
      }
    };

    const fetchVouchers = async () => {
      try {
        const response = await makeApiCall('voucher/getVouchers');
        // Ensure we have an array of vouchers
        const vouchersArray = Array.isArray(response) ? response : [];
        
        const currentTime = new Date().getTime();
        const validVouchers = vouchersArray.filter(voucher => {
          const startTime = new Date(voucher.start_time).getTime();
          const endTime = new Date(voucher.end_time).getTime();
          return startTime <= currentTime && endTime > currentTime;
        });
        
        setVouchers(validVouchers);
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
        setVouchers([]); // Set empty array on error
      }
    };

    // Initial fetch
    fetchProducts();
    fetchWishlist();
    fetchImages();
    fetchVouchers();

    // Set up intervals
    const productInterval = setInterval(fetchProducts, 60000);
    const wishlistInterval = setInterval(fetchWishlist, 60000);
    const imageInterval = setInterval(fetchImages, 60000);
    const voucherInterval = setInterval(fetchVouchers, 60000);

    // Cleanup
    return () => {
      clearInterval(productInterval);
      clearInterval(wishlistInterval);
      clearInterval(imageInterval);
      clearInterval(voucherInterval);
    };
  }, []);

  const toggleFavorite = async (productId) => {
    try {
      const response = await makeApiCall(`user/wishlist/${productId}`, {
        method: 'POST'
      });
      // Handle response
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const closeDialog = () => setShowDialog(false);

  const goToWishlist = () => {
    closeDialog();
    navigate("/wishlist");
  };


  const handleCategoryClick = (categoryName) => {
    navigate(`/shopCategory?category=${encodeURIComponent(categoryName)}`);
  };

  const [visibleProducts, setVisibleProducts] = useState({});
  const productsPerView = 5;

  useEffect(() => {
    const initialVisibleProducts = {};
    Object.keys(categoriesAndProducts).forEach((category) => {
      initialVisibleProducts[category] = 0; // Start index for each category
    });
    setVisibleProducts(initialVisibleProducts);
  }, [categoriesAndProducts]);

  // Modified scroll functions
  const scrollLeft = (category) => {
    setVisibleProducts((prev) => ({
      ...prev,
      [category]: Math.max(0, prev[category] - productsPerView),
    }));
  };

  const scrollRight = (category) => {
    const categoryProducts = categoriesAndProducts[category] || [];
    const maxStartIndex = Math.max(
      0,
      categoryProducts.length - productsPerView
    );
    setVisibleProducts((prev) => ({
      ...prev,
      [category]: Math.min(maxStartIndex, prev[category] + productsPerView),
    }));
  };


  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(getApiUrl('voucher/getVouchers'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const currentTime = new Date().getTime();

        const validVouchers = response.data.filter((voucher) => {
          const isEligibleUser = voucher.eligible_rebid_users.includes(userId);
          const isRebidActive =
            voucher.rebid_active &&
            new Date(voucher.rebid_end_time).getTime() > currentTime;
          const isActiveVoucher =
            new Date(voucher.start_time).getTime() <= currentTime &&
            new Date(voucher.end_time).getTime() > currentTime;

          return (isEligibleUser && isRebidActive) || isActiveVoucher;
        });

        const freeVouchers = validVouchers.filter((voucher) => voucher.price === 0);
        const paidVouchers = validVouchers.filter((voucher) => voucher.price !== 0);

        setVouchers([...freeVouchers, ...paidVouchers]);
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
      }
    };

    fetchVouchers();

    // Change polling interval to 30 seconds instead of 1 second
    const intervalId = setInterval(fetchVouchers, 30000);

    return () => clearInterval(intervalId);
  }, [userId, token]); // Add token to dependencies

  

  const startCountdown = (endTime) => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId); // Cleanup on component unmount
  };

  // const handleClaimVoucher = (voucher) => {
  //   if (firstFreeVoucher?.price === 0) {
  //     navigate(`/eventDetail`, { state: { voucher } });
  //   } else {
  //     navigate(`/payment/${voucher._id}`, { state: { voucher } });
  //   }
  // };

  

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + 10); // Increase the count to show more products
  };

 



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
      <OrginalNavbar />
      <NavbarWithMenu />

      {showDialog && (
        <WishlistDialog
          message={dialogMessage}
          onClose={closeDialog}
          onGoToWishlist={goToWishlist}
        />
      )}

      {/* Image Carousel */}
      <ResponsiveCarousel carouselImages={carouselImages}/>

      <div className="p-6 mx-auto max-w-7xl">
        {/* Flex Layout for Side-by-Side Design */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Categories Section */}
          <div className="flex-2 space-y-8">
            <h2 className="text-xl font-bold text-blue-950">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Fashion Category Card */}
              <div
                onClick={() => handleCategoryClick("Stationary")}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 cursor-pointer"
              >
                <div className="relative h-40">
                  <img
                    src="https://media.istockphoto.com/id/485725200/photo/school-and-office-accessories-on-wooden-background.jpg?s=612x612&w=0&k=20&c=PWgiIA-7_QDC_PXnEhwZqDLDDzrNMIxxJjBeD4h4oLM="
                    alt="Fashion"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-700">Stationary</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    All Stationary items under this
                  </p>
                </div>
              </div>

              {/* Electronics Category Card */}
              <div
                onClick={() => handleCategoryClick("Electronics and Home Appliances")}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 cursor-pointer"
              >
                <div className="relative h-40">
                  <img
                    src="https://assets.architecturaldigest.in/photos/60084fc951daf9662c149bb9/16:9/w_2560%2Cc_limit/how-to-clean-gadgets-1366x768.jpg"
                    alt="Electronics"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-700">
                    Electronics and Home Appliances
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Latest gadgets and devices at unbeatable prices.
                  </p>
                </div>
              </div>

              {/* Home Appliances Category Card */}
              <div
                onClick={() => handleCategoryClick("Jwellery")}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 cursor-pointer"
              >
                <div className="relative h-40">
                  <img
                    src="https://d25xd2afqp2r8a.cloudfront.net/blog/14f491d8-2176-40a2-85fd-5c97cfa81c42.jpg"
                    alt="Home Appliances"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-700">
                    Jwellery
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    High-quality appliances for a better home experience.
                  </p>
                </div>
              </div>

              {/* Vehicles Category Card */}
              <div
                onClick={() => handleCategoryClick("Decor and Dine")}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 cursor-pointer"
              >
                <div className="relative h-40">
                  <img
                    src="https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?cs=srgb&dl=pexels-sammsara-luxury-modern-home-372468-1099816.jpg&fm=jpg"
                    alt="Vehicles"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-700">
                    Decore and Dine
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Find the best vehicles and accessories for your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Voucher Section */}
          <VouchersCarousel vouchers={vouchers}/>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 ml-28">
          Products
        </h2>
      </div>

      {/* Product Cards Container */}
      <div className="p-4 grid gap-8 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-5 mx-auto max-w-7xl">
        {/* Product Cards */}
        {products.slice(0, visibleCount).map((product) => (
          <Link key={product.id} to={`/singleProduct/${product._id}`}>
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 "
            >
              {/* Favorite Button */}
              <button
                className={`absolute top-4 right-4 p-2 bg-white border border-gray-400 rounded-full ${
                  wishlist[product._id] ? "text-red-500" : "text-gray-500"
                }`}
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
                  {product.description && product.description.length > 20
                    ? `${product.description.slice(0, 20)}...`
                    : product.description || "No description available."}
                </p>
                {/* <p className="text-sm text-gray-500 mt-1 mb-2">
                  {product.category}
                </p> */}

                <div className="flex items-center">
                  <p className="text-gray-500 line-through mr-2">
                    ₹{formatCurrency(product.productPrice)}
                  </p>
                  <span className="text-lg text-bold text-green-500 mr-2">
                    ₹{formatCurrency(product.salePrice)}
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

      {/* Carousel Container */}
      <ProductCarousel
        categoriesAndProducts={categoriesAndProducts}
        formatCurrency={formatCurrency}
      />

      <Footer />
      <div className="fixed bottom-8 right-8 z-50">
        <ChatBotButton />
      </div>
    </div>
  );
};

export default HomePage;
