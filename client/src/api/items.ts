/**
 * Items resource endpoints.
 * Replace with your domain-specific API files.
 */

import client from "./client";
import type { Item, ListResponse } from "../types";

export const itemsApi = {
  list: (page = 1, perPage = 20) =>
    client.get<ListResponse<Item>>("/api/items", { params: { page, per_page: perPage } }),

  get: (id: string) => client.get<Item>(`/api/items/${id}`),

  create: (payload: Pick<Item, "name" | "description">) =>
    client.post<Item>("/api/items", payload),
};
