const Router = require("express")
const userRoute = Router();


const { getProducts,fetchimages,fetchCategory,fetchSingleProduct,registerUser,sendOtp,verifyOtp,addItemToCart, getCartItems, removeCartItem, addWishlist,getWishlist,removeWishlist,addAddress
    ,getAddress,deleteAddress
 } = require("../Controller/userController");

userRoute.get("/products",getProducts);
userRoute.get("/images/:id",fetchimages);
userRoute.get("/category",fetchCategory);
userRoute.get("/products/:id",fetchSingleProduct);

userRoute.post("/register",registerUser);
userRoute.post("/sendOtp",sendOtp);
userRoute.post("/verify-otp",verifyOtp);

userRoute.post("/cart/add",addItemToCart);
userRoute.get("/cart/:userId",getCartItems);
userRoute.delete("/cart/:userId/:productId",removeCartItem);

userRoute.post("/wishlist/:userId",addWishlist);
userRoute.get("/wishlist/:userId",getWishlist);
userRoute.delete("/wishlist/:userId/:itemId",removeWishlist);

userRoute.post("/addAddress", addAddress);
userRoute.get("/addresses/:userId",getAddress);
userRoute.delete('/deleteAddress/:id',deleteAddress);



module.exports = userRoute;