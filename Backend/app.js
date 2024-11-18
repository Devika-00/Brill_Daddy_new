const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const ENV = require("./Config/ENV");
const connectDb = require("./Config/Connection");
const adminRoute = require("./Routes/adminRoutes");
const userRoute = require("./Routes/userRoutes");
const voucherRoute = require("./Routes/voucherRoutes");
const bidRoute = require("./Routes/bidRoutes");

require("./jobs/winnerSelction");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/admin",adminRoute);
app.use("/api/user",userRoute);
app.use("/api/voucher",voucherRoute);
app.use("/api/bid",bidRoute);

const port = ENV.PORT || 5002;

app.listen(port, () => {
  connectDb();
  console.log(`Server is running at port ${port}`);
});
