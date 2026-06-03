import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import "./BlogsList.css";

export default function BlogsList() {

  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  // =========================
  // FETCH BLOGS
  // =========================
  useEffect(() => {

    const fetchBlogs = async () => {

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.log("Blog fetch error:", error);
        return;
      }

      setBlogs(data || []);
    };

    fetchBlogs();

  }, []);

  // =========================
  // UI
  // =========================
  return (

    <div className="blogs-page">

      <h1 className="blogs-title">
        📚 All Blogs
      </h1>

      <div className="blogs-grid">

        {blogs.length === 0 ? (

          <p
            style={{
              textAlign: "center",
              width: "100%",
            }}
          >
            No blogs found
          </p>

        ) : (

          blogs.map((blog, index) => (

            <div
              key={blog.id}
              className="blog-card"
            >

              {/* BLOG NUMBER */}
              <div className="blog-number">
                {index + 1}
              </div>

              {/* BLOG IMAGE */}
              <img
                src={
                  blog.image_url ||
                  blog.image ||
                  "https://via.placeholder.com/400x250?text=Blog+Image"
                }
                alt={blog.title || "Blog"}
                className="blog-image"
              />

              {/* BLOG CONTENT */}
              <div className="blog-content">

                <h3>
                  {blog.title}
                </h3>

                <p>
                  {
                    blog.description ||
                    blog.content?.slice(0, 120) ||
                    "No description available."
                  }
                </p>

                <button
                  className="blog-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/post/${blog.id}`);
                  }}
                >
                  View Details →
                </button>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}