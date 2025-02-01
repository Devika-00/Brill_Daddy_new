import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ProductCarousel = ({ categoriesAndProducts, formatCurrency }) => {
  const [visibleProducts, setVisibleProducts] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Dynamically calculate products per view based on screen width
  const getProductsPerView = () => {
    const width = window.innerWidth;
    if (width >= 1280) return 5;  // Extra large screens
    if (width >= 1024) return 4;  // Large screens
    if (width >= 768) return 3;   // Medium screens
    return 2;                     // Mobile screens
  };

  // Handle responsive design and mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial setup of visible products
    const initialVisibleProducts = {};
    Object.keys(categoriesAndProducts).forEach((category) => {
      initialVisibleProducts[category] = 0;
    });
    setVisibleProducts(initialVisibleProducts);

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [categoriesAndProducts]);

  const scrollLeft = (category) => {
    const productsPerView = getProductsPerView();
    setVisibleProducts((prev) => ({
      ...prev,
      [category]: Math.max(0, prev[category] - productsPerView),
    }));
  };

  const scrollRight = (category) => {
    const productsPerView = getProductsPerView();
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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl overflow-x-hidden">
      {Object.entries(categoriesAndProducts).map(([category, products]) => (
        <div key={category} className="mb-8 sm:mb-10">
          {/* Category Header */}
          <div className="py-4">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4 text-center sm:text-left">
              {category}
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            <div className="flex items-center justify-center">
              {/* Left Arrow - Show on all screens */}
              {visibleProducts[category] > 0 && (
                <button
                  onClick={() => scrollLeft(category)}
                  className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transform -translate-y-1/2 top-1/2"
                >
                  <FaArrowLeft className="text-gray-600" />
                </button>
              )}

              {/* Products Container */}
              <div className="w-full overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {products
                    .slice(
                      visibleProducts[category],
                      visibleProducts[category] + getProductsPerView()
                    )
                    .map((product) => (
                      <Link
                        key={product._id}
                        to={`/singleProduct/${product._id}`}
                        className="block"
                      >
                        <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 relative">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 sm:h-56 object-cover"
                          />
                          <div className="p-3 sm:p-4">
                            <h2 className="text-sm sm:text-lg font-bold text-gray-700 truncate">
                              {product.name}
                            </h2>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-1 sm:mt-2">
                              <p className="text-xs sm:text-sm text-gray-500 line-through">
                                ₹{formatCurrency(product.productPrice)}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm sm:text-lg text-green-500 font-semibold">
                                  ₹{formatCurrency(product.salePrice)}
                                </span>
                                <span className="text-xs sm:text-sm text-blue-600 font-medium">
                                  {product.discount}% off
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Right Arrow - Show on all screens */}
              {products.length >
                visibleProducts[category] + getProductsPerView() && (
                <button
                  onClick={() => scrollRight(category)}
                  className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transform -translate-y-1/2 top-1/2"
                >
                  <FaArrowRight className="text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCarousel;