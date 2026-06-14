import "./CategoryNavbar.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CategoryNavbar() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // CLICK OUTSIDE CLOSE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FETCH SUGGESTIONS
  const fetchSuggestions = async (value) => {
    const query = value.trim();

    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const [products, blogs] = await Promise.all([
        supabase
          .from("products")
          .select("id,title")
          .ilike("title", `%${query}%`)
          .limit(5),

        supabase
          .from("blogs")
          .select("id,title")
          .ilike("title", `%${query}%`)
          .limit(5),
      ]);

      const productList =
        products.data?.map((p) => ({ ...p, type: "product" })) || [];

      const blogList =
        blogs.data?.map((b) => ({ ...b, type: "blog" })) || [];

      setSuggestions([...productList, ...blogList]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // SEARCH NAVIGATE
  const handleSearch = (value) => {
    if (!value.trim()) return;

    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="category-navbar" ref={wrapperRef}>

      {/* CATEGORY LINKS */}
      <div className="cat-links">
        <button onClick={() => navigate("/category/strength-training")}>Strength Training</button>
        <button onClick={() => navigate("/category/gym-wear")}>Gym Wear</button>
        <button onClick={() => navigate("/category/recovery-wellness")}>Recovery Wellness</button>
        <button onClick={() => navigate("/category/yoga-pilates")}>Yoga & Pilates</button>
        <button onClick={() => navigate("/category/home-gym")}>Home Gym</button>
        <button onClick={() => navigate("/category/ebooks")}>Ebooks</button>
      </div>

      {/* SEARCH */}
      <div className="cat-search">

        <input
          type="text"
          placeholder="Search products & blogs..."
          value={term}
          onChange={(e) => {
            const val = e.target.value;
            setTerm(val);
            fetchSuggestions(val);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(term);
            }
          }}
        />

        <button onClick={() => handleSearch(term)}>
          Search
        </button>

        {/* SUGGESTIONS */}
        {loading && <div className="suggestions">Searching...</div>}

        {!loading && suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="suggestion-item"
                onClick={() => handleSearch(item.title)}
              >
                <span>
  {item.type === "product" ? "🏋️ " : "📝 "}

  {item.title.length > 40
    ? item.title.substring(0, 40) + "..."
    : item.title}
</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}