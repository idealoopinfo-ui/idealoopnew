import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import MainCategoryBlock from "../../components/MainCategoryBlock/MainCategoryBlock";
import About from "../../components/About/About";
import GetInTouch from "../../components/GetInTouch/GetInTouch";
import TrendingProducts from "../../components/Trending/TrendingProducts";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import SearchBar from "../../components/SearchBar/SearchBar";
import NoticePanel from "../../components/NoticePanel/NoticePanel";
import CategoryShowcase from "../../components/CategoryShowcase/CategoryShowcase";


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

  console.log("BLOG COUNT:", blogs.length);
console.log("BLOG DATA:", blogs);

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

    {/* MAIN CATEGORY BLOCK */}
    <MainCategoryBlock />

      {/* FEATURED */}
      <FeaturedProducts />

      {/* ABOUT */}
      <section className="section-container about-section">
        <About />
      </section>

      {/* TRENDING */}
      <TrendingProducts />

      {/* CATEGORY SHOWCASE */}
      <CategoryShowcase />

     {/* BLOGS */}
{/* BLOGS */}
<section className="blog-section">

  {blogs.length === 0 ? (
    <p>No blogs found</p>
  ) : (
    <div className="blog-container">
      {blogs.map((blog) => (
        <div className="home-blog-card" key={blog.id}>

          <img
            src={blog.image_url || "https://via.placeholder.com/400"}
            alt={blog.title}
            className="home-blog-image"
          />

          <div className="home-blog-content">
            <h3 className="home-blog-title">
              {blog.title}
            </h3>

            <button
              className="blog-btn"
              onClick={() => navigate(`/post/${blog.id}`)}
            >
              View Details →
            </button>
          </div>

        </div>
      ))}
    </div>
  )}

</section>
      {/* CONTACT */}
  <section className="contact-section">
    <GetInTouch />
  </section>

 
</div>
  );
 }