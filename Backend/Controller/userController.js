const Category = require("../Models/categoryModel");
const Brand = require("../Models/brandModel");
const Images = require("../Models/imageModel");
const Product = require("../Models/productModel");
const User = require("../Models/userModel");
const OTP = require("../Models/otpModel");
const crypto = require("crypto");
const { sendOtpToEmail, sendOtpToPhone } = require('../utils/otpService');
const jwt = require('jsonwebtoken');

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


module.exports = { getProducts,fetchimages,fetchCategory,fetchSingleProduct,registerUser,sendOtp,verifyOtp
}