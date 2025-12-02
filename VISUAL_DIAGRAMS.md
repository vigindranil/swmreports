# Visual Architecture & Flow Diagrams

## 1. Component Hierarchy

```
┌─────────────────────────────────────────┐
│         app/page.tsx (Main)             │
├─────────────────────────────────────────┤
│  ├─ FilterSection                       │
│  │   └─ Manages: month, year, state,   │
│  │      district, block, gp, level     │
│  ├─ Statistics Cards                    │
│  ├─ Report Title Section                │
│  ├─ WasteChart                          │
│  └─ DataTable ◄─── UPDATED             │
│      ├─ State:                          │
│      │  ├─ searchTerm                   │
│      │  ├─ sortField                    │
│      │  ├─ sortDirection                │
│      │  ├─ selectedLocation ◄─── NEW   │
│      │  └─ isModalOpen ◄─── NEW        │
│      ├─ Table with Actions Column       │
│      └─ DetailsModal ◄─── NEW          │
│          ├─ State:                      │
│          │  ├─ data (PropertyDetail[]) │
│          │  ├─ loading                  │
│          │  └─ error                    │
│          ├─ Property Table              │
│          └─ Export Button               │
```

## 2. User Interaction Flow

```
┌──────────────────────────┐
│   1. Select Filters      │
│   - District            │
│   - Block (optional)    │
│   - GP (optional)       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   2. Click "Fetch Report" Button     │
│                                      │
│   API: GET /api/waste-report         │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   3. Main Data Table Loads           │
│   - Shows Block/GP/Location data    │
│   - Each row has "View Details" btn  │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ Location │ ... │ View Details │   │
│   │          │ ... │   [Button]   │   │
│   │          │ ... │   [Button]   │   │
│   └──────────────────────────────┘   │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   4. User Clicks "View Details"      │
│       for a Location                 │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   5. Modal Opens & Fetches Data      │
│                                      │
│   API: GET /api/property-waste-      │
│        report?...filters...          │
│                                      │
│   Loading Spinner Shows              │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│   6. Property Type Table Displays    │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ Property │ Org │ Inorg │ ... │   │
│   │ House    │ 405 │  485  │ ... │   │
│   │ Shop     │ 911 │ 1136  │ ... │   │
│   │ School   │ 286 │  217  │ ... │   │
│   │ TOTAL    │ ... │  ...  │ ... │   │
│   └──────────────────────────────┘   │
│                                      │
│   [Close Button] [Export to Excel]   │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  7a. User Closes Modal               │
│      OR                              │
│  7b. User Clicks "Export to Excel"   │
│      → CSV file downloaded           │
└──────────────────────────────────────┘
```

## 3. Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                     MAIN PAGE (page.tsx)                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  filters = {                                                  │
│    month: "August"      ───────────────────┐                 │
│    year: 2025                              │                 │
│    stateID: 1                              │                 │
│    districtID: 9        ───────────────────┤─────────────┐   │
│    blockID: 73                             │             │   │
│    gpID: 0                                 │             │   │
│    level: 1                                │             │   │
│  }                                         │             │   │
│                                            │             │   │
│  ┌─────────────────────────────────────┐   │             │   │
│  │ FILTER SECTION                      │   │             │   │
│  │ Sets filters above                  │   │             │   │
│  └─────────────────────────────────────┘   │             │   │
│         │                                   │             │   │
│         │ onFetch()                         │             │   │
│         ▼                                   │             │   │
│  API Call: /api/waste-report?...          │             │   │
│  Returns: WasteData[]                     │             │   │
│         │                                   │             │   │
│         ▼                                   │             │   │
│  data = [                                   │             │   │
│    { Name: "Maynaguri", ... },              │             │   │
│    { Name: "Rajganj", ... },                │             │   │
│    ...                                      │             │   │
│  ]                                          │             │   │
│                                            │             │   │
└────────────────────────────────────────────┼─────────────┼───┘
                                             │             │
                                             │             │
