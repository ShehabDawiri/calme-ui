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

        // const response = await axiosInstance.get("/protected");
        const response = { status: 200 }; // Mock response for testing
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

        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      }
    };

    handleAuthentication();
  }, [isAuthenticated, getAccessTokenSilently]);

  return <Loader />;
}

export default Callback;
