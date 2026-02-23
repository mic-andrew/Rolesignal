/**
 * Hook for the items resource.
 * Replace with your domain-specific hooks.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "../api/items";
import type { Item, ListResponse } from "../types";

export function useItems(page = 1, perPage = 20) {
  const queryClient = useQueryClient();

  const query = useQuery<ListResponse<Item>>({
    queryKey: ["items", page, perPage],
    queryFn: () => itemsApi.list(page, perPage).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Pick<Item, "name" | "description">) =>
      itemsApi.create(payload).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });

  return {
    items: query.data?.data ?? [],
    count: query.data?.count ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    createItem: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
