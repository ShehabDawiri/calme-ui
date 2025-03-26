import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import i18n from "./utils/i18n";
import { I18nextProvider } from "react-i18next";
import { Auth0Provider } from "@auth0/auth0-react";
// import { ThemeProviderContext } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin + "/callback",
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <I18nextProvider i18n={i18n}>
        {/* <ThemeProviderContext> */}
        <App />
        {/* </ThemeProviderContext> */}
      </I18nextProvider>
    </Auth0Provider>
  </StrictMode>,
);
