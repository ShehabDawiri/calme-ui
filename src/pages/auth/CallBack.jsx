import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { Loader } from "../../components/ui/loader";
import { useToast } from "../../hooks/useToast";

function Callback() {
  const { isAuthenticated, getAccessTokenSilently, logout, user } = useAuth0();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const handleAuthentication = async () => {
      if (!isAuthenticated) return;

      try {
        // Get access token
        const token = await getAccessTokenSilently();
        document.cookie = `auth_token=${token}; path=/; secure; samesite=strict;`;

        // Verify token with backend

        //TODO: add that when be the backend is ready
        // const response = await axiosInstance.get("/protected");
        //Dummy response
        const response = { status: 200 };
        if (response.status === 200) {
          navigate("/");
        }
      } catch (error) {
        console.error("Authentication error:", error);

        // Handle different error types
        let errorMessage = "Authentication failed";
        let variant = "error";

        if (error.response) {
          switch (error.response.status) {
            case 401:
              errorMessage = "Session expired. Please log in again.";
              break;
            case 403:
              errorMessage = "Insufficient permissions";
              variant = "warning";
              break;
            case 500:
              errorMessage =
                "Backend service unavailable. Please try again later.";
              break;
            default:
              errorMessage = "Unexpected server error";
          }
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection.";
        }

        showToast(errorMessage, variant);

        // Proper logout with redirect
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      }
    };

    handleAuthentication();
  }, [isAuthenticated, getAccessTokenSilently, navigate, showToast, logout]);

  return <Loader />;
}

export default Callback;
