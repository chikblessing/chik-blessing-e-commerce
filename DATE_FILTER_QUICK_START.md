# 📅 Quick Start: Filter Orders by Date

## Yes! You Can Pick Specific Dates

The date picker is already built-in and ready to use. Here's the fastest way to filter:

---

## ⚡ 3-Step Quick Filter

### Step 1: Click "Filters" Button
Located at the top of the Orders list

### Step 2: Add Date Filter
```
Click "Add Filter" → Select "Created At" (or any date field)
```

### Step 3: Pick Your Date
```
Choose operator: "equals"
Click calendar icon → Select date → Apply
```

**Done!** Your orders are now filtered by that specific date.

---

## 🎯 Most Common Filters

### Filter 1: Today's Orders
```
Field: createdAt
Operator: greater_than_equal
Date: [Today at 00:00]
```

### Filter 2: Specific Date
```
Field: createdAt
Operator: equals
Date: [Pick from calendar - e.g., Dec 15, 2024]
```

### Filter 3: Date Range (e.g., This Month)
```
Filter 1: createdAt >= [Dec 1, 2024]
Filter 2: createdAt <= [Dec 31, 2024]
```

### Filter 4: Orders Paid Today
```
Field: paidAt
Operator: equals
Date: [Today]
```

### Filter 5: Orders Shipped Yesterday
```
Field: delivery.shippedAt
Operator: equals
Date: [Yesterday]
```

---

## 📋 Available Date Fields

Click "Add Filter" and you'll see these date options:

| Field | What It Filters |
|-------|----------------|
| **Created At** | When order was placed |
| **Updated At** | Last modification date |
| **Paid At** | When payment was confirmed |
| **Shipped At** | When order was shipped |
| **Expected Delivery Date** | Estimated delivery |
| **Actual Delivery Date** | Confirmed delivery |
| **Cancelled At** | When order was cancelled |

---

## 🔧 Filter Operators Explained

| Operator | Meaning | Example |
|----------|---------|---------|
| **equals** | Exact match | Orders on Dec 15 |
| **greater_than** | After date | Orders after Dec 15 |
| **less_than** | Before date | Orders before Dec 15 |
| **greater_than_equal** | On or after | Orders from Dec 15 onwards |
| **less_than_equal** | On or before | Orders up to Dec 15 |
| **exists** | Has a value | Orders that have been paid |
| **not_exists** | Empty/null | Orders not yet shipped |

---

## 💡 Pro Tips

1. **Combine filters** - Add multiple date filters for date ranges
2. **Use "exists"** - Quick way to find orders with/without dates
3. **Save the URL** - Bookmark frequently used filters
4. **Clear filters** - Click X next to each filter to remove

---

## 🎨 What You'll See

When you click "Add Filter" → Select a date field:

1. **Operator dropdown** appears (equals, greater_than, etc.)
2. **Date picker** appears (calendar icon)
3. Click calendar → **Pick your date**
4. Click **"Apply"**
5. List updates with filtered results

---

## ✅ That's It!

The date picker is fully functional and ready to use. Just:
- Click Filters
- Select date field
- Pick your date
- Apply

**No additional setup needed!** 🎉

---

## 📞 Need Help?

Common questions:

**Q: Can I filter by time too?**
✅ Yes! Fields like "Paid At" and "Shipped At" include time

**Q: Can I filter by date range?**
✅ Yes! Add two filters (one for start, one for end date)

**Q: Can I save my filters?**
✅ Bookmark the URL after applying filters

**Q: How do I clear filters?**
✅ Click the X next to each filter or "Clear All"
