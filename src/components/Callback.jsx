import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Callback = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthentication = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          console.log("Access token:", token);
          document.cookie = `auth_token=${token}; path=/; secure; samesite=strict;`;
          const response = await axiosInstance.get("/protected");
          if (response.status === 200) {
            const userData = response.data;
            console.log("User data:", userData);
          } else if (response.status === 401) {
            navigate("/login-patient");
          }
          console.log({ response });
          navigate("/home");
        } catch (error) {
          console.error("Authentication error:", error);
        }
      }
    };

    handleAuthentication();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  return <div>Loading...</div>;
};

export default Callback;
