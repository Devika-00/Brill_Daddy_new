import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import { SERVER_URL } from "../../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NavbarWithMenu = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentParentId, setCurrentParentId] = useState(null); // Track the current parent category ID
  const navigate = useNavigate();

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios(`${SERVER_URL}/user/category`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    // Check if there are subcategories for this category
    const hasSubcategories = categories.some(
      (category) => category.parentCategory === categoryId
    );

    if (hasSubcategories) {
      setCurrentParentId(categoryId); // Set the clicked category as the current parent
    } else {
      // Navigate to the shop page if no subcategories exist
      setShowCategories(false); // Close the dropdown
      const category = categories.find((cat) => cat._id === categoryId);
      navigate(`/shopCategory?category=${encodeURIComponent(category.name)}`);
    }
  };

  const handleBackClick = () => {
    // Navigate back to the parent category or reset to the top-level categories
    if (currentParentId) {
      const parentCategory = categories.find(
        (category) => category._id === currentParentId
      )?.parentCategory;

      setCurrentParentId(parentCategory || null);
    }
  };

  const handleHomeClick = () => {
    navigate("/"); // Redirect to the home page
  };

  const handleEventsClick = () => {
    navigate("/event"); // Redirect to the events page
  };

  const getDisplayedCategories = () => {
    return categories.filter(
      (category) =>
        (currentParentId === null && category.parentCategory === null) ||
        category.parentCategory === currentParentId
    );
  };

  const renderCategoryList = (categoriesToRender) => {
    return (
      <ul>
        {categoriesToRender.map((category) => (
          <li
            key={category._id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleCategoryClick(category._id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    );
  };

  const displayedCategories = getDisplayedCategories();

  return (
    <>
      <div className="bg-blue-900 text-white font-bold flex justify-between items-center p-2">
        <div className="flex items-center space-x-4">
          {/* All Menu Button */}
          <button
            onClick={toggleCategories}
            className="flex items-center focus:outline-none ml-5"
          >
            <FaBars className="text-white mr-2" />
            <span>All</span>
          </button>

          {/* Home and Events for both mobile and desktop */}
          <span
            className="flex items-center cursor-pointer hover:text-gray-300"
            onClick={handleHomeClick}
          >
            <FaHome className="mr-1 ml-3" />
            Home
          </span>
          <span
            className="cursor-pointer hover:text-gray-300"
            onClick={handleEventsClick}
          >
            Events
          </span>
        </div>
      </div>

      {/* Categories Dropdown */}
      {showCategories && (
        <div className="absolute top-16 left-0 bg-white w-64 h-full shadow-lg z-50">
          <div className="p-4">
            <button
              onClick={toggleCategories}
              className="text-gray-600 text-xl absolute top-2 right-2 focus:outline-none"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {currentParentId
                ? categories.find((cat) => cat._id === currentParentId)?.name
                : "Categories"}
            </h2>

            {currentParentId && (
              <button
                onClick={handleBackClick}
                className="text-blue-500 text-sm mb-4"
              >
                &larr; Back
              </button>
            )}

            {renderCategoryList(displayedCategories)}
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarWithMenu;
