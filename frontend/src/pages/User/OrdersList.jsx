import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import OrginalNavbar from '../../components/User/OrginalUserNavbar';
import NavbarWithMenu from '../../components/User/NavbarwithMenu';
import Footer from '../../components/User/Footer';
import { useAppSelector } from '../../Redux/Store/store';
import axios from 'axios';
import { SERVER_URL } from "../../Constants";

const OrdersList = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]); // State to hold orders
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});

  

  const user = useAppSelector((state) => state.user);
  const userId = user.id;
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/user/orders`, { params: { userId } }); // Update with your server URL
        setOrders(response.data); // Set fetched orders to state

        const imageUrlsMap = {}; // Create an object to hold image URLs
        for (const order of response.data) {
          for (const item of order.cartItems) {
            const imageId = item.productId.images[0]; // Get the first image ID
            const imageResponse = await axios.get(`${SERVER_URL}/user/images/${imageId}`);
            imageUrlsMap[imageId] = imageResponse.data.imageUrl; // Store the image URL in the map
          }
        }
        setImageUrls(imageUrlsMap);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (userId) {
      fetchOrders(); // Fetch orders only if userId exists
    }
  }, [userId]);

  const handleProductClick = (orderId, productId) => {
    navigate(`/orderDetails/${orderId}/${productId}`); // Navigate with orderId and productId in URL
  };

  console.log(orders,"lalalalalalal")
  console.log(imageUrls,"gggggggggggggggggggg");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white py-0">
      <OrginalNavbar />
      <NavbarWithMenu />

      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold text-center mb-6">Order History</h2>

        {loading ? (
          <p className="text-center">Loading orders...</p> // Loading state message
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
                {/* Order Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
                  <p className="text-green-600 font-semibold">{order.orderStatus}</p>
                  <p className="text-gray-500 text-sm">Ordered on {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p className="text-xl font-semibold">Total: ${order.total}</p>
                </div>

                {/* Products Info */}
                <div className="space-y-4">
                  {order.cartItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleProductClick(order._id,item.productId._id)} // Navigate to product details if needed
                      className="flex flex-col md:flex-row items-center md:space-x-6 cursor-pointer hover:shadow-lg transition bg-gray-100 rounded-lg p-4"
                    >
                      {/* Product Image */}
                      <div className="w-full md:w-1/4 flex justify-center md:justify-start mb-4 md:mb-0">
                        <img
                          src={imageUrls[item.productId.images[0]]} // Assuming productId has an images array
                          alt={item.productId.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="w-full md:w-1/3 text-center md:text-left space-y-1">
                        <h4 className="text-lg font-semibold">{item.productId.name}</h4>
                        <p className="text-gray-600">{item.productId.color}</p> {/* Assuming color is stored in productId */}
                      </div>

                      {/* Price */}
                      <div className="w-full md:w-1/4 text-center md:text-left space-y-1">
                        <p className="text-xl font-semibold">${item.price}</p>
                      </div>

                      {/* Quantity */}
                      <div className="w-full md:w-1/4 text-center md:text-left space-y-1">
                        <p className="text-gray-500 italic">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrdersList;
