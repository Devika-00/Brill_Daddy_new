import React, { useState, useEffect } from "react";
import ImageOne from "../../assets/Group1.png";
import ImageTagLine from "../../assets/Group 4.png";
import ImageTwo from "../../assets/Group2.png";

const ResponsiveCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    ImageOne,
    ImageTagLine,
    ImageTwo,
    ImageTagLine,
    ImageOne,
    ImageTagLine,
    ImageTwo,
    ImageTagLine,
    ImageOne,
    ImageTagLine,
    ImageTwo,
    ImageTagLine,
    ImageOne,
    ImageTagLine,
    ImageTwo,
    ImageTagLine,
  ];

  const handlePrev = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Carousel Wrapper */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {carouselImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Carousel ${index}`}
            className="w-full h-44 sm:h-44 md:h-44 object-cover"
          />
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
    </div>
  );
};

export default ResponsiveCarousel;
