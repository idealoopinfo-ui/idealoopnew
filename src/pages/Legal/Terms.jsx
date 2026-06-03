import "./Legal.css";

export default function TermsConditions() {
  return (
    <div className="legal-page">
      <h1 className="legal-title">Terms & Conditions</h1>

      <section className="legal-section">
        <h2>User Agreement</h2>

        <p>
          By accessing or using this website, you agree to comply
          with all applicable rules, policies, and guidelines.
        </p>

        <ul>
          <li>No illegal or harmful activity is permitted</li>
          <li>Do not misuse, copy, or abuse platform content</li>
          <li>Users are responsible for their account activity</li>
          <li>We may update these terms at any time</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Service Changes</h2>

        <p>
          We reserve the right to modify, suspend, or discontinue
          any part of the platform or services at any time without
          prior notice.
        </p>
      </section>
    </div>
  );
}