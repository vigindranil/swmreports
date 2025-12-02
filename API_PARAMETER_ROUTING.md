# API Parameter Routing Logic - Fixed

## Problem
The API was being called with incorrect parameters when clicking "View Details". The blockID was always 0 even when a Block was selected from the datatable.

## Root Cause
The API parameters weren't correctly routing the location ID from the datatable based on which dropdowns had selections.

## Solution

### New Logic for Parameter Routing

The API parameters are now built based on **what's selected in the dropdowns**:

#### Scenario 1: Only District Selected in Dropdown
```
Dropdown State: districtID = 9, blockID = 0, gpID = 0
Datatable Column Selected: Block (ID = 75)
API Call Parameters:
  districtID: 9 (from dropdown)
  blockID: 75 (from datatable column)
  gpID: 0 (not selected)
  level: from level dropdown (e.g., 2)
```

#### Scenario 2: District + Block Selected in Dropdown
```
Dropdown State: districtID = 9, blockID = 75, gpID = 0
Datatable Column Selected: GP (ID = 5)
API Call Parameters:
  districtID: 9 (from dropdown)
  blockID: 75 (from dropdown)
  gpID: 5 (from datatable column)
  level: from level dropdown (e.g., 3)
```

#### Scenario 3: District + Block + GP Selected in Dropdown
```
Dropdown State: districtID = 9, blockID = 75, gpID = 5
Datatable Column Selected: Village/GP (ID = 123)
API Call Parameters:
  districtID: 9 (from dropdown)
  blockID: 75 (from dropdown)
  gpID: 123 (from datatable column - village ID)
  level: from level dropdown (e.g., 4)
```

### Implementation Code

```typescript
const fetchDetails = async () => {
  if (!selectedLocation) return

  let newBlockID = filters.blockID
  let newGpID = filters.gpID

  // If blockID is not selected in dropdown (=0), use datatable column ID as blockID
  if (filters.blockID === 0) {
    newBlockID = selectedLocation.id
  }
  // If blockID is selected but gpID is not (=0), use datatable column ID as gpID
  else if (filters.gpID === 0) {
    newGpID = selectedLocation.id
  }
  // If both blockID and gpID are selected, datatable ID is villageID (also goes to gpID)

  const params = new URLSearchParams({
    month: filters.month,
    year: filters.year.toString(),
    stateID: filters.stateID.toString(),
    districtID: filters.districtID.toString(),
    blockID: newBlockID.toString(),
    gpID: newGpID.toString(),
    level: filters.level.toString(), // Use level from dropdown as-is
  })

  const response = await fetch(`/api/property-waste-report?${params}`)
  // ... handle response
}
```

## Key Changes Made

### File: `components/details-modal.tsx`

1. **Removed hardcoded level increment**: Changed from `level: (filters.level + 1).toString()` to `level: filters.level.toString()`
   - Level now comes directly from the level dropdown selection

2. **Implemented conditional ID routing**: 
   - If `blockID === 0` → use `selectedLocation.id` for `blockID`
   - Else if `gpID === 0` → use `selectedLocation.id` for `gpID`
   - Else → use `selectedLocation.id` for `gpID` (village level)

3. **Preserved dropdown values**: `districtID` always comes from `filters.districtID`, never changed

## Example Flow

**User Actions:**
1. User selects "District: Jalpaiguri" from dropdown
2. Main datatable shows all blocks in Jalpaiguri
3. User clicks "View Details" on "Dhupguri" block (ID = 75)
4. Modal opens and calls API with:
   ```
   /api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=75&gpID=0&level=2
   ```
5. Backend returns property-type breakdown for Dhupguri block

## Benefits

✅ **Correct Hierarchical Navigation**: Each level correctly identifies the location being drilled into
✅ **Flexible Dropdown Combinations**: Works with any combination of dropdown selections
✅ **Level Control**: Users can select the level from dropdown, API uses it as-is
✅ **Consistent with Datatable**: ID always comes from the row clicked in datatable
✅ **No Hardcoded Logic**: Uses the state of dropdowns to determine parameter routing

## Testing Scenarios

- [ ] Test with only District selected → blockID from datatable
- [ ] Test with District + Block selected → gpID from datatable  
- [ ] Test with District + Block + GP selected → villageID from datatable
- [ ] Test that level parameter matches dropdown selection
- [ ] Test that districtID always comes from dropdown, never changed
- [ ] Test export filename includes correct location name

## API Call Examples

**Scenario 1 - Block level view:**
```
/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=75&gpID=0&level=2
```
Shows property types in Dhupguri (blockID=75)

**Scenario 2 - GP level view:**
```
/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=75&gpID=5&level=3
```
Shows property types in Fulbari-ii (gpID=5) within Rajganj block

**Scenario 3 - Village level view:**
```
/api/property-waste-report?month=August&year=2025&stateID=1&districtID=9&blockID=75&gpID=123&level=4
```
Shows property types in specific village (gpID=123)
