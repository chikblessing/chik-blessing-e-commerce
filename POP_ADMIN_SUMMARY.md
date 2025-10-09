# Pay on Pickup (POP) - Admin Information Retrieval

## How Admins Access POP Order Information

### 1. Admin Panel Access

**URL**: `https://yourdomain.com/admin/collections/orders`

### 2. Identifying POP Orders

POP orders have these distinct characteristics:

- **Shipping Method**: `pickup` (Store Pickup)
- **Payment Method**: `cash`
- **Payment Status**: `pending`
- **Shipping Cost**: ₦0

### 3. Filtering POP Orders

In the admin panel, you can filter by:

- Shipping Method = "Store Pickup"
- Payment Status = "Pending"
- Status = "Pending" or "Processing"

### 4. Customer Contact Information

For each POP order, admins can see:

#### In the Order List View:

- Order Number (e.g., ORD-1234567890-ABC)
- Customer Name
- Total Amount
- Status

#### In the Order Detail View:

**Contact Information** (in Shipping Address section):

- **Name**: Customer's full name
- **Phone**: Customer's phone number
- **Email**: Customer's email address
- Street: "N/A - Pickup Order" (not needed for pickup)
- City, State, Country: Basic location info

**Order Items**:

- Product names and images
- Quantities
- Individual prices
- SKUs

**Payment Details**:

- Payment Method: Cash
- Payment Status: Pending
- Total to Collect: ₦X,XXX

## Admin Workflow

### When a POP Order is Placed:

1. **Order Appears in Admin Panel**
   - Status: "Pending"
   - Payment Status: "Pending"
   - Shipping Method: "Store Pickup"

2. **Admin Reviews Order**
   - Click on order number
   - View customer contact info (name, phone, email)
   - Check items and quantities
   - Note total amount to collect

3. **Admin Contacts Customer**
   Send email/SMS with:
   - Order number
   - Store address and directions
   - Available pickup times
   - List of items
   - Total amount to pay (cash)
   - Any special instructions

4. **Admin Prepares Order**
   - Update status to "Processing"
   - Gather items from inventory
   - Package with order number label
   - Place in designated pickup area

5. **Customer Arrives at Store**
   - Verify customer identity (ID or order number)
   - Show items to customer
   - Collect cash payment
   - Issue receipt

6. **Admin Completes Order**
   - Update Payment Status to "Paid"
   - Update Status to "Delivered"
   - Add payment reference (receipt number)
   - Set "Paid At" date
   - Update inventory

## Key Information Fields

### Always Available for POP Orders:

```
Order Number: ORD-1234567890-ABC
Customer Name: John Doe
Phone: +234 800 000 0000
Email: john@example.com
Items: [Product list with quantities]
Total: ₦15,000
Payment Method: Cash
Shipping Method: Store Pickup
```

### Status Progression:

```
Pending → Processing → Delivered
```

### Payment Status Progression:

```
Pending → Paid
```

## Quick Actions for Admins

### To Find Today's Pickups:

1. Go to Orders
2. Filter: Shipping Method = "Store Pickup"
3. Filter: Status = "Processing"
4. Sort by: Created Date (newest first)

### To Contact Customer:

- Phone: Click phone number in order details
- Email: Click email address to send message
- SMS: Use phone number for text notifications

### To Mark as Completed:

1. Open order
2. Update Payment Status → "Paid"
3. Add Payment Reference (receipt #)
4. Update Status → "Delivered"
5. Set "Paid At" date
6. Save

## Important Notes

✅ **Contact Info is Always Saved**: Even for pickup orders, customer name, phone, and email are stored in the `shippingAddress` group.

✅ **No Physical Address Required**: For pickup orders, the street address shows "N/A - Pickup Order" since it's not needed.

✅ **Zero Shipping Fee**: Pickup orders automatically have ₦0 shipping cost.

✅ **Payment Collected at Pickup**: Payment status remains "Pending" until customer pays at store.

## Recommended Admin Actions

### Daily Checklist:

- [ ] Check for new pickup orders
- [ ] Contact customers with pickup details
- [ ] Prepare orders for pickup
- [ ] Update order statuses
- [ ] Process completed pickups

### Customer Communication Template:

```
Subject: Your Order is Ready for Pickup - [Order Number]

Hi [Customer Name],

Your order [Order Number] is ready for pickup!

Items:
- [Product 1] x [Qty]
- [Product 2] x [Qty]

Total to Pay: ₦[Amount] (Cash)

Pickup Location:
[Your Store Address]

Available Times:
Monday - Friday: 9 AM - 6 PM
Saturday: 10 AM - 4 PM

Please bring:
- This order number
- Valid ID
- Exact cash amount (or we can provide change)

Questions? Call us at [Store Phone]

Thank you!
[Store Name]
```

## Technical Details

### Database Structure:

```typescript
Order {
  orderNumber: "ORD-1234567890-ABC"
  customer: User ID
  shippingMethod: "pickup"
  paymentMethod: "cash"
  paymentStatus: "pending"
  status: "pending"
  shippingAddress: {
    name: "John Doe"
    phone: "+234 800 000 0000"
    email: "john@example.com"
    street: "N/A - Pickup Order"
    city: "Lagos"
    state: "Lagos"
    country: "Nigeria"
  }
  items: [...]
  total: 15000
  shipping: 0
}
```

### API Endpoint:

- **POST** `/api/checkout`
- Creates order with pickup details
- Returns order ID and confirmation

### Admin Panel URL:

- **All Orders**: `/admin/collections/orders`
- **Specific Order**: `/admin/collections/orders/[order-id]`
