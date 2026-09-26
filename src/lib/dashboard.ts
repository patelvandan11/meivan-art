import type { UserRole } from "@/types";

export function getDashboardPath(role: UserRole) {
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/user";
}
