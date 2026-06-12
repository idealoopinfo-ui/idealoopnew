import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./AdminDashboard.css";

export default function AdminDashboard() {
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
  // FETCH ALL DATA
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

  // =========================
  // UI
  // =========================
  return (
    <div>
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
          </div>

          {/* =========================
              SITE CONTROL (FIXED)
          ========================= */}
          <div className="maintenance-control">
  <h3>Site Control</h3>

  <div className="maintenance-buttons">
    <button onClick={() => toggleMaintenance(true)}>
      Enable Maintenance
    </button>

    <button onClick={() => toggleMaintenance(false)}>
      Disable Maintenance
    </button>
  </div>
</div>
        </div>
      )}

      {/* =========================
          PRODUCTS
      ========================= */}
      {tab === "products" && (
        <div>
          <h2>Products</h2>

          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((p) => (
              <div key={p.id} className="admin-product-card">
                <img src={p.image_url} alt={p.name} />

                <div>
                  <h4>{p.title}</h4>
                  <p>{p.price}</p>
                </div>

                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      )}

      {/* =========================
          BLOGS
      ========================= */}
      {tab === "blogs" && (
        <div>
          <h2>Blogs</h2>

          {blogs.length === 0 ? (
            <p>No blogs found</p>
          ) : (
            blogs.map((b) => (
              <div key={b.id}>
                <h4>{b.title}</h4>

                <button onClick={() => deleteBlog(b.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      )}

      {/* =========================
          MESSAGES (FIXED TAB)
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