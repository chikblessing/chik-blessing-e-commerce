# How to Filter Orders by Date - Step by Step Guide

## Yes! You Can Pick Specific Dates to Filter Orders

Payload CMS provides a built-in date picker for filtering. Here's exactly how to use it:

---

## 📅 Step-by-Step: Filter Orders by Specific Date

### Example 1: Find All Orders Created on a Specific Date

1. **Go to Orders Collection**
   - Navigate to: Admin Panel → Orders

2. **Open Filters**
   - Click the **"Filters"** button (usually at the top right of the list)

3. **Add a Date Filter**
   - Click **"Add Filter"**
   - From the dropdown, select **"Created At"**

4. **Choose Filter Operator**
   - Select operator: **"equals"** (for exact date match)
   - Or use **"greater_than_equal"** and **"less_than"** for date ranges

5. **Pick Your Date**
   - A date picker will appear
   - Click on the calendar icon
   - Select your specific date (e.g., December 15, 2024)
   - Click **"Apply"**

6. **View Results**
   - The list will now show only orders from that specific date

---

## 🎯 Common Filtering Scenarios

### Scenario 1: Orders from a Specific Day
```
Filter: createdAt
Operator: equals
Date: [Pick your date from calendar]
```

### Scenario 2: Orders After a Specific Date
```
Filter: createdAt
Operator: greater_than
Date: [Pick your date from calendar]
```

### Scenario 3: Orders Before a Specific Date
```
Filter: createdAt
Operator: less_than
Date: [Pick your date from calendar]
```

### Scenario 4: Orders Between Two Dates (Date Range)
```
Filter 1: createdAt
Operator: greater_than_equal
Date: [Start date - e.g., Dec 1, 2024]

AND

Filter 2: createdAt
Operator: less_than_equal
Date: [End date - e.g., Dec 31, 2024]
```

### Scenario 5: Orders Paid on a Specific Date
```
Filter: paidAt
Operator: equals
Date: [Pick your date from calendar]
```

### Scenario 6: Orders Shipped on a Specific Date
```
Filter: delivery.shippedAt
Operator: equals
Date: [Pick your date from calendar]
```

### Scenario 7: Orders Expected to Deliver on a Specific Date
```
Filter: delivery.expectedDeliveryDate
Operator: equals
Date: [Pick your date from calendar]
```

---

## 🔍 Available Date Filter Operators

When you add a date filter, you can choose from these operators:

| Operator | Description | Use Case |
|----------|-------------|----------|
| **equals** | Exact date match | Find orders on Dec 15, 2024 |
| **not_equals** | Exclude specific date | Exclude orders from Dec 25, 2024 |
| **greater_than** | After this date | Orders after Jan 1, 2024 |
| **greater_than_equal** | On or after this date | Orders from Jan 1, 2024 onwards |
| **less_than** | Before this date | Orders before Dec 31, 2024 |
| **less_than_equal** | On or before this date | Orders up to Dec 31, 2024 |
| **exists** | Has a date value | Orders that have been paid |
| **not_exists** | No date value | Orders not yet shipped |

---

## 📊 Practical Examples

