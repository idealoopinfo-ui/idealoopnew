import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./BlogCreatePage.css";

export default function BlogCreatePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  /* =====================
     CHECK USER
  ===================== */
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        navigate("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  /* =====================
     CREATE BLOG
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("User not loaded");
    if (!title || !description || !content) {
      return alert("Please fill all required fields");
    }

    const { error } = await supabase.from("blogs").insert([
      {
        title,
        description,
        content,
        image_url: image,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Blog created successfully 🚀");

      setTitle("");
      setDescription("");
      setContent("");
      setImage("");

      navigate("/blogs");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="blog-create-page">
      <h2 className="blog-create-title">Create Blog</h2>

      <form onSubmit={handleSubmit} className="blog-create-form">
        <input
          className="input"
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <textarea
          className="textarea"
          placeholder="Write full blog content..."
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          className="input"
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button type="submit" className="btn">
          Publish Blog
        </button>
      </form>
    </div>
  );
}