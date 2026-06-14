import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../ProductCard/ProductCard";
import "./TrendingProducts.css";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchTrending = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_trending", true);

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    fetchTrending();
  }, []);

  // 🔥 AUTO ROTATION (EVERY 4 HOURS DIFFERENT SET)
  useEffect(() => {
    const getOffset = () => {
      const hour = new Date().getHours();
      return Math.floor(hour / 4); // more frequent changes
    };

    const interval = setInterval(() => {
      setOffset(getOffset());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const rotated = [
    ...products.slice(offset),
    ...products.slice(0, offset),
  ];

  const visibleProducts = rotated.slice(0, 5);

  return (
    <section className="trending-section">
      <h2>🔥 Trending Products</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="trending-grid">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}