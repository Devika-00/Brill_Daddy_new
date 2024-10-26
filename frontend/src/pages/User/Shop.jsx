import React, { useState } from 'react';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import Footer from '../../components/User/Footer';
import { FaHeart } from 'react-icons/fa'; // Importing heart icon from react-icons

const Shop = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Product 1',
      salePrice: 100,
      productPrice: 150,
      category: { title: 'Category 1' },
      images: [
        {
          thumbnailUrl:
            'https://www.leafstudios.in/cdn/shop/files/1_6b54ff34-acdd-40e6-a08a-f2bfa33a1c7a_800x.png?v=1718706988',
        },
      ],
    },
    {
      id: 2,
      title: 'Product 2',
      salePrice: 200,
      productPrice: 250,
      category: { title: 'Category 2' },
      images: [
        {
          thumbnailUrl:
            'https://rukminim2.flixcart.com/image/850/1000/xif0q/headphone/t/4/p/-original-imagrddw8rpjwfag.jpeg?q=90&crop=false',
        },
      ],
    },
  ]);

  const [categories, setCategories] = useState([
    { _id: 1, title: 'Category 1' },
    { _id: 2, title: 'Category 2' },
  ]);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Function to handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
      {/* Navbar */}
      <OrginalNavbar />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block p-4 bg-white shadow-md rounded-lg">
            {/* Search Box */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Search Products</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
                <button className="absolute right-2 top-2 text-gray-500">
                  <i className="ti-search"></i>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Categories</h3>
              <ul>
                {categories.map((category) => (
                  <li key={category._id} className="mb-2">
                    <a
                      href="#"
                      className="text-gray-700 hover:text-blue-600 transition"
                    >
                      {category.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Section */}
          <section className="lg:col-span-3">
            {/* Sorting Options */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <label className="mr-2 font-medium">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none"
                >
                  <option value="default">Default</option>
                  <option value="az">A to Z</option>
                  <option value="za">Z to A</option>
                  <option value="priceasc">Price: Low to High</option>
                  <option value="pricedesc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Listings */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white p-6 rounded-lg shadow-lg"
                >
                  {/* Heart Icon */}
                  <button className="absolute top-4 right-4 p-2 bg-white border border-gray-400 rounded-full text-gray-500 hover:text-red-500">
                    <FaHeart />
                  </button>

                  <a href={`/product/${product.id}`}>
                    <img
                      src={product.images[0].thumbnailUrl}
                      alt={product.title}
                      className="h-56 object-cover rounded-lg mb-4"
                    />
                  </a>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 truncate">
                      {product.title}
                    </h4>
                    <p className="text-gray-500 mb-4">
                      Category: {product.category.title}
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

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <ul className="inline-flex items-center">
                <li>
                  <a
                    href="#"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-200"
                  >
                    Previous
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-200"
                  >
                    1
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-200"
                  >
                    2
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-200"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Shop;
