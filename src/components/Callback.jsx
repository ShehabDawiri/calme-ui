import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import React from "react";

const Callback = () => {
  const { isAuthenticated, getIdTokenClaims, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const saveTokenAndRedirect = async () => {
      if (isAuthenticated) {
        try {
          const tokenClaims = await getIdTokenClaims();
          const token = tokenClaims?.__raw;

          if (token) {
            localStorage.setItem("token", token); // Save the actual token
            console.log("Token saved:", token);
          }

          navigate("/home"); // Redirect to home page
        } catch (err) {
          console.error("Failed to fetch token:", err);
        }
      }

      if (error) console.error("Login failed:", error);

      if (!isLoading && !isAuthenticated) navigate("/login");
    };

    saveTokenAndRedirect();
  }, [isAuthenticated, getIdTokenClaims, isLoading, error, navigate]);

  return <h2>Loading...</h2>;
};

export default Callback;
