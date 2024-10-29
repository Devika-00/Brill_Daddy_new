const Category = require("../Models/categoryModel");
const Brand = require("../Models/brandModel");
const Images = require("../Models/imageModel");
const Product = require("../Models/productModel");
const User = require("../Models/userModel");
const OTP = require("../Models/otpModel");
const crypto = require("crypto");
const { sendOtpToEmail, sendOtpToPhone } = require('../utils/otpService');
const jwt = require('jsonwebtoken');
const Cart = require("../Models/cartModel");
const mongoose = require('mongoose');
const Wishlist = require("../Models/wishlistModel");
const Address = require("../Models/addressModel");
const Order = require("../Models/orderModel");

const getProducts = async (req,res) =>{
    try {
        const products = await Product.find({});
        res.json(products);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
      }
}

const fetchimages = async (req, res) =>{
    try {
        const id = req.params.id;
        const image = await Images.findById(id);
        if (image) {
          res.json({ imageUrl: image.thumbnailUrl }); // Adjust based on your image model structure
        } else {
          res.status(404).json({ error: "Image not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
}

const fetchCategory = async (req, res) =>{
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const fetchSingleProduct = async (req, res) =>{
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('images'); // Populate images if necessary
         
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } 
    
}

const registerUser = async (req, res) => {
    try {
        console.log(req.body);
      const { username, email, phone } = req.body;
  
      if (!username || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(409).json({ message: 'Email or phone number already in use' });
      }
  
      const newUser = new User({ username, email, phone });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Server error, please try again later' });
    }
  };

  const sendOtp = async (req, res) => {
    try {
      const { identifier } = req.body;
      const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const otpCode = crypto.randomInt(100000, 999999).toString();
      
      // Store the OTP in the database with expiration
      await OTP.create({ userId: user._id, otp: otpCode });
  
      if (/^\d+$/.test(identifier)) {
        // If it's a phone number, format it with the country code
        const formattedPhoneNumber = `+91${identifier}`;
        await sendOtpToPhone(formattedPhoneNumber, otpCode);
      } else {
        // If it's an email, send the OTP to email
        await sendOtpToEmail(identifier, otpCode);
      }
  
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Server error, please try again later' });
    }
  };

  const verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body; // identifier can be phone or email
        
        // Step 1: Find the user by email or phone
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Find the OTP record for the retrieved userId
        const otpRecord = await OTP.findOne({ userId: user._id });

        if (!otpRecord) {
            return res.status(404).json({ message: 'OTP not found or expired' });
        }

        // Step 3: Check if the OTP matches
        if (otpRecord.otp === otp) {

            user.isVerified = true;
            await user.save();

            // Step 4: Generate JWT token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET, // Adjust token expiration as needed
            );

            res.status(200).json({ message: 'OTP verified, login successful',token,username:user.username,id:user._id });
        } else {
            res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};


const addItemToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    // If cart does not exist, create a new one
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      // Check if the product already exists in the cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // If product exists, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // If product does not exist, add as new item
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Error adding product to cart', error });
  }
};


const getCartItems = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId'); // Populates product details
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart.items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Error fetching cart items', error });
  }
};

const removeCartItem = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    console.log(productId);
    console.log(userId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId format' });
    }
    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Convert productId from string to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Filter out the item with the specified productId
    cart.items = cart.items.filter(item => !item.productId.equals(productObjectId));

    console.log(cart.items, "Updated items after removal"); // Log the updated items array

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addWishlist = async (req, res) => {
  try {
    const newWishlistItem = new Wishlist({
        userId: req.params.userId,
        productId: req.body.productId,
    });
    await newWishlistItem.save();
    res.status(201).json(newWishlistItem);
} catch (error) {
    res.status(500).json({ message: "Error adding to wishlist" });
}
};

const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.params.userId }).populate('productId');
    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ productId: req.params.itemId, userId: req.params.userId });
    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addAddress = async (req, res) => {
  const { userId, userName, addressLine, pincode, street, state, flatNumber, phoneNumber, addressType } = req.body;

  try {
    // Create a new address document
    const newAddress = new Address({
      userId,
      userName,
      addressLine,
      pincode,
      street,
      state,
      flatNumber,
      phoneNumber,
      addressType
    });

    // Save address to the database
    await newAddress.save();

    res.status(200).json({ message: 'Address saved successfully', address: newAddress });
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ message: 'Failed to save address' });
  }
};

const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.status(200).json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAddress = async (req, res) => {
  const addressId = req.params.id; // Get the address ID from the URL
  const { userId } = req.body; // Get userId from the request body

  if (!userId) {
    return res.status(400).json({ message: 'User ID not provided' });
  }

  try {
    // Find the address by ID and ensure it belongs to the user
    const address = await Address.findOneAndDelete({ 
      _id: addressId,
      userId: userId 
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found or does not belong to the user' });
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const placeOrder = async (req, res) => {
  try {
    const { userId, cartItems, selectedAddressId, paymentMethod, paid } = req.body;


    // Ensure each item has a salePrice, else default to 0
    const formattedCartItems = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.productId.salePrice  
    }));

    // Calculate total using the validated prices
    let total = formattedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Check if total is NaN and handle error if so
    if (isNaN(total)) {
      return res.status(400).json({ error: 'Invalid sale price in cart items.' });
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      total,
      cartItems: formattedCartItems,
      selectedAddressId,
      paymentMethod,
      paid,
      orderStatus: 'Pending'  // Initial status as 'Pending'
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

const getOrders = async (req, res) => {
  const { userId } = req.query; // Get userId from query params

  try {
    const orders = await Order.find({ userId }) // Find orders by userId
      .populate('cartItems.productId') // Populate product details
      .lean(); // Use lean for better performance

    res.status(200).json(orders); // Send orders back to frontend
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const getOrderDetail = async (req, res) => {
  console.log(req.params.orderId);
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("cartItems.productId", "name description productPrice salePrice images") // Populate product details
      .populate("selectedAddressId"); // Populate address details

      console.log(order,"enthaaa")

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProductSuggestions = async (req, res) => {
  try {
      // Fetch product words from the database
      const products = await Product.find({}, 'word'); // Fetch only the 'word' field
      const suggestions = products.map(product => product.word); // Map to an array of words

      // Respond with the suggestions
      res.status(200).json({ suggestions });
  } catch (error) {
      console.error("Error fetching product suggestions:", error);
      res.status(500).json({ message: "Error fetching product suggestions" });
  }
};



module.exports = { getProducts,fetchimages,fetchCategory,fetchSingleProduct,registerUser,sendOtp,verifyOtp,addItemToCart, getCartItems, removeCartItem,addWishlist,
  getWishlist, removeWishlist,addAddress, getAddress, deleteAddress,placeOrder, getOrders,getOrderDetail, getProductSuggestions,
}