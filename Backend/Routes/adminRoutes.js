const Router = require("express")
const adminRoute = Router();

const {addCategory,addBrand,getcategories,updateCategory,deleteCategory,getBrand,editBrand,deleteBrand,addProduct,fetchProduct,fetchimages,
    deleteProducts,editProduct, getOrders, updateOrderStatus, addVouchers, getAllVoucher, deletevoucher, editVoucher
} = require("../Controller/adminController")

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

module.exports = adminRoute;