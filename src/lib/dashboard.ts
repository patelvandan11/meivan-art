import type { UserRole } from "@/types";

export function getDashboardPath(role: UserRole) {
  return `/dashboard/${role}`;
}
