# How to Filter Orders by User (Name, Email, Phone)

## ✅ Yes! Admins Can Filter Orders by User Information

You can filter orders by customer details in multiple ways. Here's your complete guide:

---

## 🎯 Three Ways to Filter by User

### Method 1: Filter by Customer Account (Relationship)
For orders placed by logged-in users

### Method 2: Filter by Guest Email
For orders placed by guests (no account)

### Method 3: Search by Customer Details
Search by name, email, or phone in shipping address

---

## 📋 Method 1: Filter by Customer Account

### Step-by-Step:

1. **Go to Orders** in Payload Admin
2. **Click "Filters"** button
3. **Click "Add Filter"**
4. **Select "Customer"** from dropdown
5. **Choose operator**:
   - `equals` - Specific customer
   - `exists` - All orders with customer accounts
   - `not_exists` - All guest orders
6. **Select customer** from the relationship picker
7. **Click "Apply"**

### Use Cases:

**Find all orders from a specific customer:**
```
Filter: customer
Operator: equals
Value: [Select customer from list]
```

**Find all orders from registered users:**
```
Filter: customer
Operator: exists
```

**Find all guest orders (no account):**
```
Filter: customer
Operator: not_exists
```

---

## 📧 Method 2: Filter by Guest Email

### Step-by-Step:

1. **Go to Orders** in Payload Admin
2. **Click "Filters"** button
3. **Click "Add Filter"**
4. **Select "Guest Email"** from dropdown
5. **Choose operator**:
   - `equals` - Exact email match
   - `contains` - Partial email match
   - `exists` - Has guest email
6. **Enter email** (or partial email)
7. **Click "Apply"**

### Use Cases:

**Find orders from specific guest email:**
```
Filter: guestEmail
Operator: equals
Value: customer@example.com
```

**Find orders with emails containing "@gmail.com":**
```
Filter: guestEmail
Operator: contains
Value: @gmail.com
```

**Find all guest orders:**
```
Filter: guestEmail
Operator: exists
```

---

## 🔍 Method 3: Search by Customer Details

The search bar at the top of the Orders list searches across:
- ✅ Order Number
- ✅ Guest Email
- ✅ Transaction ID
- ✅ Payment Reference
- ✅ **Shipping Address Name**
- ✅ **Shipping Address Email**
- ✅ **Shipping Address Phone**

### How to Use:

1. **Go to Orders** in Payload Admin
2. **Use the search bar** at the top
3. **Type any of these**:
   - Customer name (e.g., "John Smith")
   - Email address (e.g., "john@example.com")
   - Phone number (e.g., "+234 800 123 4567")
   - Order number
   - Transaction ID

4. **Press Enter** or click search icon
5. Results appear instantly

### Examples:

**Search by name:**
```
Search: "John Smith"
Results: All orders with "John Smith" in shipping address
```

**Search by email:**
```
Search: "john@example.com"
Results: Orders with this email (guest or shipping address)
```

**Search by phone:**
```
Search: "+234 800 123 4567"
Results: Orders with this phone number
```

**Search by partial name:**
```
Search: "John"
Results: All orders with "John" in the name
```

---

## 🎨 Advanced Filtering Combinations

### Example 1: Find Orders from Specific Customer in Date Range
```
Filter 1: customer equals [Select customer]
Filter 2: createdAt >= [Start date]
Filter 3: createdAt <= [End date]
```

### Example 2: Find Unpaid Orders from Registered Users
```
Filter 1: customer exists
Filter 2: paymentStatus equals "pending"
```

### Example 3: Find Guest Orders Over $100
```
Filter 1: customer not_exists
Filter 2: total greater_than 100
```

### Example 4: Find Orders from Specific Email Domain
```
Filter 1: guestEmail contains "@company.com"
```

### Example 5: Find Customer's Cancelled Orders
```
Filter 1: customer equals [Select customer]
Filter 2: status equals "cancelled"
```

---

## 📊 Filter by Shipping Address Fields

You can also filter by specific shipping address fields:

### Filter by Shipping Name:
```
Filter: shippingAddress.name
Operator: contains
Value: "John"
```

### Filter by Shipping Email:
```
Filter: shippingAddress.email
Operator: equals
Value: "customer@example.com"
```

### Filter by Shipping Phone:
```
Filter: shippingAddress.phone
Operator: contains
Value: "+234"
```

### Filter by City:
```
Filter: shippingAddress.city
Operator: equals
Value: "Lagos"
```

### Filter by State:
```
Filter: shippingAddress.state
Operator: equals
Value: "Lagos"
```

---

## 🔧 Available Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| **equals** | Exact match | Email equals "john@example.com" |
| **not_equals** | Exclude | Customer not_equals [specific user] |
| **contains** | Partial match | Name contains "John" |
| **in** | Match any in list | Status in ["pending", "processing"] |
| **not_in** | Exclude list | Status not_in ["cancelled", "refunded"] |
| **exists** | Has a value | Customer exists (registered users) |
| **not_exists** | Empty/null | Customer not_exists (guest orders) |

