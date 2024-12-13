//backend/Routes/adminRoutes.js
const Router = require("express")
const adminRoute = Router();
const bcrypt = require("bcrypt");
const Admin = require("../Models/adminModel");
const Order = require("../Models/orderModel");
const Bid = require('../Models/bidModel');
const User = require('../Models/userModel');

const {getAllUsers, addCategory,addBrand,getcategories,updateCategory,deleteCategory,getBrand,editBrand,deleteBrand,addProduct,fetchProduct,fetchimages,
    deleteProducts,editProduct, getOrders, updateOrderStatus, addVouchers, getAllVoucher, deletevoucher, editVoucher, getDashboardCounts, refundUserList, updateStatusRefund, uploadCarsouelImage,
    fetchCarouselImages, deleteImageCarousel
} = require("../Controller/adminController")

// Admin login route
adminRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Prebuilt admin credentials
    const prebuiltEmail = "admin@gmail.com";
    const prebuiltPassword = "admin123";

    // Log received email and password
    console.log("Received email:", email);
    console.log("Received password:", password);

    try {
        // Check if the admin exists in the database
        let admin = await Admin.findOne({ email });

        // If admin does not exist, create a new one with prebuilt credentials
        if (!admin) {
            const hashedPassword = await bcrypt.hash(prebuiltPassword, 10);
            admin = new Admin({
                email: prebuiltEmail,
                password: hashedPassword,
            });
            await admin.save();
            console.log("New admin created:", admin);
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Login successful
        res.status(200).json({ message: "Login successful." });
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Admin cancel order route
adminRoute.put('/cancel-order/:orderId', async (req, res) => {
    try {
      
      const { userId, productId, cancelReason } = req.body;
      const { orderId } = req.params;
  
      // Find the order by ID
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Find the specific product in cartItems by productId
    const productToCancel = order.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (!productToCancel) {
      return res.status(404).json({ message: 'Product not found in order' });
    }

    // Update the status of the specific product to 'Cancelled'
    productToCancel.status = 'Cancelled';

    if (order.paymentMethod === 'Razorpay') {
      productToCancel.refundAmountStatus = 'Pending';
    }

    // Set the cancellation details for the order
    order.cancellation = {
      reason: cancelReason,  // Reason for cancellation
      cancelledAt: new Date(), // Cancellation timestamp
      status: 'Cancelled',  // Mark as cancelled
    };

    // Save the order with the updated details
    await order.save();
      // Return the updated order with cancellation details
      res.status(200).json({
        message: 'Order cancelled successfully',
        cancellation: order.cancellation,  // Return the cancellation details
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error handling cancellation request' });
    }
  });

  adminRoute.put('/return-order/:orderId', async (req, res) => {
    try {
      const { userId, productId, selectedReason } = req.body;
      const { orderId } = req.params;

        // Find the order by ID
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const productToReturn = order.cartItems.find(
          (item) => item.productId.toString() === productId
        );
    
        if (!productToReturn) {
          return res.status(404).json({ message: 'Product not found in order' });
        }
    
        // Update the status of the specific product to 'Cancelled'
        productToReturn.status = 'Returned';

        if (order.paymentMethod === 'Razorpay'|| order.paymentMethod === 'COD' ) {
          productToReturn.refundAmountStatus = 'Pending';
        }
    
    
        // Save the order with the updated details
        await order.save();

        // Return the updated order with return details
        res.status(200).json({
            message: 'Order returned successfully',
            returnDetails: order.returnDetails,  // Return the return details
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error handling return request' });
    }
});

adminRoute.get('/dashboardCounts', getDashboardCounts);


adminRoute.get("/users", getAllUsers);
adminRoute.post("/addcategory",addCategory);
adminRoute.get("/categories",getcategories);
adminRoute.put('/updateCategory/:id',updateCategory);
adminRoute.delete('/deleteCategory/:id',deleteCategory);

adminRoute.post("/addbrand",addBrand);
adminRoute.get("/brands",getBrand);
adminRoute.put('/updateBrand/:id',editBrand);
adminRoute.delete("/deleteBrand/:id",deleteBrand);

adminRoute.post("/addProducts",addProduct);
adminRoute.get("/products",fetchProduct);
adminRoute.get('/products/:id',fetchimages);
adminRoute.delete("/deleteProducts/:id",deleteProducts);
adminRoute.put('/updateProducts/:id', editProduct);

adminRoute.get("/orders",getOrders);
adminRoute.put("/orders/:orderId",updateOrderStatus);

adminRoute.post("/addvoucher",addVouchers);
adminRoute.get("/voucher",getAllVoucher);
adminRoute.delete("/voucher/:id",deletevoucher);
adminRoute.put("/voucher/:id",editVoucher);

adminRoute.get("/refundUsers",refundUserList);
adminRoute.put("/updateRefundStatus",updateStatusRefund);
adminRoute.post("/uploadImage", uploadCarsouelImage);
adminRoute.get("/carouselImages",fetchCarouselImages);
adminRoute.delete("/deleteImage/:imageId",deleteImageCarousel);

module.exports = adminRoute;