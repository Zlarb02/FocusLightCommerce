import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/700.css";
import "@fontsource/geist-sans/800.css";
import "./index.css";
import "./assets/global.css";
import "./assets/layout.css";

const rootElement = document.getElementById("root");

if (rootElement && !rootElement.hasChildNodes()) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
