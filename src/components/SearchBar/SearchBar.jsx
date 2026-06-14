import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./SearchBar.css";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  console.log("SearchBar mounted");

  // =========================
  // CLICK OUTSIDE CLOSE
  // =========================
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

  // =========================
  // FETCH SUGGESTIONS
  // =========================
  const fetchSuggestions = async (value) => {
    const query = value?.trim();
  
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
  
    setLoading(true);
  
    try {
      const [productsResult, blogsResult] = await Promise.all([
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
  
      const products = (productsResult.data || []).map((item) => ({
        ...item,
        type: "product",
      }));
  
      const blogs = (blogsResult.data || []).map((item) => ({
        ...item,
        type: "blog",
      }));
  
      setSuggestions([...products, ...blogs]);
    } catch (error) {
      console.error("Suggestion error:", error);
      setSuggestions([]);
    }
  
    setLoading(false);
  };

  // =========================
  // SEARCH SUBMIT (BUTTON + ENTER)
  // =========================
  const handleSubmit = () => {
    const query = searchTerm.trim();
  
    if (!query) return;
  
    setSuggestions([]);
    setFocused(false);
  
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // =========================
  // SUGGESTION CLICK
  // =========================
  const handleSuggestionClick = (item) => {
    setSearchTerm(item.title);
    setSuggestions([]);
    setFocused(false);

    navigate(`/search?q=${encodeURIComponent(item.title)}`);
  };

  return (
    <div className="search-wrapper">
  
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search products or blogs..."
          value={searchTerm}
          onFocus={() => setFocused(true)}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            fetchSuggestions(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
  
        <button onClick={handleSubmit}>
          Search
        </button>
      </div>
  
      {/* suggestions */}
      {!loading && suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(item)}
            >
              {item.title}
            </div>
          ))}
        </div>
      )}
  
    </div>
  );
          }