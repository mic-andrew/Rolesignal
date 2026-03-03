import { useQuery } from "@tanstack/react-query";
import { progressApi } from "../api/progress";

export function useProgress() {
  const statsQuery = useQuery({
    queryKey: ["progress", "me"],
    queryFn: () => progressApi.me().then((r) => r.data),
    staleTime: 30_000,
  });

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
  };
}
