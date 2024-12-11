import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PublicRoute,ProtectedRoute } from "./PrivateRoute";




import User from "../pages/Admin/User";
import Product from "../pages/Admin/Products";
import Dashboard from "../pages/Admin/Dashboard";
import Orders from "../pages/Admin/Orders";
import Voucher from "../pages/Admin/Vocher";
import Login from "../pages/Admin/Login";
import Register from "../pages/User/Register";
import UserLogin from "../pages/User/Login";
import HomePage from "../pages/User/HomePage";
import SingleProduct from "../pages/User/SingleProduct";
import WishlistPage from "../pages/User/Whishlist";
import Cart from "../pages/User/Cart";
import Checkout from "../pages/User/Checkout";
import Shop from "../pages/User/Shop";
import Event from "../pages/User/Event";
import EventDetail from "../pages/User/EventDetail";
import Category from "../pages/Admin/category";
import Brand from "../pages/Admin/brand";
import Profile from "../pages/User/Profile";
import OrdersList from "../pages/User/OrdersList";
import OrderDetails from "../pages/User/OrderDetails";
import ShopCategory from "../pages/User/shopCategory";
import OrderSuccessful from "../pages/User/orderSuccesfull";
import NotFoundPage from "../pages/User/NotFoundPage";
import PaymentPage from "../pages/User/Payment";
import Wallet from "../pages/User/Wallet";
import WinnerAlbumPage from "../pages/User/WinAlbum";
import BidProductsPage from "../pages/User/BidProducts";
import BidAmountList from "../pages/Admin/bidAmountList";
import PrivacyPolicy from "../pages/User/PrivacyPolicy";
import RefundPolicy from "../pages/User/RefundPolicy";
import RefundUsers from "../pages/Admin/RefundUsers";
import ImageCarousels from "../pages/Admin/imageCarousel";

const MainRouter = () => {
  return (
    <Router>
      <Routes>
        {/*User Routes */}
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

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
};

export default MainRouter;
