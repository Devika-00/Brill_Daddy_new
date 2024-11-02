const Category = require("../Models/categoryModel");
const Brand = require("../Models/brandModel");
const Images = require("../Models/imageModel");
const Product = require("../Models/productModel");
const Order = require("../Models/orderModel")

const addCategory = async (req,res) =>{
    try {
        const {name, description} = req.body;
        const category = new Category({name,description});

        const savedCategory = await category.save();

        res.status(201).json(savedCategory);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


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
        const { name, description, price, salesPrice, category, brand, quantity, discount, color, images } = req.body;

        
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
          productPrice: price,
          salePrice: salesPrice,
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
        const { name, description, price, salesPrice, category, brand, quantity, discount, color, images } = req.body;

        // Ensure sales price is valid
        if (parseFloat(salesPrice) >= parseFloat(price)) {
            return res.status(400).json({ message: "Sales price should be less than price" });
        }

        // Prepare the update object
        const updateData = {
            name,
            description,
            productPrice: price,
            salePrice: salesPrice,
            category,
            brand,
            quantity,
            discount,
            color,
            images:images
        };

        if (images) {
            const newImageIds = []; // Array to hold new image IDs

            for (const img of images) {
                const newImages = new Images({
                    thumbnailUrl: img.thumbnailUrl,
                    imageUrl: img.imageUrl,
                });

                const savedImage = await newImages.save(); // Save each new image
                newImageIds.push(savedImage._id); // Store the saved image ID
            }

            updateData.images = newImageIds; // Update the product's images
     
        }


        // Find the product and update it in one operation
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });


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


  





module.exports = {addCategory,addBrand,getcategories,updateCategory,deleteCategory,getBrand,editBrand,deleteBrand,addProduct,fetchProduct,fetchimages,
    deleteProducts,editProduct, getOrders, updateOrderStatus,
}