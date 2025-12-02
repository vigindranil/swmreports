# Waste Report Dashboard - Feature Implementation Guide

## Overview
This document outlines the implementation of the Property-wise Waste Details feature in the Waste Report Dashboard.

## Features Implemented

### 1. **View Details Modal** (`components/details-modal.tsx`)
A modal dialog that displays property-type-wise waste collection details for a selected location.

**Key Features:**
- Fetches data from `/api/property-waste-report` endpoint
- Displays property-wise breakdown of waste (Organic, Inorganic, Total)
- Shows property counts (Total Properties, Active Properties with percentage)
- Excel export functionality for detailed data
- Loading and error states

**Props:**
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

### 2. **Enhanced Data Table** (`components/data-table.tsx`)
Updated to include a "View Details" button in each row.

**Changes:**
- Added import for `DetailsModal` component
- Added new state for tracking selected location and modal visibility
- Added "Actions" column with "View Details" button
- Button opens the details modal with the selected location's name
- Passes filters to the modal for API calls

### 3. **Updated Main Page** (`app/page.tsx`)
Modified to pass filter state to the DataTable component.

**Changes:**
- DataTable now receives the current `filters` object
- Enables the modal to make API calls with correct parameters

## How It Works

### User Flow:
1. User selects filters (State, District, Block, GP)
2. User clicks "Fetch Report" to load the main data table
3. For each location row, a "View Details" button is available
4. Clicking "View Details" opens a modal with property-type-wise breakdown
5. User can export the detailed data to Excel

### API Endpoint Details:
```
GET /api/property-waste-report
Query Parameters:
  - month: string (e.g., "August")
  - year: number (e.g., 2025)
  - stateID: number
  - districtID: number
  - blockID: number
  - gpID: number
  - level: number

Response:
{
  "success": boolean,
  "data": [
    {
      "ID": number,
      "PropertyTypeName": string,
      "Organic_WasteAmount": string,
      "Inorganic_WasteAmount": string,
      "WasteAmount": string,
      "TotalProperty": number,
      "TotalActiveProperty": number
    }
  ],
  "count": number
}
```

## Hierarchical Drilldown Support

The implementation supports different hierarchy levels:

### **Level 1: State Selection**
- Shows nothing (needs district selection)

### **Level 2: District Selection** (districtID > 0)
- Main table shows: Block-wise reports
- View Details shows: Property-type-wise data for that block

### **Level 3: Block Selection** (blockID > 0)
- Main table shows: GP-wise reports
- View Details shows: Property-type-wise data for that GP

### **Level 4: GP Selection** (gpID > 0)
- Main table shows: Individual location data
- View Details shows: Property-type-wise data for that location

## Excel Export Functionality

### Main Table Export
- Exports all visible rows with totals
- Filename: `waste-report-{date}.csv`

### Details Modal Export
- Exports property-type-wise breakdown
- Includes location name and period
- Filename: `property-details-{location-name}-{date}.csv`

## Components Used
- **Dialog** (Radix UI): For modal display
- **Button**: For action buttons
- **Card**: For layout structure
- **Eye Icon** (Lucide): For View Details button visual
- **Download Icon** (Lucide): For Export button
- **Loader2 Icon**: For loading state

## Styling
- Gradient backgrounds for headers (emerald-500 to teal-600)
- Hover effects on interactive elements
- Responsive design for mobile/desktop
- Color-coded waste types:
  - Organic Waste: Green (bg-green-50)
  - Inorganic Waste: Orange (bg-orange-50)
  - Total Waste: Blue (bg-blue-50)

## Error Handling
- API errors are caught and displayed in the modal
- Loading states provide user feedback
- Empty state messaging when no data is available

## Future Enhancements (Optional)
1. Add more detailed property information (address, contact, etc.)
2. Implement PDF export in addition to Excel
3. Add filtering within the details modal
4. Real-time data updates with auto-refresh
5. Historical comparison between periods
