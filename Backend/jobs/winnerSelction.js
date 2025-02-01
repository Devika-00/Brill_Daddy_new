const Wallet = require("../Models/walletModel");
const Voucher = require("../Models/voucherModel");
const Bid = require("../Models/bidModel");
const Winner = require("../Models/winnerModel");
const cron = require("node-cron");
const { getSocketInstance } = require("../socket/socketInstance");
const Notification = require("../Models/notificationModel");
const User = require("../Models/userModel");

// Helper function to refund non-winning bidders
async function refundNonWinningBidders(bids, lowestUniqueBidAmount, voucher) {
  for (const bid of bids) {
    if (bid.bidAmount !== lowestUniqueBidAmount) {
      let wallet = await Wallet.findOne({ userId: bid.userId });

      if (!wallet) {
        wallet = new Wallet({
          userId: bid.userId,
          balance: 0,
        });
      }

      wallet.balance += voucher.price;

      wallet.transactions.push({
        type: "credit",
        amount: voucher.price,
        description: `Refund for lost bid on voucher ${voucher.voucher_name}`,
      });

      await wallet.save();
    }
  }
}
async function notifyNonWinners(voucher, winner, bids) {
  try {
    console.log("Notifying non-winners");
    const io = getSocketInstance();

    // Ensure all parameters are present
    if (!voucher || !winner || !bids || !Array.isArray(bids)) {
      console.error("Missing required parameters:", { voucher, winner, bids });
      return;
    }

    const winnerUser = await User.findById(winner.userId);
    if (!winnerUser) {
      console.error("Winner user not found");
      return;
    }

    const winnerName = winnerUser.username

    for (const bid of bids) {
      // Skip if bid is invalid or matches winner
      if (!bid.userId || bid.userId === winner.userId) continue;

      const message = `The winner of the voucher "${voucher.voucher_name}" is ${winnerName} with a Amount of ₹${winner.bidAmount}. Better luck next time!`;
      
      console.log(`Sending notification to user ${bid.userId}:`, message);

      // Emit both test and notification events
      io.to(bid.userId.toString()).emit("notification", { message });
      
      // // For debugging, emit a test message to all clients
      // io.emit("test", { 
      //   message: `Test: Notification sent to user ${bid.userId}` 
      // });

      try {
        // Save notification to database
        await Notification.create({ 
          userId: bid.userId, 
          message,
        });
      } catch (dbError) {
        console.error("Error saving notification to database:", dbError);
      }
    }
  } catch (error) {
    console.error("Error in notifyNonWinners:", error);
  }
}



// Helper function to determine winners
async function determineWinners(voucher) {
  const bids = await Bid.find({ voucherId: voucher._id });
  
  const bidAmountCounts = {};
  bids.forEach(bid => {
    bidAmountCounts[bid.bidAmount] = (bidAmountCounts[bid.bidAmount] || 0) + 1;
  });

  const sortedBids = Object.entries(bidAmountCounts)
    .sort((a, b) => a[1] - b[1] || parseFloat(a[0]) - parseFloat(b[0]));

  const [lowestUniqueBid, count] = sortedBids[0] || [null, null];


  if (lowestUniqueBid !== null) {
    const lowestUniqueBidAmount = parseFloat(lowestUniqueBid);

    const winningBids = bids.filter(bid => bid.bidAmount === lowestUniqueBidAmount);

    if (winningBids.length === 1) {
      // Single winner
      const winningBid = winningBids[0];
      await new Winner({
        userId: winningBid.userId,
        voucherId: voucher._id,
        winningBidId: winningBid._id,
        winningAmount: lowestUniqueBidAmount,
      }).save();
      
      voucher.winner_bid_id = winningBid._id;
      voucher.is_expired = true;
      await voucher.save();

      await notifyNonWinners(voucher, winningBid, bids);
    } else {
      // Multiple winners, set up re-bid
      voucher.eligible_rebid_users = winningBids.map(bid => bid.userId);
      voucher.rebid_active = true;
      voucher.rebid_end_time = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await voucher.save();
    }

    // Refund non-winning bidders
    await refundNonWinningBidders(bids, lowestUniqueBidAmount, voucher);
  }
}

// Helper function to finalize re-bid winner
async function finalizeRebidWinner(voucher) {
  const eligibleBids = await Bid.find({
    voucherId: voucher._id,
    userId: { $in: voucher.eligible_rebid_users }
  });

  
  if (eligibleBids.length > 0) {
    const bidAmountCounts = {};
    eligibleBids.forEach(bid => {
      bidAmountCounts[bid.bidAmount] = (bidAmountCounts[bid.bidAmount] || 0) + 1;
    });
    
    const sortedBids = Object.entries(bidAmountCounts)
      .sort((a, b) => a[1] - b[1] || parseFloat(a[0]) - parseFloat(b[0]));
    
    const [lowestUniqueBid, count] = sortedBids[0] || [null, null];

    if (lowestUniqueBid !== null) {
      const lowestUniqueBidAmount = parseFloat(lowestUniqueBid);
      const winningBids = eligibleBids.filter(bid => bid.bidAmount === lowestUniqueBidAmount);

      if (winningBids.length === 1) {
        // Finalize single winner
        const winningBid = winningBids[0];
        await new Winner({
          userId: winningBid.userId,
          voucherId: voucher._id,
          winningBidId: winningBid._id,
          winningAmount: lowestUniqueBidAmount,
        }).save();
        
        voucher.winner_bid_id = winningBid._id;
        await notifyNonWinners(voucher, winningBid, eligibleBids);
      }


      // Refund non-winning bidders in the re-bid period
      await refundNonWinningBidders(eligibleBids, lowestUniqueBidAmount, voucher);
    }
  }
  
  // Finalize voucher expiration after re-bid
  voucher.is_expired = true;
  voucher.rebid_active = false;
  await voucher.save();
}


// Main cron job
cron.schedule("* * * * *", async () => {
  try {
    console.log("Running voucher expiration and winner selection job...");

    // Find vouchers that have expired
    const expiredVouchers = await Voucher.find({
      is_expired: false,
      end_time: { $lte: new Date() },
    });

    for (const voucher of expiredVouchers) {
      if (!voucher.rebid_active) {
        // First round of winner determination
        await determineWinners(voucher);
      } else if (voucher.rebid_active && voucher.rebid_end_time <= new Date()) {
        // Finalize re-bid winner after 24 hours
        await finalizeRebidWinner(voucher);
      }
    }

    console.log("Voucher expiration and winner selection process completed.");
  } catch (error) {
    console.error("Error in voucher expiration and winner selection:", error);
  }
});
