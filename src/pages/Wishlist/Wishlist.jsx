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
  
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }
  
    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id);
  
    if (error) {
      console.log(error);
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
           <div className="wishlist-card">

           <div className="wishlist-info">
             <p><b>Product ID:</b> {item.product_id}</p>
           </div>
         
           <div className="wishlist-actions">
             <button
               className="view-btn"
               onClick={() => navigate(`/product/${item.product_id}`)}
             >
               View Product
             </button>
           </div>
         
         </div>
          ))}
        </div>
      )}

    </div>
  );
}