"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const COLORS = [
  "oklch(0.546 0.245 262.881)",
  "oklch(0.488 0.243 264.376)",
  "oklch(0.809 0.105 251.813)",
  "oklch(0.623 0.214 259.815)",
  "oklch(0.424 0.199 265.638)",
];

interface EventTypePieProps {
  data: { name: string; count: number }[];
}

export function EventTypePieChart({ data }: EventTypePieProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
