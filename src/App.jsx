import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Admin from "./pages/Admin/Admin";
import Users from "./pages/Admin/Users";
import Messages from "./pages/Admin/Messages";
import Analytics from "./pages/Admin/Analytics";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist/Wishlist";
import BlogPostPage from "./pages/BlogPostPage/BlogPostPage";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";

import CategoryPage from "./pages/CategoryPage/CategoryPage";
import CookiePopup from "./components/CookiePopup/CookiePopup";

import ProductPage from "./pages/ProductPage/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";

import BlogCreatePage from "./pages/BlogCreatePage/BlogCreatePage";
import BlogsList from "./pages/BlogsList/BlogsList";

import Terms from "./pages/Legal/Terms";
import Privacy from "./pages/Legal/PrivacyPolicy";
import AffiliateDisclosure from "./pages/Legal/AffiliateDisclosure";

import ResetPassword from "./pages/ResetPassword/ResetPassword";

import "./App.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`app-layout ${darkMode ? "dark" : ""}`}>
      <BrowserRouter>

        <Navbar />

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="dark-toggle"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        <main className="main-content">
          <Routes>

            {/* HOME */}
            <Route path="/" element={<Home />} />

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ADMIN (PROTECTED) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            {/* WISHLIST */}
            <Route path="/wishlist" element={<Wishlist />} />

            {/* CATEGORY */}
            <Route path="/category/:category" element={<CategoryPage />} />

            {/* PRODUCTS */}
            <Route path="/products" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* BLOGS */}
            <Route path="/blog" element={<BlogCreatePage />} />
            <Route path="/blogs" element={<BlogsList />} />
            <Route path="/post/:id" element={<BlogPostPage />} />

            {/* PROFILE */}
            <Route path="/profile" element={<Profile />} />

            {/* LEGAL */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />

            {/* RESET PASSWORD */}
            <Route path="/reset-password" element={<ResetPassword />} />

          </Routes>
        </main>

        <Footer />
        <CookiePopup />

      </BrowserRouter>
    </div>
  );
}