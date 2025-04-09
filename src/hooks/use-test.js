import { useQuery } from "@tanstack/react-query";

export const useTest = () => {
  const { data, isFetching, isLoading, error } = useQuery({
    queryKey: ["selectedSessionId"],
    queryFn: async () => {
      const response = await fetch("https://randomuser.me/api/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
  });
  return {
    data,
    isFetching,
    isLoading,
    error,
  };
};
