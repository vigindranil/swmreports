# Developer Quick Reference

## 🎯 What Was Built?

A **View Details** feature that opens a modal showing property-type-wise waste breakdown when users click a button on the main data table.

---

## 📍 Key Files

```
NEW FILE:
  components/details-modal.tsx          ← The modal component

MODIFIED FILES:
  components/data-table.tsx             ← Added View Details button
  app/page.tsx                          ← Pass filters to DataTable
```

---

## 🔌 Component Integration

### In DataTable:
```typescript
import DetailsModal from "@/components/details-modal"

// Add to component
const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false)

// Add button in table
<Button onClick={() => {
  setSelectedLocation(item.Name)
  setIsModalOpen(true)
}}>
  <Eye className="w-4 h-4 mr-1.5" />
  View Details
</Button>

// Add modal at bottom
{filters && selectedLocation && (
  <DetailsModal
    isOpen={isModalOpen}
    onClose={() => {
      setIsModalOpen(false)
      setSelectedLocation(null)
    }}
    locationName={selectedLocation}
    filters={filters}
  />
)}
```

### In Page:
```typescript
// Pass filters to DataTable
<DataTable data={data} reportTitle={reportTitle} filters={filters} />
```

---

## 📡 API Integration

### What Modal Calls:
```
GET /api/property-waste-report
?month=August&year=2025&stateID=1&districtID=9&blockID=73&gpID=0&level=1
```

### What Modal Expects:
```typescript
{
  success: true,
  data: [
    {
      ID: number,
      PropertyTypeName: string,
      Organic_WasteAmount: string,      // "405.61"
      Inorganic_WasteAmount: string,    // "484.96"
      WasteAmount: string,              // "890.57"
      TotalProperty: number,            // 938
      TotalActiveProperty: number       // 96
    },
    // ... more property types
  ],
  count: number
}
```

---

## 🧪 Quick Testing

### Test the Button:
1. Select filters → Click "Fetch Report"
2. Table loads → Find "View Details" button in last column
3. Click button → Modal should open with location name

### Test the Modal:
1. After button click, modal shows
2. Wait for data to load (loading spinner)
3. Verify table displays property types
4. Click "Export to Excel" → CSV downloads
5. Click "Close" → Modal closes

### Test the Export:
1. Open modal, wait for data
2. Click "Export to Excel"
3. Check Downloads folder for CSV file
4. Verify location name is in filename
5. Open CSV in Excel/Sheets to verify data

---

## 🔧 Common Modifications

### Change Button Text:
```typescript
// In data-table.tsx
<Button>
  <Eye className="w-4 h-4 mr-1.5" />
  View Details    ← Change this text
</Button>
```

### Change Colors:
```typescript
// Update these Tailwind classes:
// Header: from-emerald-500 to-teal-600
// Organic: bg-green-50 text-green-700
// Inorganic: bg-orange-50 text-orange-700
// Total: bg-blue-50 text-blue-700
```

### Change Modal Title:
```typescript
// In details-modal.tsx
<DialogTitle className="text-2xl font-bold">
  Property-wise Waste Details    ← Change this
</DialogTitle>
```

### Add More Columns:
```typescript
// In details-modal.tsx, add to columns in table:
<th>New Column Name</th>

// Then in data rows:
<td>{item.NewField}</td>
```

---

## 🚀 Development Workflow

### If Starting Fresh:
```bash
# 1. Create new details-modal.tsx component
# 2. Import in data-table.tsx
# 3. Add state for modal
# 4. Add View Details button
# 5. Pass filters to DataTable in page.tsx
# 6. Test locally with dev server
# 7. Build: npm run build
# 8. Deploy when backend API ready
```

### For Debugging:
```typescript
// Add console logs in modal
console.log('Selected location:', locationName)
console.log('API response:', result)
console.log('Filters:', filters)

// Check browser console: F12 → Console tab
// Network tab to see API calls
// Performance tab to check speed
```

---

## 📦 Dependencies

### Already Installed:
```json
{
  "@radix-ui/react-dialog": "1.1.4",  // Dialog component
  "lucide-react": "^0.454.0",          // Icons
  "react": "19.0.0",                   // React
  "next": "16.0.3"                     // Next.js
}
```

### No Additional Packages Needed! ✅

---

