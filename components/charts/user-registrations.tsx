"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface UserRegistrationsProps {
  data: { month: string; count: number }[];
}

export function UserRegistrationsChart({ data }: UserRegistrationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="oklch(0.424 0.199 265.638)"
              fill="oklch(0.424 0.199 265.638)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
