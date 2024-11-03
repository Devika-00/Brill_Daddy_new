const Voucher = require("../Models/voucherModel");

const getVouchersUserSide = async (req, res) => {
  console.log("Fetching all vouchers");
  try {
      const vouchers = await Voucher.find({});
      res.status(200).json(vouchers);
  } catch (error) {
      console.error("Error fetching vouchers:", error);
      res.status(500).json({ error: "Failed to fetch vouchers" });
  }
};



module.exports = { getVouchersUserSide
}