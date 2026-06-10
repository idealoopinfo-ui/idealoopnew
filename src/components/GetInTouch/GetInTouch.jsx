import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./GetInTouch.css";

export default function GetInTouch() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus(null);

    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            name,
            email,
            message,
          },
        ]);

      if (error) {
        throw error;
      }

      setStatus({
        type: "success",
        text: "✅ Message sent successfully!",
      });

      // Clear form
      setName("");
      setEmail("");
      setMessage("");

      // Hide success message after 4.5 seconds
      setTimeout(() => {
        setStatus(null);
      }, 4500);
    } catch (error) {
      console.error(error);

      setStatus({
        type: "error",
        text: "❌ Failed to send message. Please try again.",
      });

      setTimeout(() => {
        setStatus(null);
      }, 4500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact">
      <h2 className="contact-title">Get in Touch</h2>

      <form className="contact-container" onSubmit={handleSubmit}>
        {status && (
          <div className={`contact-status ${status.type}`}>
            {status.text}
          </div>
        )}

        <input
          type="text"
          placeholder="Your Name"
          className="contact-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="contact-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          placeholder="Your Message"
          className="contact-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button
          type="submit"
          className="contact-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="sending">
              📨 Sending
              <span className="dot-flash">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </span>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </section>
  );
}