## 🔗 Props & Types

### DetailsModal Props:
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

### DataTable Props (Updated):
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

---

## 🐛 Troubleshooting

### Button Not Showing:
```
❌ Problem: View Details button not visible
✅ Solution: 
  - Check that data loaded (no empty table)
  - Verify "Actions" column header exists
  - Check browser console for errors
```

### Modal Not Opening:
```
❌ Problem: Modal doesn't open when button clicked
✅ Solution:
  - Verify DetailsModal import in data-table.tsx
  - Check isModalOpen state is toggling
  - Look for React errors in console
```

### Modal Data Not Loading:
```
❌ Problem: Modal shows loading spinner forever
✅ Solution:
  - Check if /api/property-waste-report endpoint exists
  - Verify API returns correct JSON format
  - Check Network tab in DevTools for API response
  - Look for CORS errors in console
```

### Export Not Working:
```
❌ Problem: Export button doesn't download file
✅ Solution:
  - Check browser allows downloads
  - Disable popup/download blockers
  - Check browser console for errors
  - Verify data is not empty before export
```

---

## 📊 Code Snippets

### Hook to Fetch Data:
```typescript
useEffect(() => {
  if (isOpen) {
    fetchDetails()
  }
}, [isOpen, filters])
```

### Generate CSV:
```typescript
const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
const link = document.createElement("a")
const url = URL.createObjectURL(blob)
link.setAttribute("href", url)
link.setAttribute("download", `property-details-${locationName}-${date}.csv`)
link.click()
```

### Format Numbers:
```typescript
Number.parseFloat(item.Organic_WasteAmount).toFixed(2)  // "405.61"
```

### Calculate Percentage:
```typescript
((item.TotalActiveProperty / item.TotalProperty) * 100).toFixed(0)  // "10%"
```

---

## 🎯 Performance Tips

- ✅ Modal opens only when button clicked (lazy loading)
- ✅ CSV generated client-side (no server load)
- ✅ Efficient state updates with proper dependencies
- ✅ Responsive design without heavy libraries

---

## 📝 Testing Checklist

- [ ] Button renders in table
- [ ] Modal opens on click
- [ ] API request sent with correct params
- [ ] Data loads and displays
- [ ] Totals calculated correctly
- [ ] Export generates valid CSV
- [ ] Modal closes properly
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Works in all browsers

---

## 🔄 Release Checklist

Before production:
- [ ] Frontend code reviewed
- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Testing completed
- [ ] Documentation reviewed
- [ ] Backend API implemented
- [ ] Integration tested
- [ ] Performance acceptable
- [ ] Deploy!

---

## 📚 Code Quality

- ✅ TypeScript types defined
- ✅ Error handling implemented
- ✅ Loading states managed
- ✅ Accessible UI (keyboard nav, ARIA)
- ✅ Responsive design
- ✅ DRY principles followed
- ✅ Comments added where needed

---

## 🎨 Styling Reference

### Colors Used:
```
Primary: emerald-500 to teal-600
Organic: green-50 / green-700
Inorganic: orange-50 / orange-700
Total: blue-50 / blue-700
Success: emerald-600
Error: red-700
Neutral: slate-50 to slate-800
```

### Responsive Classes:
```
max-w-4xl         // Modal width
overflow-y-auto   // Scrollable content
max-h-[80vh]      // Modal height limit
grid-cols-1 md:   // Responsive grid
flex flex-col sm:flex-row  // Responsive flex
```

---

## 🚀 Deployment Steps

1. **Build**: `npm run build`
2. **Test**: Manual testing in staging
3. **Deploy**: Push to production
4. **Monitor**: Check error logs for issues
5. **Rollback** (if needed): Remove component imports

---

## 💡 Pro Tips

1. **Debugging**: Use `console.log()` in fetchDetails()
2. **Testing**: Use Network tab to inspect API responses
3. **Styling**: Tailwind classes are self-documenting
4. **Performance**: Monitor API response times
5. **UX**: Ensure loading states are visible

---

## 🔗 Quick Links

```
Component: components/details-modal.tsx
Updated: components/data-table.tsx
Updated: app/page.tsx
Docs: BACKEND_CHECKLIST.md
```

---

**Status**: ✅ Frontend Complete | ⏳ Backend Needed

Ready to integrate! 🚀
