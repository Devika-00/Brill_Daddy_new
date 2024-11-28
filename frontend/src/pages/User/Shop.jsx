import React, { useState, useEffect } from "react";
import OrginalNavbar from "../../components/User/OrginalUserNavbar";
import NavbarWithMenu from "../../components/User/NavbarwithMenu";
import Footer from "../../components/User/Footer";
import { FaHeart, FaSearch } from "react-icons/fa";
import axios from "axios";
import { SERVER_URL } from "../../Constants/index";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Redux/Store/store";

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "";

  // Convert to string and split decimal parts
  const [integerPart, decimalPart] = value.toString().split(".");

  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Recombine with decimal part if exists
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

const Shop = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState({});
  const [productImageIndices, setProductImageIndices] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;
  const itemsPerPage = 40;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get("search") || "";
    setSearch(searchQuery);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/products`);
        const productsWithImages = await Promise.all(
          response.data.map(async (product) => {
            if (product.images && product.images.length > 0) {
              const imageResponse = await axios.get(
                `${SERVER_URL}/user/images/${product.images[0]}`
              );
              product.imageUrl = imageResponse.data.imageUrl;
              product.imageSubUrl = imageResponse.data.subImageUrl;
            }
            return product;
          })
        );
        setProducts(productsWithImages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/category`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        console.log("Retrieved token:", token); // Log token
        console.log("Retrieved userId:", userId); // Log userId
        if (!userId || !token) return;

        const response = await axios.get(`${SERVER_URL}/user/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if wishlist is empty and only process if not empty
        if (response.data.length > 0) {
          const wishlistItems = response.data.reduce((acc, item) => {
            acc[item.productId._id] = item.wishlistStatus === "added";
            return acc;
          }, {});
          console.log(
            "Wishlist fetched:",
            JSON.stringify(wishlistItems, null, 2)
          );
          setWishlist(wishlistItems);
        } else {
          console.log("Wishlist is empty, no products found.");
          setWishlist({});
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchWishlist();
  }, [userId, token]);


  useEffect(() => {
    const initialImageIndices = products.reduce((acc, product) => {
      acc[product._id] = 0;
      return acc;
    }, {});
    setProductImageIndices(initialImageIndices);
  }, [products]);

  useEffect(() => {
    let intervalId;

    if (hoveredProduct) {
      intervalId = setInterval(() => {
        setProductImageIndices((prevIndices) => {
          const newIndices = { ...prevIndices };
          newIndices[hoveredProduct] =
            (newIndices[hoveredProduct] + 1) %
            products.find((p) => p._id === hoveredProduct).imageSubUrl.length;
          return newIndices;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [hoveredProduct, products]);

  const handleMouseEnter = (productId) => setHoveredProduct(productId);
  const handleMouseLeave = () => setHoveredProduct(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const toggleFavorite = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!userId || !token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const requestBody = {
        productId,
        userId,
        wishlistStatus: wishlist[productId] ? "removed" : "added",
      };

      if (wishlist[productId]) {
        const response = await axios.delete(
          `${SERVER_URL}/user/wishlist/remove`,
          {
            headers,
            data: requestBody,
          }
        );

        if (response.status === 200) {
          setWishlist((prev) => ({ ...prev, [productId]: false }));
          alert("Product removed from wishlist!");
        }
      } else {
        const response = await axios.post(
          `${SERVER_URL}/user/wishlist`,
          requestBody,
          { headers }
        );

        if (response.status === 201) {
          setWishlist((prev) => ({ ...prev, [productId]: true }));
          alert("Product added to wishlist!");
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("There was an issue adding/removing the item from your wishlist.");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory ? product.category === selectedCategory : true) &&
      product.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "priceasc":
        return a.salePrice - b.salePrice;
      case "pricedesc":
        return b.salePrice - a.salePrice;
      default:
        return 0;
    }
  });

  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log(products, "llllllllll");

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);


  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white scrollbar-thin scrollbar-track-gray-100 h-screen overflow-y-scroll">
      <OrginalNavbar />
      <NavbarWithMenu />
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="hidden lg:block p-4 bg-white shadow-md rounded-lg">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Search Products</h3>
              <div className="flex items-center border border-gray-300 rounded-lg px-3">
                <FaSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full py-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Categories</h3>
              <ul>
                <button
                  onClick={() => handleCategoryClick("")}
                  className={`text-gray-700 mb-2 ${
                    !selectedCategory && "font-bold"
                  }`}
                >
                  Show All
                </button>
                {categories.map((category) => (
                  <li key={category._id} className="mb-2">
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className={`text-gray-700 hover:text-blue-600 transition ${
                        selectedCategory === category.name ? "font-bold" : ""
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <label className="mr-2 font-medium">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
                >
                  <option value="default">Relevant</option>
                  <option value="az">A to Z</option>
                  <option value="za">Z to A</option>
                  <option value="priceasc">Price: Low to High</option>
                  <option value="pricedesc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center text-lg font-semibold text-gray-500 mt-10">
                No Products Available
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {displayedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="relative bg-white p-6 rounded-lg shadow-lg"
                      onMouseEnter={() => handleMouseEnter(product._id)}
                      onMouseLeave={handleMouseLeave}
                      
                    >
                      <button
                        className={`absolute top-4 right-4 p-2 bg-white border border-gray-400 rounded-full ${
                          wishlist[product._id]
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                        onClick={(e) => toggleFavorite(product._id, e)} // Pass event object to toggleFavorite
                      >
                        <FaHeart
                          className={
                            wishlist[product._id] ? "fill-current" : ""
                          }
                        />
                      </button>

                      <div
                      onClick={() =>
                        navigate(`/singleProduct/${product._id}`)
                      } 
                      onMouseEnter={() => handleMouseEnter(product._id)}
                      className="cursor-pointer"
                    >
                      <img
                    src={
                      product.imageSubUrl?.[
                        productImageIndices[product._id] || 0
                      ] || product.imageUrl
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                    </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2 truncate">
                          {product.name}
                        </h4>
                        <p className="text-gray-500 mb-4">
                          Category: {product.category}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">
                            ₹{formatCurrency(product.productPrice)}
                          </span>
                          {product.salePrice !== product.productPrice && (
                            <span className="line-through text-gray-400">
                              ₹{formatCurrency(product.salePrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {displayedProducts.length > 0 && totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <ul className="inline-flex items-center">
                      <li>
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-200"
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages).keys()].map((page) => (
                        <li key={page + 1}>
                          <button
                            onClick={() => setCurrentPage(page + 1)}
                            className={`px-4 py-2 bg-white border border-gray-300 ${
                              currentPage === page + 1
                                ? "bg-blue-500 text-white"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            {page + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-200"
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
