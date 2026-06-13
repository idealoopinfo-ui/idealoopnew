import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function NoticePanel() {
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const fetchNotice = async () => {
      const { data, error } = await supabase
        .from("site_notice")
        .select("message")
        .single();

      if (error) {
        console.log("Notice fetch error:", error);
        return;
      }

      setNotice(data?.message || "");
    };

    fetchNotice();
  }, []);

  return (
    <div className="notice-bar">
      <span>📢 Notice: </span>
      <span>{notice || "No notice available"}</span>
    </div>
  );
}