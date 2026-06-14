import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  const [searchId, setSearchId] = useState("");
  const [tab, setTab] = useState("stats");

  const [productsCount, setProductsCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchBlog, setSearchBlog] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // =========================
  // FETCH ALL DATA
  // =========================
  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    const loadNotice = async () => {
      const { data } = await supabase
        .from("site_notice")
        .select("message")
        .single();

      setNotice(data?.message);
    };

    loadNotice();
  }, []);

  const updateNotice = async () => {
    const { error } = await supabase
      .from("site_notice")
      .update({ message: notice })
      .eq("id", (await supabase.from("site_notice").select("id").single()).data.id);

    if (!error) {
      alert("Notice updated successfully!");
      
    }
  };


  const fetchAll = async () => {
    // PRODUCTS COUNT
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    setProductsCount(count || 0);

    // PRODUCTS
    const { data: productData } = await supabase.from("products").select("*");
    setProducts(productData || []);

    // BLOGS
    const { data: blogData } = await supabase.from("blogs").select("*");
    setBlogs(blogData || []);

    // MESSAGES
    const { data: contactData } = await supabase.from("messages").select("*");
    setContacts(contactData || []);

    // USERS
    const { data: userData } = await supabase.from("profiles").select("*");
    setUsers(userData || []);
  };

  // =========================
// MAINTENANCE TOGGLE
// =========================
const toggleMaintenance = async (value) => {
  const { error } = await supabase
    .from("site_settings")
    .update({ maintenance_mode: value })
    .eq("id", 1);

  if (!error) {
    alert(value ? "Maintenance Enabled" : "Maintenance Disabled");
  } else {
    console.error("Maintenance error:", error.message);
  }
};
  // =========================
  // DELETE / UPDATE
  // =========================
  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    fetchAll();
  };

  const deleteBlog = async (id) => {
    await supabase.from("blogs").delete().eq("id", id);
    fetchAll();
  };

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

  return (
    <div className="admin-container">
  
      {/* HEADER */}
      <div className="admin-top-bar">
        <h1>Admin Dashboard</h1>
      </div>
  
      {/* NAVIGATION */}
      <div className="admin-tabs">
  
        <button
          className="btn btn-primary"
          onClick={() => navigate("/profile")}
        >
          ← Back to Profile
        </button>
  
        <button
          className={`btn ${tab === "stats" ? "active" : ""}`}
          onClick={() => setTab("stats")}
        >
          Dashboard
        </button>
  
        <button
          className={`btn ${tab === "products" ? "active" : ""}`}
          onClick={() => setTab("products")}
        >
          Products
        </button>
  
        <button
          className={`btn ${tab === "blogs" ? "active" : ""}`}
          onClick={() => setTab("blogs")}
        >
          Blogs
        </button>
  
        <button
          className="btn"
          onClick={() => navigate("/admin/users")}
        >
          Users
        </button>
  
        <button
          className="btn"
          onClick={() => navigate("/admin/messages")}
        >
          Messages
        </button>
  
      </div>
  
      {/* =========================
          DASHBOARD STATS
      ========================= */}
      {tab === "stats" && (
        <>
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
  
          {/* NOTICE PANEL */}
          <div className="card notice-card">
            <h3>Site Notice</h3>
  
            <textarea
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              placeholder="Write important announcement..."
            />
  
            <button
              className="btn btn-primary"
              onClick={updateNotice}
            >
              Update Notice
            </button>
          </div>
  
          {/* MAINTENANCE */}
          <div className="maintenance-control">
            <h3>Maintenance Mode</h3>
  
            <div className="maintenance-buttons">
  
              <button
                className="enable-btn"
                onClick={() => toggleMaintenance(true)}
              >
                Enable Maintenance
              </button>
  
              <button
                className="disable-btn"
                onClick={() => toggleMaintenance(false)}
              >
                Disable Maintenance
              </button>
  
            </div>
          </div>
        </>
      )}
  
      {/* PRODUCTS */}
      {tab === "products" && (
        <div className="section">
          <h2>Products</h2>
  
          <div className="admin-search-wrapper">
            <input
              type="text"
              placeholder="Search Product ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="admin-search-input"
            />
          </div>
  
          <div className="admin-product-wrapper">
            <div className="admin-product-list">
  
              {products
                .filter((p, index) => {
                  if (!searchId) return true;
  
                  const keyword = searchId.toLowerCase();
  
                  return (
                    String(p.product_id || "")
                      .toLowerCase()
                      .includes(keyword) ||
                    String(p.id)
                      .toLowerCase()
                      .includes(keyword) ||
                    String(index + 1).includes(keyword)
                  );
                })
                .map((p, index) => (
                  <div
                    key={p.id}
                    className="admin-product-row"
                  >
                    <span>{index + 1}</span>
  
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="admin-product-image-small"
                    />
  
                    <div className="admin-product-title">
                      {p.name}
                    </div>
  
                    <div className="admin-product-price">
                      ${p.price}
                    </div>
                  </div>
                ))}
  
            </div>
          </div>
        </div>
      )}
  
      {/* BLOGS */}
      {tab === "blogs" && (
        <div className="section">
          <h2>Blogs</h2>
  
          <div className="admin-search-wrapper">
            <input
              type="text"
              placeholder="Search blog..."
              value={searchBlog}
              onChange={(e) => setSearchBlog(e.target.value)}
              className="admin-search-input"
            />
          </div>
  
          {blogs
            .filter((b) =>
              (b.title || "")
                .toLowerCase()
                .includes(searchBlog.toLowerCase())
            )
            .map((b, index) => (
              <div
                key={b.id}
                className="admin-blog-row"
              >
                <span>{index + 1}</span>
  
                <div className="admin-blog-title">
                  {b.title}
                </div>
  
                <button
                  className="btn btn-danger"
                  onClick={() => deleteBlog(b.id)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      )}
  
    </div>
  );
}