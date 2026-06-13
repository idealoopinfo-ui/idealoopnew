import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

import "./Login.css";

export default function Login() {
const navigate = useNavigate();

/* =========================
FORM STATE
========================= */
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

/* PASSWORD TOGGLE */
const [showPassword, setShowPassword] = useState(false);

/* MESSAGE */
const [message, setMessage] = useState("");

/* LOADING */
const [loading, setLoading] = useState(false);

/* =========================
LOGIN FUNCTION (FIXED)
========================= */
const handleLogin = async (e) => {
e.preventDefault();

setLoading(true);
setMessage("");

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

/* ERROR */
if (error) {
  setMessage(error.message);
  setLoading(false);
  return;
}

/* ✅ SESSION FIX START */
const session = data?.session;

if (!session || !session.access_token) {
  setMessage("Login failed: Session not created");
  setLoading(false);
  return;
}

console.log("LOGIN SESSION:", session);
/* ✅ SESSION FIX END */

/* SUCCESS */
setMessage("✅ Login successful!");

setLoading(false);

/* 🔥 small delay ensures JWT is stored properly */
setTimeout(() => {
  navigate("/");
}, 800);
};

/* =========================
GOOGLE LOGIN
========================= */
const handleGoogleLogin = async () => {
  setMessage("");
  setLoading(true);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    setMessage(error.message);
    setLoading(false);
  }
};

/* =========================
FORGOT PASSWORD
========================= */
const handleForgotPassword = async () => {
if (!email) {
setMessage("Please enter your email first");
return;
}

const { error } = await supabase.auth.resetPasswordForEmail(email);

if (error) {
  setMessage(error.message);
  return;
}

setMessage("✅ Password reset email sent!");
};

return (
<div className="login-wrapper">

{message && (
<div className="message">{message}</div>
)}

  <div className="login-card">
    <h2>Welcome Back</h2>

    <p className="subtitle">
      Login to continue
    </p>

    {/* GOOGLE BUTTON */}
    <button
      type="button"
      className="google-btn"
      onClick={handleGoogleLogin}
    >
      <span className="google-icon">
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.98 2.69 30.41 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.2C12.43 13.21 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.54 28.43a14.5 14.5 0 0 1 0-9.02l-7.98-6.2A24 24 0 0 0 0 24c0 3.88.93 7.54 2.56 10.79l7.98-6.36z"/>
          <path fill="#34A853" d="M24 48c6.41 0 11.8-2.1 15.73-5.7l-7.73-6c-2.15 1.45-4.92 2.3-8 2.3-6.26 0-11.57-3.71-13.46-9.09l-7.98 6.36C6.51 42.62 14.62 48 24 48z"/>
        </svg>
      </span>

      Continue with Google
    </button>

    <div className="divider">OR</div>

    <form onSubmit={handleLogin}>
      <input
        className="input"
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="password-box">
        <input
          className="input"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <span
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🐵" : "🙈"}
        </span>
      </div>

      <p className="forgot-password" onClick={handleForgotPassword}>
        Forgot Password?
      </p>

      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <p className="register-text">
      Don't have an account?{" "}
      <span onClick={() => navigate("/register")}>
        Register
      </span>
    </p>
  </div>
</div>
);
}