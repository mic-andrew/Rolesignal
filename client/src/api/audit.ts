import client from "./client";
import type { AuditEvent } from "../types";

export const auditApi = {
  list: (page: number = 1, perPage: number = 20) =>
    client
      .get<{ data: AuditEvent[]; count: number }>("/api/audit", {
        params: { page, per_page: perPage },
      })
      .then((r) => r.data),
};
