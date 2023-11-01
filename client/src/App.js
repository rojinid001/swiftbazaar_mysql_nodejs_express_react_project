import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Policy from "./Pages/Policy";
import PageNotFound from "./Pages/PageNotFound";
import Register from "./Pages/Auth/Register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/User/Dashboard";
import PrivateRoute from "./Components/Routes/Privateroute";
import ForgotPassword from "./Pages/Auth/forgotPassword";
import ResetPassword from "./Pages/Auth/resetPassword";
import AdminRoute from "./Components/Routes/AdminRoute";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import CreateCategory from "./Pages/Admin/CreateCategory";
import CreateProduct from "./Pages/Admin/CreateProduct";
import Users from "./Pages/Admin/Users";
import Orders from "./Pages/User/Orders";
import Profile from "./Pages/User/Profile";
import Products from "./Pages/Admin/Products";
import UpdateProduct from "./Pages/Admin/UpdateProduct";
import Search from "./Pages/search";
import ProductDetails from "./Pages/ProductDetails";
import Categories from "./Pages/Categories";
import CategoryProduct from "./Pages/CategoryProduct";
import CartPage from "./Pages/CartPage";
import PaymentSuccess from "./Pages/User/paymentSuccess";
import PaymentFailure from "./Pages/User/paymentFailure";
import AdminOrders from "./Pages/Admin/AdminOrders";
import UserReviews from "./Pages/Admin/UserReviews";
import Coupons from "./Pages/Admin/Coupons";
import Wishlist from "./Pages/User/Wishlist";
import Banners from "./Pages/Admin/Banners";



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/wishlist" element={<Wishlist />} /> 

        {/* Corrected route for reset password */}
        <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentFailure />} />
        
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} /> 
        </Route>

        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} /> 
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/:slug" element={<UpdateProduct />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/user-reviews" element={<UserReviews />} />
          <Route path="admin/coupons" element={<Coupons />} />
          <Route path="admin/banners" element={<Banners />} />
        </Route>

        <Route path="/contact" element={<Contact />} />    
        <Route path="/about" element={<About />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/login" element={<Login />} />
        {/* Fallback route for Page Not Found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;

