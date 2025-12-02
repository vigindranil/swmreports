# Backend Implementation Checklist

## API Endpoint Required

### Endpoint Details
```
Method: GET
Path: /api/property-waste-report
```

## Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| month | string | Yes | Month name | "August" |
| year | number | Yes | Year | 2025 |
| stateID | number | Yes | State ID | 1 |
| districtID | number | Yes | District ID (0 for all) | 9 |
| blockID | number | Yes | Block ID (0 for all) | 73 |
| gpID | number | Yes | GP ID (0 for all) | 0 |
| level | number | Yes | Collection level | 1 |

## Response Format

### Success Response (200 OK)
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
    ...more property types...
  ],
  "count": 11
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "error": "Invalid parameters or no data found"
}
```

## Data Requirements

### Property Type Fields
Each property type object must contain:

| Field | Type | Required | Format | Notes |
|-------|------|----------|--------|-------|
| ID | number | Yes | Integer | Unique identifier |
| PropertyTypeName | string | Yes | Text | e.g., "House", "Shop", "Office Building" |
| Organic_WasteAmount | string | Yes | Decimal | e.g., "1.50" |
| Inorganic_WasteAmount | string | Yes | Decimal | e.g., "1.50" |
| WasteAmount | string | Yes | Decimal | Sum of organic + inorganic |
| TotalProperty | number | Yes | Integer | Total number of properties |
| TotalActiveProperty | number | Yes | Integer | Number actively reporting |

### Data Calculation Notes
1. **WasteAmount** should equal `Organic_WasteAmount + Inorganic_WasteAmount`
2. **TotalActiveProperty** should be ≤ **TotalProperty**
3. Amounts are in kilograms
4. All numeric strings should be convertible to floating-point numbers

## Database Query Logic

### Expected Behavior by Filter Level

#### When districtID > 0 and blockID = 0
- Return property-type aggregated data for entire district
- Sum waste across all blocks in district

#### When districtID > 0 and blockID > 0 and gpID = 0
- Return property-type aggregated data for entire block
- Sum waste across all GPs in block

#### When districtID > 0 and blockID > 0 and gpID > 0
- Return property-type aggregated data for specific GP
- Sum waste from that GP only

## Implementation Example (Pseudo-code)

```sql
SELECT 
  PT.ID,
  PT.PropertyTypeName,
  SUM(WR.Organic_WasteAmount) as Organic_WasteAmount,
  SUM(WR.Inorganic_WasteAmount) as Inorganic_WasteAmount,
  SUM(WR.Organic_WasteAmount + WR.Inorganic_WasteAmount) as WasteAmount,
  COUNT(DISTINCT P.ID) as TotalProperty,
  COUNT(DISTINCT CASE WHEN WR.ID IS NOT NULL THEN P.ID END) as TotalActiveProperty
FROM PropertyTypes PT
LEFT JOIN Properties P ON PT.ID = P.PropertyTypeID
LEFT JOIN WasteReports WR ON P.ID = WR.PropertyID
WHERE 
  WR.Month = @month
  AND WR.Year = @year
  AND P.StateID = @stateID
  AND P.DistrictID = @districtID
  AND (P.BlockID = @blockID OR @blockID = 0)
  AND (P.GPID = @gpID OR @gpID = 0)
  AND P.Level = @level
GROUP BY PT.ID, PT.PropertyTypeName
ORDER BY PT.PropertyTypeName
```

## Testing Checklist

### ✅ Frontend Expectations

- [ ] API returns data for all property types in location
- [ ] API returns correct waste amounts (string format)
- [ ] API returns correct property counts
- [ ] API returns count field matching data array length
- [ ] API handles invalid parameters gracefully
- [ ] API returns 200 OK with error flag if no data found

### ✅ Data Validation Tests

- [ ] Test with real month/year combination
- [ ] Test with valid state/district/block/gp IDs
- [ ] Test with districtID=0 (all districts)
- [ ] Test with blockID=0 (all blocks)
- [ ] Test with gpID=0 (all GPs)
- [ ] Test with invalid IDs (return empty or error)
- [ ] Test decimal amounts for organic/inorganic waste
- [ ] Test total waste calculation accuracy

### ✅ Edge Cases

- [ ] Empty result set (return empty array, success=true)
- [ ] No data for selected month/year
- [ ] Properties with no waste reports
- [ ] Single property type only
- [ ] Very large numbers (test formatting)

### ✅ Performance Tests

- [ ] Query executes in < 1 second
- [ ] Response size is reasonable (< 1MB)
- [ ] Handles large datasets (1000+ properties)
- [ ] Proper indexing on filters

## Example cURL Commands for Testing

### Test District Level
```bash
curl --location 'http://localhost:3000/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=0&gpID=0&level=1'
```

### Test Block Level
```bash
curl --location 'http://localhost:3000/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=73&gpID=0&level=1'
```

### Test GP Level
```bash
curl --location 'http://localhost:3000/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=73&gpID=1&level=1'
```

## Integration Steps

1. **Create Route Handler**
   - File: `/app/api/property-waste-report/route.ts`
   - Method: GET
   - Return: JSON response

2. **Add Database Query**
   - Query property types with aggregated waste data
   - Filter by month, year, location hierarchy
   - Sort by property type name

3. **Validation Layer**
   - Validate all required parameters present
   - Validate parameter types
   - Check for valid IDs in database

4. **Error Handling**
   - Return 400 Bad Request for invalid params
   - Return 404 Not Found if no data
   - Return 500 Server Error for DB issues
   - Always include error message in response

5. **Testing**
   - Run with sample data
   - Test all parameter combinations
   - Verify frontend displays data correctly

## Frontend Integration Status

✅ **Frontend is ready** - No changes needed on client side
- Modal component is built
- Button integration is complete
- Export functionality works
- Error handling is implemented

⏳ **Waiting on backend**
- `/api/property-waste-report` endpoint needs to be created
- Once created, frontend will automatically work

## Deployment Checklist

- [ ] Backend route implemented
- [ ] Database queries optimized
- [ ] Error handling tested
- [ ] Edge cases handled
- [ ] Performance acceptable
- [ ] Response format matches specification
- [ ] Frontend tested with live endpoint
- [ ] CSV export verified
- [ ] All filters tested (state, district, block, gp)
- [ ] Pagination added (if needed for large datasets)

## Rollback Plan

If issues occur:
1. Disable View Details button in frontend temporarily
2. Comment out DetailsModal import/usage
3. Redeploy without feature
4. Fix backend issues
5. Re-enable and redeploy

---

**Expected Timeline:** 2-4 hours for development and testing
**Complexity Level:** Medium (requires aggregation queries)
**Database Impact:** Low (read-only queries)
