# Stock Management Fix

## Problem

When orders were updated to "delivered" status and payment status changed to "paid" (especially for pay-on-pickup orders), the product stock numbers were not being reduced.

## Root Cause

The Orders collection had no logic to update product inventory when payment was confirmed. It only snapshotted product data during order creation but never reduced stock levels.

## Solution

Added an `afterChange` hook in the Orders collection (`src/collections/Orders.ts`) that:

1. Detects when `paymentStatus` changes from any status to `'paid'`
2. Iterates through all items in the order
3. For each product:
   - Fetches the current product data
   - Checks if inventory tracking is enabled (`trackInventory` field)
   - Reduces the stock by the ordered quantity
   - Ensures stock never goes below 0
   - Logs the stock change for audit purposes

## How It Works

```typescript
// Triggered when payment status changes to 'paid'
if (operation === 'update' && previousDoc) {
  const paymentJustPaid = doc.paymentStatus === 'paid' && previousDoc.paymentStatus !== 'paid'

  if (paymentJustPaid) {
    // Reduce stock for each item in the order
    for (const item of doc.items) {
      const currentStock = product.inventory.stock
      const newStock = Math.max(0, currentStock - item.quantity)
      // Update product with new stock level
    }
  }
}
```

## When Stock is Reduced

Stock is automatically reduced when:

- Admin marks payment status as "paid" in the admin panel
- Paystack webhook confirms successful payment
- Any manual payment method (cash, bank transfer, etc.) is confirmed

## Important Notes

1. **Idempotent**: Stock is only reduced once when payment status first changes to "paid"
2. **Safe**: Stock never goes below 0 (uses `Math.max(0, currentStock - quantity)`)
3. **Respects Settings**: Only reduces stock if `trackInventory` is enabled for the product
4. **Logged**: All stock changes are logged for audit trail
5. **Error Handling**: If stock update fails for one product, it continues with others

## Testing

To test the fix:

1. Create a test order with pay-on-pickup
2. Note the current stock level of the ordered product
3. Update the order's payment status to "paid" in admin panel
4. Check the product - stock should be reduced by the ordered quantity
5. Check server logs for confirmation message

## Related Files

- `src/collections/Orders.ts` - Main fix location
- `src/collections/Products/index.ts` - Product inventory structure
- `src/app/api/payments/webhook/route.ts` - Paystack webhook (triggers payment status change)
