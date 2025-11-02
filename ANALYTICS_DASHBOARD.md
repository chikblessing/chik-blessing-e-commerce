# Analytics Dashboard

## Overview

A comprehensive analytics dashboard for monitoring store performance, sales, inventory, and customer data.

## Access

**URL**: `http://localhost:3000/admin-dashboard`

**Requirements**: Must be logged in as admin or super_admin

## Features

### 📊 Key Metrics (30-day overview)

- **Total Revenue**: Revenue from last 30 days with weekly breakdown
- **Total Orders**: Order count with weekly comparison
- **Products**: Total products with out-of-stock count
- **Customers**: Total users with new registrations this month

### 🚨 Alerts

- **Low Stock Alert**: Products with stock ≤ 10 units
- **Pending Reports**: Product reports awaiting review

### 📈 Charts & Visualizations

#### Order Status Breakdown (30 days)

- Pending orders
- Processing orders
- Shipped orders
- Delivered orders
- Cancelled orders

Visual progress bars showing percentage distribution

#### Payment Status Breakdown (30 days)

- Pending payments
- Paid orders
- Failed payments
- Refunded orders

Visual progress bars showing percentage distribution

### 📋 Data Tables

#### Recent Orders

Shows last 10 orders with:

- Order number
- Customer name/email
- Order date
- Status (color-coded badges)
- Total amount

#### Low Stock Products

Shows products with low inventory:

- Product name
- SKU
- Current stock (color-coded)
- Product status

## Dashboard Sections

### 1. Header

- Dashboard title
- Link back to admin panel

### 2. Key Metrics Cards

Four cards displaying:

- Revenue metrics
- Order counts
- Product inventory
- Customer statistics

### 3. Alert Banners

- Orange banner for low stock warnings
- Red banner for pending reports
- Quick links to relevant collections

### 4. Status Charts

Two side-by-side charts:

- Order status distribution
- Payment status distribution

### 5. Recent Orders Table

- Last 10 orders
- Sortable columns
- Status badges
- Link to view all orders

### 6. Low Stock Table

- Products needing restocking
- Stock level indicators
- Link to products collection

## Color Coding

### Order Status

- 🟡 **Pending**: Yellow
- 🔵 **Processing**: Blue
- 🟣 **Shipped**: Purple
- 🟢 **Delivered**: Green
- 🔴 **Cancelled**: Red

### Payment Status

- 🟡 **Pending**: Yellow
- 🟢 **Paid**: Green
- 🔴 **Failed**: Red
- ⚫ **Refunded**: Gray

### Stock Levels

- 🔴 **0 units**: Critical (Red)
- 🟠 **1-5 units**: Very Low (Orange)
- 🟡 **6-10 units**: Low (Yellow)

## Data Sources

All data is fetched from Payload CMS collections:

- **Orders**: Sales and revenue data
- **Products**: Inventory levels
- **Users**: Customer information
- **Reviews**: Customer feedback count
- **Product Reports**: Pending reports

## Time Periods

- **30 days**: Main analytics period
- **7 days**: Weekly comparison
- **All time**: Total counts

## Quick Actions

From the dashboard, you can:

- View all orders
- Check product inventory
- Review pending reports
- Monitor low stock items
- Track customer growth

## Navigation

### From Dashboard:

- Click "Back to Admin Panel" → Returns to `/admin`
- Click "View All" links → Navigate to specific collections
- Click "View Products" → Go to products collection
- Click "Review Reports" → Go to product reports

### To Dashboard:

- Direct URL: `/admin-dashboard`
- Bookmark for quick access

## Technical Details

### Server Component (`page.tsx`)

- Authenticates user
- Fetches all analytics data
- Calculates metrics
- Passes data to client component

### Client Component (`page.client.tsx`)

- Renders UI
- Displays charts and tables
- Handles formatting
- Provides navigation

### Data Fetching

- Real-time data from database
- No caching (always fresh)
- Efficient queries with limits
- Filtered by date ranges

## Performance

- Optimized queries with limits
- Only fetches necessary data
- Server-side data processing
- Client-side rendering for interactivity

## Future Enhancements

Potential improvements:

- Date range selector
- Export to CSV/PDF
- More detailed charts (line graphs, pie charts)
- Revenue trends over time
- Top-selling products
- Customer lifetime value
- Conversion rates
- Real-time updates
- Customizable widgets
- Email reports
- Comparison with previous periods

## Troubleshooting

### Can't access dashboard?

1. Ensure you're logged in
2. Check your user role (must be admin or super_admin)
3. Try accessing directly: `/admin-dashboard`

### Data not showing?

1. Check if you have orders/products in the database
2. Verify date ranges
3. Check browser console for errors

### Slow loading?

1. Large datasets may take time to load
2. Consider adding pagination
3. Implement caching if needed

---

**Access your analytics dashboard at: `/admin-dashboard`** 📊
