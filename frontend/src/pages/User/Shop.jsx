import React, { useState, useEffect } from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { FaHeart, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { SERVER_URL } from "../../Constants/index";
import { useLocation } from 'react-router-dom';

const Shop = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('search') || '';
    setSearch(searchQuery);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/products`);
        const productsWithImages = await Promise.all(response.data.map(async (product) => {
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

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/category`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product =>
    (selectedCategory ? product.category === selectedCategory : true) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'az':
        return a.name.localeCompare(b.name);
      case 'za':
        return b.name.localeCompare(a.name);
      case 'priceasc':
        return a.salePrice - b.salePrice;
      case 'pricedesc':
        return b.salePrice - a.salePrice;
      default:
        return 0;
    }
  });

  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
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
                  onClick={() => handleCategoryClick('')}
                  className={`text-gray-700 mb-2 ${!selectedCategory && 'font-bold'}`}
                >
                  Show All
                </button>
                {categories.map((category) => (
                  <li key={category._id} className="mb-2">
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className={`text-gray-700 hover:text-blue-600 transition ${selectedCategory === category.name ? 'font-bold' : ''}`}
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
                    >
                      <button className="absolute top-4 right-4 p-2 bg-white border border-gray-400 rounded-full text-gray-500 hover:text-red-500">
                        <FaHeart />
                      </button>

                      <a href={`/singleProduct/${product._id}`}>
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="h-56 object-cover rounded-lg mb-4"
                        />
                      </a>
                      <div>
                        <h4 className="text-lg font-semibold mb-2 truncate">
                          {product.name}
                        </h4>
                        <p className="text-gray-500 mb-4">
                          Category: {product.category}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">
                            ₹ {product.salePrice}
                          </span>
                          {product.salePrice !== product.productPrice && (
                            <span className="line-through text-gray-400">
                              ₹ {product.productPrice}
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
                            className={`px-4 py-2 bg-white border border-gray-300 ${currentPage === page + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
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
