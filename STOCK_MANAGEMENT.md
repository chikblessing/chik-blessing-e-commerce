# Stock Management System

## Overview

This e-commerce platform now includes comprehensive stock management features to prevent overselling and provide clear inventory visibility.

## Features Implemented

### 1. **Payload Admin - Visual Stock Indicators**

- **Custom Stock Field Component**: Shows real-time stock status with color-coded badges
  - 🔴 **OUT OF STOCK** (Red) - 0 units
  - 🟠 **LOW STOCK** (Orange) - Below threshold (default: 10 units)
  - 🟢 **IN STOCK** (Green) - Above threshold
- **Location**: Visible when editing products in Payload admin
- **Auto-status Updates**: Product status automatically changes to "out-of-stock" when inventory reaches 0

### 2. **Product Cards - Stock Badges**

- **Out of Stock Badge**: Red badge displayed on product images when unavailable
- **Low Stock Badge**: Orange badge showing "ONLY X LEFT" when stock is low
- **Disabled Add to Cart**: Button is disabled and grayed out for out-of-stock items
- **Stock Status Text**: Shows availability status below product title

### 3. **Product Detail Page - Stock Validation**

- **Real-time Stock Display**:
  - Out of stock: Red indicator
  - Low stock: Orange indicator with exact count
  - In stock: Green indicator with available units
- **Quantity Limits**:
  - Plus button disabled when max quantity reached
  - Shows "Maximum available" message
  - Prevents adding more than available stock
- **Add to Cart Validation**: Checks stock before allowing purchase

### 4. **Shopping Cart - Stock Warnings**

- **Stock Status Indicators**:
  - ⚠️ Out of stock warning for unavailable items
  - ⚠️ "Only X available" warning when cart quantity exceeds stock
- **Quantity Controls**:
  - Plus button disabled when max stock reached
  - Minus button disabled at quantity 1
  - Real-time validation

### 5. **Checkout - Stock Validation**

- **Pre-checkout Validation**:
  - Validates all items before creating order
  - Checks if products are still in stock
  - Verifies requested quantities don't exceed availability
- **Error Handling**:
  - Returns detailed error messages for each stock issue
  - Prevents order creation if validation fails
  - User-friendly error display

### 6. **Order Processing - Automatic Stock Deduction**

- **Stock Deduction**: Automatically reduces inventory when order is placed
- **Status Updates**: Changes product status to "out-of-stock" when inventory reaches 0
- **Transaction Safety**: Stock is only deducted after successful order creation

### 7. **Order Cancellation - Stock Restoration**

- **Automatic Restoration**: Returns inventory when order status changes to "cancelled"
- **Status Recovery**: Restores product status from "out-of-stock" to "published" if stock becomes available
- **Audit Logging**: Logs all stock restoration activities

## Configuration

### Product Inventory Settings

Each product has the following inventory fields:

```typescript
inventory: {
  stock: number // Current stock quantity
  trackInventory: boolean // Enable/disable inventory tracking (default: true)
  lowStockThreshold: number // Alert threshold (default: 10)
  sku: string // Stock Keeping Unit
}
```

### Disabling Inventory Tracking

To disable inventory tracking for a product:

1. Edit the product in Payload admin
2. Navigate to Inventory section
3. Uncheck "Track Inventory"
4. Product will be treated as always available

## Stock Flow

### Purchase Flow

1. Customer adds item to cart → Validates current stock
2. Customer proceeds to checkout → Re-validates all items
3. Order is created → Stock is deducted
4. If stock reaches 0 → Product status changes to "out-of-stock"

### Cancellation Flow

1. Admin/System cancels order
2. System restores stock for all items
3. If product was out-of-stock → Status changes back to "published"
4. Stock restoration is logged

## API Endpoints

### Stock Validation (Checkout)

**Endpoint**: `POST /api/checkout`

**Validation Checks**:

- Product exists
- Product is not out of stock
- Requested quantity ≤ available stock

**Error Response**:

```json
{
  "error": "Stock validation failed",
  "details": [
    "Only 5 units of \"Product Name\" available (requested 10)",
    "\"Another Product\" is out of stock"
  ]
}
```

## Admin Features

### Stock Management in Payload

- **Default Columns**: Shows stock level in product list view
- **Search**: Can search by SKU
- **Filtering**: Filter products by status (including out-of-stock)
- **Bulk Actions**: Update multiple products' stock levels

### Low Stock Alerts

Products with stock below the threshold are highlighted in:

- Admin product list
- Product edit page
- Frontend product cards

## Best Practices

1. **Set Appropriate Thresholds**: Adjust `lowStockThreshold` based on product demand
2. **Regular Stock Audits**: Periodically verify physical inventory matches system
3. **Monitor Cancelled Orders**: Check stock restoration logs for accuracy
4. **Test Before Launch**: Verify stock deduction/restoration in staging environment

## Troubleshooting

### Stock Not Deducting

- Check if `trackInventory` is enabled for the product
- Verify order was successfully created
- Check server logs for errors

### Stock Not Restoring on Cancellation

- Ensure order status changed to "cancelled"
- Check Payload logs for restoration errors
- Verify product still exists

### Out of Stock Products Still Showing

- Clear browser cache
- Verify product status in admin
- Check if inventory tracking is enabled

## Future Enhancements

Potential improvements for the stock management system:

- Stock reservation during checkout (hold stock for X minutes)
- Backorder support
- Stock alerts via email/SMS
- Inventory history tracking
- Multi-warehouse support
- Automatic reorder points
