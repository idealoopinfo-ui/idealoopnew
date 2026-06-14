import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./CategoryShowcase.css";

export default function CategoryShowcase() {
  const [strength, setStrength] = useState([]);
  const [gymwear, setGymwear] = useState([]);
  const [recovery, setRecovery] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.log("Supabase error:", error.message);
        return;
      }

      if (!data) return;

      setStrength(
        data
          .filter((p) => p.category === "strength-training")
          .slice(0, 4)
      );

      setGymwear(
        data
          .filter((p) => p.category === "gym-wear")
          .slice(0, 4)
      );

      setRecovery(
        data
          .filter((p) => p.category === "recovery-wellness")
          .slice(0, 4)
      );
    };

    fetchData();
  }, []);

  const renderImages = (items) => {
    return (
      <div className="image-collage">
        {items.map((item) => (
          <div key={item.id} className="img-box">
            <img
              src={item.image_url || "https://via.placeholder.com/150"}
              alt={item.name || "product"}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="category-showcase">
      <h2></h2>

      <div className="category-cards">

        {/* Strength Training */}
        <div className="category-box">
          <h3>Strength Training</h3>
          {renderImages(strength)}
          <button>View More</button>
        </div>

        {/* Gym Wear */}
        <div className="category-box">
          <h3>Gym Wear</h3>
          {renderImages(gymwear)}
          <button>View More</button>
        </div>

        {/* Recovery Wellness */}
        <div className="category-box">
          <h3>Recovery Wellness</h3>
          {renderImages(recovery)}
          <button>View More</button>
        </div>

      </div>
    </section>
  );
}