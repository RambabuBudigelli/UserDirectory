import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import "./index.css";
import "./App.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

if (!domain || !clientId) {
  // Render a visible error so the user doesn't trigger a broken Auth redirect
  rootEl.innerHTML = `
    <div style="padding:20px;color:#8B0000;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
      <h2>Missing Auth0 configuration</h2>
      <p>Please copy <code>.env.example</code> to <code>.env</code>, set <code>VITE_AUTH0_DOMAIN</code> and <code>VITE_AUTH0_CLIENT_ID</code>, and restart the dev server.</p>
    </div>
  `;
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <BrowserRouter>
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience,
          }}
        >
          <App />
        </Auth0Provider>
      </BrowserRouter>
    </StrictMode>
  );
}
