import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { supabase } from "./lib/supabaseClient";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Users from "./pages/Admin/Users";
import Messages from "./pages/Admin/Messages";
import Analytics from "./pages/Admin/Analytics";

import Home from "./pages/Home/Home";
import Wishlist from "./pages/Wishlist/Wishlist";
import BlogPostPage from "./pages/BlogPostPage/BlogPostPage";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";

import CategoryPage from "./pages/CategoryPage/CategoryPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";

import BlogCreatePage from "./pages/BlogCreatePage/BlogCreatePage";
import BlogsList from "./pages/BlogsList/BlogsList";

import Terms from "./pages/Legal/Terms";
import Privacy from "./pages/Legal/PrivacyPolicy";
import AffiliateDisclosure from "./pages/Legal/AffiliateDisclosure";

import ResetPassword from "./pages/ResetPassword/ResetPassword";

import CookiePopup from "./components/CookiePopup/CookiePopup";
import ScrollToTop from "./components/ScrollToTop";

import "./App.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Session:", data.session);
    });
  }, []);

  return (
    <div className={`app-layout ${darkMode ? "dark" : ""}`}>
      <Navbar />

      <button onClick={() => setDarkMode(!darkMode)} className="dark-toggle">
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

      <ScrollToTop />

      <main className="main-content">
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          <Route path="/blog" element={<BlogCreatePage />} />
          <Route path="/blogs" element={<BlogsList />} />
          <Route path="/post/:id" element={<BlogPostPage />} />

          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />

          <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>
      </main>

      <Footer />
      <CookiePopup />
    </div>
  );
}