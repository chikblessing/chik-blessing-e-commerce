# Admin Guide: Managing Pay on Pickup (POP) Orders

## How Admins Retrieve POP Order Information

### 1. Access the Admin Panel

Navigate to: `https://yourdomain.com/admin`

### 2. View All Orders

- Click on **"Orders"** in the admin sidebar
- You'll see a list of all orders with these columns:
  - Order Number
  - Customer
  - Total
  - Status
  - Expected Delivery Date

### 3. Identify POP Orders

POP orders have these characteristics:

- **Shipping Method**: `pickup` (Store Pickup)
- **Payment Method**: `cash`
- **Payment Status**: `pending` (until customer pays at pickup)
- **Shipping Fee**: ₦0

### 4. Filter POP Orders

You can filter orders by:

```
Shipping Method = "Store Pickup"
Payment Status = "Pending"
```

### 5. View Individual POP Order Details

Click on any order to see complete information:

#### Customer Contact Information

- Name
- Phone Number
- Email Address

#### Order Items

- Product names
- Product images
- Quantities
- Prices
- SKUs

#### Payment Information

- Payment Method: Cash
- Payment Status: Pending
- Total Amount: ₦X,XXX

#### Important Notes

- **No shipping address** (customer will pick up)
- Contact info is in the `shippingAddress.name` field
- Phone and email for customer communication

## Admin Workflow for POP Orders

### Step 1: New POP Order Arrives

1. Order appears in admin panel with status "Pending"
2. Payment status shows "Pending"
3. Shipping method shows "Store Pickup"

### Step 2: Review Order Details

1. Click on the order
2. Check customer contact information
3. Verify items and quantities
4. Note the total amount to collect

### Step 3: Contact Customer

Send pickup notification with:

- Order number
- Store address
- Available pickup times
- Items to collect
- Total amount to pay

### Step 4: Prepare Order

1. Update order status to "Processing"
2. Gather items from inventory
3. Package order with order number label
4. Place in pickup area

### Step 5: Customer Arrives

1. Verify customer identity
2. Show items
3. Collect payment (cash)
4. Update order:
   - Payment Status: "Paid"
   - Status: "Delivered"
   - Add payment reference/receipt number
   - Set `paidAt` date

### Step 6: Complete Order

1. Mark order as "Delivered"
2. Update inventory if needed
3. File receipt/documentation

## Key Fields for POP Orders

### Required Information

- `customer`: Customer ID (relationship)
- `shippingAddress.name`: Customer name
- `shippingAddress.phone`: Contact phone (if added)
- `shippingAddress.email`: Contact email (if added)
- `items`: Products to prepare
- `total`: Amount to collect
- `orderNumber`: Reference number

### Status Tracking

- **Pending**: Order placed, awaiting preparation
- **Processing**: Items being prepared
- **Delivered**: Customer picked up and paid

### Payment Tracking

- **Payment Method**: `cash`
- **Payment Status**: `pending` → `paid`
- **Payment Reference**: Receipt/transaction number
- **Paid At**: Date/time of payment

## Recommended Enhancements

### 1. Add Phone Field to Shipping Address

Currently, phone is in the form but may not be saved to `shippingAddress`.
Consider adding:

```typescript
{ name: 'phone', type: 'text', required: true }
```

to the `shippingAddress` group in Orders collection.

### 2. Add Pickup Notes Field

```typescript
{
  name: 'pickupNotes',
  type: 'textarea',
  admin: {
    description: 'Special instructions for pickup',
    condition: (data) => data.shippingMethod === 'pickup'
  }
}
```

### 3. Add Pickup Time Slot

```typescript
{
  name: 'pickupTimeSlot',
  type: 'select',
  options: [
    { label: '9:00 AM - 12:00 PM', value: 'morning' },
    { label: '12:00 PM - 3:00 PM', value: 'afternoon' },
    { label: '3:00 PM - 6:00 PM', value: 'evening' }
  ],
  admin: {
    condition: (data) => data.shippingMethod === 'pickup'
  }
}
```

### 4. Add Pickup Confirmation

```typescript
{
  name: 'pickupConfirmed',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    description: 'Customer confirmed pickup time',
    condition: (data) => data.shippingMethod === 'pickup'
  }
}
```

## Quick Reference

### Finding POP Orders

**Admin Panel → Orders → Filter:**

- Shipping Method = "Store Pickup"
- Payment Status = "Pending"

### Customer Contact Info Location

- Name: `shippingAddress.name`
- Email: `shippingAddress.email` (or from customer relationship)
- Phone: `shippingAddress.phone` (if added)

### Order Status Flow

```
Pending → Processing → Delivered
```

### Payment Status Flow

```
Pending → Paid
```

## Tips for Efficient Management

1. **Daily Pickup List**: Create a view of all pending pickup orders
2. **SMS Notifications**: Send pickup ready notifications
3. **Pickup Area**: Designate specific area for pickup orders
4. **Label System**: Print order numbers on packages
5. **Payment Receipts**: Issue receipts when collecting payment
6. **Inventory Updates**: Update stock after pickup completion
