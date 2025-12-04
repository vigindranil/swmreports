"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Package, RefreshCw, Download, Calendar, MapPin } from "lucide-react"
import FilterSection from "@/components/filter-section"
import DataTable from "@/components/data-table"
import WasteChart from "@/components/waste-chart"
import LocationWasteTable from "@/components/location-waste-table"
import LocationWasteChart from "@/components/location-waste-chart"

interface WasteData {
  ID: number
  Name: string
  Organic_WasteAmount: string
  Inorganic_WasteAmount: string
  WasteAmount: string
  TotalProperty: number
  TotalActiveProperty: number
}

interface LocationWasteData {
  LocationID: number
  LocationName: string
  [key: string]: string | number
}

interface ApiResponse {
  success: boolean
  data: WasteData[]
  count: number
  error?: string
}

interface LocationWasteApiResponse {
  success: boolean
  data: LocationWasteData[]
  count: number
  error?: string
}

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    month: "August",
    year: 2025,
    stateID: 1,
    districtID: 0,
    blockID: 0,
    gpID: 0,
    level: 1,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  })

  const [data, setData] = useState<WasteData[]>([])
  const [locationWasteData, setLocationWasteData] = useState<LocationWasteData[]>([])
  const [loading, setLoading] = useState(false)
  const [reportTitle, setReportTitle] = useState("State Wise Collection Report")

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        month: filters.month,
        year: filters.year.toString(),
        stateID: filters.stateID.toString(),
        districtID: filters.districtID.toString(),
        blockID: filters.blockID.toString(),
        gpID: filters.gpID.toString(),
        level: filters.level.toString(),
      })

      // Add dates if selected
      if (filters.startDate) {
        params.append("startDate", filters.startDate.toISOString().split("T")[0])
      }
      if (filters.endDate) {
        params.append("endDate", filters.endDate.toISOString().split("T")[0])
      }

      console.log(params.toString());

      // Fetch waste report data
      const response = await fetch(`/api/waste-report?${params}`)
      const result: ApiResponse = await response.json()
      console.log(result)

      if (result.success) {
        setData(result.data)
      } else {
        console.error("[v0] API error:", result.error)
      }

      // Fetch location-wise property waste report data
      const locationResponse = await fetch(`/api/location-wise-property-waste-report?${params}`)
      const locationResult: LocationWasteApiResponse = await locationResponse.json()
      console.log(locationResult)

      if (locationResult.success) {
        setLocationWasteData(locationResult.data)
      } else {
        console.error("[v0] Location API error:", locationResult.error)
      }
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateReportTitle = (currentFilters: typeof filters) => {
    if (currentFilters.districtID === 0) return "State Wise Collection Report"
    if (currentFilters.blockID === 0) return "District Wise Collection Report"
    if (currentFilters.gpID === 0) return "Block Wise Collection Report"
    return "Village/GP Wise Collection Report"
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    const newTitle = generateReportTitle(newFilters)
    setReportTitle(newTitle)
  }

  // Calculate statistics
  const stats = data.length > 0 ? {
    totalWaste: data.reduce((sum, item) => sum + parseFloat(item.WasteAmount || "0"), 0).toFixed(2),
    totalOrganic: data.reduce((sum, item) => sum + parseFloat(item.Organic_WasteAmount || "0"), 0).toFixed(2),
    totalInorganic: data.reduce((sum, item) => sum + parseFloat(item.Inorganic_WasteAmount || "0"), 0).toFixed(2),
    totalProperties: data.reduce((sum, item) => sum + item.TotalProperty, 0),
  } : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Waste Management Analytics
              </h1>
              <p className="text-slate-600 mt-1">Comprehensive waste collection and reporting dashboard</p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <FilterSection onFilterChange={handleFilterChange} onFetch={fetchData} isLoading={loading} />
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <CardHeader className="pb-3">
                <CardDescription className="text-emerald-50 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Total Waste Collected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalWaste} kg</div>
                <p className="text-emerald-100 text-sm mt-1">All waste types</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2 text-slate-600">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Organic Waste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.totalOrganic} kg</div>
                <p className="text-slate-600 text-sm mt-1">Biodegradable materials</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2 text-slate-600">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                  Inorganic Waste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{stats.totalInorganic} kg</div>
                <p className="text-slate-600 text-sm mt-1">Non-biodegradable materials</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Total Properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.totalProperties}</div>
                <p className="text-slate-600 text-sm mt-1">Registered locations</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Report Title Section */}
        {data.length > 0 && (
          <div className="mb-6 p-6 bg-white rounded-xl shadow-md border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-800">{reportTitle}</h2>
                </div>
                <p className="text-slate-600 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    {data.length} {data.length === 1 ? "record" : "records"}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>{filters.month} {filters.year}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chart and Table Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Chart Section */}
          {data.length > 0 && (
            <Card className="border-0 shadow-xl bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                      Waste Collection Overview
                    </CardTitle>
                    <CardDescription className="mt-1">Organic vs Inorganic waste distribution across regions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <WasteChart data={data} />
              </CardContent>
            </Card>
          )}

          {/* Data Table Section */}
          {data.length > 0 && (
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
              <DataTable data={data} reportTitle={reportTitle} filters={filters} />
            </div>
          )}
        </div>

        {/* Location-wise Property Waste Report Section */}
        {locationWasteData.length > 0 && (
          <div className="mt-12">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Location-wise Property Waste Analysis</h2>
                  <p className="text-slate-600 mt-1">Property-type wise waste collection across locations</p>
                </div>
              </div>
            </div>

            {/* Location Chart Section */}
            <Card className="border-0 shadow-xl bg-white overflow-hidden mb-8">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Location Wise Waste Distribution
                    </CardTitle>
                    <CardDescription className="mt-1">Property-type wise waste analysis by location</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <LocationWasteChart data={locationWasteData} />
              </CardContent>
            </Card>

            {/* Location Data Table Section */}
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
              <LocationWasteTable data={locationWasteData} reportTitle="Location-wise Property Waste Report" />
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {data.length === 0 && !loading && (
          <Card className="border-0 shadow-xl text-center py-16 bg-gradient-to-br from-white to-slate-50">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full">
                  <BarChart3 className="w-12 h-12 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">No Data Available</h3>
                  <p className="text-slate-600 text-lg mb-4">Select your filters and click "Fetch Report" to load waste collection data</p>
                  <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <RefreshCw className="w-4 h-4" />
                    <span>Configure filters above to get started</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="border-0 shadow-xl text-center py-16">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin" />
                <p className="text-slate-600 text-lg">Loading waste collection data...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
