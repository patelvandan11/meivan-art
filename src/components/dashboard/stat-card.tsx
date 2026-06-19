"use client";

import { formatPrice } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, sub, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-card border border-border bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-3xl font-semibold">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10">
          <Icon className="h-5 w-5 text-terracotta" />
        </div>
      </div>
    </div>
  );
}

export function StatCardMoney({
  label,
  amount,
  sub,
  icon,
}: {
  label: string;
  amount: number;
  sub?: string;
  icon: LucideIcon;
}) {
  return (
    <StatCard label={label} value={formatPrice(amount)} sub={sub} icon={icon} />
  );
}

interface BarChartProps {
  data: { label: string; value: number }[];
  valuePrefix?: string;
}

export function SimpleBarChart({ data, valuePrefix = "" }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-56 items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-terracotta/80 transition-all"
              style={{ height: `${(item.value / max) * 100}%`, minHeight: "4px" }}
              title={`${valuePrefix}${item.value.toLocaleString("en-IN")}`}
            />
          </div>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
