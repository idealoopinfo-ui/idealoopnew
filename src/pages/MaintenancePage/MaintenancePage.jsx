import "./MaintenancePage.css";

export default function MaintenancePage() {
  return (
    <div className="maintenance-container">
      
      <div className="maintenance-card">
        
        {/* Animated icon */}
        <div className="maintenance-animation">
          🔧
        </div>

        <h1>We’ll Be Back Soon</h1>

        <p>
          We’re currently improving <strong>Idealoop Fitness Store</strong> to bring you a
          better experience, faster performance, and new features.
        </p>

        <div className="loading-bar"></div>

        <p className="small-text">
          Site is under maintenance. Please check back shortly.
        </p>

      </div>

    </div>
  );
}