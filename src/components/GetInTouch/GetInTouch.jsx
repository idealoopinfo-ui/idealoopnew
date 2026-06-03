import "./GetInTouch.css";

export default function GetInTouch() {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Later you can connect Supabase or EmailJS here
    console.log("Message sent");
  };

  return (
    <section className="contact">
      <h2 className="contact-title">Get in Touch</h2>

      <form className="contact-container" onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Your Name"
          className="contact-input"
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          className="contact-input"
          required
        />

        <textarea
          placeholder="Your Message"
          className="contact-textarea"
          required
        ></textarea>

        <button type="submit" className="contact-btn">
          Send Message
        </button>

      </form>
    </section>
  );
}