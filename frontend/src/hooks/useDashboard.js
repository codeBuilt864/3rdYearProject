import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export default function useDashboard() {
  const { userId, getToken } = useAuth();
  return useQuery({
    queryKey: ["dashboard", userId],
    enabled: Boolean(userId),
    queryFn: async ({ signal }) => {
      const token = await getToken();
      const { data } = await axiosInstance.get("/api/dashboard", {
        signal, timeout: 15000,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchInterval: 60000,
    retry: 1,
  });
}
