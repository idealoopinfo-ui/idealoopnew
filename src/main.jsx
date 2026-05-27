import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/button.css";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}