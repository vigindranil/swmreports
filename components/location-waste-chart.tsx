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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LocationWasteData {
  LocationID: number
  LocationName: string
  [key: string]: string | number
}

interface LocationWasteChartProps {
  data: LocationWasteData[]
}

const PROPERTY_TYPES = [
  "CLUB",
  "Comunity Centre",
  "Health Center",
  "House",
  "ICDS",
  "Market",
  "Office Building",
  "Others",
  "Religious Place",
  "School",
  "Shop",
]

const COLORS = [
  "#0E5892",
  "#06B6D4",
  "#3B82F6",
  "#22C55E",
  "#A855F7",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
  "#F97316",
]

export default function LocationWasteChart({ data }: LocationWasteChartProps) {
  // Prepare data for bar chart
  const barChartData = data.map((item) => {
    const chartItem: { [key: string]: string | number } = {
      name: item.LocationName,
    }

    PROPERTY_TYPES.forEach((type) => {
      chartItem[type] = Number.parseFloat(item[type]?.toString() || "0") || 0
    })

    return chartItem
  })

  // Calculate total waste by property type
  const propertyTypeTotals = PROPERTY_TYPES.map((type) => {
    const total = data.reduce((sum, item) => {
      const value = Number.parseFloat(item[type]?.toString() || "0") || 0
      return sum + value
    }, 0)

    return {
      name: type,
      value: parseFloat(total.toFixed(2)),
    }
  }).filter((item) => item.value > 0)

  // Calculate total waste by location
  const locationTotals = data.map((item) => {
    const total = PROPERTY_TYPES.reduce((sum, type) => {
      const value = Number.parseFloat(item[type]?.toString() || "0") || 0
      return sum + value
    }, 0)

    return {
      name: item.LocationName,
      value: parseFloat(total.toFixed(2)),
    }
  })

  return (
    <Tabs defaultValue="location" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="location" className="text-sm">
          By Location
        </TabsTrigger>
        <TabsTrigger value="property-type" className="text-sm">
          By Property Type
        </TabsTrigger>
        <TabsTrigger value="distribution" className="text-sm">
          Property Distribution
        </TabsTrigger>
      </TabsList>

      <TabsContent value="location" className="mt-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
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
              {PROPERTY_TYPES.slice(0, 6).map((type, idx) => (
                <Bar key={type} dataKey={type} fill={COLORS[idx]} name={type} radius={[8, 8, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="property-type" className="mt-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={propertyTypeTotals} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: "Total Waste (kg)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                formatter={(value) => `${(value as number).toFixed(2)} kg`}
              />
              <Bar dataKey="value" fill="#3B82F6" name="Total Waste" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="distribution" className="mt-6">
        <div className="h-80 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={locationTotals}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(2)} kg`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {locationTotals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${(value as number).toFixed(2)} kg`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
