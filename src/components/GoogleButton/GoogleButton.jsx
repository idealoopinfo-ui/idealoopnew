import { supabase } from "../../lib/supabaseClient";
import "./GoogleButton.css";

export default function GoogleButton() {
  const handleGoogleLogin = async () => {
    try {
      const redirectUrl =
        import.meta.env.VITE_APP_URL || window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectUrl}/profile`,
        },
      });

      if (error) {
        console.error("Google login error:", error.message);
        alert(error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong during Google login.");
    }
  };

  return (
    <button className="google-btn" onClick={handleGoogleLogin}>
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="google-icon"
      />
      Continue with Google
    </button>
  );
}