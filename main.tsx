import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// CSS import order is load-order dependent.
// tokens.css must precede global.css because global.css
// reads var(--theme-*) properties defined in tokens.css.
import "@/styles/global.css";
import "@/styles/tokens.css";

import App from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error(
    "[grand-finale] Could not find #root element. " +
      'Check that index.html contains <div id="root">.',
  );
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
