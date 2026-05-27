import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!error && isMounted) {
        setUser(data?.user || null);
      }
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user || null);
      }
    });

    return () => {
      isMounted = false;
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.user_metadata?.name?.split(" ")[0] ||
    user?.email?.split("@")[0];

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo-container">
        <img
          src="/logo.png"
          alt="idealoop logo"
          className="logo"
        />
        <span className="brand-name">idealoop</span>
      </div>

      {/* NAV LINKS */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/blogs">Blogs</Link></li>
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