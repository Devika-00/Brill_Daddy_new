//backend/Controller/adminController.js
const Category = require("../Models/categoryModel");
const Brand = require("../Models/brandModel");
const Images = require("../Models/imageModel");
const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");
const Voucher = require("../Models/voucherModel");
const User = require('../Models/userModel');
const Bid = require('../Models/bidModel'); 
const CarouselImage = require('../Models/carouselModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    if (!users || users.length === 0) {
      console.warn('No users found');
      return res.status(404).json({ message: 'No users found' });
    }

    console.log('Fetched users:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    const errorMessage = error.message || 'Unknown error occurred while fetching users';
    res.status(500).json({ message: 'Error fetching users', error: errorMessage });
  }
};


const addCategory = async (req, res) => {
  try {
      const { name, description, parentCategory } = req.body;

      // Create a new category object
      const categoryData = { name, description };
      if (parentCategory) {
          categoryData.parentCategory = parentCategory; // Add parent category if provided
      }

      const category = new Category(categoryData);
      const savedCategory = await category.save();

      res.status(201).json(savedCategory);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};



const getcategories = async (req,res) =>{
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
}

const updateCategory = async (req,res) =>{
    const { name, description } = req.body;
    
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
}

const deleteCategory = async (req,res) =>{
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
}

const addBrand = async (req,res) =>{
    try {
        const {name, description} = req.body;
        const brand = new Brand({name,description});

        const savedbrand = await brand.save();

        res.status(201).json(savedbrand);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getBrand = async (req,res) =>{
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching brands' });
    }
}

const editBrand = async (req,res) =>{
    const { name, description } = req.body;

    try {
        const updatedBrand = await Brand.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        res.json(updatedBrand);
    } catch (error) {
        res.status(500).json({ message: 'Error updating brand' });
    }
}

const deleteBrand = async (req,res) =>{
    try {
        await Brand.findByIdAndDelete(req.params.id);
        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting brand' });
    }
}

const addProduct = async (req,res) =>{
    try {
        const { name, description, productPrice, salePrice, category, brand, quantity, discount, color, images } = req.body;

        
        // Create an entry for the images
        const newImages = new Images({
          thumbnailUrl: images.thumbnailUrl,
          imageUrl: images.imageUrl,
        });
    
        await newImages.save();
    
        // Create the product
        const newProduct = new Product({
          name,
          description,
          productPrice: productPrice,
          salePrice: salePrice,
          category,
          brand,
          quantity,
          discount,
          color,
          images: newImages._id,  // Link the images to the product
        });
    
        await newProduct.save();
    
        res.status(201).json(newProduct);
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
     }
}

const fetchProduct = async (req,res) =>{
    
    try {
        // Fetch all products from the database and populate brand and category fields
        const products = await Product.find().populate('category').populate('brand');
        
        // Return the fetched products as JSON
        res.status(200).json(products);
    } catch (error) {
        // Handle any errors that occur during the fetch
        res.status(500).json({ message: 'Error fetching products', error });
    }
}

const fetchimages = async (req, res) =>{
    const { id } = req.params;
    const { populate } = req.query; // Check if populate is in query
  
    try {
      const productQuery = Product.findById(id);
      if (populate) {
        productQuery.populate('images'); // Populate images if requested
      }
  
      const product = await productQuery;
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Error fetching product' });
    }
}

const deleteProducts = async (req, res) =>{
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
    
        if (!deletedProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
    
        res.status(200).json({ message: "Product deleted successfully" });
      } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
      }
}

const editProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get the product ID from the request parameters
        const { name, description, productPrice, salePrice, category, brand, quantity, discount, color, images } = req.body;

        // Ensure sales price is valid
        if (parseFloat(salePrice) >= parseFloat(productPrice)) {
            return res.status(400).json({ message: "Sales price should be less than price" });
        }

        // Prepare the update object
        const updateData = {
            name,
            description,
            productPrice,
            salePrice,
            category,
            brand,
            quantity,
            discount,
            color,
            images:[],
        };

        if (images && images.thumbnailUrl) {
          // Check if existing images are to be preserved
          const existingProduct = await Product.findById(id);

          // Preserve existing small images if not replaced
          const existingSmallImages = images.imageUrl || 
              (existingProduct.images[0] && existingProduct.images[0].imageUrl) || 
              [];

          // Create or update image document
          const imageDocument = {
              thumbnailUrl: images.thumbnailUrl,
              imageUrl: existingSmallImages
          };

          // Create new Images document or update existing
          const savedImage = await Images.findOneAndUpdate(
              { _id: existingProduct.images[0]?._id }, // If exists
              imageDocument,
              { upsert: true, new: true }
          );

          updateData.images = [savedImage._id];
      }


        // Find the product and update it in one operation
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('images');;


        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct); // Return the updated product
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
          .populate('userId', 'name email') // Populate user's name and email
          .populate('cartItems.productId', 'name images price') // Populate product name, image, and price
          .populate('selectedAddressId', 'street city postalCode') // Populate address details
          .exec();
    
        res.status(200).json(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Error fetching orders' });
      }
  };

  const updateOrderStatus = async (req, res) => {
    const { orderStatus, productId } = req.body;
    const { orderId } = req.params;
  
    try {
      // Validate orderStatus against the enum values defined in the model
      const validStatuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({ message: 'Invalid order status' });
      }
  
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Find the product in cartItems and update its status
      const itemToUpdate = order.cartItems.find(item => item.productId.toString() === productId);
      if (!itemToUpdate) {
        return res.status(404).json({ message: 'Product not found in the order' });
      }
  
      itemToUpdate.status = orderStatus;
  
      // Save the updated order
      await order.save();
  
      return res.status(200).json({ message: 'Product status updated successfully', order });
    } catch (error) {
      console.error('Error updating product status:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  const addVouchers = async (req, res) => {
    try {
        console.log(req.body, "Request Body"); // Log incoming request body
        const { voucher_name, details, product_name, price,  productPrice, imageUrl, date, time, endDate, endTime } = req.body;

        

        // Combine date and time into a single Date object for start_time
        const start_time = new Date(`${date}T${time}`);
        const end_time = new Date(`${endDate}T${endTime}`)

        // Create a new voucher instance
        const voucher = new Voucher({
            voucher_name,
            details,
            product_name,
            productPrice,
            price,
            imageUrl,
            start_time,
            end_time,
        });

        // Save the voucher to the database
        const savedVoucher = await voucher.save();
        console.log("Saved Voucher:", savedVoucher); // Log saved voucher
        res.status(201).json(savedVoucher);
    } catch (error) {
        console.error("Error creating voucher:", error.message); // Log the error message
        res.status(500).json({ message: "Error creating voucher" });
    }
};


const getAllVoucher = async (req, res) => {
    try {
        const vouchers = await Voucher.find(); // Fetch all vouchers from the database
        res.status(200).json(vouchers); // Send the vouchers as JSON response
        } catch (error) {
        console.error('Error fetching vouchers:', error);
        res.status(500).json({ message: 'Failed to retrieve vouchers' }); // Error handling
    }
};

const deletevoucher = async (req, res) => {
    try {
        const { id } = req.params; // Get voucher ID from request parameters
        const deletedVoucher = await Voucher.findByIdAndDelete(id); // Find and delete the voucher by ID
    
        if (!deletedVoucher) {
          return res.status(404).json({ message: 'Voucher not found' }); // If voucher not found, respond with 404
        }
    
        res.status(200).json({ message: 'Voucher deleted successfully' }); // Success response
      } catch (error) {
        console.error('Error deleting voucher:', error);
        res.status(500).json({ message: 'Failed to delete voucher' }); // Error handling
      }
};

const editVoucher = async (req, res) => {
    const { id } = req.params;
  const { voucher_name, details, product_name, productPrice, imageUrl, date, time, endDate, endTime } = req.body;

  try {
    const start_time = new Date(`${date}T${time}`);
        const end_time = new Date(`${endDate}T${endTime}`)

    // Find the voucher by ID and update its fields
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { voucher_name, details, product_name,productPrice, imageUrl,start_time,end_time },
      { new: true } // Return the updated document
    );

    // Check if the voucher was found and updated
    if (!updatedVoucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    // Send the updated voucher as a response
    res.status(200).json(updatedVoucher);
  } catch (error) {
    console.error('Error updating voucher:', error);
    res.status(500).json({ message: 'Error updating voucher' });
  }
};

// backend/Controller/adminController.js
const getDashboardCounts = async (req, res) => {
  try {
    // Count unique users and include registration date
    const users = await User.find({}, { _id: 1, createdAt: 1 }); // Retrieve user IDs and registration dates
    const userCount = users.length;

    // Count unique user IDs in bids (auction participants) and include auction date
    const bids = await Bid.find({}, { userId: 1, createdAt: 1 }); // Retrieve user IDs and auction dates
    const auctionParticipants = new Set(bids.map(bid => bid.userId.toString()));
    const auctionCount = auctionParticipants.size; // Unique user IDs participating in auctions

    // Count unique user and product IDs in orders and include order date
    const orders = await Order.find({}, { userId: 1, cartItems: 1, orderDate: 1 }); // Retrieve user IDs, cartItems, and order dates
    const orderUserProductSet = new Set();
    const orderDates = orders.map(order => order.orderDate); // Collect order dates
    const orderStatusCounts = {
      Pending: { count: 0, dates: [] },
      Processing: { count: 0, dates: [] },
      Shipped: { count: 0, dates: [] },
      Delivered: { count: 0, dates: [] },
      'Out for Delivery': { count: 0, dates: [] },
      Cancelled: { count: 0, dates: [] },
      Returned: { count: 0, dates: [] }
    };

    // Loop through orders and cartItems to track status counts and dates
    orders.forEach(order => {
      order.cartItems.forEach(item => {
        // Track the status counts and dates of each cart item
        if (item.status in orderStatusCounts) {
          orderStatusCounts[item.status].count += 1;
          orderStatusCounts[item.status].dates.push(order.orderDate);
        }
        orderUserProductSet.add(`${order.userId}-${item.productId}`);
      });
    });

    const orderCount = orderUserProductSet.size;

    res.status(200).json({
      userCount,
      userRegistrationDates: users.map(user => user.createdAt), // Add registration dates
      auctionCount,
      auctionUniqueParticipants: auctionCount,
      auctionDates: Array.from(auctionParticipants).map(userId => {
        const userBids = bids.filter(bid => bid.userId.toString() === userId);
        return userBids.map(bid => bid.createdAt); // Get bid dates for each user
      }).flat(), // Flatten the nested arrays
      orderCount,
      orderDates, // Add order dates
      orderStatusCounts
    });
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const refundUserList = async (req, res) => {
  try {
    const refundOrders = await Order.find({
        $or: [
            { 
                paymentMethod: 'Razorpay', 
                'cartItems.status': { $in: ['Cancelled', 'Returned'] }
            },
            { 
                paymentMethod: 'COD', 
                'cartItems.status': 'Returned' 
            }
        ]
    })
    .populate('userId', 'username email phone')
    .populate('cartItems.productId', 'name')
    .populate('selectedAddressId', 'addressLine city state zip');

    res.status(200).json(refundOrders);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

const updateStatusRefund = async (req, res) => {
  try {
    const { orderId, productId, newAction } = req.body;


  const allowedActions = ['Refund Pending', 'Refund Completed'];
  if (!allowedActions.includes(newAction)) {
    return res.status(400).json({ message: 'Invalid action provided' });
  }

  const refundStatus = newAction === 'Refund Pending' ? 'Pending' : 'Completed';


  // Find the order and update the specific cart item's refund status
  const updatedOrder = await Order.findOneAndUpdate(
    { 
      _id: orderId, 
      'cartItems.productId': productId 
    },
    { 
      $set: { 
        'cartItems.$.refundAmountStatus': refundStatus 
      } 
    },
    { 
      new: true,  // Return the updated document
      runValidators: true  // Ensure schema validations are run
    }
  ).populate('userId cartItems.productId');


  // If no order found
  if (!updatedOrder) {
    return res.status(404).json({ message: 'Order or Product not found' });
  }

  res.status(200).json({
    message: 'Refund status updated successfully',
    order: {
      orderId,
      productId,
      refundStatus,
    }
  });

} catch (error) {
  console.error('Error updating refund status:', error);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: error.message 
  });
}
};

const uploadCarsouelImage = async (req, res) => {

  try {
    const { imageUrl } = req.body;

    // Validate the request body
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Create a new Carousel entry
    const newCarouselImage = new CarouselImage({
      imageUrl, // Assuming your Carousel model has an `imageUrl` field
    });

    // Save to the database
    await newCarouselImage.save();

    res.status(200).json({ message: 'Image saved successfully', data: newCarouselImage });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchCarouselImages = async (req,res) =>{
  try {
    // Fetch all images from the database
    const images = await CarouselImage.find().sort({ uploadedAt: -1 }); // Sort by newest first
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    res.status(500).json({ error: 'Failed to fetch carousel images' });
  }
}

const deleteImageCarousel = async (req,res) =>{
  const { imageId } = req.params;
  try {
    // Find the image by ID and remove it from the database
    const deletedImage = await CarouselImage.findByIdAndDelete(imageId);
    
    if (!deletedImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Send a success response
    res.status(200).json({ message: 'Image deleted successfully!' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
}



module.exports = {getAllUsers, addCategory,addBrand,getcategories,updateCategory,deleteCategory,getBrand,editBrand,deleteBrand,addProduct,fetchProduct,fetchimages,
    deleteProducts,editProduct, getOrders, updateOrderStatus, addVouchers, getAllVoucher, deletevoucher, editVoucher, getDashboardCounts, refundUserList, updateStatusRefund, uploadCarsouelImage,
    fetchCarouselImages, deleteImageCarousel
}