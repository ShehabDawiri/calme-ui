import { useQuery } from "@tanstack/react-query";
import useSession from "@/hooks/useSession";

const fetchSessionData = async (sessionId) => {
  if (!sessionId) return null;
  const response = await fetch(`route/${sessionId}`);
  if (!response.ok) throw new Error("Failed to fetch session data");
  return response.json();
};

const useFetchSession = () => {
  const sessionId = useSession((state) => state.sessionId);

  const { data, error, isFetching } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSessionData(sessionId),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    error,
    isFetching,
  };
};

export default useFetchSession;
