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
    productPrice: "",
    salePrice: "",
    discount: "",
    color: "",
    mainImage: "",
    smallImages: [],
    quantity: "",
    existingMainImage: null,
    existingSmallImages: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    productPrice: "",
    salePrice: "",
    discount: "",
    category: "",
    color: "",
    brand: "",
    quantity: "",
    mainImage: "",
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
        const sortedProducts = populatedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedProducts);
        // Set fetched products with populated images
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Set to empty array on error
      }
    };

    fetchProducts(); // Call the fetch function
  }, []);

  const validateForm = () => {
    let formErrors = {};

    // Name validation: Minimum 2 characters, Max 30 characters, and no more than 10 digits allowed
    if (newProduct.name.length < 2) {
      formErrors.name = "Product name must be at least 2 characters.";
    } else if (newProduct.name.length > 30) {
      formErrors.name = "Product name can have a maximum of 30 characters.";
    }

    // Description validation: Max 150 characters
    if (newProduct.description.length > 150) {
      formErrors.description =
        "Description can have a maximum of 150 characters.";
    }

    // Price, Sales Price, and Discount validation: Must be numbers (no strings or alphabets)
    if (isNaN(newProduct.productPrice) || newProduct.productPrice < 0) {
      formErrors.productPrice = "Price must be a valid number.";
    }
    if (isNaN(newProduct.salePrice) || newProduct.salePrice < 0) {
      formErrors.salePrice = "Sales price must be a valid number.";
    }
    if (isNaN(newProduct.discount) || newProduct.discount < 0) {
      formErrors.discount = "Discount must be a valid number.";
    }
    if (isNaN(newProduct.quantity) || newProduct.quantity < 0) {
      formErrors.quantity = "Discount must be a valid number.";
    }

    // Required fields validation
    if (!newProduct.name) formErrors.name = "Product name is required.";
    if (!newProduct.description)
      formErrors.description = "Description is required.";
    if (!newProduct.productPrice)
      formErrors.productPrice = "Price is required.";
    if (!newProduct.salePrice)
      formErrors.salePrice = "Sales price is required.";
    if (!newProduct.discount) formErrors.discount = "Discount is required.";
    if (!newProduct.category) formErrors.category = "Category is required.";
    if (!newProduct.brand) formErrors.brand = "Brand is required.";
    if (!newProduct.color) formErrors.color = "Color is required.";
    if (!newProduct.quantity) formErrors.quantity = "Quantity is required.";
    if (!newProduct.mainImage) formErrors.mainImage = "Main image is required.";

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleAddProductSubmit = async () => {
    if (!validateForm()) return;
    // Ensure sales price is valid
    if (
      parseFloat(newProduct.salePrice) >= parseFloat(newProduct.productPrice)
    ) {
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
      productPrice: newProduct.productPrice,
      salePrice: newProduct.salePrice,
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
          productPrice: "",
          salePrice: "",
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
    setNewProduct({
      ...product,
      mainImage: "",
      smallImages: [],
      existingMainImage: product.images[0]?.thumbnailUrl || null,
      existingSmallImages: product.images[0]?.imageUrl || [],
    }); // Reset images for upload
    setIsEditModalOpen(true);
  };

  const handleRemoveMainImage = () => {
    setNewProduct((prev) => ({
      ...prev,
      mainImage: "",
      existingMainImage: null,
    }));
  };

  // New method to remove small image
  const handleRemoveSmallImage = (index) => {
    setNewProduct((prev) => {
      // Create a copy of existing small images
      const updatedExistingSmallImages = [...prev.existingSmallImages];
      updatedExistingSmallImages.splice(index, 1);

      return {
        ...prev,
        existingSmallImages: updatedExistingSmallImages,
      };
    });
  };

  const handleEditProductSubmit = async () => {
    // Ensure sales price is valid
    if (
      parseFloat(newProduct.salePrice) >= parseFloat(newProduct.productPrice)
    ) {
      alert("Sales price should be less than price");
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      name: newProduct.name,
      description: newProduct.description,
      productPrice: newProduct.productPrice,
      salePrice: newProduct.salePrice,
      category: newProduct.category,
      brand: newProduct.brand,
      quantity: newProduct.quantity,
      color: newProduct.color,
      discount: newProduct.discount,
      images: {
        thumbnailUrl: newProduct.existingMainImage,
        imageUrl: newProduct.existingSmallImages,
      },
    };

    // Handle image uploads if new images are provided
    if (newProduct.mainImage) {
      const mainImageUrl = await uploadImagesToCloudinary(newProduct.mainImage);
      updatedProduct.images.thumbnailUrl = mainImageUrl;
    }

    // Handle small images upload
    if (newProduct.smallImages.length > 0) {
      const smallImagesUrls = await Promise.all(
        newProduct.smallImages.map((image) => uploadImagesToCloudinary(image))
      );

      // Combine existing and new small images
      updatedProduct.images.imageUrl = [
        ...newProduct.existingSmallImages,
        ...smallImagesUrls,
      ];
    }

    try {
      // Send updated product data to the backend
      const response = await axios.put(
        `${SERVER_URL}/admin/updateProducts/${selectedProduct._id}`,
        updatedProduct
      );

      if (response.status === 200) {
        // Update the product list after successful update
        setProducts(
          products.map((product) =>
            product._id === selectedProduct._id ? response.data : product
          )
        );

        setIsEditModalOpen(false);
        setNewProduct({
          name: "",
          description: "",
          category: "",
          brand: "",
          productPrice: "", // Explicitly set these
          salePrice: "",
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
      const response = await axios.delete(
        `${SERVER_URL}/admin/deleteProducts/${productId}`
      );
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
              onClick={() => setIsAddModalOpen(true)}
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
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}

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
                {errors.description && (
                  <p className="text-red-500 text-xs">{errors.description}</p>
                )}
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
                {errors.category && (
                  <p className="text-red-500 text-xs">{errors.category}</p>
                )}
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
                {errors.brand && (
                  <p className="text-red-500 text-xs">{errors.brand}</p>
                )}
                <input
                  type="number"
                  value={newProduct.productPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productPrice: e.target.value,
                    })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Price"
                />
                {errors.productPrice && (
                  <p className="text-red-500 text-xs">{errors.productPrice}</p>
                )}
                <input
                  type="number"
                  value={newProduct.salePrice}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, salePrice: e.target.value })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Sales Price"
                />
                {errors.salePrice && (
                  <p className="text-red-500 text-xs">{errors.salePrice}</p>
                )}
                <input
                  type="number"
                  value={newProduct.discount}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, discount: e.target.value })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Discount"
                />
                {errors.discount && (
                  <p className="text-red-500 text-xs">{errors.discount}</p>
                )}
                <input
                  type="text"
                  value={newProduct.color}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, color: e.target.value })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Color"
                />
                {errors.color && (
                  <p className="text-red-500 text-xs">{errors.color}</p>
                )}
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, quantity: e.target.value })
                  }
                  className="border p-2 mb-2 w-full rounded-md"
                  placeholder="Quantity"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs">{errors.quantity}</p>
                )}
                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e, "main")}
                  className="border p-2 mb-2 w-full rounded-md"
                  accept="image/*"
                />
                {errors.mainImage && (
                  <p className="text-red-500 text-xs">{errors.mainImage}</p>
                )}
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
                        style={{
                          width: "700px",
                          height: "50px",
                          margin: "10px",
                        }}
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
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="border p-2 rounded"
                    />
                    <p className="font-semibold text-gray-500 ml-1">
                      Description
                    </p>
                    <textarea
                      placeholder="Description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />
                    <p className="font-semibold text-gray-500 ml-1">Category</p>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, brand: e.target.value })
                      }
                      className="border p-2 rounded"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    <p className="font-semibold text-gray-500 ml-1">
                      ProductPrice
                    </p>
                    <input
                      type="number"
                      placeholder="Price"
                      value={newProduct.productPrice}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          productPrice: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />
                    <p className="font-semibold text-gray-500 ml-1">
                      SalesPrice
                    </p>
                    <input
                      type="number"
                      placeholder="Sales Price"
                      value={newProduct.salePrice}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          salePrice: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />
                    <p className="font-semibold text-gray-500 ml-1">Discount</p>
                    <input
                      type="number"
                      placeholder="Discount"
                      value={newProduct.discount}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          discount: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />
                    <p className="font-semibold text-gray-500 ml-1">colour</p>
                    <input
                      type="text"
                      placeholder="Color"
                      value={newProduct.color}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, color: e.target.value })
                      }
                      className="border p-2 rounded"
                    />
                    <p className="font-semibold text-gray-500 ml-1">Quantity</p>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newProduct.quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          quantity: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />
                    <p className="font-semibold text-gray-500 ml-1">
                      Main Image
                    </p>
                    {/* First Image Upload Input */}
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e, "main")}
                      className="border p-2 rounded"
                    />

                    {/* Display Thumbnail URL under the first input */}
                    {(newProduct.existingMainImage || newProduct.mainImage) && (
                      <div className="mt-2 relative w-20 h-20">
                        <img
                          src={
                            newProduct.mainImage
                              ? URL.createObjectURL(newProduct.mainImage)
                              : newProduct.existingMainImage
                          }
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={handleRemoveMainImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    <p className="font-semibold text-gray-500 ml-1">
                      sub Image
                    </p>
                    {/* Second Image Upload Input */}
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleImageUpload(e, "small")}
                      className="border p-2 rounded"
                    />

                    {/* Display Image URLs under the second input */}
                    {(newProduct.existingSmallImages.length > 0 ||
                      newProduct.smallImages.length > 0) && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {newProduct.existingSmallImages.map((image, index) => (
                          <div key={index} className="relative w-20 h-20">
                            <img
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              onClick={() => handleRemoveSmallImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {newProduct.smallImages.map((image, index) => (
                          <div key={`new-${index}`} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`New Image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              onClick={() => {
                                // Create a new state update to remove the specific new image
                                setNewProduct((prev) => ({
                                  ...prev,
                                  smallImages: prev.smallImages.filter(
                                    (_, i) => i !== index
                                  ),
                                }));
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2"
                            >
                              ×
                            </button>
                          </div>
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
