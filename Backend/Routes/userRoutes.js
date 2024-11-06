const Router = require("express")
const userRoute = Router();


const { getProducts,fetchimages,fetchCategory,fetchSingleProduct,registerUser,sendOtp,verifyOtp,addItemToCart, getCartItems,clearCart, addWishlist,getWishlist,removeWishlist,addAddress
    ,getAddress,deleteAddress, placeOrder, getOrders, getOrderDetail, getProductSuggestions, getUserDetails, updateQuantityOfProduct, updateAddressUser, getUserAddress, getVouchersUserSide,
    getWallet,
 } = require("../Controller/userController");

userRoute.get("/products",getProducts);
userRoute.get("/images/:id",fetchimages);
userRoute.get("/category",fetchCategory);
userRoute.get("/products/:id",fetchSingleProduct);
userRoute.get("/:id",getUserDetails);

userRoute.post("/register",registerUser);
userRoute.post("/sendOtp",sendOtp);
userRoute.post("/verify-otp",verifyOtp);

userRoute.post("/cart/add",addItemToCart);
userRoute.get("/cart/:userId",getCartItems);
userRoute.delete("/clearCart/:userId",clearCart);

userRoute.post("/wishlist/:userId",addWishlist);
userRoute.get("/wishlist/:userId",getWishlist);
userRoute.delete("/wishlist/:userId/:itemId",removeWishlist);

userRoute.post("/addAddress", addAddress);
userRoute.get("/addresses/:userId",getAddress);
userRoute.get("/address/:addressId", getUserAddress);
userRoute.delete('/deleteAddress/:id',deleteAddress);
userRoute.put("/updateAddress/:userId", updateAddressUser);


userRoute.post("/checkout/placeorder",placeOrder);
userRoute.get("/orders/:userId",getOrders);
userRoute.get("/order/:orderId",getOrderDetail);
userRoute.get("/product-suggestions",getProductSuggestions);

userRoute.post("/updateQuantity",updateQuantityOfProduct);

userRoute.get("/getVoucher", getVouchersUserSide);

userRoute.get("/wallet/:userId",getWallet);



module.exports = userRoute;