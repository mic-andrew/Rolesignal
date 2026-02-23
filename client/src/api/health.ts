/**
 * Health check endpoint.
 */

import client from "./client";
import type { HealthStatus } from "../types";

export const healthApi = {
  check: () => client.get<HealthStatus>("/health"),
};
