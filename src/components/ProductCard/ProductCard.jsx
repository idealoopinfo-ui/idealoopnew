import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  if (!product) return null;

  // =========================
  // GET USER SESSION
  // =========================
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    getUser();
  }, []);

  // =========================
  // IMAGE HANDLING
  // =========================
  const images = Array.isArray(product.image_urls) ? product.image_urls : [];

  const mainImage =
    images[0] ||
    (typeof product.image_url === "string" &&
    product.image_url.startsWith("http")
      ? product.image_url
      : null) ||
    product.image ||
    "https://via.placeholder.com/400x400?text=Product";

  // =========================
  // NAVIGATION TO PRODUCT PAGE
  // =========================
  const goToProduct = () => {
    if (!product?.id) return;
    navigate(`/product/${product.id}`);
  };

  // =========================
  // SHOP BUTTON LOGIC (LOGIN PROTECTED)
  // =========================
  const handleShopClick = (e) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="product-card">

      {/* IMAGE */}
      <div className="image-container">
        <img
          src={mainImage}
          alt={product.title || "Product"}
          className="product-main-img"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=Product";
          }}
        />

        {/* WISHLIST */}
        <button
          className="wishlist-hover-btn"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Wishlist clicked");
          }}
        >
          👍
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="product-info">

        <h3 className="product-title" title={product.title}>
          {product.title || "Untitled Product"}
        </h3>

        <p
          className="view-more"
          onClick={(e) => {
            e.stopPropagation();
            goToProduct();
          }}
        >
          View More →
        </p>

        {/* LOGIN PROTECTED BUTTON */}
        <button
          className="shop-btn"
          onClick={handleShopClick}
        >
          {user ? "Shop Now" : "Login to Shop"}
        </button>

      </div>

    </div>
  );
}