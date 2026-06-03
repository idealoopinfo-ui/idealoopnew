import "./Legal.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <h1 className="legal-title">Privacy Policy</h1>

      <section className="legal-section">
        <h2>How We Use Your Data</h2>

        <p>
          We collect limited user information only to improve
          your experience and provide core platform features.
          Protecting your privacy is important to us.
        </p>

        <ul>
          <li>We do not sell personal information</li>
          <li>Secure authentication is handled through Supabase</li>
          <li>Data is stored using encrypted and secure systems</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Data Protection</h2>

        <p>
          We use industry-standard security practices and technologies
          to help protect your information from unauthorized access,
          misuse, or disclosure.
        </p>
      </section>
    </div>
  );
}