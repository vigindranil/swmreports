"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search, Download, ArrowUp, ArrowDown } from "lucide-react"

interface LocationWasteData {
  LocationID: number
  LocationName: string
  [key: string]: string | number
}

interface LocationWasteTableProps {
  data: LocationWasteData[]
  reportTitle?: string
}

type SortField = "LocationName" | "LocationID"
type SortDirection = "asc" | "desc"

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

export default function LocationWasteTable({ data, reportTitle = "Location-wise Property Waste Report" }: LocationWasteTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("LocationName")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((item) =>
      item.LocationName.toLowerCase().includes(searchTerm.toLowerCase())
    )

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

  const columns = [
    { key: "LocationName", label: "Location Name", align: "left" as const },
    ...PROPERTY_TYPES.map((type) => ({ key: type, label: type, align: "right" as const })),
  ]

  const calculateTotals = () => {
    const totals: { [key: string]: number | string } = {
      LocationName: "TOTAL",
    }

    PROPERTY_TYPES.forEach((type) => {
      totals[type] = filteredAndSortedData.reduce((sum, item) => {
        const value = Number.parseFloat(item[type]?.toString() || "0") || 0
        return sum + value
      }, 0)
    })

    return totals
  }

  const totals = calculateTotals()

  const exportToExcel = () => {
    const headers = columns.map((col) => col.label)
    const rows = filteredAndSortedData.map((item) =>
      columns.map((col) => {
        const value = item[col.key]
        if (typeof value === "number") {
          return Number.isInteger(value) ? value.toString() : value.toFixed(2)
        }
        return value?.toString() || ""
      })
    )

    const totalsRow = columns.map((col) => {
      const value = totals[col.key]
      if (typeof value === "number") {
        return Number.isInteger(value) ? value.toString() : value.toFixed(2)
      }
      return value?.toString() || ""
    })

    rows.push(totalsRow)

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
    link.setAttribute("download", `location-waste-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-6 border-b-2 border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-slate-800">{reportTitle}</CardTitle>
            <p className="text-slate-600 mt-2">Property-type wise waste collection across locations</p>
          </div>
          <Button
            onClick={exportToExcel}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64 border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          />
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
                    onClick={() => column.key !== "LocationName" ? null : handleSort(column.key as SortField)}
                    className={`px-6 py-4 text-${column.align} text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-200/70 transition-all group ${
                      idx === 0 ? "sticky left-0 z-10 bg-slate-100" : ""
                    }`}
                  >
                    <div className={`flex items-center gap-2 ${column.align === "right" ? "justify-end" : ""}`}>
                      <span>{column.label}</span>
                      {column.key === "LocationName" ? (
                        sortField === column.key ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-blue-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                        )
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {filteredAndSortedData.map((item, index) => (
                <tr
                  key={item.LocationID}
                  className={`hover:bg-blue-50/50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800 sticky left-0 bg-inherit">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      {item.LocationName}
                    </div>
                  </td>
                  {PROPERTY_TYPES.map((type) => (
                    <td key={type} className="px-6 py-4 text-sm text-right font-medium text-slate-700">
                      <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                        {(Number.parseFloat(item[type]?.toString() || "0") || 0).toFixed(2)} kg
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold">
                <td className="px-6 py-4 text-sm sticky left-0 z-10 bg-gradient-to-r from-emerald-500 to-teal-600">
                  TOTAL
                </td>
                {PROPERTY_TYPES.map((type) => (
                  <td key={type} className="px-6 py-4 text-sm text-right">
                    {(totals[type] as number).toFixed(2)} kg
                  </td>
                ))}
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
    </Card>
  )
}
