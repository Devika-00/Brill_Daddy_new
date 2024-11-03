const Router = require("express")
const voucherRoute = Router();


const {  getVouchersUserSide
 } = require("../Controller/voucherController");

voucherRoute.get("/getVouchers",getVouchersUserSide)




module.exports = voucherRoute;