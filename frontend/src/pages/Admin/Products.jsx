import React, { useState, useEffect } from "react";
import Navbar from "../../components/Admin/Navbar";
import Sidebar from "../../components/Admin/Sidebar";
import axios from "axios";
import { SERVER_URL } from "../../Constants";
import { uploadImagesToCloudinary } from "../../Api/uploadImage";

const Product = () => {
  const [products, setProducts] = useState([]); // Initialize with an empty array
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salesPrice: "",
    discount: "",
    color: "",
    mainImage: "",
    smallImages: [],
    quantity: "",
  });

  useEffect(() => {
    // Fetch brands and categories
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${SERVER_URL}/admin/brands`),
          axios.get(`${SERVER_URL}/admin/categories`),
        ]);
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching brands or categories:", error);
        setBrands([]);
        setCategories([]);
      }
    };

    fetchBrandsAndCategories(); // Call the fetch function

    // Fetch products from the database
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/admin/products`);
        const populatedProducts = await Promise.all(
          response.data.map(async (product) => {
            const populatedProduct = await axios.get(
              `${SERVER_URL}/admin/products/${product._id}?populate=images`
            );
            return populatedProduct.data;
          })
        );
        setProducts(populatedProducts); // Set fetched products with populated images
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Set to empty array on error
      }
    };

    fetchProducts(); // Call the fetch function
  }, []);

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleAddProductSubmit = async () => {
    // Ensure sales price is valid
    if (parseFloat(newProduct.salesPrice) >= parseFloat(newProduct.price)) {
      alert("Sales price should be less than price");
      return;
    }

    // Upload main image to Cloudinary
    const mainImageUrl = await uploadImagesToCloudinary(newProduct.mainImage);
    if (!mainImageUrl) return; // Handle upload error

    // Upload small images to Cloudinary
    const smallImagesUrls = await Promise.all(
      newProduct.smallImages.map((image) => uploadImagesToCloudinary(image))
    );

    // Create product object with uploaded image URLs
    const productWithImages = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      salesPrice: newProduct.salesPrice,
      category: newProduct.category,
      brand: newProduct.brand,
      quantity: newProduct.quantity,
      color: newProduct.color,
      discount: newProduct.discount,
      images: {
        thumbnailUrl: mainImageUrl, // Main image
        imageUrl: smallImagesUrls.filter((url) => url), // Small images
      },
    };

    try {
      // Send product data to the backend
      const response = await axios.post(
        `${SERVER_URL}/admin/addProducts`,
        productWithImages
      );
      if (response.status === 201) {
        // Update the product list after successful save
        setProducts([...products, response.data]);

        // Reset the product form
        setNewProduct({
          name: "",
          description: "",
          category: "",
          brand: "",
          price: "",
          salesPrice: "",
          discount: "",
          color: "",
          mainImage: "",
          smallImages: [],
          quantity: "",
        });

        setIsAddModalOpen(false);
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct({ ...product, mainImage: "", smallImages: [] }); // Reset images for upload
    setIsEditModalOpen(true);
  };

  const handleEditProductSubmit = async () => {
    // Ensure sales price is valid
    if (parseFloat(newProduct.salesPrice) >= parseFloat(newProduct.price)) {
      alert("Sales price should be less than price");
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      salesPrice: newProduct.salesPrice,
      category: newProduct.category,
      brand: newProduct.brand,
      quantity: newProduct.quantity,
      color: newProduct.color,
      discount: newProduct.discount,
    };

    // Handle image uploads if new images are provided
    if (newProduct.mainImage) {
      updatedProduct.images.thumbnailUrl = await uploadImagesToCloudinary(newProduct.mainImage);
    }

    if (newProduct.smallImages.length > 0) {
      updatedProduct.images.imageUrl = await Promise.all(
        newProduct.smallImages.map((image) => uploadImagesToCloudinary(image))
      );
    }

    try {
      // Send updated product data to the backend
      const response = await axios.put(
        `${SERVER_URL}/admin/updateProducts/${selectedProduct._id}`,
        updatedProduct
      );
      console.log(response,"evide entha avastha")
      if (response.status === 200) {
        // Update the product list after successful update
        setProducts(products.map(product => product._id === selectedProduct._id ? response.data : product));

        setIsEditModalOpen(false);
        setNewProduct({
          name: "",
          description: "",
          category: "",
          brand: "",
          price: "",
          salesPrice: "",
          discount: "",
          color: "",
          mainImage: "",
          smallImages: [],
          quantity: "",
        });
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    }
  };

  const handleImageUpload = (e, type) => {
    const files = e.target.files;

    if (type === "main") {
      // Handle single main image
      setNewProduct((prev) => ({
        ...prev,
        mainImage: files[0], // Assuming it's a file input
      }));
    } else if (type === "small") {
      // Handle multiple small images
      setNewProduct((prev) => ({
        ...prev,
        smallImages: Array.from(files), // Convert files to array
      }));
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${SERVER_URL}/admin/deleteProducts/${productId}`);
      if (response.status === 200) {
        // Remove the deleted product from the state
        setProducts(products.filter((product) => product._id !== productId));
        alert("Product deleted successfully.");
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product.");
    }
  };


  

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-700">Product List</h2>
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Image
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Product Details
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {product.name}
                    </td>
                    <td className="px-4 py-2">
                      {product.images.length > 0 &&
                      product.images[0].thumbnailUrl ? ( // Check if images exist
                        <img
                          src={product.images[0].thumbnailUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <span></span> // Fallback text if no image is available
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="text-blue-500 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                    <td className="px-4 py-2">
                    <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Product Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-2/4">
                <h3 className="text-xl font-bold mb-2">Add New Product</h3>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Product Name"
                />
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Description"
                />
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="border p-2 mb-3 w-full rounded-md"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  value={newProduct.brand}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                  className="border p-2 mb-3 w-full rounded-md"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Price"
                />
                <input
                  type="number"
                  value={newProduct.salesPrice}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, salesPrice: e.target.value })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Sales Price"
                />
                <input
                  type="number"
                  value={newProduct.discount}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, discount: e.target.value })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Discount"
                />
                <input
                  type="text"
                  value={newProduct.color}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, color: e.target.value })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Color"
                />
                  <input
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, quantity: e.target.value })
                    }
                    className="border p-2 mb-2 w-full rounded-md"
                    placeholder="Quantity"
                  />
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, "main")}
                  className="border p-2 mb-2 w-full rounded-md"
                  accept="image/*"
                />
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, "small")}
                  className="border p-2 mb-2 w-full rounded-md"
                  multiple
                  accept="image/*"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProductSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          )}

           {/* Product Details Modal */}
           {isModalOpen && selectedProduct && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h3 className="text-xl font-bold mb-4">Product Details</h3>
                <div className="mb-4">
                  <img
                    src={selectedProduct.images[0]?.thumbnailUrl || ""}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover mb-4"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Name:</strong> {selectedProduct.name}
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedProduct.category}
                  </div>
                  <div>
                    <strong>Brand:</strong> {selectedProduct.brand}
                  </div>
                  <div>
                    <strong>Price:</strong> ${selectedProduct.productPrice}
                  </div>
                  <div>
                    <strong>Sales Price:</strong> ${selectedProduct.salePrice}
                  </div>
                  <div>
                    <strong>Discount:</strong> {selectedProduct.discount}%
                  </div>
                  <div>
                    <strong>Color:</strong> {selectedProduct.color}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {selectedProduct.quantity}
                  </div>
                  <div className="col-span-2">
                    <strong>Description:</strong>
                    <p>{selectedProduct.description}</p>
                  </div>
                    <strong>Sub Images:</strong>
                  <div className="grid grid-cols-5 gap-2">
              {selectedProduct.images[0]?.imageUrl.map((url, index) => (
                <img 
                  key={index} 
                  src={url} 
                  alt={`Product Image ${index + 1}`} 
                  style={{ width: '700px', height: '50px', margin: '10px' }}
                />
              ))}
            </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

            {/* Edit Product Modal */}
            {isEditModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-2/4">
                <h3 className="text-xl font-bold mb-4">Edit Product</h3>
                <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  <p className="font-semibold text-gray-500 ml-1">Name</p>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <p className="font-semibold text-gray-500 ml-1">Description</p>
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <p className="font-semibold text-gray-500 ml-1">Category</p>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="font-semibold text-gray-500 ml-1">Brand</p>
                  <select
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <p className="font-semibold text-gray-500 ml-1">ProductPrice</p>
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.productPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <p className="font-semibold text-gray-500 ml-1">SalesPrice</p>
                  <input
                    type="number"
                    placeholder="Sales Price"
                    value={newProduct.salesPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, salesPrice: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <p className="font-semibold text-gray-500 ml-1">Discount</p>
                  <input
                    type="number"
                    placeholder="Discount"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <p className="font-semibold text-gray-500 ml-1">colour</p>
                  <input
                    type="text"
                    placeholder="Color"
                    value={newProduct.color}
                    onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <p className="font-semibold text-gray-500 ml-1">Quantity</p>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    className="border p-2 rounded"
                  />
                  <p className="font-semibold text-gray-500 ml-1">Main Image</p>
                  {/* First Image Upload Input */}
                  <input
                    type="file"
                    onChange={(e) => handleImageUpload(e, "main")}
                    className="border p-2 rounded"
                  />
                  
                  {/* Display Thumbnail URL under the first input */}
                  {newProduct?.images[0]?.thumbnailUrl && (
                    <div className="mt-2">
                      <img src={newProduct?.images[0]?.thumbnailUrl} alt="Thumbnail" className="h-20 w-20 object-cover" />
                    </div>
                  )}
                  <p className="font-semibold text-gray-500 ml-1">sub Image</p>
                  {/* Second Image Upload Input */}
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleImageUpload(e, "small")}
                    className="border p-2 rounded"
                  />
                  
                  {/* Display Image URLs under the second input */}
                  {newProduct.images && newProduct.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {newProduct?.images[0]?.imageUrl.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="h-20 w-20 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-gray-300 px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditProductSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Product;
