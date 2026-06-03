import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {

  return (

    <footer className="footer">

      {/* =========================
          TOP SECTION
      ========================= */}
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-col">

          <div className="footer-brand">

            <img
              src="https://bykkbdkowxocrfucxlhd.supabase.co/storage/v1/object/sign/personal/Untitled_design-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNjM1YjI5OC03ZmFkLTRkOTYtYjU1Yi02MDRjOGJjZGRjMGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZXJzb25hbC9VbnRpdGxlZF9kZXNpZ24tcmVtb3ZlYmctcHJldmlldy5wbmciLCJpYXQiOjE3Nzk1NjYxODMsImV4cCI6MTgxMTEwMjE4M30.ZegW3OY0CX_wchRWofeczIOrI-AnocEe9Ht5I986e_U"
              alt="Idealoop Logo"
              className="footer-logo"
            />

            <h2 className="logo">
              idealoop
            </h2>

          </div>

          <p>
            Premium fitness products, wellness tools,
            ebooks, and expert content designed to
            support your health and growth journey.
          </p>

        </div>

        {/* CONTACT */}
        <div className="footer-col">

          <h3>Contact</h3>

          <p>
            idealoop.info@gmail.com
          </p>

        </div>

        {/* LEGAL */}
        <div className="footer-col">

          <h3>Legal</h3>

          <Link to="/terms">
            Terms & Conditions
          </Link>

          <Link to="/affiliate-disclosure">
            Affiliate Disclosure
          </Link>

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

        </div>

      </div>

      {/* =========================
          BOTTOM
      ========================= */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} idealoop.
          All rights reserved.
        </p>

        <p className="disclosure">
          Disclosure: Some links on this website may
          be affiliate links. We may earn a commission
          at no additional cost to you.
        </p>

      </div>

    </footer>
  );
}