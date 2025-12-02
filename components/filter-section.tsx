"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Filter, Search, RotateCcw, ChevronDown, Calendar, MapPin, Layers, X } from "lucide-react"
import { format } from "date-fns"

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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    onFilterChange({
      ...filters,
      startDate,
      endDate,
    })
  }, [filters, startDate, endDate])

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
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const filteredBlocks = blocks.filter(block => 
    filters.districtID === 0 || block.districtId === filters.districtID
  )

  const filteredGPs = gps.filter(gp => 
    filters.blockID === 0 || gp.blockId === filters.blockID
  )

  return (
    <Card className="border border-slate-200/60 shadow-2xl bg-white overflow-hidden rounded-2xl backdrop-blur-sm">
      <CardHeader 
        className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white cursor-pointer hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 transition-all duration-300 relative overflow-hidden group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <div className="flex items-center justify-between relative z-10">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-md shadow-lg ring-2 ring-white/30">
              <Filter className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Filter Options</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium opacity-80 hidden sm:block">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-5 pb-4 px-6 bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30">
          <div className="space-y-4">
            {/* Time Period Section */}
            <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                <div className="p-1.5 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-md">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Time Period</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    Month
                    <span className="text-red-500">*</span>
                  </label>
                  <Select value={filters.month} onValueChange={(value) => handleFilterChange("month", value)}>
                    <SelectTrigger className="border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white h-9 rounded-md shadow-sm hover:shadow-md text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      {months.map((month) => (
                        <SelectItem key={month} value={month} className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 rounded-md text-sm">
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    Year
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={filters.year.toString()}
                    onValueChange={(value) => handleFilterChange("year", Number.parseInt(value))}
                  >
                    <SelectTrigger className="border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white h-9 rounded-md shadow-sm hover:shadow-md text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 rounded-md text-sm">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Start Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white h-9 rounded-md shadow-sm hover:shadow-md text-sm justify-start font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-lg" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) =>
                          endDate ? date > endDate : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  {startDate && (
                    <button
                      onClick={() => setStartDate(undefined)}
                      className="text-xs text-slate-600 hover:text-slate-800 font-medium mt-1 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear date
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    End Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white h-9 rounded-md shadow-sm hover:shadow-md text-sm justify-start font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-lg" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) =>
                          startDate ? date < startDate : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  {endDate && (
                    <button
                      onClick={() => setEndDate(undefined)}
                      className="text-xs text-slate-600 hover:text-slate-800 font-medium mt-1 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear date
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                <div className="p-1.5 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-md">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Location Hierarchy</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    State
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={filters.stateID.toString()}
                    onValueChange={(value) => handleFilterChange("stateID", Number.parseInt(value))}
                  >
                    <SelectTrigger className="border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white h-9 rounded-md shadow-sm hover:shadow-md text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()} className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 rounded-md text-sm">
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    District
                  </label>
                  <Select
                    value={filters.districtID.toString()}
                    onValueChange={(value) => handleFilterChange("districtID", Number.parseInt(value))}
                  >
                    <SelectTrigger className="border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white h-9 rounded-md shadow-sm hover:shadow-md text-sm">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      <SelectItem value="0" className="cursor-pointer font-semibold text-slate-600 hover:bg-emerald-50 focus:bg-emerald-50 rounded-md text-sm">
                        All Districts
                      </SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id.toString()} className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 rounded-md text-sm">
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Block
                  </label>
                  <Select
                    value={filters.blockID.toString()}
                    onValueChange={(value) => handleFilterChange("blockID", Number.parseInt(value))}
                    disabled={filters.districtID === 0}
                  >
                    <SelectTrigger className="border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white h-9 rounded-md shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm text-sm">
                      <SelectValue placeholder="Select Block" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      <SelectItem value="0" className="cursor-pointer font-semibold text-slate-600 hover:bg-emerald-50 focus:bg-emerald-50 rounded-md text-sm">
                        All Blocks
                      </SelectItem>
                      {filteredBlocks.map((block) => (
                        <SelectItem key={block.id} value={block.id.toString()} className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 rounded-md text-sm">
                          {block.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Gram Panchayat
                  </label>
                  <Select
                    value={filters.gpID.toString()}
                    onValueChange={(value) => handleFilterChange("gpID", Number.parseInt(value))}
                    disabled={filters.blockID === 0}
                  >
                    <SelectTrigger className="border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white h-9 rounded-md shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm text-sm">
                      <SelectValue placeholder="Select GP" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      <SelectItem value="0" className="cursor-pointer font-semibold text-slate-600 hover:bg-emerald-50 focus:bg-emerald-50 rounded-md text-sm">
                        All GPs
                      </SelectItem>
                      {filteredGPs.map((gp) => (
                        <SelectItem key={gp.id} value={gp.id.toString()} className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 rounded-md text-sm">
                          {gp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Collection Level Section */}
            <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200">
                <div className="p-1.5 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-md">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Collection Level</h3>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Waste Collection Level
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  value={filters.level.toString()}
                  onValueChange={(value) => handleFilterChange("level", Number.parseInt(value))}
                >
                  <SelectTrigger className="border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white h-9 rounded-md shadow-sm hover:shadow-md text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.id.toString()} className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-50 rounded-md">
                        <div className="flex flex-col py-1">
                          <span className="font-bold text-slate-800 text-sm">{level.name}</span>
                          <span className="text-xs text-slate-500">{level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-1.5 p-2 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-md border border-emerald-100">
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-emerald-700">Selected:</span> <span className="font-bold text-slate-800">{levels.find(l => l.id === filters.level)?.name}</span>
                    <span className="text-slate-500 ml-1">— {levels.find(l => l.id === filters.level)?.description}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-slate-200">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 sm:flex-none border-2 border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 h-9 rounded-md shadow-sm hover:shadow-md font-semibold text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
            <div className="flex-1"></div>
            <Button
              onClick={onFetch}
              disabled={isLoading}
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-8 h-9 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-bold relative overflow-hidden group text-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {isLoading ? (
                <span className="relative z-10 flex items-center">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                  Loading...
                </span>
              ) : (
                <span className="relative z-10 flex items-center">
                  <Search className="w-3.5 h-3.5 mr-1.5" />
                  Fetch Report
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}