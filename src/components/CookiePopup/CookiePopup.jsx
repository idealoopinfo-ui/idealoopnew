import { useEffect, useState } from "react";
import "./CookiePopup.css";

export default function CookiePopup() {

  // =========================
  // STATE
  // =========================
  const [visible, setVisible] = useState(false);

  // =========================
  // EFFECT
  // =========================
  useEffect(() => {

    const accepted = localStorage.getItem("cookiesAccepted");

    // show popup only if not set (null)
    if (accepted === null) {

      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }

    // if user already accepted or rejected → hide
    setVisible(false);

  }, []);

  // =========================
  // ACCEPT COOKIES
  // =========================
  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  // =========================
  // REJECT COOKIES
  // =========================
  const rejectCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setVisible(false);
  };

  // =========================
  // RENDER
  // =========================
  if (!visible) return null;

  return (
    <div className="cookie-overlay">

      <div className="cookie-box">

        <h3>🍪 We use cookies</h3>

        <p>
          We use cookies to improve your experience and personalize content.
        </p>

        <div className="cookie-actions">

          <button
            className="cookie-btn accept"
            onClick={acceptCookies}
          >
            Accept
          </button>

          <button
            className="cookie-btn reject"
            onClick={rejectCookies}
          >
            Reject
          </button>

        </div>

      </div>

    </div>
  );
}