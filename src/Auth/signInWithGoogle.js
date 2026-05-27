import { supabase } from "../lib/supabaseClient";

/* =========================
   GOOGLE SIGN IN
========================= */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // ✅ correct root (localhost + production)
      },
    });

    if (error) {
      console.error("Google Sign-In Error:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during Google login:", err);
    return null;
  }
};