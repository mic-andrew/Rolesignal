import { useQuery } from "@tanstack/react-query";
import { topicsApi } from "../api/topics";
import type { Topic } from "../types";

export function useTopics() {
  const query = useQuery({
    queryKey: ["topics"],
    queryFn: () => topicsApi.list().then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  const topics = query.data?.data ?? [];

  const coreDsa = topics.filter((t: Topic) => t.category === "core_dsa");
  const advanced = topics.filter((t: Topic) => t.category === "advanced");
  const systemDesign = topics.filter((t: Topic) => t.category === "system_design");

  return {
    topics,
    coreDsa,
    advanced,
    systemDesign,
    isLoading: query.isLoading,
  };
}
