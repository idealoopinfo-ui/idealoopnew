import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./AdminDashboard.css";

export default function AdminDashboard() {

  // =========================
  // NAVIGATION
  // =========================
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================
  const [tab, setTab] = useState("stats");

  const [productsCount, setProductsCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  const [editProduct, setEditProduct] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {

    // PRODUCTS COUNT
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    setProductsCount(count || 0);

    // PRODUCTS
    const { data: productData } = await supabase
      .from("products")
      .select("*");

    setProducts(productData || []);

    // BLOGS
    const { data: blogData } = await supabase
      .from("blogs")
      .select("*");

    setBlogs(blogData || []);

    // MESSAGES
    const { data: contactData } = await supabase
      .from("messages")
      .select("*");

    setContacts(contactData || []);

    // USERS
    const { data: userData } = await supabase
      .from("profiles")
      .select("*");

    setUsers(userData || []);
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    await supabase
      .from("products")
      .delete()
      .eq("id", id);

    fetchAll();
  };

  // =========================
  // DELETE BLOG
  // =========================
  const deleteBlog = async (id) => {
    await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

    fetchAll();
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const handleProductUpdate = async () => {

    await supabase
      .from("products")
      .update({
        name: editProduct.name,
        category: editProduct.category,
        subcategory: editProduct.subcategory,
      })
      .eq("id", editProduct.id);

    setEditProduct(null);
    fetchAll();
  };

  // =========================
  // UPDATE BLOG
  // =========================
  const handleBlogUpdate = async () => {

    await supabase
      .from("blogs")
      .update({
        title: editBlog.title,
        content: editBlog.content,
      })
      .eq("id", editBlog.id);

    setEditBlog(null);
    fetchAll();
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="admin-container">

    <h1>Admin Dashboard</h1>
   

      {/* =========================
          TABS
      ========================= */}
      <div className="admin-tabs">

        <button className="btn" onClick={() => setTab("stats")}>
          Stats
        </button>

        <button className="btn" onClick={() => setTab("products")}>
          Products
        </button>

        <button className="btn" onClick={() => setTab("blogs")}>
          Blogs
        </button>

        <button
          className="btn"
          onClick={() => navigate("/admin/users")}
        >
          Users Page
        </button>

        <button
          className="btn"
          onClick={() => navigate("/admin/messages")}
        >
          Messages Page
        </button>

      </div>

      {/* =========================
          STATS
      ========================= */}
      {tab === "stats" && (
        <div className="stats-grid">

          <div className="card">
            <h3>Total Products</h3>
            <p>{productsCount}</p>
          </div>

          <div className="card">
            <h3>Total Blogs</h3>
            <p>{blogs.length}</p>
          </div>

          <div className="card">
            <h3>Total Messages</h3>
            <p>{contacts.length}</p>
          </div>

          <div className="card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>

        </div>
      )}

      {/* =========================
      PRODUCTS
========================= */}
{tab === "products" && (
  <div className="section">

    <h2>Products</h2>

    {products.length === 0 ? (
      <p>No products found</p>
    ) : (
      products.map((p) => (
        <div key={p.id} className="admin-product-card">

          {/* IMAGE */}
          <img
            src={p.image_url}
            alt={p.name}
            className="admin-product-image"
          />

          {/* INFO */}
      <div className="admin-product-info">

      <div className="admin-product-id">
      {p.product_id}
      </div>

      <h4>{p.title}</h4>

      <p>${p.price}</p>

      </div>

          {/* ACTION BUTTONS */}
          <div className="admin-product-actions">

            <button
              className="btn"
              onClick={() => setEditProduct(p)}
            >
              Edit
            </button>

            <button
              className="btn btn-danger"
              onClick={() => deleteProduct(p.id)}
            >
              Delete
            </button>

          </div>

        </div>
      ))
    )}

  </div>
)}
      {/* =========================
    BLOGS
========================= */}
{tab === "blogs" && (
  <div className="section">

    <h2>Blogs</h2>

    {blogs.length === 0 ? (
      <p>No blogs found</p>
    ) : (
      blogs.map((b) => (
        <div key={b.id} className="admin-blog-row">

          <div className="admin-blog-info">

          <div className="admin-blog-id">
        #{blogs.indexOf(b) + 1}
        </div>

            <div className="admin-blog-title">
              {b.title}
            </div>

          </div>

          <div className="admin-blog-actions">

            <button
              className="btn btn-small"
              onClick={() => setEditBlog(b)}
            >
              Edit
            </button>

            <button
              className="btn btn-small btn-danger"
              onClick={() => deleteBlog(b.id)}
            >
              Delete
            </button>

          </div>

        </div>
      ))
    )}

  </div>
)}
      {/* =========================
          USERS
      ========================= */}
      {tab === "users" && (
  <div className="section">

    <h2>Users</h2>

    {users.length === 0 ? (
      <p>No users found</p>
    ) : (
      users.map((u, index) => (
        <div key={u.id} className="admin-user-card">

          <div className="admin-user-info">

            <div className="admin-user-id">
              #{index + 1}
            </div>

            <div className="admin-user-email">
              {u.email}
            </div>

          </div>

          <div className="admin-user-actions">
            <button className="btn btn-small">
              View
            </button>
          </div>

        </div>
      ))
    )}

  </div>
)}

      {/* =========================
          EDIT PRODUCT MODAL
      ========================= */}
      {editProduct && (
        <div className="modal">

          <div className="modal-content">

            <h2>Edit Product</h2>

            <input
              type="text"
              value={editProduct.name || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              value={editProduct.category || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  category: e.target.value,
                })
              }
            />

            <input
              type="text"
              value={editProduct.subcategory || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  subcategory: e.target.value,
                })
              }
            />

            <button
              className="btn btn-primary"
              onClick={handleProductUpdate}
            >
              Save
            </button>

            <button
              className="btn"
              onClick={() => setEditProduct(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* =========================
          EDIT BLOG MODAL
      ========================= */}
      {editBlog && (
        <div className="modal">

          <div className="modal-content">

            <h2>Edit Blog</h2>

            <input
              type="text"
              value={editBlog.title || ""}
              onChange={(e) =>
                setEditBlog({
                  ...editBlog,
                  title: e.target.value,
                })
              }
            />

            <textarea
              value={editBlog.content || ""}
              onChange={(e) =>
                setEditBlog({
                  ...editBlog,
                  content: e.target.value,
                })
              }
            />

            <button
              className="btn btn-primary"
              onClick={handleBlogUpdate}
            >
              Save
            </button>

            <button
              className="btn"
              onClick={() => setEditBlog(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* =========================
          MESSAGE MODAL
      ========================= */}
    {/* =========================
    MESSAGES
========================= */}
{tab === "contacts" && (
  <div className="section">

    <h2>Messages</h2>

    {contacts.length === 0 ? (
      <p>No messages found</p>
    ) : (
      contacts.map((c, index) => (
        <div key={c.id} className="admin-message-card">

          <div className="admin-message-info">

            <div className="admin-message-id">
              #{index + 1}
            </div>

            <div className="admin-message-name">
              {c.name}
            </div>

            <div className="admin-message-email">
              {c.email}
            </div>

            <div className="admin-message-preview">
              {c.message?.slice(0, 60)}...
            </div>

          </div>

          <div className="admin-message-actions">
            <button
              className="btn btn-small"
              onClick={() => setSelectedMessage(c)}
            >
              View
            </button>
          </div>

        </div>
      ))
    )}

  </div>
  
)}
</div>
)}