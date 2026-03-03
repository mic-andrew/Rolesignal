import client from "./client";
import type { Topic } from "../types";

export const topicsApi = {
  list: () => client.get<{ data: Topic[]; count: number }>("/api/topics"),
};
