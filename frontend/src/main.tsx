import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-ennfeex6067qq830.us.auth0.com"
        clientId="oQhwS4edLquoqm7374bn5jt8J80MLWGJ"
        authorizationParams={{
          redirect_uri: window.location.origin,
          //audience: "https://userdirectory-api",
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>
);