# Code Structure Reference

## Component Architecture

```
app/
└── page.tsx (Main Page Component)
    ├── Renders FilterSection
    ├── Renders DataTable
    │   └── Passes: data, reportTitle, filters
    └── Renders WasteChart

components/
├── data-table.tsx (Updated)
│   ├── Imports: DetailsModal
│   ├── State:
│   │   ├── searchTerm
│   │   ├── sortField
│   │   ├── sortDirection
│   │   ├── selectedLocation (NEW)
│   │   └── isModalOpen (NEW)
│   ├── Renders: Table with "View Details" button
│   └── Renders: DetailsModal
│
├── details-modal.tsx (NEW)
│   ├── Props: isOpen, onClose, locationName, filters
│   ├── State:
│   │   ├── data (PropertyDetail[])
│   │   ├── loading (boolean)
│   │   └── error (string | null)
│   ├── Methods:
│   │   ├── fetchDetails() - Calls /api/property-waste-report
│   │   └── exportToExcel() - Generates CSV file
│   └── Renders: Modal with property details table
│
├── filter-section.tsx
└── waste-chart.tsx
```

## Data Flow

### 1. Initial Load Flow
```
User sets filters
     ↓
[filters] state updated in page.tsx
     ↓
User clicks "Fetch Report"
     ↓
fetchData() called → /api/waste-report
     ↓
[data] state updated with locations
     ↓
DataTable rendered with data
```

### 2. View Details Flow
```
User clicks "View Details" button in row
     ↓
selectedLocation = item.Name
isModalOpen = true
     ↓
DetailsModal useEffect triggered
     ↓
fetchDetails() called → /api/property-waste-report
     ↓
API returns PropertyDetail[] array
     ↓
Modal renders with property type breakdown
     ↓
User can export or close modal
```

## State Management

### page.tsx
```typescript
const [filters, setFilters] = useState({
  month: "August",
  year: 2025,
  stateID: 1,
  districtID: 0,
  blockID: 0,
  gpID: 0,
  level: 1,
})
const [data, setData] = useState<WasteData[]>([])
const [loading, setLoading] = useState(false)
const [reportTitle, setReportTitle] = useState("State Wise Collection Report")
```

### data-table.tsx
```typescript
const [searchTerm, setSearchTerm] = useState("")
const [sortField, setSortField] = useState<SortField>("Name")
const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
const [selectedLocation, setSelectedLocation] = useState<string | null>(null) // NEW
const [isModalOpen, setIsModalOpen] = useState(false) // NEW
```

