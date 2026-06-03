import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./BlogPostPage.css";

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH SINGLE + ALL BLOGS
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // GET CURRENT BLOG
      const { data: singleData, error: singleError } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (singleError || !singleData) {
        console.log(singleError);
        setError("Failed to load blog post");
        setLoading(false);
        return;
      }

      setPost(singleData);

      // GET ALL BLOGS
      const { data: allData, error: allError } = await supabase
        .from("blogs")
        .select("*")
        .order("id", { ascending: true });

      if (!allError && allData) {
        setAllPosts(allData);

        const index = allData.findIndex((b) => b.id === singleData.id);

        setCurrentIndex(index);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  /* =========================
     NAVIGATION
  ========================= */
  const goNext = () => {
    if (currentIndex >= 0 && currentIndex < allPosts.length - 1) {
      const next = allPosts[currentIndex + 1];
      navigate(`/post/${next.id}`);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      const prev = allPosts[currentIndex - 1];
      navigate(`/post/${prev.id}`);
    }
  };

  /* =========================
     ERROR STATE
  ========================= */
  if (error) {
    return (
      <h2 style={{ padding: "50px", color: "red", textAlign: "center" }}>
        {error}
      </h2>
    );
  }

  /* =========================
     LOADING STATE
  ========================= */
  if (loading || !post) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  /* =========================
     PAGE UI
  ========================= */
  return (
    <div className="post-container">
      <h1 className="post-title">{post.title}</h1>

      {post.description && (
        <p className="post-description">{post.description}</p>
      )}

      {post.image_url?.trim() && (
        <img
          className="post-image"
          src={post.image_url}
          alt={post.title}
        />
      )}

      <div className="post-content">{post.content}</div>

      <div className="blog-progress">
        Blog {currentIndex + 1} of {allPosts.length}
      </div>

      <div className="post-navigation">
        <button
          className="nav-btn"
          onClick={goPrev}
          disabled={currentIndex <= 0}
        >
          ← Previous
        </button>

        <button className="nav-btn" onClick={() => navigate("/blogs")}>
          All Blogs
        </button>

        <button
          className="nav-btn"
          onClick={goNext}
          disabled={currentIndex >= allPosts.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}