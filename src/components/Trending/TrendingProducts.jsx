import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../ProductCard/ProductCard";
import "./TrendingProducts.css";

export default function TrendingProducts() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_trending", true);

      if (error) {
        console.error("Supabase fetch error:", error.message);
        return;
      }

      setTrending(data || []);
    };

    fetchTrending();
  }, []);

  // 🔥 DAILY ROTATION LOGIC
  const getTodayProducts = (list) => {
    if (!Array.isArray(list) || list.length === 0) return [];

    const today = new Date().getDate();
    const startIndex = today % list.length;

    return [
      ...list.slice(startIndex),
      ...list.slice(0, startIndex),
    ];
  };

  const dailyProducts = getTodayProducts(trending).slice(0, 5);

  return (
    <section className="trending-section">
      <h2 className="trending-title">🔥 Trending Products</h2>

      {dailyProducts.length === 0 ? (
        <p>No trending products available.</p>
      ) : (
        <div className="trending-grid">
          {dailyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}