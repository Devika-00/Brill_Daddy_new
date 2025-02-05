import React, { useState, useEffect } from "react";

const ResponsiveCarousel = ({carouselImages}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const handlePrev = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, [carouselImages.length]);

  return (
    <div className="relative w-full overflow-hidden">
      {carouselImages.length > 0 ? (
        <>
          {/* Carousel Wrapper */}
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {carouselImages.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <img
                  src={image.imageUrl}
                  alt={`Carousel ${index}`}
                  className="w-full md:h-44 md:object-cover h-24 "
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100 focus:outline-none"
          >
            &#8249;
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100 focus:outline-none"
          >
            &#8250;
          </button>
        </>
      ) : (
        <div className="text-center text-gray-500">Loading images...</div>
      )}
    </div>
  );
};

export default ResponsiveCarousel;