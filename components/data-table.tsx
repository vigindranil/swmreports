"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search, Download, Table2, TrendingUp, ArrowUp, ArrowDown, Eye } from "lucide-react"
import DetailsModal from "@/components/details-modal"

interface WasteData {
  ID: number
  Name: string
  Organic_WasteAmount: string
  Inorganic_WasteAmount: string
  WasteAmount: string
  TotalProperty: number
  TotalActiveProperty: number
}

interface DataTableProps {
  data: WasteData[]
  reportTitle?: string
  filters?: {
    month: string
    year: number
    stateID: number
    districtID: number
    blockID: number
    gpID: number
    level: number
  }
}

type SortField = keyof WasteData
type SortDirection = "asc" | "desc"

export default function DataTable({ data, reportTitle = "Waste Collection Data", filters }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("Name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; id: number } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((item) => item.Name.toLowerCase().includes(searchTerm.toLowerCase()))

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      let comparison = 0
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue)
      } else {
        comparison = Number(aValue) - Number(bValue)
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [data, searchTerm, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const columns: { key: SortField; label: string; align?: "left" | "right" }[] = [
    { key: "Name", label: "Location Name", align: "left" },
    { key: "Organic_WasteAmount", label: "Organic Waste", align: "right" },
    { key: "Inorganic_WasteAmount", label: "Inorganic Waste", align: "right" },
    { key: "WasteAmount", label: "Total Waste", align: "right" },
    { key: "TotalProperty", label: "Total Properties", align: "right" },
    { key: "TotalActiveProperty", label: "Active Properties", align: "right" },
  ]

  const calculateTotals = () => {
    return {
      Name: "TOTAL",
      Organic_WasteAmount: filteredAndSortedData
        .reduce((sum, item) => sum + Number.parseFloat(item.Organic_WasteAmount), 0)
        .toFixed(2),
      Inorganic_WasteAmount: filteredAndSortedData
        .reduce((sum, item) => sum + Number.parseFloat(item.Inorganic_WasteAmount), 0)
        .toFixed(2),
      WasteAmount: filteredAndSortedData.reduce((sum, item) => sum + Number.parseFloat(item.WasteAmount), 0).toFixed(2),
      TotalProperty: filteredAndSortedData.reduce((sum, item) => sum + item.TotalProperty, 0),
      TotalActiveProperty: filteredAndSortedData.reduce((sum, item) => sum + item.TotalActiveProperty, 0),
    }
  }

  const totals = calculateTotals()

  const exportToExcel = () => {
    const headers = columns.map((col) => col.label)
    const rows = filteredAndSortedData.map((item) => [
      item.Name,
      Number.parseFloat(item.Organic_WasteAmount).toFixed(2),
      Number.parseFloat(item.Inorganic_WasteAmount).toFixed(2),
      Number.parseFloat(item.WasteAmount).toFixed(2),
      item.TotalProperty,
      item.TotalActiveProperty,
    ])

    rows.push([
      totals.Name,
      totals.Organic_WasteAmount,
      totals.Inorganic_WasteAmount,
      totals.WasteAmount,
      totals.TotalProperty.toString(),
      totals.TotalActiveProperty.toString(),
    ])

    const csvContent = [
      [reportTitle],
      [],
      [headers.join(",")],
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `waste-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="border-0 shadow-xl bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Table2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-800 text-lg">{reportTitle}</CardTitle>
              <p className="text-sm text-slate-600 mt-0.5">
                Showing {filteredAndSortedData.length} of {data.length} records
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <Button
              onClick={exportToExcel}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-300">
                {columns.map((column, idx) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className={`px-6 py-4 text-${column.align || "left"} text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-200/70 transition-all group ${
                      idx === 0 ? "sticky left-0 z-10 bg-slate-100" : ""
                    }`}
                  >
                    <div className={`flex items-center gap-2 ${column.align === "right" ? "justify-end" : ""}`}>
                      <span>{column.label}</span>
                      {sortField === column.key ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-blue-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {filteredAndSortedData.map((item, index) => (
                <tr
                  key={item.ID}
                  className={`hover:bg-blue-50/50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800 sticky left-0 bg-inherit">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      {item.Name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-slate-700">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md font-medium">
                      {Number.parseFloat(item.Organic_WasteAmount).toFixed(2)} kg
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-slate-700">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md font-medium">
                      {Number.parseFloat(item.Inorganic_WasteAmount).toFixed(2)} kg
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-md font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {Number.parseFloat(item.WasteAmount).toFixed(2)} kg
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-slate-700">
                    {item.TotalProperty}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                      {item.TotalActiveProperty}
                      <span className="text-xs text-slate-500">
                        ({((item.TotalActiveProperty / item.TotalProperty) * 100).toFixed(0)}%)
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <Button
                      onClick={() => {
                        setSelectedLocation({ name: item.Name, id: item.ID })
                        setIsModalOpen(true)
                      }}
                      size="sm"
                      variant="outline"
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 border-t-2 border-emerald-700 text-white font-bold">
                <td className="px-6 py-4 text-sm sticky left-0 bg-gradient-to-r from-emerald-500 to-teal-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    {totals.Name}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  {typeof totals.Organic_WasteAmount === "string"
                    ? totals.Organic_WasteAmount
                    : totals.Organic_WasteAmount.toFixed(2)}{" "}
                  kg
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  {typeof totals.Inorganic_WasteAmount === "string"
                    ? totals.Inorganic_WasteAmount
                    : totals.Inorganic_WasteAmount.toFixed(2)}{" "}
                  kg
                </td>
                <td className="px-6 py-4 text-sm text-right text-lg">
                  {typeof totals.WasteAmount === "string" ? totals.WasteAmount : totals.WasteAmount.toFixed(2)} kg
                </td>
                <td className="px-6 py-4 text-sm text-right">{totals.TotalProperty}</td>
                <td className="px-6 py-4 text-sm text-right">{totals.TotalActiveProperty}</td>
                <td className="px-6 py-4 text-sm text-right"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No results found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </CardContent>

      {/* Details Modal */}
      {filters && selectedLocation && (
        <DetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedLocation(null)
          }}
          selectedLocation={selectedLocation}
          filters={filters}
        />
      )}
    </Card>
  )
}