---

## 💡 Pro Tips

### Tip 1: Combine Customer and Date Filters
```
Filter 1: customer equals [Select customer]
Filter 2: createdAt >= [This month]
Result: All orders from this customer this month
```

### Tip 2: Find Repeat Customers
```
Filter 1: customer exists
Filter 2: Sort by customer
Result: See which customers order most frequently
```

### Tip 3: Track Guest vs Registered Orders
```
For Registered: customer exists
For Guests: customer not_exists
```

### Tip 4: Search Across All Fields
Use the search bar for quick lookups:
- Type customer name, email, or phone
- No need to select specific field
- Searches across all indexed fields

### Tip 5: Export Filtered Results
After filtering:
1. Apply your filters
2. Use export function (if available)
3. Or copy the filtered URL to share

---

## 📱 Quick Reference Table

| What You Want | How to Filter |
|---------------|---------------|
| **Specific customer's orders** | Filter: customer equals [Select user] |
| **All registered user orders** | Filter: customer exists |
| **All guest orders** | Filter: customer not_exists |
| **Orders from email** | Search: "email@example.com" |
| **Orders from name** | Search: "Customer Name" |
| **Orders from phone** | Search: "+234 800 123 4567" |
| **Orders from city** | Filter: shippingAddress.city equals "Lagos" |
| **Orders from state** | Filter: shippingAddress.state equals "Lagos" |

---

## 🚀 Common Use Cases

### Use Case 1: Customer Service Lookup
**Scenario**: Customer calls asking about their order

**Solution**:
1. Search by their email or phone
2. Or filter by customer account
3. View all their orders instantly

### Use Case 2: VIP Customer Analysis
**Scenario**: Find all orders from VIP customers

**Solution**:
1. Filter: customer equals [VIP customer]
2. Add date range if needed
3. Analyze order patterns

### Use Case 3: Guest Order Follow-up
**Scenario**: Follow up with guests to create accounts

**Solution**:
1. Filter: customer not_exists
2. Filter: paymentStatus equals "paid"
3. Export list for email campaign

### Use Case 4: Regional Analysis
**Scenario**: Analyze orders by location

**Solution**:
1. Filter: shippingAddress.state equals "Lagos"
2. Add date range
3. View regional performance

### Use Case 5: Customer Retention
**Scenario**: Find customers who haven't ordered recently

**Solution**:
1. Filter: customer exists
2. Filter: createdAt less_than [3 months ago]
3. Identify customers to re-engage

---

## 🎓 Advanced: API Filtering by User

For developers, you can filter via API:

```typescript
// Find orders from specific customer
const orders = await payload.find({
  collection: 'orders',
  where: {
    customer: {
      equals: 'customer-id-here',
    },
  },
})

// Find orders by guest email
const guestOrders = await payload.find({
  collection: 'orders',
  where: {
    guestEmail: {
      equals: 'guest@example.com',
    },
  },
})

// Find orders by shipping name
const ordersByName = await payload.find({
  collection: 'orders',
  where: {
    'shippingAddress.name': {
      contains: 'John',
    },
  },
})

// Find registered user orders
const registeredOrders = await payload.find({
  collection: 'orders',
  where: {
    customer: {
      exists: true,
    },
  },
})

// Find guest orders
const guestOnlyOrders = await payload.find({
  collection: 'orders',
  where: {
    customer: {
      exists: false,
    },
  },
})
```

---

## ✅ Summary

**Yes, admins can filter orders by user in multiple ways:**

1. ✅ **By Customer Account** - Filter by relationship to Users collection
2. ✅ **By Guest Email** - Filter guest orders by email
3. ✅ **By Search** - Search by name, email, or phone across all orders
4. ✅ **By Shipping Address** - Filter by any shipping address field
5. ✅ **Combine Filters** - Mix user filters with date, status, payment filters

**Quickest Method**: Use the search bar and type the customer's name, email, or phone!

---

## ❓ Troubleshooting

**Q: I can't find a customer's orders**
- Try searching by email or phone instead of name
- Check if they ordered as a guest (no customer account)
- Verify spelling of name/email

**Q: How do I see all orders from one customer?**
- Filter: customer equals [Select customer]
- Or search by their email

**Q: How do I distinguish guest vs registered orders?**
- Guest orders: customer field is empty
- Registered orders: customer field has a user

**Q: Can I filter by customer's phone number?**
- Yes! Use the search bar or filter by shippingAddress.phone

**Q: How do I export customer order data?**
- Apply your filters
- Use the export function (if available in your Payload version)

---

## 🎉 You're All Set!

You now have multiple ways to filter orders by user information. Use whichever method works best for your workflow!
