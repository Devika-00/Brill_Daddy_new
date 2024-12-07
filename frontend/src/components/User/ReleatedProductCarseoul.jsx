import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const RelatedProductsCarousel = ({ relatedProducts, formatCurrency, navigate }) => {
  const [visibleProductIndex, setVisibleProductIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Dynamically calculate products per view based on screen width
  const getProductsPerView = () => {
    const width = window.innerWidth;
    if (width >= 1280) return 4;  // Extra large screens
    if (width >= 1024) return 3;  // Large screens
    if (width >= 768) return 2;   // Medium screens
    return 1;                     // Mobile screens
  };

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollLeft = () => {
    const productsPerView = getProductsPerView();
    setVisibleProductIndex(Math.max(0, visibleProductIndex - productsPerView));
  };

  const scrollRight = () => {
    const productsPerView = getProductsPerView();
    const maxStartIndex = Math.max(0, relatedProducts.length - productsPerView);
    setVisibleProductIndex(Math.min(maxStartIndex, visibleProductIndex + productsPerView));
  };

  console.log(relatedProducts,"aaaaaaaaaaaaaaaaaaaaa")

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl overflow-x-hidden">
      <div className="mb-8 sm:mb-10">
        {/* Related Products Header */}
        <div className="py-4">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 text-center sm:text-left">
            Related Products
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="flex items-center justify-center space-x-6">
            {/* Left Arrow */}
            {visibleProductIndex > 0 && (
              <button
                onClick={scrollLeft}
                className="flex-shrink-0 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-110"
              >
                <FaArrowLeft className="text-gray-600 text-xl" />
              </button>
            )}

            {/* Products Container */}
            <div className="w-full max-w-screen-xl overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts
                  .slice(
                    visibleProductIndex,
                    visibleProductIndex + getProductsPerView()
                  )
                  .map((product) => (
                    <Link
                        key={product._id}
                        to={`/singleProduct/${product._id}`}
                        className="block"
                      >
                    <div
                      key={product._id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="relative">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {product.discount}% OFF
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50">
                        <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-2 truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs sm:text-sm text-gray-500 line-through">
                            ₹{formatCurrency(product.productPrice)}
                          </p>
                          <span className="text-sm sm:text-lg text-green-600 font-semibold">
                            ₹{formatCurrency(product.salePrice)}
                          </span>
                        </div>
                        
                      </div>
                    </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Right Arrow */}
            {relatedProducts.length > visibleProductIndex + getProductsPerView() && (
              <button
                onClick={scrollRight}
                className="flex-shrink-0 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-110"
              >
                <FaArrowRight className="text-gray-600 text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductsCarousel;