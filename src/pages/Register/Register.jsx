import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import GoogleButton from "../../components/GoogleButton/GoogleButton";

import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  /* =========================
     FORM STATE
  ========================= */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* =========================
     UI STATE
  ========================= */
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================
     REGISTER USER
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    /* PASSWORD MATCH CHECK */
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setMessage("❌ Passwords do not match");
      setLoading(false);
      return;
    }

    /* PASSWORD LENGTH CHECK */
    if (formData.password.length < 6) {
      setMessage(
        "❌ Password must be at least 6 characters"
      );

      setLoading(false);
      return;
    }

    try {
      /* SIGN UP USER */
      const { data, error } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const user = data?.user;

      /* EMAIL CONFIRMATION CASE */
      if (!user) {
        setMessage(
          "📩 Check your email to confirm your account"
        );

        setLoading(false);
        return;
      }

      /* INSERT PROFILE */
      const { error: profileError } =
        await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,

              first_name:
                formData.firstName,

              last_name:
                formData.lastName,

              email: formData.email,

              bio: "",
              address: "",
              avatar_url: "",

              wishlist: [],
            },
          ]);

      if (profileError) {
        console.error(profileError);

        setMessage(
          "⚠️ Account created but profile save failed"
        );

        setLoading(false);
        return;
      }

      /* SUCCESS */
      setMessage(
        "✅ Registration successful!"
      );

      /* REDIRECT */
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      console.error(err);

      setMessage(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      {/* TOAST MESSAGE */}
      {message && (
        <div className="toast-message">
          {message}
        </div>
      )}

      <div className="register-card">

        <h2>Create Account</h2>

        <p className="subtitle">
          Join us and get started
        </p>

        {/* GOOGLE LOGIN */}
        <GoogleButton />

        {/* DIVIDER */}
        <div className="divider">
          OR
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* NAME ROW */}
          <div className="row">

            <input
              className="input"
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              className="input"
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

          </div>

          {/* EMAIL */}
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* PASSWORD */}
          <div className="password-box">

            <input
              className="input"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? "🐵" : "🙈"}
            </span>

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="password-box">

            <input
              className="input"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <span
              className="toggle-password"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? "🐵"
                : "🙈"}
            </span>

          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="login-text">

          Already have an account?{" "}

          <span
            className="login-link"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </span>

        </p>

      </div>
    </div>
  );
}