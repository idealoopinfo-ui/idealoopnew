import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../ProductCard/ProductCard";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Featured error:", error.message);
        setLoading(false);
        return;
      }

      // ✅ FILTER using correct column: featured
      const featured = (data || []).filter(
        (p) => p.featured === true
      );

      console.log("FEATURED PRODUCTS:", featured);

      setProducts(featured);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <section className="featured-section">
      <div className="featured-header">
        <h2>🔥 Featured Products</h2>
        <p>Top fitness picks for performance & lifestyle</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No featured products found.</p>
      ) : (
        <div className="featured-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}