# Order Date Filtering Guide

## Overview
The Orders collection now has comprehensive date filtering capabilities in the Payload Admin panel. You can filter orders by various date fields to track order lifecycle and performance.

## Available Date Fields for Filtering

### 1. **Created At** (createdAt)
- **Description**: When the order was initially created
- **Use Case**: Find orders placed on specific dates or date ranges
- **Auto-populated**: Yes (by Payload on creation)

### 2. **Paid At** (paidAt)
- **Description**: When payment was confirmed
- **Use Case**: Track payment processing times, reconcile payments
- **Auto-populated**: Yes (when payment status changes to "paid")

### 3. **Shipped At** (delivery.shippedAt)
- **Description**: When the order was shipped
- **Use Case**: Track fulfillment speed, shipping performance
- **Auto-populated**: Yes (when order status changes to "shipped")

### 4. **Expected Delivery Date** (delivery.expectedDeliveryDate)
- **Description**: Estimated delivery date for the customer
- **Use Case**: Track upcoming deliveries, manage customer expectations
- **Auto-populated**: No (set manually or via shipping calculation)

### 5. **Actual Delivery Date** (delivery.actualDeliveryDate)
- **Description**: Confirmed delivery date
- **Use Case**: Track delivery accuracy, calculate actual delivery times
- **Auto-populated**: Yes (when order status changes to "delivered")

### 6. **Cancelled At** (cancelledAt)
- **Description**: When the order was cancelled
- **Use Case**: Track cancellation patterns, analyze cancellation reasons
- **Auto-populated**: Yes (when order status changes to "cancelled")

## How to Use Date Filters in Payload Admin

### Basic Filtering

1. **Navigate to Orders Collection**
   - Go to Admin Panel → Orders

2. **Open Filters Panel**
   - Click the "Filters" button at the top of the list

3. **Add Date Filter**
   - Click "Add Filter"
   - Select a date field (e.g., "Created At", "Paid At", etc.)
   - Choose an operator:
     - `equals` - Exact date match
     - `not_equals` - Exclude specific date
     - `greater_than` - After this date
     - `greater_than_equal` - On or after this date
     - `less_than` - Before this date
     - `less_than_equal` - On or before this date
     - `exists` - Has a value
     - `not_exists` - Is empty/null

4. **Select Date**
   - Use the date picker to select your date
   - Click "Apply" to filter

### Common Use Cases

#### Find Today's Orders
```
Filter: createdAt
Operator: greater_than_equal
Value: [Today's date at 00:00]
```

#### Find Orders Awaiting Shipment (Paid but Not Shipped)
```
Filter 1: paymentStatus equals "paid"
Filter 2: delivery.shippedAt not_exists
```

#### Find Overdue Deliveries
```
Filter 1: delivery.expectedDeliveryDate less_than [Today]
Filter 2: status not_equals "delivered"
Filter 3: status not_equals "cancelled"
```

#### Find Orders from Last Week
```
Filter 1: createdAt greater_than_equal [7 days ago]
Filter 2: createdAt less_than_equal [Today]
```

#### Find Orders Paid in a Specific Month
```
Filter 1: paidAt greater_than_equal [First day of month]
Filter 2: paidAt less_than [First day of next month]
```

## Automatic Date Population

The system automatically sets these dates when status changes:

| Status Change | Auto-populated Field | Timestamp |
|--------------|---------------------|-----------|
| Payment Status → "paid" | `paidAt` | Current date/time |
| Order Status → "shipped" | `delivery.shippedAt` | Current date/time |
| Order Status → "delivered" | `delivery.actualDeliveryDate` | Current date/time |
| Order Status → "cancelled" | `cancelledAt` | Current date/time |

## Default Columns in List View

The orders list now displays:
- Order Number
- Customer
- Guest Email
- Total
- Status
- Created At
- Expected Delivery Date

## Searchable Fields

You can also search orders by:
- Order Number
- Guest Email
- Transaction ID
- Payment Reference
- Tracking Number

## Tips for Better Date Management

1. **Set Expected Delivery Dates**: When marking orders as "shipped", always set the expected delivery date for customer communication

2. **Track Fulfillment Speed**: Use the difference between `createdAt` and `delivery.shippedAt` to measure fulfillment performance

3. **Monitor Delivery Accuracy**: Compare `delivery.expectedDeliveryDate` with `delivery.actualDeliveryDate` to track carrier performance

4. **Analyze Cancellations**: Use `cancelledAt` filters to identify patterns in order cancellations

5. **Payment Reconciliation**: Use `paidAt` filters to match orders with payment gateway reports

## API Usage (For Developers)

You can also filter orders by date via the API:

```typescript
// Find orders created today
const orders = await payload.find({
  collection: 'orders',
  where: {
    createdAt: {
      greater_than_equal: new Date().setHours(0, 0, 0, 0),
    },
  },
})

// Find orders shipped in the last 7 days
const recentShipments = await payload.find({
  collection: 'orders',
  where: {
    'delivery.shippedAt': {
      greater_than_equal: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  },
})

// Find overdue deliveries
const overdueOrders = await payload.find({
  collection: 'orders',
  where: {
    and: [
      {
        'delivery.expectedDeliveryDate': {
          less_than: new Date(),
        },
      },
      {
        status: {
          not_equals: 'delivered',
        },
      },
      {
        status: {
          not_equals: 'cancelled',
        },
      },
    ],
  },
})
```

## Performance Notes

All date fields are indexed for fast filtering and sorting. This means:
- ✅ Fast queries even with thousands of orders
- ✅ Efficient date range searches
- ✅ Quick sorting by date fields

## Need Help?

If you need to add custom date filters or modify the date handling logic, check:
- `src/collections/Orders.ts` - Collection configuration
- The `snapshotProductData` hook - Automatic date population logic
