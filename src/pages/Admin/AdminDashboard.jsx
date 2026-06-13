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
      console.error(error.message);
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
  
        <button className="btn" onClick={() => setTab("messages")}>
          Messages
        </button>
  
        <button className="btn" onClick={() => navigate("/admin/users")}>
          Users Page
        </button>
  
        <button className="btn" onClick={() => navigate("/admin/messages")}>
          Messages Page
        </button>
      </div>
  
      {/* =========================
          STATS
      ========================= */}
      {tab === "stats" && (
        <div>
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
  
            {/* NOTICE */}
            <div className="card">
              <h3>Update Notice</h3>
  
              <textarea
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                rows={4}
                style={{ width: "100%" }}
              />
  
              <button onClick={updateNotice}>
                Update Notice
              </button>
            </div>
          </div>
  
          {/* Maintenance */}
          <div className="maintenance-control">
            <button onClick={() => toggleMaintenance(false)}>
              Disable Maintenance
            </button>
          </div>
        </div>
      )}
  
  
    {/* =========================
PRODUCTS (IMPROVED + SEARCH)
========================= */}
{tab === "products" && (
  <>
    {products.length === 0 ? (
      <p>No products found</p>
    ) : (
      <>

    {/* ✅ ADD SEARCH HERE */}
    <div className="admin-search-wrapper">
      <input
        type="text"
        placeholder="Search by Product ID, Item No..."
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        className="admin-search-input"
      />
    </div>

        {/* PRODUCT LIST WRAPPER */}
        <div className="admin-product-wrapper">
          <div className="admin-product-list">
          {products
  .filter((p, index) => {
    if (!searchId) return true;

    const keyword = searchId.toLowerCase();

    return (
      String(p.product_id || "").toLowerCase().includes(keyword) || // NEW ID
      String(p.id).toLowerCase().includes(keyword) ||               // UUID fallback
      String(index + 1).includes(keyword)                           // UI number
    );
  })
  .map((p, index) => (
                <div
                  key={p.id}
                  className={`admin-product-row ${
                    editProduct?.id === p.id ? "active" : ""
                  }`}
                  onClick={() =>
                    setEditProduct({
                      id: p.id,
                      name: p.name,
                      category: p.category,
                      subcategory: p.subcategory,
                      image_url: p.image_url,
                      price: p.price,
                    })
                  }
                >
                  <span className="product-index">
                    {index + 1}
                  </span>

                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="admin-product-image-small"
                  />

                  <div className="admin-product-title">
                    {p.title}
                  </div>

                  <div className="admin-product-price">
                    {p.price}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* GLOBAL ACTION PANEL */}
        {editProduct && (
          <div className="admin-action-bar">
            <button
              className="admin-btn"
              onClick={() => console.log("Edit mode")}
            >
              Edit
            </button>

            <button
              className="admin-btn save"
              onClick={handleProductUpdate}
            >
              Save
            </button>

            <button
              className="admin-btn delete"
              onClick={() => {
                deleteProduct(editProduct.id);
                setEditProduct(null);
              }}
            >
              Delete
            </button>
          </div>
        )}

        {/* OPTIONAL QUICK EDIT FORM */}
        {editProduct && (
          <div className="admin-edit-form">
            <input
              value={editProduct.name || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  name: e.target.value,
                })
              }
              placeholder="Product Name"
            />

            <input
              value={editProduct.category || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  category: e.target.value,
                })
              }
              placeholder="Category"
            />

            <input
              value={editProduct.subcategory || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  subcategory: e.target.value,
                })
              }
              placeholder="Subcategory"
            />
          </div>
        )}
      </>
    )}
  </>
)}
     {/* =========================
    BLOGS (WITH SEARCH)
========================= */}
{tab === "blogs" && (
  <div>
    <h2>Blogs</h2>

    {/* SEARCH INPUT (same style as products) */}
    <div className="admin-search-bar">
      <div className="admin-search-wrapper">
        <input
          type="text"
          placeholder="Search blog by title or ID..."
          value={searchBlog}
          onChange={(e) => setSearchBlog(e.target.value)}
        />
      </div>
    </div>

    {blogs.length === 0 ? (
      <p>No blogs found</p>
    ) : (
      blogs
        .filter((b, index) => {
          if (!searchBlog) return true;

          const keyword = searchBlog.toLowerCase();

          return (
            String(b.id).includes(keyword) ||
            String(index + 1).includes(keyword) ||
            (b.title || "").toLowerCase().includes(keyword)
          );
        })
        .map((b, index) => (
          <div key={b.id} className="admin-product-row">
            <span>{index + 1}</span>

            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{b.title}</h4>
            </div>

            <button onClick={() => deleteBlog(b.id)}>
              Delete
            </button>
          </div>
        ))
    )}
  </div>
)}
      {/* =========================
          MESSAGES
      ========================= */}
      {tab === "messages" && (
        <div>
          <h2>Messages</h2>
  
          {contacts.length === 0 ? (
            <p>No messages found</p>
          ) : (
            contacts.map((c, index) => (
              <div key={c.id}>
                <p>
                  #{index + 1} {c.name}
                </p>
                <p>{c.email}</p>
                <p>{c.message?.slice(0, 60)}...</p>
  
                <button onClick={() => setSelectedMessage(c)}>
                  View
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
 }