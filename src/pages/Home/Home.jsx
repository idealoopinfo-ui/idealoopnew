import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import About from "../../components/About/About";
import GetInTouch from "../../components/GetInTouch/GetInTouch";
import TrendingProducts from "../../components/Trending/TrendingProducts";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate(); // ✅ FIX ADDED

  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([]);

  /* =========================
     FETCH BLOGS
  ========================= */
  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.log(error);
        return;
      }

      setBlogs(data || []);
    };

    fetchBlogs();
  }, []);

  /* =========================
     SEARCH
  ========================= */
  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/search?q=${search}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>

      {/* HERO */}
      <section className="hero">
        <h1>Welcome to idealoop fitness</h1>
        <p>
          Your all-in-one destination for fitness blogs,
          premium products, and expert learning content
          designed to boost your performance.
        </p>
      </section>

      {/* SEARCH */}
      <div className="search-section">
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search products..."
      className="search-input"
    />

    <button className="btn btn-primary">
      Search
    </button>
  </div>
</div>

      {/* CATEGORY */}
      <section className="category-section">

<div className="categories-header">
  <h2 className="categories-title">Shop by Category</h2>
  <p className="categories-subtitle">
    Find products based on your fitness goals
  </p>
</div>

<div className="categories-grid">

  <div onClick={() => navigate("/category/strength-training")} className="category-card">
    <div className="category-icon"></div>
    <div className="category-text">Strength Training</div>
  </div>

  <div onClick={() => navigate("/category/yoga-pilates")} className="category-card">
    <div className="category-icon"></div>
    <div className="category-text">Yoga & Pilates</div>
  </div>

  <div onClick={() => navigate("/category/recovery-wellness")} className="category-card">
    <div className="category-icon"></div>
    <div className="category-text">Recovery</div>
  </div>

  <div onClick={() => navigate("/category/gym-wear")} className="category-card">
    <div className="category-icon"></div>
    <div className="category-text">Gym Wear</div>
  </div>

  <div onClick={() => navigate("/category/ebooks")} className="category-card">
    <div className="category-icon"></div>
    <div className="category-text">Ebooks</div>
  </div>

</div>

</section>
      {/* FEATURED */}
      <FeaturedProducts />

      {/* ABOUT */}
      <section className="section-container about-section">
        <About />
      </section>

      {/* TRENDING */}
      <TrendingProducts />

      {/* BLOGS */}
      <section className="blog-section">

        <div className="blog-header">
          <h2>📚 Latest Blogs</h2>
        </div>

        <div className="blog-container">

          {blogs.length === 0 ? (
            <p>No blogs found.</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="blog-card">

                <img
                  src={blog.image_url || "https://via.placeholder.com/400"}
                  alt={blog.title}
                  className="blog-image"
                />

                <div className="blog-content">
                  <h3>{blog.title}</h3>

                  <p>
                    {blog.description ||
                      (blog.content ? blog.content.slice(0, 100) : "")}
                  </p>

                  <button
                    className="amazon-btn"
                    onClick={() => navigate(`/post/${blog.id}`)}
                  >
                    View Details →
                  </button>
                </div>

              </div>
            ))
          )}

        </div>

        <div className="blog-footer">
          <button
            className="view-all-btn"
            onClick={() => navigate("/blogs")}
          >
            View All →
          </button>
        </div>

      </section>

      {/* CONTACT */}
      <GetInTouch />

      {/* FOOTER */}
      <footer className="footer"></footer>

    </div>
  );
}