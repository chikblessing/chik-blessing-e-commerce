# 👤 Quick Reference: Filter Orders by User

## ✅ Yes! You Can Filter by Name, Email, and Phone

---

## ⚡ 3 Quick Methods

### Method 1: Use Search Bar (Fastest!)
```
Just type in the search bar:
- Customer name: "John Smith"
- Email: "john@example.com"  
- Phone: "+234 800 123 4567"
- Order number: "ORD-123"
```
**Searches across**: Order number, guest email, name, phone, transaction ID

---

### Method 2: Filter by Customer Account
```
Click "Filters" → "Add Filter"
Field: customer
Operator: equals
Value: [Select customer from list]
```
**Use for**: Finding all orders from a registered user

---

### Method 3: Filter by Guest Email
```
Click "Filters" → "Add Filter"
Field: guestEmail
Operator: equals or contains
Value: customer@example.com
```
**Use for**: Finding orders from guests (no account)

---

## 🎯 Common Scenarios

### Scenario 1: Customer Calls About Their Order
**Fastest way**: Type their email or phone in search bar

### Scenario 2: Find All Orders from One Customer
```
Filter: customer equals [Select customer]
```

### Scenario 3: Find Guest Orders
```
Filter: customer not_exists
```

### Scenario 4: Find Registered User Orders
```
Filter: customer exists
```

### Scenario 5: Find Orders by Email Domain
```
Filter: guestEmail contains "@company.com"
```

---

## 📋 Searchable Fields

The search bar searches these fields automatically:
- ✅ Order Number
- ✅ Guest Email
- ✅ Shipping Address Name
- ✅ Shipping Address Email
- ✅ Shipping Address Phone
- ✅ Transaction ID
- ✅ Payment Reference

---

## 🔍 Filter Options

### By Customer Account:
| Operator | Result |
|----------|--------|
| `equals` | Specific customer's orders |
| `exists` | All registered user orders |
| `not_exists` | All guest orders |

### By Email/Name/Phone:
| Operator | Result |
|----------|--------|
| `equals` | Exact match |
| `contains` | Partial match |
| `exists` | Has value |

---

## 💡 Pro Tips

1. **Quick Lookup**: Use search bar for fastest results
2. **Combine Filters**: Mix user + date + status filters
3. **Guest vs Registered**: Use `customer exists/not_exists`
4. **Partial Search**: Use `contains` operator for partial matches
5. **Export Results**: Apply filters, then export

---

## 🚀 Examples

### Find customer's orders this month:
```
Filter 1: customer equals [Select customer]
Filter 2: createdAt >= [First of month]
```

### Find unpaid orders from registered users:
```
Filter 1: customer exists
Filter 2: paymentStatus equals "pending"
```

### Find orders from Lagos:
```
Filter: shippingAddress.state equals "Lagos"
```

### Find orders with Gmail addresses:
```
Filter: guestEmail contains "@gmail.com"
```

---

## ✅ Summary

**Fastest Method**: Use the search bar!
- Type name, email, or phone
- Results appear instantly
- No need to select specific fields

**Most Precise**: Use filters
- Filter by customer account
- Filter by guest email
- Filter by shipping address fields

**Both methods work great** - choose based on your needs!
