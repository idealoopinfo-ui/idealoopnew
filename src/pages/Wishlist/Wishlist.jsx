import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./Wishlist.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    // =========================
    // FETCH FROM WISHLIST TABLE (FIXED)
    // =========================
    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log("Wishlist error:", error.message);
      setWishlist([]);
      setLoading(false);
      return;
    }

    setWishlist(data || []);
    setLoading(false);
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="wishlist-page">
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      <h1>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>No wishlist items yet.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">

              <p><b>Product ID:</b> {item.product_id}</p>

              <button
                onClick={() =>
                  navigate(`/product/${item.product_id}`)
                }
              >
                View Product
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}