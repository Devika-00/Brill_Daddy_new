const Router = require("express")
const userRoute = Router();


const { getProducts,fetchimages,fetchCategory,fetchSingleProduct,registerUser,sendOtp,verifyOtp } = require("../Controller/userController");

userRoute.get("/products",getProducts);
userRoute.get("/images/:id",fetchimages);
userRoute.get("/category",fetchCategory);
userRoute.get("/products/:id",fetchSingleProduct);

userRoute.post("/register",registerUser);
userRoute.post("/sendOtp",sendOtp);
userRoute.post("/verify-otp",verifyOtp);


module.exports = userRoute;