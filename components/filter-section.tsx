"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, RotateCcw, ChevronDown, Calendar, MapPin, Layers } from "lucide-react"

interface FilterSectionProps {
  onFilterChange: (filters: any) => void
  onFetch: () => void
  isLoading: boolean
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const years = [2025, 2026, 2027, 2028]

const states = [
  { id: 1, name: "West Bengal" }
]

const districts = [
  { id: 9, name: "Jalpaiguri" },
]

const blocks = [
  { id: 73, name: "Maynaguri", districtId: 9 },
  { id: 74, name: "Rajganj", districtId: 9 },
  { id: 75, name: "Dhupguri", districtId: 9 },
  { id: 76, name: "Banarhat", districtId: 9 },
  { id: 78, name: "Matiali", districtId: 9 },
  { id: 79, name: "Nagrakata", districtId: 9 },
  { id: 80, name: "Kranti", districtId: 9 },
  { id: 81, name: "JALPAIGURI SADAR", districtId: 9 },
  { id: 88, name: "MALBAZAR", districtId: 9 },
]

const gps = [
  { id: 1, name: "Amguri", blockId: 73 },
  { id: 2, name: "Panikauri", blockId: 74 },
  { id: 3, name: "Sikarpur", blockId: 74 },
  { id: 4, name: "Majhiali", blockId: 74 },
  { id: 5, name: "Fulbari-II", blockId: 74 },
  { id: 6, name: "Binnaguri", blockId: 74 },
  { id: 7, name: "Fulbari-I", blockId: 74 },
  { id: 8, name: "Khagrabari-II", blockId: 73 },
  { id: 17, name: "Maynaguri", blockId: 73 },
  { id: 18, name: "Padamoti-II", blockId: 73 },
  { id: 19, name: "Padamoti-I", blockId: 73 },
  { id: 20, name: "Domohoni-II", blockId: 73 },
  { id: 21, name: "Madhabdanga-II", blockId: 73 },
  { id: 22, name: "Barnis", blockId: 73 },
  { id: 24, name: "Churabhandar", blockId: 73 },
  { id: 25, name: "Domohoni-I", blockId: 73 },
  { id: 26, name: "Ramshai", blockId: 73 },
  { id: 27, name: "Khagrabari-I", blockId: 73 },
  { id: 28, name: "Madhabdanga-I", blockId: 73 },
  { id: 29, name: "Dharmapur", blockId: 73 },
  { id: 30, name: "Saptibari-I", blockId: 73 },
  { id: 31, name: "Saptibari-II", blockId: 73 },
  { id: 32, name: "Dabgram-I", blockId: 74 },
  { id: 33, name: "Kukurjan", blockId: 74 },
  { id: 34, name: "Mantadari", blockId: 74 },
  { id: 35, name: "Sannyasikata", blockId: 74 },
  { id: 36, name: "Sukhani", blockId: 74 },
  { id: 37, name: "Gadhearkuthi", blockId: 75 },
  { id: 38, name: "Jharaltagram-I", blockId: 75 },
  { id: 39, name: "Barogharia", blockId: 75 },
  { id: 40, name: "Godong-I", blockId: 75 },
  { id: 41, name: "Magurmari-II", blockId: 75 },
  { id: 42, name: "Sakoyajhora-II", blockId: 75 },
  { id: 43, name: "Jharaltagram-II", blockId: 75 },
  { id: 44, name: "Magurmari-I", blockId: 75 },
  { id: 45, name: "Godong-II", blockId: 75 },
  { id: 46, name: "Chamurchi", blockId: 76 },
  { id: 47, name: "Banarhat-II", blockId: 76 },
  { id: 48, name: "Salbari-II", blockId: 76 },
  { id: 49, name: "Binnaguri", blockId: 76 },
  { id: 50, name: "Salbari-I", blockId: 76 },
  { id: 51, name: "Sakoyajhora-I", blockId: 76 },
  { id: 52, name: "Banarhat-I", blockId: 76 },
  { id: 53, name: "Matiali-Batabari-I", blockId: 78 },
  { id: 54, name: "Bidhannagar", blockId: 78 },
  { id: 55, name: "Matiali-Batabari-II", blockId: 78 },
  { id: 56, name: "Matiali Hat", blockId: 78 },
  { id: 57, name: "Indong-Matiali", blockId: 78 },
  { id: 58, name: "Sulkapara", blockId: 79 },
  { id: 59, name: "Champaguri", blockId: 79 },
  { id: 60, name: "Luksan", blockId: 79 },
  { id: 61, name: "Angrabhasa-II", blockId: 79 },
  { id: 62, name: "Angrabhasa-I", blockId: 79 },
  { id: 63, name: "Moulani", blockId: 80 },
  { id: 64, name: "Rajadanga", blockId: 80 },
  { id: 65, name: "Changmari", blockId: 80 },
  { id: 66, name: "Chapadanga", blockId: 80 },
  { id: 67, name: "Jkranti", blockId: 80 },
  { id: 68, name: "Lataguri", blockId: 80 },
  { id: 69, name: "Nagar Berubari", blockId: 81 },
  { id: 70, name: "Arabinda", blockId: 81 },
  { id: 71, name: "Boalmari-Nandanpur", blockId: 81 },
  { id: 72, name: "Bahadur", blockId: 81 },
  { id: 73, name: "Baropatia Nutanbos", blockId: 81 },
  { id: 74, name: "Kharija-Berubari-I", blockId: 81 },
  { id: 75, name: "Belakoba", blockId: 81 },
  { id: 76, name: "South Berubari", blockId: 81 },
  { id: 77, name: "Garalbari", blockId: 81 },
  { id: 78, name: "Kharia", blockId: 81 },
  { id: 79, name: "Mondalghat", blockId: 81 },
  { id: 80, name: "Paharpur", blockId: 81 },
  { id: 81, name: "Patkata", blockId: 81 },
  { id: 82, name: "Bagrakot", blockId: 88 },
  { id: 83, name: "Damdim", blockId: 88 },
  { id: 84, name: "Kumlai", blockId: 88 },
  { id: 85, name: "Odlabari", blockId: 88 },
  { id: 86, name: "Rangamati", blockId: 88 },
  { id: 87, name: "Tesimala", blockId: 88 },
  { id: 88, name: "Kharija Berubari-II", blockId: 81 },
  { id: 89, name: "Dabgram-II", blockId: 74 }
];


const levels = [
  { id: 1, name: "Level 1", description: "House, Shop, Health Center, Office Building, Market, Community Centre" },
  { id: 2, name: "Level 2", description: "Collection Point, Iron cage" },
  { id: 3, name: "Level 3", description: "SWM Unit-Decentralized, PWM Unit-Decentralized" },
]

export default function FilterSection({ onFilterChange, onFetch, isLoading }: FilterSectionProps) {
  const [filters, setFilters] = useState({
    month: "August",
    year: 2025,
    stateID: 1,
    districtID: 0,
    blockID: 0,
    gpID: 0,
    level: 1,
  })

  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    onFilterChange(filters)
  }, [filters])

  const handleFilterChange = (key: string, value: any) => {
    const updatedFilters = { ...filters, [key]: value }

    if (key === "stateID") {
      updatedFilters.districtID = 0
      updatedFilters.blockID = 0
      updatedFilters.gpID = 0
    } else if (key === "districtID") {
      updatedFilters.blockID = 0
      updatedFilters.gpID = 0
    } else if (key === "blockID") {
      updatedFilters.gpID = 0
    }

    setFilters(updatedFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      month: "August",
      year: 2025,
      stateID: 1,
      districtID: 0,
      blockID: 0,
      gpID: 0,
      level: 1,
    }
    setFilters(resetFilters)
  }

  const filteredBlocks = blocks.filter(block => 
    filters.districtID === 0 || block.districtId === filters.districtID
  )

  const filteredGPs = gps.filter(gp => 
    filters.blockID === 0 || gp.blockId === filters.blockID
  )

  return (
    <Card className="border-0 shadow-xl bg-white overflow-hidden">
      <CardHeader 
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white cursor-pointer hover:from-emerald-600 hover:to-teal-700 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Filter className="w-5 h-5" />
            </div>
            <span className="text-xl">Filter Options</span>
          </CardTitle>
          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-8 pb-6 px-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="space-y-6">
            {/* Time Period Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-slate-700">Time Period</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    Month
                    <span className="text-red-500">*</span>
                  </label>
                  <Select value={filters.month} onValueChange={(value) => handleFilterChange("month", value)}>
                    <SelectTrigger className="border-slate-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month} className="cursor-pointer">
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    Year
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={filters.year.toString()}
                    onValueChange={(value) => handleFilterChange("year", Number.parseInt(value))}
                  >
                    <SelectTrigger className="border-slate-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="cursor-pointer">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-slate-700">Location Hierarchy</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    State
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={filters.stateID.toString()}
                    onValueChange={(value) => handleFilterChange("stateID", Number.parseInt(value))}
                  >
                    <SelectTrigger className="border-slate-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()} className="cursor-pointer">
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    District
                  </label>
                  <Select
                    value={filters.districtID.toString()}
                    onValueChange={(value) => handleFilterChange("districtID", Number.parseInt(value))}
                  >
                    <SelectTrigger className="border-slate-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" className="cursor-pointer font-medium text-slate-600">
                        All Districts
                      </SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id.toString()} className="cursor-pointer">
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Block
                  </label>
                  <Select
                    value={filters.blockID.toString()}
                    onValueChange={(value) => handleFilterChange("blockID", Number.parseInt(value))}
                    disabled={filters.districtID === 0}
                  >
                    <SelectTrigger className="border-slate-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                      <SelectValue placeholder="Select Block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" className="cursor-pointer font-medium text-slate-600">
                        All Blocks
                      </SelectItem>
                      {filteredBlocks.map((block) => (
                        <SelectItem key={block.id} value={block.id.toString()} className="cursor-pointer">
                          {block.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Gram Panchayat
                  </label>
                  <Select
                    value={filters.gpID.toString()}
                    onValueChange={(value) => handleFilterChange("gpID", Number.parseInt(value))}
                    disabled={filters.blockID === 0}
                  >
                    <SelectTrigger className="border-slate-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                      <SelectValue placeholder="Select GP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" className="cursor-pointer font-medium text-slate-600">
                        All GPs
                      </SelectItem>
                      {filteredGPs.map((gp) => (
                        <SelectItem key={gp.id} value={gp.id.toString()} className="cursor-pointer">
                          {gp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Collection Level Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h3 className="font-semibold text-slate-700">Collection Level</h3>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  Waste Collection Level
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  value={filters.level.toString()}
                  onValueChange={(value) => handleFilterChange("level", Number.parseInt(value))}
                >
                  <SelectTrigger className="border-slate-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.id.toString()} className="cursor-pointer">
                        <div className="flex flex-col py-1">
                          <span className="font-semibold">{level.name}</span>
                          <span className="text-xs text-slate-500">{level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1.5">
                  Selected: <span className="font-medium text-slate-700">{levels.find(l => l.id === filters.level)?.name}</span> - {levels.find(l => l.id === filters.level)?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 sm:flex-none border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
            <div className="flex-1"></div>
            <Button
              onClick={onFetch}
              disabled={isLoading}
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-2.5 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Fetch Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}