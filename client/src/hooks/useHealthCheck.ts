import { useQuery } from "@tanstack/react-query";
import { healthApi } from "../api/health";
import type { HealthStatus } from "../types";

export function useHealthCheck() {
  const query = useQuery<HealthStatus>({
    queryKey: ["health"],
    queryFn: () => healthApi.check().then((r) => r.data),
    refetchInterval: 30000,
  });

  return {
    health: query.data,
    isHealthy: query.data?.status === "healthy",
    isLoading: query.isLoading,
    error: query.error,
  };
}
