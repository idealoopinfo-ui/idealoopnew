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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe?.();
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
          src="https://bykkbdkowxocrfucxlhd.supabase.co/storage/v1/object/sign/personal/Untitled_design-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNjM1YjI5OC03ZmFkLTRkOTYtYjU1Yi02MDRjOGJjZGRjMGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZXJzb25hbC9VbnRpdGxlZF9kZXNpZ24tcmVtb3ZlYmctcHJldmlldy5wbmciLCJpYXQiOjE3ODAwODI0ODgsImV4cCI6MTgxMTYxODQ4OH0._RLJ0sRfc75YRvbIYp-57l0p_pUVl8UcF2WaP6Em9PU"
          alt="idealoop logo"
          className="navbar-logo"
        />

      <Link to="/" className="brand">
      <span className="brand-name">idealoop</span>
    </Link>
      </div>

      {/* NAV LINKS */}
      <ul className="nav-links">
        
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