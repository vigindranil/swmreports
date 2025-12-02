# Quick Start Guide - View Details Feature

## 🎯 What's New

Your waste report dashboard now has a **View Details** feature that allows users to drill down into property-type-wise waste collection data.

## 🚀 How to Use

### Step 1: Select Filters
1. Expand the "Filter Options" panel
2. Select your desired filters:
   - Month
   - Year
   - District (optional, but required to see blocks)
   - Block (optional, but required to see GPs)
   - Gram Panchayat (optional)

### Step 2: Fetch Report
1. Click the **"Fetch Report"** button
2. Wait for the main data table to load

### Step 3: View Details
1. In the data table, each row now has an **"Actions"** column
2. Click the **"View Details"** button (with eye icon)
3. A modal will open showing:
   - All property types in that location (House, Shop, Office, School, etc.)
   - Organic waste amount for each property type
   - Inorganic waste amount for each property type
   - Total waste for each property type
   - Number of total properties
   - Number of active properties
   - Percentage of active properties

### Step 4: Export Details (Optional)
1. Inside the modal, click **"Export to Excel"**
2. A CSV file will be downloaded with the property details
3. Filename format: `property-details-{location-name}-{date}.csv`

## 📊 What Data You'll See

The details modal shows a table with:

| Column | Description |
|--------|-------------|
| Property Type | Name of property type (House, Shop, etc.) |
| Organic Waste | Waste amount in kg from biodegradable sources |
| Inorganic Waste | Waste amount in kg from non-biodegradable sources |
| Total Waste | Sum of organic + inorganic waste |
| Total Properties | Number of properties of this type |
| Active Properties | Number of actively reporting properties (with %) |

The bottom row shows totals across all property types.

## 🔄 Hierarchical Navigation

The feature works at different levels depending on your filter selection:

### District Level
- Main table: Shows **Block-wise** data
- View Details: Shows **Property-type breakdown** for that block

### Block Level
- Main table: Shows **GP-wise** data
- View Details: Shows **Property-type breakdown** for that GP

### GP Level
- Main table: Shows **Individual location** data
- View Details: Shows **Property-type breakdown** for that location

## 📁 Files Involved

**New Files:**
- `components/details-modal.tsx` - The modal component

**Modified Files:**
- `components/data-table.tsx` - Added View Details button
- `app/page.tsx` - Passes filters to data table

## 🔌 API Endpoint

The feature uses a new API endpoint:
```
GET /api/property-waste-report
```

**Required Query Parameters:**
- `month` - Month name (e.g., "August")
- `year` - Year as number (e.g., 2025)
- `stateID` - State ID
- `districtID` - District ID
- `blockID` - Block ID
- `gpID` - GP ID
- `level` - Collection level

## ⚙️ Configuration Notes

- The modal opens on the same filters used in the main table
- API calls are made only when "View Details" button is clicked
- Data is cached within the modal until closed
- No additional backend setup required if the API endpoint exists

## 🐛 Troubleshooting

### Modal doesn't open
- Ensure you've clicked "Fetch Report" first
- Check browser console for errors
- Verify the API endpoint exists

### No data in modal
- Confirm the location has property data for the selected period
- Check if `/api/property-waste-report` is returning data
- Verify filters match the API requirements

### Export doesn't work
- Check if your browser allows file downloads
- Verify pop-up/download blocking is disabled
- Check browser console for errors

### Button not visible
- Ensure data has loaded in the main table
- Look for the "Actions" column on the right
- The "View Details" button should have an eye icon

## 💡 Tips

1. **Export for Reporting**: Export the details before the modal closes so you have a record
2. **Check Percentages**: The percentage shows what % of properties actively reported waste
3. **Cross-Check Totals**: The footer total should match the sum of all rows
4. **Date in Filename**: The export filename includes today's date for organization

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12 → Console tab)
2. Verify the API endpoint is accessible
3. Ensure you have the latest version of the code
4. Check that all required filter values are selected

## 🎨 UI/UX Features

- **Color Coding**: Different colors for different waste types
- **Loading Indicator**: Spinner while data is being fetched
- **Error Messages**: Clear error messages if something goes wrong
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: Keyboard navigation and screen reader support

---

**Last Updated:** December 2, 2025
**Version:** 1.0
