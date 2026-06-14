import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [subCategory, setSubCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const subCategories = {
    "strength-training": ["strength-training-essentials", "accessories"],
    "gym-wear": ["men", "women", "shoes", "accessories"],
    ebooks: ["strength-training", "yoga", "health"],
    "yoga-pilates": [],
    "recovery-wellness": [],
    "home-gym": []
  };

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase
        .from("products")
        .select("*")
        .eq("category", category);

      if (subCategory !== "all") {
        query = query.eq("subcategory", subCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.log("Category error:", error.message);
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [category, subCategory]);

  return (
    <div className="category-page">
      {/* HEADER */}
      <div className="category-header">
        <h1>
          {(category || "").replaceAll("-", " ").toUpperCase()}
        </h1>

        <p>Browse all products in this category</p>
      </div>

      {/* SUBCATEGORIES */}
      <div className="subcategory-list">
        <button
          className={subCategory === "all" ? "active" : ""}
          onClick={() => setSubCategory("all")}
        >
          All
        </button>

        {(subCategories[category] || []).map((sub) => (
          <button
            key={sub}
            className={subCategory === sub ? "active" : ""}
            onClick={() => setSubCategory(sub)}
          >
            {sub.replaceAll("-", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="product-grid">
        {loading ? (
          <p className="loading">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="empty">No products found.</p>
        ) : (
          products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        )}
      </div>
    </div>
  );
}