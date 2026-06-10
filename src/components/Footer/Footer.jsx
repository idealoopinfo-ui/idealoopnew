import "./Footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaPinterest } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-col">

          <div className="footer-brand">
          <img
  src="https://bykkbdkowxocrfucxlhd.supabase.co/storage/v1/object/public/personal/Untitled_design-removebg-preview.png"
  alt="Idealoop Logo"
  className="footer-logo"
  onError={(e) => {
    e.target.src = "/fallback-logo.png";
  }}
/>

            <h2 className="footer-logo-text">idealoop</h2>
          </div>

          <p className="footer-desc">
            Premium fitness products, wellness tools & digital resources designed to elevate your lifestyle.
          </p>

          <div className="footer-socials">

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon ig"
            >
              <FaInstagram />
            </a>

            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon pin"
            >
              <FaPinterest />
            </a>

          </div>

        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h3>Get In Touch</h3>

          <a href="mailto:idealoop.info@gmail.com" className="footer-email">
            idealoop.info@gmail.com
          </a>

          <p className="small-text">
            We usually reply within 24–48 hours.
          </p>
        </div>

        {/* LEGAL */}
        <div className="footer-col">
          <h3>Legal</h3>

          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/affiliate-disclosure">Affiliate Disclosure</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>© {new Date().getFullYear()} idealoop. All rights reserved.</p>

        <p className="disclosure">
          Disclosure: This site may contain affiliate links. We may earn a commission at no extra cost to you.
        </p>

      </div>

    </footer>
  );
}