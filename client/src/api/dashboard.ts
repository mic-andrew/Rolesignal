import client from "./client";
import type { ActivityItem, DashboardMetrics, PipelineColumn, Role } from "../types";

export interface DashboardData {
  metrics: DashboardMetrics;
  pipeline: PipelineColumn[];
  roles: Role[];
  activity: ActivityItem[];
}

export const dashboardApi = {
  get: () => client.get<DashboardData>("/api/dashboard").then((r) => r.data),
};
