"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WasteData {
  ID: number
  Name: string
  Organic_WasteAmount: string
  Inorganic_WasteAmount: string
  WasteAmount: string
  TotalProperty: number
  TotalActiveProperty: number
}

interface WasteChartProps {
  data: WasteData[]
}

const COLORS = ["#0E5892", "#06B6D4", "#3B82F6", "#22C55E", "#A855F7"]

export default function WasteChart({ data }: WasteChartProps) {
  const chartData = data.map((item) => ({
    name: item.Name,
    organic: Number.parseFloat(item.Organic_WasteAmount),
    inorganic: Number.parseFloat(item.Inorganic_WasteAmount),
    total: Number.parseFloat(item.WasteAmount),
    totalProperty: item.TotalProperty,
    activeProperty: item.TotalActiveProperty,
  }))

  return (
    <Tabs defaultValue="waste" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="waste" className="text-sm">
          Waste Breakdown
        </TabsTrigger>
        <TabsTrigger value="properties" className="text-sm">
          Properties
        </TabsTrigger>
        <TabsTrigger value="combined" className="text-sm">
          All Metrics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="waste" className="mt-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: "Waste Amount (kg)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                formatter={(value) => `${(value as number).toFixed(2)} kg`}
              />
              <Legend />
              <Bar dataKey="organic" fill="#0E5892" name="Organic Waste" radius={[8, 8, 0, 0]} />
              <Bar dataKey="inorganic" fill="#06B6D4" name="Inorganic Waste" radius={[8, 8, 0, 0]} />
              <Bar dataKey="total" fill="#3B82F6" name="Total Waste" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="properties" className="mt-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: "Number of Properties", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                formatter={(value) => (value as number).toString()}
              />
              <Legend />
              <Bar dataKey="totalProperty" fill="#22C55E" name="Total Properties" radius={[8, 8, 0, 0]} />
              <Bar dataKey="activeProperty" fill="#A855F7" name="Active Properties" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="combined" className="mt-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" label={{ value: "Waste (kg)", angle: -90, position: "insideLeft" }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Properties", angle: 90, position: "insideRight" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="organic"
                stroke="#0E5892"
                name="Organic Waste"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="inorganic"
                stroke="#06B6D4"
                name="Inorganic Waste"
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                name="Total Waste"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalProperty"
                stroke="#22C55E"
                name="Total Properties"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="activeProperty"
                stroke="#A855F7"
                name="Active Properties"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
