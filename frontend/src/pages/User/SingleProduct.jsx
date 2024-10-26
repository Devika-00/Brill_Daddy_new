import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { SERVER_URL } from "../../Constants";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/products/${id}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(response.data.images[0].thumbnailUrl); // Set the main image to the thumbnail
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  // Ensure product is available before rendering
  if (!product) {
    return <div>Loading...</div>; // You might want to show a loading state here
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white">
        <OrginalNavbar />
        <NavbarWithMenu />
        
        {/* Single Product Section */}
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images Section */}
            <div className="flex flex-col items-center">
              <div className="relative overflow-hidden h-96 w-full max-w-md lg:max-w-lg bg-gray-100 rounded-lg cursor-pointer transition-transform duration-300">
                <img 
                  src={mainImage} 
                  alt="Product" 
                  className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-125"
                />
              </div>
              
              {/* Small Images */}
              <div className="flex space-x-4 mt-4">
                {product.images[0].imageUrl.map((img, index) => (
                  <img 
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-20 h-20 rounded-lg cursor-pointer transition-opacity duration-300 hover:opacity-80"
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-700">{product.description}</p>

              {/* Pricing */}
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-red-600">₹{product.salePrice}</span>
                <span className="text-xl text-gray-500 line-through">₹{product.productPrice}</span>
                <span className="text-lg text-green-600">{product.discount}% OFF</span>
              </div>
              <span className="text-2xl font-bold">Category:{product.category}</span>
                <span className="text-xl">Brand:{product.brand}</span>
                <span className="text-lg">Color:{product.color}</span>
              <div>

              </div>

              {/* Colour and Size Options */}
              <div className="flex flex-col space-y-4">
                {/* Add your color and size options here */}
              </div>


              {/* Add to Cart and Buy Now Buttons */}
              <div className="mt-6 flex space-x-4">
                <button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors duration-300 flex items-center">
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Add to Cart
                </button>
                <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-300 flex items-center">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default SingleProduct;
