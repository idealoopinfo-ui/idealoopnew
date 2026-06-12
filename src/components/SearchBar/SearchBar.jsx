import { useState, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./SearchBar.css";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const wrapperRef = useRef(null);

  /* =========================
     CLICK OUTSIDE CLOSE
  ========================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setSuggestions([]);
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     FETCH SUGGESTIONS
  ========================= */
  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const { data: products } = await supabase
        .from("products")
        .select("id,title")
        .ilike("title", `%${value}%`)
        .limit(5);

      const { data: blogs } = await supabase
        .from("blogs")
        .select("id,title")
        .ilike("title", `%${value}%`)
        .limit(5);

      const mergedSuggestions = [
        ...(products || []).map((item) => ({
          ...item,
          type: "product",
        })),
        ...(blogs || []).map((item) => ({
          ...item,
          type: "blog",
        })),
      ];

      setSuggestions(mergedSuggestions);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  /* =========================
     SEARCH SUBMIT
  ========================= */
  const handleSubmit = () => {
    if (!searchTerm.trim()) return;

    onSearch(searchTerm);
    setSuggestions([]);
    setFocused(false);
  };

  /* =========================
     SUGGESTION CLICK
  ========================= */
  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setSuggestions([]);
    setFocused(false);
    onSearch(title);
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      
      {/* DARK OVERLAY */}
      {focused && <div className="search-overlay"></div>}

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search fitness products and blogs..."
          value={searchTerm}
          onFocus={() => setFocused(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        <button
          className="search-btn"
          onClick={handleSubmit}
        >
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="suggestions">
          <div className="suggestion-item">
            Searching...
          </div>
        </div>
      )}

      {/* SUGGESTIONS */}
      {!loading && suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="suggestion-item"
              onClick={() =>
                handleSuggestionClick(item.title)
              }
            >
              <span className="suggestion-type">
                {item.type === "product"
                  ? "🏋️ Product"
                  : "📝 Blog"}
              </span>

              {/* SHORT TEXT FIX */}
              <span>
                {item.title.length > 45
                  ? item.title.substring(0, 45) + "..."
                  : item.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}