┌────────────────────────────────────────────▼─────────────▼───┐
│                  DATA TABLE (data-table.tsx)                 │
├────────────────────────────────────────────────────────────┬─┤
│ Table Display:                                             │ │
│ ┌────────────────────────────────────────────────────────┐│ │
│ │ Name      │ Org │ Inorg │ Total │ Props │ Active │ Act │ │
│ ├────────────────────────────────────────────────────────┤│ │
│ │ Maynaguri │ ... │  ...  │  ...  │  ...  │ ...    │[btn]│ │
│ │ Rajganj   │ ... │  ...  │  ...  │  ...  │ ...    │[btn]│ │
│ │ Dhupguri  │ ... │  ...  │  ...  │  ...  │ ...    │[btn]│ │
│ └────────────────────────────────────────────────────────┘│ │
│                                                             │ │
│ User clicks [btn] on a row (e.g., "Rajganj")              │ │
│         │                                                   │ │
│         ▼                                                   │ │
│ selectedLocation = "Rajganj"                                │ │
│ isModalOpen = true                                          │ │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│               DETAILS MODAL (details-modal.tsx)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ useEffect triggered → fetchDetails()                            │
│         │                                                       │
│         ▼                                                       │
│ API Call: /api/property-waste-report?                          │
│   month=August&year=2025&districtID=9&blockID=73&...          │
│         │                                                       │
│         ▼                                                       │
│ Response: PropertyDetail[]                                      │
│ [                                                              │
│   {                                                            │
│     PropertyTypeName: "House",                                 │
│     Organic_WasteAmount: "405.61",                            │
│     Inorganic_WasteAmount: "484.96",                          │
│     WasteAmount: "890.57",                                     │
│     TotalProperty: 938,                                        │
│     TotalActiveProperty: 96                                    │
│   },                                                           │
│   { PropertyTypeName: "Shop", ... },                          │
│   ...                                                          │
│ ]                                                              │
│         │                                                       │
│         ▼                                                       │
│ data = PropertyDetail[]                                         │
│         │                                                       │
│         ▼                                                       │
│ Modal renders Property Table:                                  │
│ ┌──────────────────────────────────────────────────────┐       │
│ │Property │ Organic │ Inorg │ Total │ Props │ Active  │       │
│ ├──────────────────────────────────────────────────────┤       │
│ │House    │ 405.61  │ 484.96│ 890.57│  938  │ 96 (10%)│       │
│ │Shop     │ 910.94  │ 1136.4│ 2047.3│ 2825  │ 372(13%)│       │
│ │School   │ 285.61  │ 217.18│ 502.79│ 1090  │ 118(11%)│       │
│ │...      │  ...    │  ...  │  ...  │ ...   │  ...    │       │
│ │TOTAL    │ ...     │  ...  │  ...  │ ...   │  ...    │       │
│ └──────────────────────────────────────────────────────┘       │
│                                                                 │
│ [Export to Excel Button]  [Close Button]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4. State Management Timeline

```
Timeline: How data moves through components

T0 - Page Load
┌──────────────────┐
│ filters = {}     │ (initial state in page.tsx)
│ data = []        │
│ loading = false  │
└──────────────────┘

T1 - User selects filters
┌──────────────────┐
│ filters = {...}  │ (updated in FilterSection)
│ data = []        │
│ loading = false  │
└──────────────────┘

T2 - Click "Fetch Report"
┌──────────────────────────────────────┐
│ filters = {...}                      │
│ data = []                            │
│ loading = true    (API call started) │
└──────────────────────────────────────┘

T3 - API Response received
┌──────────────────────────────────────┐
│ filters = {...}                      │
│ data = [WasteData, ...]              │ (populated from API)
│ loading = false   (API complete)     │
└──────────────────────────────────────┘

T4 - DataTable Renders
┌──────────────────────────────────────┐
│ Receives:                            │
│ - data (from page.tsx)               │
│ - reportTitle (derived from filters) │
│ - filters (PASSED TO MODAL)           │
│                                      │
│ Local state:                         │
│ - selectedLocation = null            │
│ - isModalOpen = false                │
└──────────────────────────────────────┘

T5 - User clicks "View Details"
┌──────────────────────────────────────┐
│ DataTable state changes to:          │
│ - selectedLocation = "Rajganj"       │
│ - isModalOpen = true                 │
└──────────────────────────────────────┘

T6 - Modal Opens
┌──────────────────────────────────────┐
│ DetailsModal receives:               │
│ - isOpen = true (triggers useEffect) │
│ - locationName = "Rajganj"           │
│ - filters = {...}                    │
│                                      │
│ Local state:                         │
│ - data = []                          │
│ - loading = true (API call started)  │
│ - error = null                       │
└──────────────────────────────────────┘

T7 - Modal API Response
┌──────────────────────────────────────┐
│ DetailsModal state updates to:       │
│ - data = [PropertyDetail, ...]       │ (populated from API)
│ - loading = false (API complete)     │
│ - error = null                       │
└──────────────────────────────────────┘

T8 - Modal Renders Table
┌──────────────────────────────────────┐
│ Shows property-type breakdown        │
│ With export to Excel option          │
└──────────────────────────────────────┘
```

## 5. Hierarchical Navigation Map

