import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { SERVER_URL } from "../../Constants";
import axios from "axios";
import ImageOne from "../../assets/one.jpg"
import ImageTwo from "../../assets/two.jpg"
import ImageThree from "../../assets/three.jpg"

const HomePage = () => {

  const carouselImages = [ImageOne,ImageTwo,ImageOne,ImageTwo,ImageOne,ImageTwo,ImageOne,ImageTwo];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [products, setProducts] = useState([]);
  const [electronicProducts, setElectronicProducts] = useState([]);
  
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
        const productsWithImages = await Promise.all(products.map(async (product) => {
          if (product.images && product.images.length > 0) {
            const imageResponse = await axios.get(`${SERVER_URL}/user/images/${product.images[0]}`);
            product.imageUrl = imageResponse.data.imageUrl;
          }
          return product;
        }));
    
        setProducts(productsWithImages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  console.log(electronicProducts,"pppppppppppppppppppppp")

  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 5;

  // Carousel Scroll Left
  const scrollLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? electronicProducts.length - productsPerPage : prevIndex - 1
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

  // Calculate visible products
  const visibleProducts = electronicProducts.slice(currentIndex, currentIndex + productsPerPage);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      <OrginalNavbar />
      <NavbarWithMenu />
      
      {/* Image Carousel */}
      <div className="relative w-full overflow-hidden">
        <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
          {carouselImages.map((image, index) => (
            <img key={index} src={image} alt={`Carousel ${index}`} className="w-full h-80 mt-3" />
          ))}
        </div>
      </div>

      {/* Container for featured categories */}
      <div className="p-6 grid gap-8 md:grid-cols-4 sm:grid-cols-2 lg:gap-12 mx-auto max-w-7xl">
        {/* Category Cards */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
          <img
            src="https://static-assets.business.amazon.com/assets/in/24th-jan/705_Website_Blog_Appliances_1450x664.jpg.transform/1450x664/image.jpg"
            alt="Electronics"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-700">Home Appliances</h2>
            <p className="text-gray-500 mt-2">Wide range of Large Appliances to choose from.</p>
          </div>
        </div>

        {/* Card 2 - Fashion */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
          <img
            src="https://st3.depositphotos.com/3591429/14866/i/450/depositphotos_148668333-stock-photo-credit-card-and-fashion-graphic.jpg"
            alt="Fashion"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-700">Fashion</h2>
            <p className="text-gray-500 mt-2">Stylish clothing and accessories for every season.</p>
          </div>
        </div>

        {/* Card 3 - Sports */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
          <img
            src="https://assets.architecturaldigest.in/photos/60084fc951daf9662c149bb9/16:9/w_2560%2Cc_limit/how-to-clean-gadgets-1366x768.jpg"
            alt="Sports"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-700">Electronics</h2>
            <p className="text-gray-500 mt-2">Latest gadgets and devices at unbeatable prices.</p>
          </div>
        </div>

        {/* Card 4 - Events */}
        <div className="bg-blue-200 shadow-lg rounded-lg p-4 hover:shadow-2xl transition duration-300">
          <h2 className="text-xl font-bold text-gray-700 mb-2 text-center">Events</h2>
          <div className="grid gap-3 grid-cols-1 md:grid-row-2">
            {/* Event 1 */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-2 transition-transform transform hover:scale-105 duration-300">
              <img
                src="https://png.pngtree.com/png-clipart/20230809/original/pngtree-design-of-eid-mubarak-gift-coupon-or-voucher-with-blue-background-png-image_10209640.png"
                alt="Event 1"
                className="w-full h-20 object-cover"
              />
            </div>
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-2 transition-transform transform hover:scale-105 duration-300">
              <img
                src="https://png.pngtree.com/png-clipart/20230809/original/pngtree-design-of-eid-mubarak-gift-coupon-or-voucher-with-blue-background-png-image_10209640.png"
                alt="Event 1"
                className="w-full h-20 object-cover"
              />
            </div>
            <div className="mt-2 text-center relative z-10">
              <a
                href="/event"
                className="inline-block px-6 py-2 text-gray-600 hover:text-blue-600 font-semibold transition duration-300"
              >
                View All Events
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 ml-36">Products</h2>
      </div>

      {/* Product Cards Container */}
      <div className="p-6 grid gap-8 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-5 mx-auto max-w-7xl">
        {/* Product Cards */}
        {products.map((product) => (
           <Link key={product.id} to={`/singleProduct/${product._id}`}>
  <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 ">
    <img src={product.imageUrl || product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
    
    <div className="p-2">
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-2">{product.description || "No description available."}</p>
      <p className="text-sm text-gray-500 mt-1 mb-2">{product.category}</p>
      
      <div className="flex items-center">
        <p className="text-gray-500 line-through mr-2">{product.productPrice}</p>
        <span className="text-lg text-bold text-green-500 mr-2">{product.salePrice}</span>
        <span className="text-blue-600 font-medium">{product.discount}% off</span>
      </div>
    </div>
  </div>
  </Link>
))}

      </div>

      {/* View More Button */}
      <div className="flex justify-center mt-6">
        <Link to="/shop" className=" text-blue-950 py-2 px-4 rounded hover:bg-blue-200 transition duration-300">
          View More
        </Link>
      </div>

      {/* Products Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4 ml-36 mt-4">Electronics</h2>
      </div>

      {/* Carousel Container */}
      <div className="relative flex items-center">
        {/* Left Scroll Arrow */}
        <button onClick={scrollLeft} className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg">
          <FaArrowLeft />
        </button>

        {/* Product Cards Container */}
        <div className="p-6 grid gap-8 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-5 mx-auto max-w-7xl">
          {/* Product Cards */}
          {electronicProducts.map((product) => (
            <Link key={product.id} to={`/singleProduct/${product._id}`}>
                        <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 relative">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-bold text-gray-700">{product.name}</h2>
                                <p className="text-gray-500 mt-2 line-through">{product.productPrice}</p>
                                <span className="text-lg text-bold text-green-500 mr-2">{product.salePrice}</span>
                                <span className="text-blue-600 font-medium">{product.discount}% off</span>
                            </div>
                        </div>
                        </Link>
                    ))}
        </div>

        {/* Right Scroll Arrow */}
        <button onClick={scrollRight} className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg">
          <FaArrowRight />
        </button>
      </div>


      <Footer />
    </div>
  );
};

export default HomePage;
