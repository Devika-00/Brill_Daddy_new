const Wallet = require("../Models/walletModel");
const Voucher = require("../Models/voucherModel");
const Bid = require("../Models/bidModel");
const Winner = require("../Models/winnerModel");
const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Running voucher expiration and winner selection job...");

    // Find vouchers that have expired
    const expiredVouchers = await Voucher.find({
      is_expired: false,
      end_time: { $lte: new Date() },
    });

    for (const voucher of expiredVouchers) {
      const bids = await Bid.find({ voucherId: voucher._id });
      const bidAmounts = bids.map(bid => bid.bidAmount);

      // Identify the lowest unique bid
      const uniqueBids = bidAmounts.filter(
        (amount, index, self) =>
          self.indexOf(amount) === index && self.lastIndexOf(amount) === index
      );

      if (uniqueBids.length > 0) {
        const lowestUniqueBid = Math.min(...uniqueBids);
        const winningBid = bids.find(bid => bid.bidAmount === lowestUniqueBid);

        if (winningBid) {
          // Store the winner
          const winner = new Winner({
            userId: winningBid.userId,
            voucherId: voucher._id,
            winningBidId: winningBid._id,
            winningAmount: lowestUniqueBid,
          });
          await winner.save();
        }

        // Refund the voucher price (not bid amount) to the wallet of the losing bidders
        for (const bid of bids) {
          if (bid.bidAmount !== lowestUniqueBid) {
            // Check if the bidder has a wallet
            let wallet = await Wallet.findOne({ userId: bid.userId });

            if (!wallet) {
              // If no wallet exists, create one for the user
              wallet = new Wallet({
                userId: bid.userId,
                balance: 0, // Initial balance
              });
            }

            // Credit the wallet with the voucher price (refund)
            wallet.balance += voucher.price;

            // Record this as a transaction (credit)
            wallet.transactions.push({
              type: "credit",
              amount: voucher.price,
              description: `Refund for lost bid on voucher ${voucher.voucher_name}`,
            });

            await wallet.save();
          }
        }
      }

      // Mark the voucher as expired
      voucher.is_expired = true;
      await voucher.save();
    }

    console.log("Voucher expiration and winner selection process completed.");
  } catch (error) {
    console.error("Error in voucher expiration and winner selection:", error);
  }
});