```
┌─────────────────────────────────────────────────────────────┐
│                    HIERARCHY LEVELS                         │
└─────────────────────────────────────────────────────────────┘

Level 0: State Selection
┌───────────────────┐
│  State Selection  │
│  (West Bengal)    │
└────────┬──────────┘
         │
         ▼
    ┌────────┐
    │ BLOCKS │ Main table shows Block-wise data
    │ BLOCKS │
    │ BLOCKS │
    └────┬───┘
         │ Click "View Details"
         ▼
    ┌─────────────────────┐
    │  PROPERTY TYPES     │
    │ House, Shop, School │  Modal shows Property-type breakdown
    │ Market, etc.        │
    └─────────────────────┘


Level 1: District Selected (districtID > 0, blockID = 0)
┌────────────────────┐
│ District Selected  │
│ (Jalpaiguri)       │
└────────┬───────────┘
         │
         ▼
    ┌────────────────────┐
    │ All BLOCKS in      │ Main table shows Block-wise data
    │ District           │
    │                    │
    │ - Maynaguri        │
    │ - Rajganj          │ Click "View Details" on "Rajganj"
    │ - Dhupguri         │
    │ - etc.             │
    └────┬───────────────┘
         │
         ▼
    ┌─────────────────────────────┐
    │ PROPERTY TYPES IN RAJGANJ   │
    │ House        - 405kg        │
    │ Shop         - 911kg        │  Modal shows Property-type breakdown
    │ School       - 286kg        │  FOR RAJGANJ BLOCK
    │ Market       - 549kg        │
    │ etc.                        │
    └─────────────────────────────┘


Level 2: District + Block Selected (districtID > 0, blockID > 0, gpID = 0)
┌────────────────────────────┐
│ District + Block Selected  │
│ (Jalpaiguri, Rajganj)      │
└────────┬───────────────────┘
         │
         ▼
    ┌──────────────────────┐
    │ All GPs in RAJGANJ   │ Main table shows GP-wise data
    │                      │
    │ - Panikauri          │
    │ - Sikarpur           │ Click "View Details" on "Sikarpur"
    │ - Majhiali           │
    │ - etc.               │
    └────┬─────────────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │ PROPERTY TYPES IN SIKARPUR GP│
    │ House        - 125kg         │
    │ Shop         - 234kg         │  Modal shows Property-type breakdown
    │ School       - 89kg          │  FOR SIKARPUR GP
    │ etc.                         │
    └──────────────────────────────┘


Level 3: District + Block + GP Selected (all > 0)
┌────────────────────────────────────┐
│ All Levels Selected                │
│ (Jalpaiguri, Rajganj, Sikarpur)    │
└────────┬─────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │ Individual LOCATIONS in GP   │ Main table shows individual
    │                              │ location data (if applicable)
    │ - Location 1                 │
    │ - Location 2                 │ Click "View Details" on any
    │ - Location 3                 │
    └────┬───────────────────────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │ PROPERTY TYPES IN LOCATION 2 │
    │ House        - 50kg          │
    │ Shop         - 100kg         │  Modal shows Property-type breakdown
    │ School       - 25kg          │  FOR THAT SPECIFIC LOCATION
    │ etc.                         │
    └──────────────────────────────┘
```

## 6. API Integration Points

```
┌──────────────────────────────────────────────────────────────┐
│                  API CALLS IN APPLICATION                    │
└──────────────────────────────────────────────────────────────┘

REQUEST 1: Main Table Data (EXISTING)
┌─────────────────────────────────────────────────────────────┐
│ GET /api/waste-report                                       │
│                                                             │
│ Params:                                                     │
│ ?month=August&year=2025&stateID=1                          │
│ &districtID=9&blockID=73&gpID=0&level=1                   │
│                                                             │
│ Response: { success, data: WasteData[], count }            │
│                                                             │
│ WasteData = {                                               │
│   ID, Name, Organic_WasteAmount, Inorganic_WasteAmount,   │
│   WasteAmount, TotalProperty, TotalActiveProperty          │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘

REQUEST 2: Details Modal Data (NEW - NEEDS BACKEND)
┌─────────────────────────────────────────────────────────────┐
│ GET /api/property-waste-report                              │
│                                                             │
│ Params:                                                     │
│ ?month=August&year=2025&stateID=1                          │
│ &districtID=9&blockID=73&gpID=0&level=1                   │
│                                                             │
│ Response: { success, data: PropertyDetail[], count }        │
│                                                             │
│ PropertyDetail = {                                          │
│   ID, PropertyTypeName, Organic_WasteAmount,              │
│   Inorganic_WasteAmount, WasteAmount,                     │
│   TotalProperty, TotalActiveProperty                        │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘

Both APIs use SAME query parameters!
The difference is in the data they return:
- First API: Aggregated by LOCATION (Block/GP/Village)
- Second API: Aggregated by PROPERTY TYPE
```

---

These diagrams provide a complete visual reference for understanding the architecture, data flow, and user interactions in the application.
