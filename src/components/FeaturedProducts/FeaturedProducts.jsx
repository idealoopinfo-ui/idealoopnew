import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../ProductCard/ProductCard";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true);

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // 🔥 AUTO ROTATION EVERY 6 HOURS
  useEffect(() => {
    const getOffset = () => {
      const hour = new Date().getHours();
      return Math.floor(hour / 6); // 4 rotations per day
    };

    const interval = setInterval(() => {
      setOffset(getOffset());
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, []);

  // 🔥 ROTATE LIST AUTOMATICALLY
  const rotated = [
    ...products.slice(offset),
    ...products.slice(0, offset),
  ];

  const visibleProducts = rotated.slice(0, 4);

  return (
    <section className="featured-section">
      <h2>🔥 Featured Products</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="featured-grid">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}