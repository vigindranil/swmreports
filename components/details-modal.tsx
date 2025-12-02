"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PropertyDetail {
  ID: number
  PropertyTypeName: string
  Organic_WasteAmount: string
  Inorganic_WasteAmount: string
  WasteAmount: string
  TotalProperty: number
  TotalActiveProperty: number
}

interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedLocation: { name: string; id: number } | null
  filters: {
    month: string
    year: number
    stateID: number
    districtID: number
    blockID: number
    gpID: number
    level: number
  }
}

export default function DetailsModal({ isOpen, onClose, selectedLocation, filters }: DetailsModalProps) {
  const [data, setData] = useState<PropertyDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && selectedLocation) {
      fetchDetails()
    }
  }, [isOpen, selectedLocation, filters])

  const fetchDetails = async () => {
    if (!selectedLocation) return

    setLoading(true)
    setError(null)
    try {
      // Logic based on what's selected in dropdown:
      // 1. Only District selected (blockID = 0): datatable column provides blockID
      // 2. District + Block selected (gpID = 0): datatable column provides gpID
      // 3. District + Block + GP selected: datatable column provides villageID (goes to gpID param)
      
      let newBlockID = filters.blockID
      let newGpID = filters.gpID

      // If blockID is not selected in dropdown (=0), use datatable column ID as blockID
      if (filters.blockID === 0) {
        newBlockID = selectedLocation.id
      }
      // If blockID is selected but gpID is not (=0), use datatable column ID as gpID
      else if (filters.gpID === 0) {
        newGpID = selectedLocation.id
      }
      // If both blockID and gpID are selected, datatable ID is villageID (also goes to gpID)
      // This handles the case where user clicks View Details on a GP in the datatable

      const params = new URLSearchParams({
        month: filters.month,
        year: filters.year.toString(),
        stateID: filters.stateID.toString(),
        districtID: filters.districtID.toString(),
        blockID: newBlockID.toString(),
        gpID: newGpID.toString(),
        level: filters.level.toString(), // Use level from dropdown as-is
      })

      const response = await fetch(`/api/property-waste-report?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || "Failed to fetch details")
      }
    } catch (err) {
      setError("Error fetching property details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = () => {
    if (data.length === 0 || !selectedLocation) return

    const headers = [
      "Property Type",
      "Organic Waste (kg)",
      "Inorganic Waste (kg)",
      "Total Waste (kg)",
      "Total Properties",
      "Active Properties",
    ]

    const rows = data.map((item) => [
      item.PropertyTypeName,
      (Number.parseFloat(item.Organic_WasteAmount) || 0).toFixed(2),
      (Number.parseFloat(item.Inorganic_WasteAmount) || 0).toFixed(2),
      (Number.parseFloat(item.WasteAmount) || 0).toFixed(2),
      item.TotalProperty.toString(),
      item.TotalActiveProperty.toString(),
    ])

    const totals = [
      "TOTAL",
      data.reduce((sum, item) => sum + (Number.parseFloat(item.Organic_WasteAmount) || 0), 0).toFixed(2),
      data.reduce((sum, item) => sum + (Number.parseFloat(item.Inorganic_WasteAmount) || 0), 0).toFixed(2),
      data.reduce((sum, item) => sum + (Number.parseFloat(item.WasteAmount) || 0), 0).toFixed(2),
      data.reduce((sum, item) => sum + item.TotalProperty, 0).toString(),
      data.reduce((sum, item) => sum + item.TotalActiveProperty, 0).toString(),
    ]

    rows.push(totals)

    const csvContent = [
      [`Property-wise Waste Report - ${selectedLocation.name}`],
      [`Period: ${filters.month} ${filters.year}`],
      [],
      [headers.join(",")],
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `property-details-${selectedLocation.name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const chartData = data.map((item) => ({
    name: item.PropertyTypeName,
    organic: Number.parseFloat(item.Organic_WasteAmount) || 0,
    inorganic: Number.parseFloat(item.Inorganic_WasteAmount) || 0,
    total: Number.parseFloat(item.WasteAmount) || 0,
    totalProperty: item.TotalProperty,
    activeProperty: item.TotalActiveProperty,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] w-[95vw] max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader className="pb-6 border-b-2 border-emerald-200 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Property-wise Waste Details
              </DialogTitle>
              <DialogDescription className="text-base mt-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                    <p className="text-slate-800 font-bold text-xl">{selectedLocation?.name}</p>
                  </div>
                  <p className="text-slate-600 ml-4 font-medium">
                    📅 {filters.month} {filters.year}
                  </p>
                </div>
              </DialogDescription>
            </div>
            <Button
              onClick={exportToExcel}
              disabled={data.length === 0 || loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-6 text-base flex-shrink-0"
            >
              <Download className="w-5 h-5 mr-2" />
              Export to Excel
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12 flex-grow">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-slate-600">Loading property details...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : data.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600">No property details found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col flex-grow overflow-y-auto">
            <div className="space-y-6 mt-2 flex-grow">
              {/* Charts Section */}
              <div className="bg-white rounded-xl overflow-hidden border-2 border-slate-200 shadow-lg p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Waste Analysis</h3>
                  <Tabs defaultValue="waste" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="waste" className="text-sm">
                        Waste Breakdown
                      </TabsTrigger>
                      <TabsTrigger value="properties" className="text-sm">
                        Properties
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
                  </Tabs>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-xl overflow-hidden border-2 border-slate-200 shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
                        <th className="px-8 py-5 text-left font-bold text-base tracking-wide">Property Type</th>
                        <th className="px-8 py-5 text-right font-bold text-base tracking-wide">🌱 Organic Waste</th>
                        <th className="px-8 py-5 text-right font-bold text-base tracking-wide">♻️ Inorganic Waste</th>
                        <th className="px-8 py-5 text-right font-bold text-base tracking-wide">📊 Total Waste</th>
                        <th className="px-8 py-5 text-right font-bold text-base tracking-wide">🏢 Total Properties</th>
                        <th className="px-8 py-5 text-right font-bold text-base tracking-wide">✅ Active Properties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {data.map((item, index) => (
                        <tr
                          key={item.ID}
                          className={`hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                          }`}
                        >
                          <td className="px-8 py-5 font-bold text-slate-800 text-base">{item.PropertyTypeName}</td>
                          <td className="px-8 py-5 text-right">
                            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg text-sm font-bold shadow-sm border border-green-200">
                              {(Number.parseFloat(item.Organic_WasteAmount) || 0).toFixed(2)} kg
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 rounded-lg text-sm font-bold shadow-sm border border-orange-200">
                              {(Number.parseFloat(item.Inorganic_WasteAmount) || 0).toFixed(2)} kg
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-lg font-bold shadow-sm border border-blue-200">
                              {(Number.parseFloat(item.WasteAmount) || 0).toFixed(2)} kg
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right text-slate-800 font-bold text-base">{item.TotalProperty}</td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex flex-col items-end">
                              <span className="text-slate-800 font-bold text-base">{item.TotalActiveProperty}</span>
                              <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold mt-1">
                                {((item.TotalActiveProperty / item.TotalProperty) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold">
                        <td className="px-8 py-5 text-lg">TOTAL</td>
                        <td className="px-8 py-5 text-right text-base">
                          {data.reduce((sum, item) => sum + (Number.parseFloat(item.Organic_WasteAmount) || 0), 0).toFixed(2)}{" "}
                          kg
                        </td>
                        <td className="px-8 py-5 text-right text-base">
                          {data
                            .reduce((sum, item) => sum + (Number.parseFloat(item.Inorganic_WasteAmount) || 0), 0)
                            .toFixed(2)}{" "}
                          kg
                        </td>
                        <td className="px-8 py-5 text-right text-base">
                          {data.reduce((sum, item) => sum + (Number.parseFloat(item.WasteAmount) || 0), 0).toFixed(2)} kg
                        </td>
                        <td className="px-8 py-5 text-right text-base">
                          {data.reduce((sum, item) => sum + item.TotalProperty, 0)}
                        </td>
                        <td className="px-8 py-5 text-right text-base">
                          {data.reduce((sum, item) => sum + item.TotalActiveProperty, 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-8 pt-6 border-t-2 border-slate-200 flex-shrink-0">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-8 py-6 text-base font-semibold border-2 hover:bg-slate-100 transition-all duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
