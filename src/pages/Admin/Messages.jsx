import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function Messages() {

  // =========================
  // STATES
  // =========================
  const [messages, setMessages] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // =========================
  // FETCH MESSAGES
  // =========================
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Error fetching messages:", error.message);
      setMessages([]);
    } else {
      setMessages(data || []);
    }

    setLoading(false);
  };

  // =========================
  // MARK AS READ
  // =========================
  const markAsRead = async (id) => {

    await supabase
      .from("messages")
      .update({
        is_read: true,
      })
      .eq("id", id);

    fetchMessages();
  };

  // =========================
  // SEND REPLY
  // =========================
  const sendReply = async (id) => {

    const reply = replyTexts[id];

    if (!reply || !reply.trim()) return;

    await supabase
      .from("messages")
      .update({
        reply,
      })
      .eq("id", id);

    setReplyTexts((prev) => ({
      ...prev,
      [id]: "",
    }));

    fetchMessages();
  };

  // =========================
  // DELETE MESSAGE
  // =========================
  const deleteMessage = async (id) => {

    await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    fetchMessages();
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="admin-page">

      <h1>Messages</h1>

      <table className="admin-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (

            <tr>
              <td colSpan="5">
                Loading messages...
              </td>
            </tr>

          ) : messages.length === 0 ? (

            <tr>
              <td colSpan="5">
                No messages found
              </td>
            </tr>

          ) : (

            messages.map((msg) => (

              <tr key={msg.id}>

                <td>{msg.name}</td>

                <td>{msg.email}</td>

                <td>{msg.message}</td>

                <button className="btn" onClick={() => navigate("/admin")}>
      ⬅ Back to Admin Dashboard
      </button>

                {/* =========================
                    READ STATUS
                ========================= */}
                <td>
                  {msg.is_read
                    ? "✅ Read"
                    : "🔴 Unread"}
                </td>

                {/* =========================
                    ACTIONS
                ========================= */}
                <td>

                  {!msg.is_read && (
                    <button
                      className="btn"
                      onClick={() => markAsRead(msg.id)}
                    >
                      Mark Read
                    </button>
                  )}

                  {/* =========================
                      REPLY
                  ========================= */}
                  <div className="reply-box">

                    <input
                      type="text"
                      placeholder="Reply..."
                      value={replyTexts[msg.id] || ""}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({
                          ...prev,
                          [msg.id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      className="btn btn-primary"
                      onClick={() => sendReply(msg.id)}
                    >
                      Send
                    </button>

                  </div>

                  {/* =========================
                      DELETE
                  ========================= */}
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteMessage(msg.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}