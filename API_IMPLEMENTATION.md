# API Implementation Guide

## Created API Endpoint

### Endpoint Details
```
Method: GET
Path: /api/property-waste-report
Frontend Route: http://localhost:3000/api/property-waste-report
Backend Target: http://localhost:3000/api/property-waste-report
```

## File Location
```
app/api/property-waste-report/route.ts
```

## Implementation Details

### Query Parameters Passed to Backend
The frontend API route accepts and forwards these parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| month | string | "August" | Month name |
| year | string | "2025" | Year value |
| stateID | string | "1" | State ID |
| districtID | string | "0" | District ID (0 = all) |
| blockID | string | "0" | Block ID (0 = all) |
| gpID | string | "0" | GP/Village ID (0 = all) |
| level | string | "1" | Collection level |

### Request Example
```bash
curl --location 'http://localhost:3000/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=0&gpID=0&level=1'
```

### Expected Response Format
```json
{
  "success": true,
  "data": [
    {
      "ID": 18,
      "PropertyTypeName": "CLUB",
      "Organic_WasteAmount": "1.50",
      "Inorganic_WasteAmount": "1.50",
      "WasteAmount": "3.00",
      "TotalProperty": 42,
      "TotalActiveProperty": 1
    },
    {
      "ID": 6,
      "PropertyTypeName": "Comunity Centre",
      "Organic_WasteAmount": "18.46",
      "Inorganic_WasteAmount": "3.21",
      "WasteAmount": "21.67",
      "TotalProperty": 74,
      "TotalActiveProperty": 6
    },
    // ... more property types
  ],
  "count": 11
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Failed to fetch property waste report data from backend",
  "data": []
}
```

## Frontend Integration

### How the Modal Uses This Endpoint

**File:** `components/details-modal.tsx`

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

    // Calls the frontend API route
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

## Backend Implementation Requirements

### What Your Backend API Should Do

Your backend at `http://localhost:3000/api/property-waste-report` should:

1. **Accept Query Parameters**
   - Read month, year, stateID, districtID, blockID, gpID, level
   - Validate that all parameters are provided

2. **Query Database**
   - Aggregate waste data by property type (not by location)
   - Filter by the provided month/year/location hierarchy
   - Sum organic and inorganic waste amounts
   - Count total and active properties for each property type

3. **Return JSON Response**
   - Success flag (true/false)
   - Array of property types with their waste data
   - Count field with number of records
   - On error: include error message

### Example SQL Query Structure
```sql
SELECT 
  PropertyType.ID,
  PropertyType.Name as PropertyTypeName,
  SUM(WasteReport.OrganicAmount) as Organic_WasteAmount,
  SUM(WasteReport.InorganicAmount) as Inorganic_WasteAmount,
  SUM(WasteReport.TotalAmount) as WasteAmount,
  COUNT(DISTINCT Property.ID) as TotalProperty,
  COUNT(DISTINCT Property.ID WHERE Property.IsActive = 1) as TotalActiveProperty
FROM PropertyType
LEFT JOIN Property ON PropertyType.ID = Property.PropertyTypeID
LEFT JOIN WasteReport ON Property.ID = WasteReport.PropertyID
WHERE 
  WasteReport.Month = @month
  AND WasteReport.Year = @year
  AND Property.StateID = @stateID
  AND Property.DistrictID = @districtID
  AND (Property.BlockID = @blockID OR @blockID = 0)
  AND (Property.GPID = @gpID OR @gpID = 0)
GROUP BY PropertyType.ID, PropertyType.Name
ORDER BY PropertyTypeName
```

## Testing the API

### Test Case 1: District Level (blockID = 0, gpID = 0)
```bash
curl --location 'http://localhost:3000/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=0&gpID=0&level=1'
```
Expected: Property-type breakdown for entire district

### Test Case 2: Block Level (gpID = 0)
```bash
curl --location 'http://localhost:3000/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=73&gpID=0&level=1'
```
Expected: Property-type breakdown for specific block

### Test Case 3: GP Level
```bash
curl --location 'http://localhost:3000/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=73&gpID=1&level=1'
```
Expected: Property-type breakdown for specific GP

## API Route Code

**File:** `app/api/property-waste-report/route.ts`

```typescript
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month")
    const year = searchParams.get("year")
    const stateID = searchParams.get("stateID")
    const districtID = searchParams.get("districtID")
    const blockID = searchParams.get("blockID")
    const gpID = searchParams.get("gpID")
    const level = searchParams.get("level")

    // Build the backend URL with query parameters
    const backendUrl = new URL("http://localhost:3000/api/property-waste-report")
    backendUrl.searchParams.set("month", month || "August")
    backendUrl.searchParams.set("year", year || "2025")
    backendUrl.searchParams.set("stateID", stateID || "1")
    backendUrl.searchParams.set("districtID", districtID || "0")
    backendUrl.searchParams.set("blockID", blockID || "0")
    backendUrl.searchParams.set("gpID", gpID || "0")
    backendUrl.searchParams.set("level", level || "1")

    const response = await fetch(backendUrl.toString())

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const data = await response.json()

    return Response.json(data)
  } catch (error) {
    console.error("[v0] Property waste report API route error:", error)
    return Response.json(
      { success: false, error: "Failed to fetch property waste report data from backend", data: [] },
      { status: 500 }
    )
  }
}
```

## How It Works

### Request Flow
```
Frontend Modal
    ↓
fetch('/api/property-waste-report?...')
    ↓
Frontend API Route (route.ts)
    ↓
Validates & forwards to backend
    ↓
Backend API (/api/property-waste-report)
    ↓
Queries database
    ↓
Returns PropertyDetail[] array
    ↓
Frontend route forwards response
    ↓
Modal displays in table
```

## Error Handling

### Frontend Catches:
- Network errors (no internet)
- Invalid JSON response
- API timeouts
- Missing success field

### Backend Should Handle:
- Invalid parameters
- Missing data for period
- Database connection errors
- Access/authentication errors

## Performance Considerations

1. **Frontend Route** (app/api/property-waste-report/route.ts)
   - Simple pass-through
   - No processing
   - Minimal latency added

2. **Backend API** Should:
   - Use efficient aggregation queries
   - Implement proper indexing on filters
   - Cache results if possible
   - Return results in < 1 second
   - Limit payload size (< 1MB)

## Environment Configuration

### Development
- Backend URL: `http://localhost:3000/api/property-waste-report`
- Frontend URL: `/api/property-waste-report`

### Production
Update the backend URL in route.ts if needed:
```typescript
const backendUrl = new URL("http://backend-server:3000/api/property-waste-report")
// Or use environment variable:
const backendUrl = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/property-waste-report`)
```

## Integration Checklist

- [x] Frontend API route created
- [x] Modal component built
- [x] Button integrated
- [x] Error handling implemented
- [ ] Backend API implemented
- [ ] Database queries optimized
- [ ] Testing completed
- [ ] Performance verified
- [ ] Deployment ready

## Next Steps

1. **Implement Backend API** at `http://localhost:3000/api/property-waste-report`
2. **Test with Frontend** using provided curl commands
3. **Monitor Performance** and optimize queries if needed
4. **Handle Edge Cases** (empty data, invalid IDs, etc.)
5. **Deploy to Production** with updated backend URL

---

**Status:** ✅ Frontend API route ready | ⏳ Backend API pending implementation
**Created:** December 2, 2025
**Version:** 1.0
