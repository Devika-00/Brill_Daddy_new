import React, { useState, useEffect } from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { SERVER_URL } from "../../Constants/index";
import { useLocation } from 'react-router-dom';

const ShopCategory = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const categoryQuery = query.get('category') || '';
    setSelectedCategory(categoryQuery);
    setSearch(''); // Reset search input if necessary
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
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

            {/* Display selected category heading */}
          {selectedCategory && (
            <h2 className="text-2xl font-bold text-center col-span-4 mb-3 text-blue-900">
              {selectedCategory} Products
            </h2>
          )}

          {/* Sidebar for categories, search, and sorting */}
          <section className="col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ml-10 mr-10">
              {displayedProducts.map((product) => (
                <div
                  key={product._id}
                  className="relative bg-white p-4 rounded-lg shadow-lg"
                >
                  <button className="absolute top-4 right-4 p-2 bg-white border border-gray-400 rounded-full text-gray-500 hover:text-red-500">
                    <FaHeart />
                  </button>

                  <a href={`/singleProduct/${product._id}`}>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-56 w-full object-cover rounded-lg mb-4"
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
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopCategory;