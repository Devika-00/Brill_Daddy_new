const Router = require("express")
const userRoute = Router();
const authenticateUser = require("../middleware/authMiddleware");


const { getProducts,fetchimages,fetchCategory,fetchSingleProduct,registerUser,sendOtp,verifyOtp,addItemToCart, getCartItems,clearCart, addWishlist,getWishlist,removeWishlist,addAddress
    ,getAddress,deleteAddress, placeOrder, getOrders, getOrderDetail, getProductSuggestions, getUserDetails, removeFromWishlist, updateQuantityOfProduct, updateAddressUser, getUserAddress, getVouchersUserSide,
    getWallet, removeCartProduct, editAddress
 } = require("../Controller/userController");

userRoute.get("/products",getProducts);
userRoute.get("/images/:id",fetchimages);
userRoute.get("/category",fetchCategory);
userRoute.get("/products/:id",fetchSingleProduct);
userRoute.get('/getUserDetails', authenticateUser, getUserDetails);
userRoute.delete('/wishlist/remove', authenticateUser, removeFromWishlist);



userRoute.post("/register",registerUser);
userRoute.post("/sendOtp",sendOtp);
userRoute.post("/verify-otp",verifyOtp);

userRoute.post("/cart/add",addItemToCart);
userRoute.get("/cart/:userId",getCartItems);
userRoute.delete("/cart/:userId/:productId",removeCartProduct);
userRoute.delete("/clearCart/:userId",clearCart);

userRoute.post("/wishlist", authenticateUser, addWishlist);
userRoute.delete("/wishlist/:itemId", authenticateUser, removeWishlist);
userRoute.get("/wishlist", authenticateUser, getWishlist);

userRoute.post("/addAddress", addAddress);
userRoute.get("/addresses/:userId",getAddress);
userRoute.get("/address/:addressId", getUserAddress);
userRoute.delete('/deleteAddress/:id',deleteAddress);
userRoute.put("/updateAddress/:userId", updateAddressUser);
userRoute.put("/editAddress/:addressId",authenticateUser,editAddress);
userRoute.get("/:userId",authenticateUser,getUserDetails);


userRoute.post("/checkout/placeorder",placeOrder);
userRoute.get("/orders/:userId",getOrders);
userRoute.get("/order/:orderId",getOrderDetail);
userRoute.get("/product-suggestions",getProductSuggestions);

userRoute.post("/updateQuantity",updateQuantityOfProduct);

userRoute.get("/getVoucher", getVouchersUserSide);

userRoute.get("/wallet/:userId",getWallet);



module.exports = userRoute;