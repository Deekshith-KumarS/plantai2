import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RecentProvider } from "./context/RecentContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "195325415108-qjlqr5oi3ha09b5ddkdngjt04fa8430q.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <RecentProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </WishlistProvider>
        </RecentProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);