const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const ENV = require("./Config/ENV");
const connectDb = require("./Config/Connection");
const adminRoute = require("./Routes/adminRoutes");
const userRoute = require("./Routes/userRoutes");

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

const port = ENV.PORT || 5000;

app.listen(port, () => {
  connectDb();
  console.log(`Server is running at port ${port}`);
});
