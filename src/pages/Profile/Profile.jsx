import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [reason, setReason] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    bio: "",
    avatar_url: "",
    wishlist: [],
  });

  // =========================
  // FETCH ROLE
  // =========================
  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setRole(data?.role);
      }
    };

    fetchRole();
  }, []);

  // =========================
  // FETCH PROFILE
  // =========================
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setProfile(data);
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        address: data.address || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
        wishlist: data.wishlist || [],
      });
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async (e) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated!");
    setEditing(false);
    fetchProfile();
  };

  // =========================
  // DELETE ACCOUNT REQUEST
  // =========================
  const handleDeleteAccount = async () => {
    if (!reason) {
      alert("Please select a reason");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("delete_requests")
      .insert([
        {
          user_id: user.id,
          email: user.email,
          reason,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Deletion request submitted.");

    await supabase.auth.signOut();
    navigate("/");
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================
  if (!profile) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">

      {/* TOP CARD */}
      <div className="profile-card profile-top">
        <img
          src={formData.avatar_url || "https://i.pravatar.cc/150"}
          alt="avatar"
          className="profile-avatar"
        />

        <div>
          <h2>
            {formData.first_name} {formData.last_name}
          </h2>
          <p className="profile-email">{profile.email}</p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="profile-card">
        <h3>Personal Details</h3>

        <p><strong>First Name:</strong> {formData.first_name}</p>
        <p><strong>Last Name:</strong> {formData.last_name}</p>
        <p><strong>Address:</strong> {formData.address || "Not added"}</p>
        <p><strong>Bio:</strong> {formData.bio || "No bio added"}</p>
      </div>

      {/* EDIT BUTTON */}
      <div className="profile-card">
        <button
          className="profile-btn"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Close Edit" : "Edit Profile"}
        </button>

        {editing && (
          <form className="profile-form" onSubmit={handleSave}>
            <input
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />

            <input
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />

            <input
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />

            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />

            <button type="submit" className="profile-btn">
              Save Changes
            </button>
          </form>
        )}
      </div>

      

     {/* ACTIONS SECTION */}
<div className="profile-card">

<h3>Quick Actions</h3>

<div className="profile-action-row">

  {/* WISHLIST */}
  <button
    className="profile-btn"
    onClick={() => navigate("/wishlist")}
  >
    My Wishlist
  </button>

  {/* ADMIN */}
  {role === "admin" && (
    <button
      className="profile-btn"
      onClick={() => navigate("/admin")}
    >
      Admin Panel
    </button>
  )}

</div>

{/* LOGOUT */}
<button className="logout-btn" onClick={handleLogout}>
  Logout
</button>

{/* DELETE ACCOUNT */}
<div className="profile-card">
        <button
          className="delete-btn"
          onClick={() => setShowDelete(true)}
        >
          Delete Account
        </button>

        {showDelete && (
          <div className="delete-box">
            <h3>Delete Account</h3>

            <p>Why are you deleting your account?</p>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select reason</option>
              <option value="privacy">Privacy concerns</option>
              <option value="not_useful">Not useful</option>
              <option value="switching">Switching platform</option>
              <option value="other">Other</option>
            </select>

            <button className="delete-btn" onClick={handleDeleteAccount}>
              Confirm Delete
            </button>

            <button
              className="profile-btn"
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

</div>
</div>
  )}