### details-modal.tsx
```typescript
const [data, setData] = useState<PropertyDetail[]>([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

## Type Definitions

### WasteData (Location Data)
```typescript
interface WasteData {
  ID: number
  Name: string
  Organic_WasteAmount: string
  Inorganic_WasteAmount: string
  WasteAmount: string
  TotalProperty: number
  TotalActiveProperty: number
}
```

### PropertyDetail (Property Type Data)
```typescript
interface PropertyDetail {
  ID: number
  PropertyTypeName: string
  Organic_WasteAmount: string
  Inorganic_WasteAmount: string
  WasteAmount: string
  TotalProperty: number
  TotalActiveProperty: number
}
```

### FilterState
```typescript
interface Filters {
  month: string
  year: number
  stateID: number
  districtID: number
  blockID: number
  gpID: number
  level: number
}
```

## API Calls

### Main Table Data (Existing)
```
GET /api/waste-report
Query: month, year, stateID, districtID, blockID, gpID, level
Response: { success, data: WasteData[], count }
```

### Details Modal Data (New)
```
GET /api/property-waste-report
Query: month, year, stateID, districtID, blockID, gpID, level
Response: { success, data: PropertyDetail[], count }
```

## Component Props

### DataTable Props (Updated)
```typescript
interface DataTableProps {
  data: WasteData[]
  reportTitle?: string
  filters?: {  // NEW
    month: string
    year: number
    stateID: number
    districtID: number
    blockID: number
    gpID: number
    level: number
  }
}
```

### DetailsModal Props (New)
```typescript
interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
  locationName: string
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
```

## Key Functions

### data-table.tsx - Handle View Details
```typescript
const handleViewDetails = (locationName: string) => {
  setSelectedLocation(locationName)
  setIsModalOpen(true)
}
```

### details-modal.tsx - Fetch Details
```typescript
const fetchDetails = async () => {
  setLoading(true)
  setError(null)
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
    const response = await fetch(`/api/property-waste-report?${params}`)
    const result = await response.json()
    if (result.success) {
      setData(result.data)
    } else {
      setError(result.error || "Failed to fetch details")
    }
  } catch (err) {
    setError("Error fetching property details")
  } finally {
    setLoading(false)
  }
}
```

### details-modal.tsx - Export to Excel
```typescript
const exportToExcel = () => {
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
    Number.parseFloat(item.Organic_WasteAmount).toFixed(2),
    Number.parseFloat(item.Inorganic_WasteAmount).toFixed(2),
    Number.parseFloat(item.WasteAmount).toFixed(2),
    item.TotalProperty.toString(),
    item.TotalActiveProperty.toString(),
  ])
  
  // CSV generation and download...
}
```

## Hooks Used

### useEffect (details-modal.tsx)
```typescript
useEffect(() => {
  if (isOpen) {
    fetchDetails()
  }
}, [isOpen, filters])
```

Triggers API call when modal opens or filters change.

## UI Component Dependencies

```
details-modal.tsx imports:
├── Dialog
├── DialogContent
├── DialogDescription
├── DialogHeader
├── DialogTitle
├── Button
├── Card
├── CardContent
├── Download (icon)
├── X (icon)
├── Loader2 (icon)
└── useState, useEffect

data-table.tsx imports (NEW):
├── DetailsModal
└── Eye (icon)
```

## CSS Classes Used

### Gradient Colors
- `from-emerald-500 to-teal-600` - Primary gradient
- `from-green-50 text-green-700` - Organic waste
- `from-orange-50 text-orange-700` - Inorganic waste
- `from-blue-50 text-blue-700` - Total waste

### Responsive Classes
- `max-w-4xl` - Modal max width
- `overflow-y-auto` - Scrollable modal
- `overflow-x-auto` - Scrollable table
- `grid grid-cols-1 md:grid-cols-2` - Responsive grid

### Interactive States
- `hover:bg-blue-50/50` - Row hover
- `hover:from-emerald-600` - Button hover
- `disabled:opacity-50` - Disabled state
- `animate-spin` - Loading spinner

## File Structure Summary

```
workspace/
├── components/
│   ├── data-table.tsx (MODIFIED)
│   ├── details-modal.tsx (NEW) ✨
│   ├── filter-section.tsx
│   ├── waste-chart.tsx
│   └── ui/
│       └── dialog.tsx (EXISTING)
├── app/
│   ├── page.tsx (MODIFIED)
│   ├── layout.tsx
│   └── api/
│       ├── waste-report/
│       │   └── route.ts (EXISTING)
│       └── property-waste-report/ (NEEDED)
│           └── route.ts (NEEDS BACKEND)
├── package.json
├── QUICK_START.md (NEW)
├── IMPLEMENTATION_SUMMARY.md (NEW)
└── FEATURE_DOCUMENTATION.md (NEW)
```

## Notes

- The `/api/property-waste-report` endpoint needs to be created in the backend
- All data types use string for waste amounts (need parsing with `Number.parseFloat()`)
- Modal automatically closes when `onClose()` is called
- Filters are read-only within the modal (changes to main filters won't sync until modal reopens)
- CSV export is done client-side with no server overhead

---

This structure ensures separation of concerns, reusability, and maintainability of the codebase.
