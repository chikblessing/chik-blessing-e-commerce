# How to Access Admin Reports

## Quick Access Guide

### 1. Product Reports (Reported Products)

**URL**: `http://localhost:3000/admin/collections/product-reports`

**Steps**:

1. Log in to admin panel at `http://localhost:3000/admin`
2. Look for **"Content"** section in the left sidebar
3. Click on **"Product Reports"**
4. You'll see all submitted product reports

**What you can do**:

- View all reported products
- Update report status (Pending → Investigating → Resolved/Dismissed)
- Add admin notes
- Delete reports

---

### 2. Orders (Sales Reports)

**URL**: `http://localhost:3000/admin/collections/orders`

**Steps**:

1. Log in to admin panel
2. Look for **"Commerce"** section in the left sidebar
3. Click on **"Orders"**
4. You'll see all orders with details

**What you can do**:

- View all orders
- Filter by status, payment status, date
- Update order status
- View customer details
- Track shipping

---

### 3. Reviews

**URL**: `http://localhost:3000/admin/collections/reviews`

**Steps**:

1. Log in to admin panel
2. Look for **"Reviews"** in the left sidebar
3. Click on **"Reviews"**
4. You'll see all customer reviews

**What you can do**:

- View all reviews
- Delete inappropriate reviews
- See verified purchase badges
- Monitor product ratings

---

### 4. Users (Customer Management)

**URL**: `http://localhost:3000/admin/collections/users`

**Steps**:

1. Log in to admin panel
2. Click on **"Users"** in the left sidebar
3. You'll see all registered users

**What you can do**:

- View all customers
- Manage user accounts
- Update user roles
- Suspend/activate accounts

---

### 5. Contact Submissions

**URL**: `http://localhost:3000/admin/collections/contact-submissions`

**Steps**:

1. Log in to admin panel
2. Look for **"Content"** section in the left sidebar
3. Click on **"Contact Submissions"**
4. You'll see all contact form submissions

**What you can do**:

- View customer inquiries
- Track response status
- Add admin notes

---

## Collections Organization in Admin Panel

The collections are organized into groups:

### **Commerce** Group:

- Orders
- Shipping Zones

### **Content** Group:

- Pages
- Posts
- Categories
- Product Reports
- Contact Submissions

### **Products** (Standalone):

- Products
- Promotions

### **Users** (Standalone):

- Users

### **Reviews** (Standalone):

- Reviews

### **Media** (Standalone):

- Media

---

## Direct URLs for Quick Access

Copy and paste these URLs directly into your browser (replace `localhost:3000` with your domain in production):

```
Product Reports:
http://localhost:3000/admin/collections/product-reports

Orders:
http://localhost:3000/admin/collections/orders

Reviews:
http://localhost:3000/admin/collections/reviews

Users:
http://localhost:3000/admin/collections/users

Products:
http://localhost:3000/admin/collections/products

Contact Submissions:
http://localhost:3000/admin/collections/contact-submissions

Categories:
http://localhost:3000/admin/collections/categories

Promotions:
http://localhost:3000/admin/collections/promotions

Shipping Zones:
http://localhost:3000/admin/collections/shipping-zones
```

---

## Troubleshooting

### Can't see Product Reports?

1. Make sure you're logged in as an admin
2. Check the "Content" group in the left sidebar
3. Try accessing directly: `/admin/collections/product-reports`

### Can't see Orders?

1. Check the "Commerce" group in the left sidebar
2. Try accessing directly: `/admin/collections/orders`

### Collections not showing?

1. Restart your development server
2. Clear browser cache
3. Check if you're logged in with admin privileges

---

## Admin Dashboard

The main admin dashboard is at:

```
http://localhost:3000/admin
```

From there, you can navigate to any collection using the left sidebar.

---

## Tips

1. **Bookmark frequently used collections** in your browser for quick access
2. **Use filters** in each collection to find specific items
3. **Export data** using the collection's export feature
4. **Set up email notifications** to get alerts for new reports/orders

---

## Need Help?

If you still can't access the reports:

1. Check that you're logged in as an admin user
2. Verify your user role is set to 'admin' or 'super_admin'
3. Try accessing the collections directly using the URLs above
4. Check the browser console for any errors

---

**All reports are accessible through the Payload admin panel!** 📊
