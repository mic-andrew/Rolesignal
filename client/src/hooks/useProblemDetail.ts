import { useQuery } from "@tanstack/react-query";
import { problemsApi } from "../api/problems";

export function useProblemDetail(slug: string | undefined) {
  const query = useQuery({
    queryKey: ["problem", slug],
    queryFn: () => problemsApi.get(slug!).then((r) => r.data),
    enabled: !!slug,
    staleTime: 60_000,
  });

  return {
    problem: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
