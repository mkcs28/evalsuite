"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface RocPoint {
  x: number;
  y: number;
}

/** ROC curve with the chance diagonal. Loaded lazily so Recharts never ships on other routes. */
export default function RocChart({ points }: { points: RocPoint[] }) {
  const data = points.map((p) => ({ fpr: p.x, tpr: p.y, chance: p.x }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 24, left: 4 }}>
        <CartesianGrid stroke="var(--border-subtle)" />
        <XAxis
          dataKey="fpr"
          type="number"
          domain={[0, 1]}
          tickCount={6}
          stroke="var(--muted-foreground)"
          fontSize={12}
          label={{
            value: "False positive rate",
            position: "insideBottom",
            offset: -14,
            fill: "var(--muted-foreground)",
            fontSize: 12,
          }}
        />
        <YAxis
          type="number"
          domain={[0, 1]}
          tickCount={6}
          stroke="var(--muted-foreground)"
          fontSize={12}
          label={{
            value: "True positive rate",
            angle: -90,
            position: "insideLeft",
            offset: 12,
            fill: "var(--muted-foreground)",
            fontSize: 12,
          }}
        />
        <Tooltip
          contentStyle={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontSize: 12,
          }}
          formatter={(v) => (typeof v === "number" ? v.toFixed(3) : String(v))}
          labelFormatter={(v) => `FPR ${Number(v).toFixed(3)}`}
        />
        <Line
          dataKey="chance"
          name="Chance"
          stroke="var(--plot-reference)"
          strokeDasharray="4 4"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          dataKey="tpr"
          name="TPR"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={false}
          type="stepAfter"
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
