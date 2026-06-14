import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!error) {
        setUser(data?.user || null);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  const firstName =
    user?.user_metadata?.full_name?.split(" ")?.[0] ||
    user?.user_metadata?.name?.split(" ")?.[0] ||
    user?.email?.split("@")?.[0];

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo-container">
  <Link to="/" className="brand">
    <img
      src="https://bykkbdkowxocrfucxlhd.supabase.co/storage/v1/object/public/personal/Untitled_design-removebg-preview.png"
      alt="idealoop logo"
      className="navbar-logo"
    />

    <span className="brand-name">idealoop</span>
  </Link>
</div>

      {/* NAV LINKS (optional - keep or remove later) */}
      <ul className="nav-links">
        {/* Add links here if needed */}
      </ul>

      {/* AUTH SECTION */}
      <div className="auth-links">

        {user ? (
          <>
            <span className="hello-text">
              Hi, {firstName}
            </span>

            <Link to="/profile" className="btn">
              Profile
            </Link>

            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}

      </div>

    </nav>
  );
}