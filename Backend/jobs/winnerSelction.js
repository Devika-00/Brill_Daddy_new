// cronJob.js
const cron = require("node-cron");
const Voucher = require("../Models/voucherModel");
const Bid = require("../Models/bidModel");
const Winner = require("../Models/winnerModel"); // Import your Winner model

// Schedule a cron job to run every minute
cron.schedule("* * * * *", async () => {
  try {
    console.log("Running voucher expiration and winner selection job...");

    // Find vouchers that haven't expired and whose end time has passed
    const expiredVouchers = await Voucher.find({
      is_expired: false,
      end_time: { $lte: new Date() }
    });

    console.log(expiredVouchers,"eeeeeeeeeeeeeeeeeeeeeeeee");

    for (const voucher of expiredVouchers) {
      // Fetch all bids for this voucher
      const bids = await Bid.find({ voucherId: voucher._id });
      const bidAmounts = bids.map(bid => bid.bidAmount);

      // Identify unique bids
      const uniqueBids = bidAmounts.filter(
        (amount, index, self) =>
          self.indexOf(amount) === index && self.lastIndexOf(amount) === index
      );

      // If there are unique bids, find the lowest one
      if (uniqueBids.length > 0) {
        const lowestUniqueBid = Math.min(...uniqueBids);
        console.log(lowestUniqueBid,"amamamamamamammam");

        // Find the bid with the lowest unique bid amount
        const winningBid = bids.find(bid => bid.bidAmount === lowestUniqueBid);
        console.log(winningBid,"wwwwwwwwwwwwwwwwwww");

        // Store the winner in the Winner model
        if (winningBid) {
          const winner = new Winner({
            userId: winningBid.userId, // Assuming the Bid model has a userId
            voucherId: voucher._id,
            winningBidId: winningBid._id,
            winningAmount: lowestUniqueBid
          });
          await winner.save();
        }
      }

      // Mark voucher as expired
      voucher.is_expired = true;
      await voucher.save();
    }

    console.log("Voucher expiration and winner selection process completed.");
  } catch (error) {
    console.error("Error in voucher expiration and winner selection:", error);
  }
});
