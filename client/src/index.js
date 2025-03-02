/**
 * Entry point for the React application.
 * Renders the App component inside the root element.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
      <App />
  );
}
