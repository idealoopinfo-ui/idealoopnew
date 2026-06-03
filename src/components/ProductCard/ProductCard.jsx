import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // =========================
  // SAFETY CHECK
  // =========================
  if (!product) return null;

  // =========================
  // GET CURRENT USER
  // =========================
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    getUser();
  }, []);

  // =========================
  // SAFE IMAGE ARRAY
  // =========================
  const images = Array.isArray(product.image_urls)
    ? product.image_urls
    : [];

  // =========================
  // MAIN IMAGE
  // =========================
  const mainImage =
    images[0] ||
    (
      typeof product.image_url === "string" &&
      product.image_url.startsWith("http")
        ? product.image_url
        : null
    ) ||
    product.image ||
    "https://via.placeholder.com/400x400?text=Product";

  // =========================
  // NAVIGATE TO PRODUCT
  // =========================
  const goToProduct = () => {
    if (!product?.id) return;

    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="product-card"
      onClick={goToProduct}
    >
      {/* IMAGE */}
      <div className="image-container">
        <img
          src={mainImage}
          alt={product.title || "Product"}
          className="product-main-img"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x400?text=Product";
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

        <div className="title-wrapper">

          <h3
            className="product-title"
            title={product.title}
          >
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

          {product?.amazon_url && (
            <a
              href={product.amazon_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="amazon-btn">
                Shop on Amazon
              </button>
            </a>
          )}

        </div> {/* <-- missing title-wrapper closing div */}

      </div>

    </div>
  );
}