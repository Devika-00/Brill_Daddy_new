import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "./PrivateRoute";

// Lazy load pages
const User = lazy(() => import("../pages/Admin/User"));
const Product = lazy(() => import("../pages/Admin/Products"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard"));
const Orders = lazy(() => import("../pages/Admin/Orders"));
const Voucher = lazy(() => import("../pages/Admin/Vocher"));
const Login = lazy(() => import("../pages/Admin/Login"));
const Register = lazy(() => import("../pages/User/Register"));
const UserLogin = lazy(() => import("../pages/User/Login"));
const HomePage = lazy(() => import("../pages/User/HomePage"));
const SingleProduct = lazy(() => import("../pages/User/SingleProduct"));
const WishlistPage = lazy(() => import("../pages/User/Whishlist"));
const Cart = lazy(() => import("../pages/User/Cart"));
const Checkout = lazy(() => import("../pages/User/Checkout"));
const Shop = lazy(() => import("../pages/User/Shop"));
const Event = lazy(() => import("../pages/User/Event"));
const EventDetail = lazy(() => import("../pages/User/EventDetail"));
const Category = lazy(() => import("../pages/Admin/category"));
const Brand = lazy(() => import("../pages/Admin/brand"));
const Profile = lazy(() => import("../pages/User/Profile"));
const OrdersList = lazy(() => import("../pages/User/OrdersList"));
const OrderDetails = lazy(() => import("../pages/User/OrderDetails"));
const ShopCategory = lazy(() => import("../pages/User/shopCategory"));
const OrderSuccessful = lazy(() => import("../pages/User/orderSuccesfull"));
const NotFoundPage = lazy(() => import("../pages/User/NotFoundPage"));
const PaymentPage = lazy(() => import("../pages/User/Payment"));
const Wallet = lazy(() => import("../pages/User/Wallet"));
const WinnerAlbumPage = lazy(() => import("../pages/User/WinAlbum"));
const BidProductsPage = lazy(() => import("../pages/User/BidProducts"));
const BidAmountList = lazy(() => import("../pages/Admin/bidAmountList"));
const PrivacyPolicy = lazy(() => import("../pages/User/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("../pages/User/RefundPolicy"));
const RefundUsers = lazy(() => import("../pages/Admin/RefundUsers"));
const ImageCarousels = lazy(() => import("../pages/Admin/imageCarousel"));

const MainRouter = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/singleProduct/:id" element={<SingleProduct />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/refundPolicy" element={<RefundPolicy />} />
          
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<UserLogin />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/singleProduct/:id" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/winAlbum" element={<WinnerAlbumPage />} />
            <Route path="/bidProducts" element={<BidProductsPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/event" element={<Event />} />
            <Route path="/eventDetail" element={<EventDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orderList" element={<OrdersList />} />
            <Route path="/orderDetails/:id/:productId" element={<OrderDetails />} />
            <Route path="/shopCategory" element={<ShopCategory />} />
            <Route path="/orderSuccessful" element={<OrderSuccessful />} />
            <Route path="/payment/:voucherId" element={<PaymentPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/users" element={<User />} />
          <Route path="/category" element={<Category />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/products" element={<Product />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/vouchers" element={<Voucher />} />
          <Route path="/adminlogin" element={<Login />} />
          <Route path="/bidAmounts" element={<BidAmountList />} />
          <Route path="/refundUsers" element={<RefundUsers />} />
          <Route path="/imageCarousel" element={<ImageCarousels />} />

          {/* Catch All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default MainRouter;
