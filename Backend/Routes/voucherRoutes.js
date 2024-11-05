const Router = require("express")
const voucherRoute = Router();


const {  getVouchersUserSide, getWinners
 } = require("../Controller/voucherController");

voucherRoute.get("/getVouchers",getVouchersUserSide);
voucherRoute.get("/getWinners",getWinners);





module.exports = voucherRoute;