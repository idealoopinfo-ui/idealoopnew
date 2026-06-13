import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import About from "../../components/About/About";
import GetInTouch from "../../components/GetInTouch/GetInTouch";
import TrendingProducts from "../../components/Trending/TrendingProducts";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import SearchBar from "../../components/SearchBar/SearchBar";
import NoticePanel from "../../components/NoticePanel/NoticePanel";


import "./Home.css";

export default function Home() {
  const navigate = useNavigate(); // ✅ FIX ADDED
  const [blogs, setBlogs] = useState([]);

   // =========================
  // FETCH BLOGS
  // =========================
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

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (term) => {
    if (!term || !term.trim()) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
     {/* HERO */}
    <section className="hero">
      <h1>Welcome to Idealoop Fitness</h1>
      <p></p>
    </section>

    {/* NOTICE */}
    <div style={{ marginTop: "15px" }}>
      <NoticePanel />
    </div>

    {/* SEARCH */}
    <SearchBar onSearch={handleSearch} />


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
    <div className="category-text">Recovery Wellness</div>
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

<div className="blog-container home-blog-container">

  {blogs.length === 0 ? (
    <p>No blogs found.</p>
  ) : (
    blogs.map((blog) => (
      <div key={blog.id} className="blog-card home-blog-card">

  <img
    src={blog.image_url || "https://via.placeholder.com/400"}
    alt={blog.title}
    className="home-blog-image"
  />

  <div className="home-blog-content">

    <h3 className="home-blog-title">
      {blog.title}
    </h3>

    {/* BUTTON ALWAYS SAME LEVEL */}
    <button
      className="blog-btn"
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
  <section className="contact-section">
    <GetInTouch />
  </section>

 
</div>
  );
 }