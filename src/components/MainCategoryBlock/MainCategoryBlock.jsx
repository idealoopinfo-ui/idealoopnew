import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./MainCategoryBlock.css";

const CATEGORIES = [
  {
    name: "Strength Training",
    slug: "strength-training",
  },
  {
    name: "Gym Wear",
    slug: "gym-wear",
  },
  {
    name: "Recovery Wellness",
    slug: "recovery-wellness",
  },
];

const normalize = (str) =>
  str?.toLowerCase().trim().replace(/\s+/g, "-");

export default function MainCategoryBlock() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rotate category every day
  const dayNumber = Math.floor(
    Date.now() / (1000 * 60 * 60 * 24)
  );

  const activeCategory =
    CATEGORIES[dayNumber % CATEGORIES.length];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
      }

      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const categoryProducts = products.filter(
    (p) => normalize(p.category) === activeCategory.slug
  );

  // Rotate displayed images every 4 hours
  const blockNumber = Math.floor(
    Date.now() / (1000 * 60 * 60 * 4)
  );

  const displayProducts =
    categoryProducts.length <= 3
      ? categoryProducts
      : Array.from({ length: 3 }, (_, i) => {
          const index =
            (blockNumber * 3 + i) %
            categoryProducts.length;

          return categoryProducts[index];
        });

  if (loading) {
    return null;
  }

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="main-category-block">
      <div className="main-category-grid">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="main-category-card"
            onClick={() =>
              navigate(`/category/${activeCategory.slug}`)
            }
          >
            <img
              src={product.image || product.image_url}
              alt=""
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}