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
            src="https://bykkbdkowxocrfucxlhd.supabase.co/storage/v1/object/public/personal/fw_flash_sale_sept_26_30_web_asset_1360x664.jpg"
            alt="fitness"
            loading="lazy"
          />
        </div>

      </div>

    </section>
  );
}