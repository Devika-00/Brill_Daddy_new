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
const Voucher = require("../Models/voucherModel");
const Wallet = require("../Models/walletModel");
const Winner = require("../Models/winnerModel");
const Bid = require("../Models/bidModel");
const axios = require('axios');
const Razorpay = require('razorpay');
const CarouselImage = require("../Models/carouselModel");



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
          res.json({ imageUrl: image.thumbnailUrl,
            subImageUrl: image.imageUrl,
           }); 
        } else {
          res.status(404).json({ error: "Image not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
}

// const fetchimagesSub = async (req, res) =>{
//   try {
//       const id = req.params.id;
//       const image = await Images.findById(id);
//       if (image) {
//         res.json({ imageSubUrl: image.imageUrl }); 
//       } else {
//         res.status(404).json({ error: "Image not found" });
//       }
//     } catch (error) {
//       res.status(500).json({ error: "Server error" });
//     }
// }

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
       
      const { username, email, phone, location } = req.body;
  
      if (!username || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(409).json({ message: 'Email or phone number already in use' });
      }

       // Fetch human-readable address using a geocoding API
       const apiKey = 'AIzaSyAPqZgIUS_du5n_W_Aaw4hQkaxNouifWaM'; // Replace with your Google Maps API key
       const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}`;
       let registerAddress = 'Unknown Address';

       try {
           const response = await axios.get(geocodeUrl);
           if (response.data.status === 200 && response.data.results.length > 0) {
               registerAddress = response.data.results[0].formatted_address;
           }
       } catch (geocodeError) {
           console.error('Error fetching address from geocoding API:', geocodeError.message);
       }
  
      const newUser = new User({ username, email, phone, location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      registerAddress,
     });
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
  const { userId, productId, quantity, price, walletDiscountAmount } = req.body;

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    // If cart does not exist, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity,
            price: walletDiscountAmount ? price - walletDiscountAmount : price,
            walletDiscountApplied: !!walletDiscountAmount,
            walletDiscountAmount: walletDiscountAmount || 0,
          },
        ],
      });
    } else {
      // Check for an existing item with the same productId and walletDiscountApplied status
      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === productId &&
          item.walletDiscountApplied === !!walletDiscountAmount
      );

      if (existingItem) {
        // Update quantity if the item already exists
        existingItem.quantity += quantity;
      } else {
        // Add a new item to the cart
        cart.items.push({
          productId,
          quantity,
          price: walletDiscountAmount ? price - walletDiscountAmount : price,
          walletDiscountApplied: !!walletDiscountAmount,
          walletDiscountAmount: walletDiscountAmount || 0,
        });
      }
    }

    // Save the updated cart
    await cart.save();

    // Wallet handling
    if (walletDiscountAmount) {
      const userWallet = await Wallet.findOne({ userId });

      if (!userWallet) {
        return res.status(404).json({ message: "Wallet not found for this user" });
      }

      if (userWallet.balance < walletDiscountAmount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      userWallet.balance -= walletDiscountAmount;
      userWallet.transactions.push({
        type: "debit",
        amount: walletDiscountAmount,
        description: "Used for Wallet discount",
      });

      await userWallet.save();
    }

    res.status(200).json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Error adding product to cart", error });
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

const removeCartProduct = async (req, res) => {
  const { userId, productId, walletDiscountApplied } = req.params;

  try {
    // Find the cart for the given user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for user' });
    }

    console.log(cart, "Cart data retrieved");

    console.log('Received productId:', productId);
    cart.items.forEach((item) => {
      console.log('Cart item productId:', item.productId.toString());
      console.log('walletDiscountApplied:', item.walletDiscountApplied === true);
    });


    // Find the item to be removed
    const itemToRemove = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
      item.walletDiscountApplied === true || item.walletDiscountApplied === false// Convert string to boolean
    );

    console.log(itemToRemove, "Item to remove");

    if (!itemToRemove) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // If the item has a wallet discount applied, refund the discount to the wallet
    if (itemToRemove.walletDiscountApplied) {
      const walletDiscountAmount = itemToRemove.walletDiscountAmount * itemToRemove.quantity; // Adjusted for quantity

      // Find the user's wallet
      const userWallet = await Wallet.findOne({ userId });

      if (!userWallet) {
        return res.status(404).json({ message: 'Wallet not found for user' });
      }

      // Add the wallet discount amount back to the wallet balance
      userWallet.balance += walletDiscountAmount;

      userWallet.transactions.push({
        type: 'credit',
        amount: walletDiscountAmount,
        description: 'Credited back the wallet discount amount',
      });

      // Save the updated wallet
      await userWallet.save();
    }

    // Remove the product from the cart
    cart.items = cart.items.filter((item) => item._id.toString() !== itemToRemove._id.toString());

    // Save the updated cart document
    await cart.save();

    res
      .status(200)
      .json({ message: 'Product removed from cart and wallet updated successfully' });
  } catch (error) {
    console.error('Error removing product from cart or updating wallet:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user's cart and clear the items array
    const result = await Cart.findOneAndUpdate(
      { userId: userId }, // Find the cart for the specific user
      { $set: { items: [] } }, // Clear the items array
      { new: true } // Return the updated cart
    );

    if (result) {
      return res.status(200).json({ message: 'Cart cleared successfully' });
    } else {
      return res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ message: 'Server error while clearing cart' });
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

const removeWishlist = async (req, res) => {
  try {
    // Ensure the userId exists in the request user object
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    await Wishlist.findOneAndDelete({ productId: req.params.itemId, userId: req.user.userId });
    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error("Error in removeWishlist:", error);  // Log detailed error
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// userController.js
const addWishlist = async (req, res) => {
  try {
    console.log("User ID:", req.user.userId);  // Log the user ID to confirm it's available

    // Ensure the userId exists in the request user object
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    const existingWishlistItem = await Wishlist.findOne({
      userId: req.user.userId,
      productId: req.body.productId,
    });

    // Check if the item already exists in the wishlist
    if (existingWishlistItem) {
      // Update the wishlistStatus if the product already exists
      existingWishlistItem.wishlistStatus = req.body.wishlistStatus; // Update status
      await existingWishlistItem.save();  // Save the updated item
      return res.status(200).json(existingWishlistItem);  // Return the updated item
    }

    const newWishlistItem = new Wishlist({
      userId: req.user.userId,
      productId: req.body.productId,
      wishlistStatus: req.body.wishlistStatus,
    });

    await newWishlistItem.save();
    res.status(201).json(newWishlistItem);
  } catch (error) {
    console.error("Error in addWishlist:", error);  // Log detailed error
    res.status(500).json({ message: "Error adding to wishlist", error: error.message });
  }
};

// backend/controllers/userController.js
const getWishlist = async (req, res) => {
  try {
    // Ensure userId is available from the token
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    const userId = req.user.userId;

    // Check if the userId is valid as an ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Ensure correct instantiation of ObjectId using new keyword
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find wishlist items associated with the userId
    const wishlistItems = await Wishlist.find({ userId: userObjectId })
                                        .populate('productId');  // Populate the associated product details

    if (!wishlistItems || wishlistItems.length === 0) {
      return res.status(404).json({ message: "No wishlist items found" });
    }

        // Log the retrieved wishlist items for debugging
        console.log("Wishlist items retrieved:", wishlistItems);

    // Return the wishlist items along with the populated product details
    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error("Error in getWishlist:", error);
    res.status(500).json({ message: "Error retrieving wishlist", error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    console.log("reaching");
    const { userId, productId } = req.body;

    // Check if userId and productId are valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Ensure user is authenticated
    if (!req.user || req.user.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: User not authorized" });
    }

    // Remove the product from the user's wishlist
    const result = await Wishlist.findOneAndDelete({ userId: userId, productId: productId });

    if (!result) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    res.status(200).json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Error removing product from wishlist", error: error.message });
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

const getUserAddress = async (req, res) => {
  const { addressId } = req.params; // Get address ID from request parameters

    try {
        const address = await Address.findById(addressId); // Find the address by ID

        if (!address) {
            return res.status(404).json({ message: 'Address not found' }); // Handle not found
        }

        res.status(200).json(address); // Respond with the address
    } catch (error) {
        console.error("Error fetching address:", error);
        res.status(500).json({ message: 'Server error' }); // Handle server error
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


    const address = await Address.findById(selectedAddressId);
    if (!address) {
      return res.status(404).send('Address not found');
    }

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
      selectedAddressId:address,
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
  

  const  userId  = req.params.userId // Get userId from query params


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

  try {
    const order = await Order.findById(req.params.orderId)
      .populate("cartItems.productId", "name description productPrice salePrice images") // Populate product details
      .populate("selectedAddressId"); // Populate address details

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

//userController.js
const getUserDetails = async (req, res) => {
  try {
    // Use userId from the token instead of req.params.id
    const userId = req.user.userId; // Extract userId from authenticated user
   

    // Fetch user details based on the userId
    const user = await User.findById(userId); // Use userId here

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const editAddress = async (req, res) => {
  const { addressId } = req.params;
  const { userName, addressLine, pincode, street, state, flatNumber, phoneNumber, addressType } = req.body;

  try {
    // Find and update the address by ID
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId: req.body.userId },
      {
        userName,
        addressLine,
        pincode,
        street,
        state,
        flatNumber,
        phoneNumber,
        addressType
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found or does not belong to the user' });
    }

    res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Failed to update address' });
  }
};

const updateQuantityOfProduct = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Validate that productId and quantity are provided
    if (!productId || !quantity) {  
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    // Update the product's stock in the database
    const updatedProduct = await Product.findByIdAndUpdate( 
      productId,
      { $inc: { quantity: -quantity } }, // Decrease stock by the ordered quantity
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Quantity updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Server error updating quantity' });
  }
};

const updateAddressUser = async (req, res) => {
  const { userId } = req.params;
  const { addressId } = req.body;

  try {
    // Find the user by userId and update the address ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { currentAddress: addressId }, // Assuming currentAddress stores the selected address ID
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Success response with the updated user
    res.status(200).json({
      message: 'Address updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getVouchersUserSide = async (req, res) => {
  console.log("Fetching all vouchers");
  try {
      const vouchers = await Voucher.find({});
      res.status(200).json(vouchers);
  } catch (error) {
      console.error("Error fetching vouchers:", error);
      res.status(500).json({ error: "Failed to fetch vouchers" });
  }
};

const getWallet = async (req, res) => {
  const userId = req.params.userId;

  try {
    let wallet = await Wallet.findOne({ userId });

    // If no wallet is found, create a new one with default values
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0, transactions: [] });
      await wallet.save();
    }

    res.json({
      balance: wallet.balance,
      transactions: wallet.transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



const updateQuantity = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      const item = cart.items.find(item => item.productId.toString() === productId);
      if (item) {
        item.quantity = quantity;
        await cart.save();
        return res.status(200).json({ message: 'Quantity updated successfully' });
      }
    }
    return res.status(404).json({ message: 'Item not found in cart' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


const getWinningDetails = async (req, res) => {
  try {
  
    const { userId } = req.params;
    const winner = await Winner.find({userId : userId});

    if (!winner) {
      return res.status(404).json({ message: 'Winner not found' });
    }

    res.json(winner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getParticularVoucher = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const voucher = await Voucher.find({ _id: voucherId });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
   
    res.json(voucher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserBids = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch all bids by the user
    const userBids = await Bid.find({ userId }).lean();

    if (!userBids.length) {
      return res.status(404).json({ message: "No bids found for the user." });
    }

    // Group bids by voucherId
    const groupedBids = userBids.reduce((acc, bid) => {
      if (!acc[bid.voucherId]) {
        acc[bid.voucherId] = [];
      }
      acc[bid.voucherId].push(bid);
      return acc;
    }, {});

    return res.status(200).json(groupedBids);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getVoucherBidAmount = async (req, res) => {
  const { voucherId } = req.params;

  try {
    // Validate voucherId (if necessary)
    if (!voucherId) {
      return res.status(400).json({ message: "Voucher ID is required." });
    }

    const bids = await Bid.find({ voucherId }).sort({ createdAt: -1 });

    // Respond with bids
    if (bids.length === 0) {
      return res.status(404).json({ message: "No bids found for this voucher." });
    }

    res.status(200).json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const createOrder = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: 'rzp_test_Je6Htj61yVkGEb',
    key_secret: 'TbAjlRbnAiKGc8lTYGhM8yOK',
});
const { amount, currency = "INR", receipt } = req.body;

try {
    const order = await razorpay.orders.create({
        amount: amount * 100, 
        currency,
        receipt,
    });
    res.status(200).json({ success: true, order });
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
}

};


const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
      .createHmac('sha256', 'TbAjlRbnAiKGc8lTYGhM8yOK')
      .update(body.toString())
      .digest('hex');

  if (expectedSignature === razorpay_signature) {
      // Update the database to mark the order as paid
      res.status(200).json({ success: true });
  } else {
      res.status(400).json({ success: false, error: "Invalid signature" });
  }
};


const getSingleUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the user details (for example, username)
    res.status(200).json({
      username: user.username,
      // Add other user details if necessary (e.g., email, profile picture, etc.)
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


const getWinningBid = async (req, res) => {
  try {
    const { voucherId } = req.params;

    // Find the winning bid for the specified voucher
    const winningBid = await Winner.findOne({ voucherId }).populate('winningBidId');

    if (!winningBid) {
      return res.status(404).json({ message: "No winning bid found for this voucher." });
    }

    // Return the winning bid data
    res.status(200).json(winningBid);
  } catch (error) {
    console.error('Error fetching winning bid:', error);
    res.status(500).json({ message: "Server error while fetching winning bid." });
  }
};

const fetchRelatedProducts = async (req, res) => {
  const { category, exclude } = req.query;
  const products = await Product.find({
    category,
    _id: { $ne: exclude },
  });
  res.json(products);
};

const fetchImagesCarousel = async (req, res) => {
  try {
    console.log("Fetching carousel images ooooooooooooooooooooooooooo");
    const images = await CarouselImage.find(); // Fetch all images
    res.status(200).json(images); // Send image data as JSON
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Failed to fetch images" });
  }
};





module.exports = { getProducts,fetchimages,fetchCategory,fetchSingleProduct,registerUser,sendOtp,verifyOtp,addItemToCart, getCartItems, addWishlist,clearCart,
  getWishlist, removeWishlist,addAddress, getAddress, deleteAddress,placeOrder, getOrders,getOrderDetail, getProductSuggestions, getUserDetails, updateQuantityOfProduct,
  updateAddressUser, getUserAddress, getVouchersUserSide, getWallet, removeCartProduct, removeFromWishlist, editAddress, updateQuantity, getWinningDetails, getParticularVoucher,
  getUserBids, getVoucherBidAmount, getSingleUserDetails, getWinningBid, createOrder, verifyPayment, fetchRelatedProducts, fetchImagesCarousel
}