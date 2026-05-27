import "./About.css";

export default function About() {
  return (
    <section className="about">

      <div className="about-container">

        {/* LEFT SIDE */}
        <div className="about-text">
          <h2>About idealoop</h2>

          <p>
            idealoop is a modern fitness and wellness platform designed
            to help people discover premium fitness products,
            training essentials, gym wear, recovery tools,
            and educational ebooks in one place.
          </p>

          <p>
            Our mission is to create a simple and powerful shopping
            experience for athletes, fitness enthusiasts,
            and beginners looking to improve their lifestyle.
          </p>

          <button
            className="about-btn"
            onClick={() => window.location.href = "/products"}
          >
            Explore Products
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
            alt="fitness"
            loading="lazy"
          />
        </div>

      </div>

    </section>
  );
}