import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../ProductCard/ProductCard";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Featured error:", error.message);
        if (isMounted) setLoading(false);
        return;
      }

      if (isMounted) {
        setProducts(data || []);
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="featured-section">

      <div className="featured-header">
        <h2>🔥 Featured Products</h2>
        <p>Top fitness picks for performance & lifestyle</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
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