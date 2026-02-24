import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard";

export function useDashboard() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.get(),
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
