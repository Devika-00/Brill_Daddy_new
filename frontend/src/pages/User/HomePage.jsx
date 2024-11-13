import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { SERVER_URL } from "../../Constants";
import axios from "axios";
import ImageOne from "../../assets/one.jpg";
import ImageTwo from "../../assets/two.jpg";
import { Clock } from "lucide-react";
import { useAppSelector } from "../../Redux/Store/store";

const HomePage = () => {
 
  const [hoveredCard, setHoveredCard] = useState(false);

  const [vouchers, setVouchers] = useState([]);
  const [firstFreeVoucher, setFirstFreeVoucher] = useState(null);  // Store the first free voucher
  

  const user = useAppSelector((state) => state.user);
  const userId = user.id;

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

  const [products, setProducts] = useState([]);
  const [electronicProducts, setElectronicProducts] = useState([]);

  const navigate = useNavigate();

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/products`);
        const products = response.data;

        const filteredProducts = response.data.filter(
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

    fetchProducts();
  }, []);

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

        {/* Voucher Card - Now spans full width of one column */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Inner Voucher Card */}
            <div
              className="transform transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700  overflow-hidden shadow-lg h-full">
                {/* Image Section */}
                <div className="relative h-48">
                  <img
                    src={firstFreeVoucher?.imageUrl}
                    alt={firstFreeVoucher?.voucher_name}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent" />
                  
                  {/* Free Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-400 text-white font-bold px-6 py-2 rounded-lg shadow-lg transform rotate-6">
                      Free
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {firstFreeVoucher?.voucher_name}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    {firstFreeVoucher?.details}
                  </p>

                  {/* Footer Section */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-white/80">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Valid until {firstFreeVoucher ? new Date(firstFreeVoucher.end_time).toLocaleDateString() : "Dec 31, 2024"}</span>
                    </div>
                    
                    <button 
                      className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors duration-300 font-semibold"
                      onClick={() => handleClaimVoucher(firstFreeVoucher)}
                    >
                      Claim Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Show All Vouchers Link */}
            <div className="text-center mt-3 mb-3">
              <Link 
                to="/event" 
                className="text-indigo-600 hover:text-indigo-800 font-medium underline cursor-pointer "
              >
                Show all vouchers
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
