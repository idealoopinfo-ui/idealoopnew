import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";

export default function ResetPassword() {

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {

    e.preventDefault();

    setMessage("");

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated successfully!");

    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h2>Reset Password</h2>

        {message && (
          <p style={{ marginBottom: "10px" }}>
            {message}
          </p>
        )}

        <form onSubmit={handleReset}>

          <input
            className="input"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

      </div>

    </div>
  );
}