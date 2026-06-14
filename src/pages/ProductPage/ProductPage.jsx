import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ProductPage.css";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.log("Supabase error:", error);
        return;
      }

      setProducts(data ?? []);
    };

    fetchProducts();
  }, []);

  const categories = [
    "all",
    "strength-training",
    "yoga-pilates",
    "recovery-wellness",
    "gym-wear",
    "ebooks",
    "home-gym",
  ];

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(
          (item) => item.category === activeCategory
        );

  return (
    <div className="product-page-wrapper">

      {/* CATEGORY FILTER */}
      <div className="subcategory-list">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`subcategory-btn ${
              activeCategory === cat ? "active" : ""
            }`}
          >
            {cat.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No products found
          </p>
        )}
      </div>

    </div>
  );
}