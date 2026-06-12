import { supabase } from "./supabaseClient";

/**
 * Safe wrapper for Supabase requests
 * Automatically handles JWT expired errors
 */
export const safeQuery = async (queryFn) => {
  try {
    const result = await queryFn();

    // If Supabase returns an error
    if (result?.error) {
      console.log("Supabase error:", result.error);

      // ✅ handle JWT expired / auth broken state
      if (
        result.error.message?.includes("JWT") ||
        result.error.status === 401 ||
        result.error.status === 403
      ) {
        console.warn("Session expired. Signing out...");

        await supabase.auth.signOut();

        // optional but recommended: reset app state
        window.location.reload();
      }
    }

    return result;
  } catch (err) {
    console.error("Unexpected Supabase failure:", err);
    return { data: null, error: err };
  }
};