import React, { useState,useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Package, Tag, Clock, Gift } from 'lucide-react';
import { FaArrowRight } from 'react-icons/fa';
import { useAppSelector } from "../../Redux/Store/store";

const VouchersCarousel = ({ vouchers }) => {
  const [currentVoucherIndex, setCurrentVoucherIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVoucherIndex((prevIndex) => (prevIndex + 1) % vouchers.length);
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [vouchers.length]);

  const handleClaimVoucher = () => {
    if (user.isAuthenticated) {
      navigate("/event");
    } else {
      navigate("/login");
    }
  };

  const nextVoucher = () => {
    setCurrentVoucherIndex((prev) => 
      (prev + 1) % vouchers.length
    );
  };

  const prevVoucher = () => {
    setCurrentVoucherIndex((prev) => 
      prev === 0 ? vouchers.length - 1 : prev - 1
    );
  };

  return (
    <div className="flex-1 space-y-4 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold text-blue-950 mb-6 text-center sm:text-left">
        Exclusive Vouchers
      </h2>
      
      {/* Vouchers Container */}
      <div className="relative w-full max-w-sm mx-auto lg:max-w-sm">
        {/* Carousel Wrapper */}
        <div className="relative overflow-hidden rounded-xl">
          {vouchers.length > 0 && (
            <div
              className="flex transition-transform duration-500 ease-in-out"
              onClick={() => handleClaimVoucher()}
              style={{
                transform: `translateX(-${currentVoucherIndex * 100}%)`,
                width: `${vouchers.length * 20}%`,
              }}
            >
              {vouchers.map((voucher, index) => (
                <div
                  key={voucher._id}
                  className="w-full flex-shrink-0 bg-gradient-to-r from-violet-500 to-violet-700 rounded-xl shadow-lg overflow-hidden"
                  style={{ width: "100%" }}
                >
                  {/* Free Badge */}
                  {voucher.price === 0 && (
                    <div className="absolute top-2 left-4 z-10">
                      <div className="bg-green-600 text-white font-bold px-3 py-1 rounded-md shadow-lg text-xs sm:text-sm">
                        FREE
                      </div>
                    </div>
                  )}

                  {/* Image Section */}
                  <div className="relative w-full h-52 sm:h-72">
                    <img
                      src={voucher.imageUrl}
                      alt={voucher.voucher_name || "Voucher"}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="p-2 sm:p-6 text-white">
                    <h3 className="text-base sm:text-lg font-bold mb-2">
                      {voucher.voucher_name || "Special Offer"}
                    </h3>
                    <div className="bg-white/10 rounded-lg p-3 space-y-2 mb-2">
                      <div className="flex items-center text-sm sm:text-base">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        <span>
                          {voucher.product_name || "Premium Product"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm sm:text-base">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        <span>Worth ₹{voucher.productPrice || "1000"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-white/90">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        <span className="text-xs sm:text-sm">
                          Valid until{" "}
                          {voucher.end_time
                            ? new Date(
                                voucher.end_time
                              ).toLocaleDateString()
                            : "Dec 31, 2024"}
                        </span>
                      </div>
                      <button
                        className="bg-gradient-to-r from-green-600 to-blue-500 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 hover:scale-105 transition-transform duration-300 flex items-center text-xs sm:text-base"
                        onClick={() => handleClaimVoucher(voucher)}
                      >
                        <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Claim now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Arrows - Only show on desktop */}
        {vouchers.length > 1 && !isMobile && (
          <div className="absolute inset-y-0 flex items-center justify-between w-full pointer-events-none">
            <button
              onClick={prevVoucher}
              className="pointer-events-auto bg-white/20 hover:bg-white/40 rounded-full p-2 ml-2 transition-colors duration-300"
            >
              &#10094;
            </button>
            <button
              onClick={nextVoucher}
              className="pointer-events-auto bg-white/20 hover:bg-white/40 rounded-full p-2 mr-2 transition-colors duration-300"
            >
              &#10095;
            </button>
          </div>
        )}

        {/* Dot Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {vouchers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVoucherIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                index === currentVoucherIndex 
                  ? 'bg-indigo-600' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Show All Vouchers Link */}
      <div className="text-center mt-4">
        <Link
          to="/event"
          className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer inline-flex items-center"
        >
          <span className="text-base sm:text-lg underline">Show all vouchers</span>
          <FaArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
        </Link>
      </div>
    </div>
  );
};

export default VouchersCarousel;