### Example A: Find Today's Orders
1. Add Filter → **createdAt**
2. Operator → **greater_than_equal**
3. Date → **[Today's date at 00:00]**
4. Apply

### Example B: Find Last Week's Orders
1. Add Filter → **createdAt**
2. Operator → **greater_than_equal**
3. Date → **[7 days ago]**
4. Apply

### Example C: Find Orders Paid Yesterday
1. Add Filter → **paidAt**
2. Operator → **equals**
3. Date → **[Yesterday's date]**
4. Apply

### Example D: Find Overdue Deliveries
1. Add Filter → **delivery.expectedDeliveryDate**
2. Operator → **less_than**
3. Date → **[Today]**
4. Add another filter → **status**
5. Operator → **not_equals**
6. Value → **delivered**
7. Apply

### Example E: Find Orders Shipped This Month
1. Add Filter → **delivery.shippedAt**
2. Operator → **greater_than_equal**
3. Date → **[First day of current month]**
4. Add another filter → **delivery.shippedAt**
5. Operator → **less_than**
6. Date → **[First day of next month]**
7. Apply

---

## 🎨 Date Picker Features

The date picker includes:
- ✅ **Calendar view** - Click to select any date
- ✅ **Month/Year navigation** - Quickly jump to different months
- ✅ **Time selection** - For fields with time (like paidAt, shippedAt)
- ✅ **Today button** - Quick select today's date
- ✅ **Clear button** - Remove selected date
- ✅ **Keyboard input** - Type date directly

---

## 💡 Pro Tips

### Tip 1: Combine Multiple Date Filters
You can add multiple date filters to create complex queries:
```
createdAt >= Dec 1, 2024
AND
createdAt <= Dec 31, 2024
AND
paymentStatus = paid
```

### Tip 2: Save Common Filters
If you frequently use certain date filters, consider:
- Bookmarking the filtered URL
- Creating custom views (if available in your Payload version)

### Tip 3: Use "exists" for Quick Checks
```
Filter: paidAt exists
Result: All paid orders (regardless of date)

Filter: delivery.shippedAt not_exists
Result: All orders not yet shipped
```

### Tip 4: Date Range for Reports
For monthly reports:
```
Filter 1: createdAt >= [First day of month]
Filter 2: createdAt < [First day of next month]
```

### Tip 5: Find Pending Actions
```
Filter 1: delivery.expectedDeliveryDate < [Today]
Filter 2: delivery.actualDeliveryDate not_exists
Result: Orders that should have been delivered but haven't
```

---

## 📱 Date Fields Available for Filtering

| Field Name | Description | Time Included? |
|------------|-------------|----------------|
| **createdAt** | Order creation date | Yes (auto) |
| **updatedAt** | Last modification date | Yes (auto) |
| **paidAt** | Payment confirmation | Yes |
| **delivery.shippedAt** | Shipping date | Yes |
| **delivery.expectedDeliveryDate** | Expected delivery | No (day only) |
| **delivery.actualDeliveryDate** | Actual delivery | Yes |
| **cancelledAt** | Cancellation date | Yes |

---

## 🚀 Quick Reference

**To filter by a specific date:**
1. Click "Filters"
2. Click "Add Filter"
3. Select date field
4. Choose "equals" operator
5. Pick date from calendar
6. Click "Apply"

**To filter by date range:**
1. Add first filter with "greater_than_equal"
2. Add second filter with "less_than_equal"
3. Both filters will work together (AND logic)

**To clear filters:**
- Click the "X" next to each filter
- Or click "Clear All Filters"

---

## ❓ Troubleshooting

**Q: I don't see the date picker**
- Make sure you've selected a date field (not text or number)
- Check that you're using a compatible browser

**Q: The filter isn't working**
- Verify the operator is correct
- Check that the date format is valid
- Try using "exists" to see if the field has any data

**Q: Can I filter by time as well?**
- Yes! Fields like `paidAt`, `shippedAt`, and `actualDeliveryDate` include time
- Use "greater_than" or "less_than" for time-specific filtering

**Q: How do I export filtered results?**
- After applying filters, use the export function (if available)
- Or copy the filtered URL to share with team members

---

## 🎓 Advanced: API Date Filtering

For developers, you can also filter via API:

```typescript
// Find orders from a specific date
const orders = await payload.find({
  collection: 'orders',
  where: {
    createdAt: {
      equals: '2024-12-15',
    },
  },
})

// Find orders in date range
const orders = await payload.find({
  collection: 'orders',
  where: {
    and: [
      {
        createdAt: {
          greater_than_equal: '2024-12-01T00:00:00.000Z',
        },
      },
      {
        createdAt: {
          less_than: '2025-01-01T00:00:00.000Z',
        },
      },
    ],
  },
})
```

---

## ✅ Summary

**Yes, you can absolutely pick specific dates to filter orders!**

The date picker is built into Payload CMS and works seamlessly with all date fields. Simply:
1. Open Filters
2. Select a date field
3. Choose your operator
4. Pick your date from the calendar
5. Apply

Happy filtering! 🎉
