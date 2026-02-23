import { useQuery } from "@tanstack/react-query";
import { seveumApi } from "../api/seveum";

export function useDashboard() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => seveumApi.getDashboard(),
    staleTime: 30_000,
  });

  return {
    metrics:    query.data?.metrics,
    pipeline:   query.data?.pipeline ?? [],
    roles:      query.data?.roles ?? [],
    activity:   query.data?.activity ?? [],
    isLoading:  query.isLoading,
    error:      query.error,
  };
}
