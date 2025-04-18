
import { PieChart as RechartsPC, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  className?: string;
}

export function PieChart({ data, className }: PieChartProps) {
  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPC>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}`, '']}
            contentStyle={{ 
              borderRadius: '8px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f1f5f9', 
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </RechartsPC>
      </ResponsiveContainer>
    </div>
  );
}
