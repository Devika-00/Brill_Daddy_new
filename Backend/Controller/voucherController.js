const Voucher = require("../Models/voucherModel");
const Winner = require("../Models/winnerModel");

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


const getWinners = async (req, res) => {
    try {
        const winners = await Winner.find().populate('userId voucherId winningBidId');
        res.json(winners);
      } catch (error) {
        console.error("Error fetching winners:", error);
        res.status(500).json({ message: "Internal server error" });
      }
  };
  




module.exports = { getVouchersUserSide, getWinners
}