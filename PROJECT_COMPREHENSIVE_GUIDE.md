# Complete Beginner's Guide to the E-Commerce Project

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Core Concepts](#core-concepts)
5. [Collections (Data Models)](#collections-data-models)
6. [Frontend Structure](#frontend-structure)
7. [Backend API Routes](#backend-api-routes)
8. [Authentication System](#authentication-system)
9. [Payment Integration](#payment-integration)
10. [Key Features](#key-features)
11. [File Structure Explained](#file-structure-explained)
12. [How Everything Works Together](#how-everything-works-together)

---

## 1. Project Overview

This is a **full-stack e-commerce application** built with modern web technologies. It's a complete online store where:
- Customers can browse products, add them to cart, and make purchases
- Admins can manage products, orders, and content through an admin panel
- The system handles authentication, payments, reviews, and order management

**What makes this project special:**
- It's a **monolithic application** - both frontend (what users see) and backend (server logic) are in one codebase
- Uses **Payload CMS** - a headless CMS that provides an admin panel and database management
- Built with **Next.js 15** - a React framework for building fast web applications
- Uses **TypeScript** - JavaScript with type safety for fewer bugs

---

## 2. Technology Stack

### Frontend Technologies

**1. Next.js 15 (React Framework)**
- **What it is:** A framework built on top of React that adds server-side rendering, routing, and optimization
- **Why it's used:** Makes websites faster, better for SEO, and easier to build
- **Key features used:**
  - App Router: Modern way to handle pages and routes
  - Server Components: Components that run on the server for better performance
  - Image Optimization: Automatic image resizing and optimization

**2. React 19**
- **What it is:** A JavaScript library for building user interfaces
- **Why it's used:** Makes it easy to create interactive, component-based UIs
- **Key concepts:**
  - Components: Reusable pieces of UI (like ProductCard, Header)
  - Hooks: Functions that let you use React features (useState, useEffect)
  - Props: Data passed from parent to child components

**3. TypeScript**
- **What it is:** JavaScript with type checking
- **Why it's used:** Catches errors before runtime, provides better autocomplete
- **Example:**
```typescript
// Without TypeScript (JavaScript)
function addToCart(product) {
  // What is product? We don't know!
}

// With TypeScript
interface Product {
  id: string
  title: string
  price: number
}
function addToCart(product: Product) {
  // Now we know exactly what product contains!
}
```

**4. Tailwind CSS**
- **What it is:** A utility-first CSS framework
- **Why it's used:** Write CSS faster using pre-defined classes
- **Example:**
```html
<!-- Traditional CSS -->
<div class="my-custom-button"></div>
<style>.my-custom-button { padding: 1rem; background: blue; }</style>

<!-- Tailwind CSS -->
<div class="p-4 bg-blue-500"></div>
```

**5. shadcn/ui Components**
- **What it is:** Pre-built, accessible UI components
- **Components used:** Buttons, Dropdowns, Dialogs, Inputs, Drawers
- **Why it's used:** Saves time, ensures accessibility, consistent design

### Backend Technologies

**1. Payload CMS**
- **What it is:** A headless CMS (Content Management System) and application framework
- **Why it's used:** Provides:
  - Admin panel for managing data
  - Database operations (CRUD - Create, Read, Update, Delete)
  - Authentication system
  - File uploads
  - API generation
- **Key concept:** "Collections" are like database tables

**2. MongoDB (with Mongoose)**
- **What it is:** A NoSQL database that stores data as JSON-like documents
- **Why it's used:** Flexible schema, scales well, works great with JavaScript
- **Example document:**
```json
{
  "_id": "abc123",
  "title": "Laptop",
  "price": 50000,
  "status": "published"
}
```

**3. Node.js**
- **What it is:** JavaScript runtime that lets you run JavaScript on the server
- **Why it's used:** Same language (JavaScript/TypeScript) for frontend and backend

### Additional Technologies

**1. Paystack**
- **What it is:** Payment gateway for processing online payments
- **Why it's used:** Handles credit card payments, bank transfers in Nigeria

**2. Resend**
- **What it is:** Email service for sending transactional emails
- **Why it's used:** Send verification codes, order confirmations, etc.

**3. Vercel Blob Storage**
- **What it is:** Cloud storage for files (images, documents)
- **Why it's used:** Store product images, user avatars

---

## 3. Project Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                       │
│  (Frontend - What users see and interact with)              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Home Page   │  │ Product Page │  │  Cart Page   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP Requests
┌─────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                          │
│  (Backend - Handles requests, business logic)               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  API Routes  │  │ Payload CMS  │  │  Auth Logic  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ Database Queries
┌─────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                        │
│  (Data Storage - Where all data is stored)                  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Products   │  │    Orders    │  │    Users     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow Example

**Scenario: User views a product page**

1. **User Action:** User clicks on a product
2. **Browser:** Sends GET request to `/product/laptop-hp-15`
3. **Next.js Server:** 
   - Receives request
   - Runs `page.tsx` component
   - Fetches product data from database
4. **MongoDB:** Returns product data
5. **Next.js Server:** Renders HTML with product data
6. **Browser:** Displays the product page to user

---

## 4. Core Concepts

### What is a Collection?

A **Collection** in Payload CMS is like a database table. It defines:
- What fields (columns) exist
- What type of data each field holds
- Who can read/write the data (access control)
- What happens when data changes (hooks)

**Example: Products Collection**
```typescript
{
  slug: 'products',  // Collection name
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'price', type: 'number', required: true },
    { name: 'status', type: 'select', options: ['draft', 'published'] }
  ]
}
```

This creates a "products" table with title, price, and status columns.

### What is a Field?

A **Field** is a piece of data in a collection. Types include:
- `text`: Short text (product name)
- `textarea`: Long text (description)
- `number`: Numbers (price, quantity)
- `select`: Dropdown options (status: draft/published)
- `relationship`: Link to another collection (product → category)
- `array`: List of items (product images)
- `group`: Nested fields (address: street, city, state)
- `upload`: File upload (images, documents)

### What is a Hook?

A **Hook** is code that runs automatically when something happens:
- `beforeChange`: Runs before saving data
- `afterChange`: Runs after saving data
- `beforeDelete`: Runs before deleting data
- `afterDelete`: Runs after deleting data

**Example:**
```typescript
hooks: {
  beforeChange: [({ data }) => {
    // Auto-generate slug from title
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/\s+/g, '-')
    }
    return data
  }]
}
```

### What is Access Control?

**Access Control** determines who can do what with data:
```typescript
access: {
  create: authenticated,  // Only logged-in users can create
  read: () => true,       // Everyone can read
  update: authenticated,  // Only logged-in users can update
  delete: authenticated   // Only logged-in users can delete
}
```

---

## 5. Collections (Data Models)

### 5.1 Products Collection

**Purpose:** Stores all product information

**Key Fields:**

- **title** (text): Product name - "HP Laptop 15 inch"
- **slug** (text): URL-friendly name - "hp-laptop-15-inch"
- **description** (richText): Full product details with formatting
- **shortDescription** (textarea): Brief summary for product cards
- **price** (number): Regular price - 50000
- **salePrice** (number): Discounted price - 45000
- **images** (array): Multiple product images
  - Each image has: image (upload), alt text, isFeature flag
- **categories** (relationship): Links to Category collection
- **brand** (text): Manufacturer - "HP", "Dell", "Apple"
- **status** (select): draft | published | out-of-stock
- **inventory** (group): Stock management
  - stock (number): Available quantity
  - sku (text): Stock Keeping Unit - unique product code
  - trackInventory (checkbox): Whether to track stock
  - weight (number): For shipping calculations
- **rating** (group): Calculated from reviews
  - average (number): 4.5 stars
  - count (number): Total reviews
  - breakdown: Count of 1-5 star reviews
- **specifications** (array): Technical details
  - name: "RAM", value: "16GB"
  - name: "Storage", value: "512GB SSD"
- **features** (array): Key highlights
  - "Fast processor"
  - "Long battery life"
- **relatedProducts** (relationship): Suggested products
- **promotions** (relationship): Active discounts
- **tags** (array): Search keywords
- **seo** (group): Search engine optimization
  - metaTitle, metaDescription, keywords

**Important Hooks:**
1. **beforeChange**: Auto-generates slug from title
2. **afterChange**: Updates category product counts
3. **afterDelete**: Updates category counts when product deleted

**Access Control:**
- Create/Update/Delete: Only authenticated users (admins)
- Read: Everyone (public)

### 5.2 Orders Collection

**Purpose:** Stores customer orders and purchase history

**Key Fields:**
- **orderNumber** (text): Unique ID - "ORD-1234567890-ABC"
- **customer** (relationship): Links to Users collection
- **guestEmail** (email): For non-registered customers
- **items** (array): Products in the order
  - product (relationship): Link to product
  - productTitle (text): Snapshot of product name
  - productImage (upload): Snapshot of product image
  - quantity (number): How many ordered
  - price (number): Price at time of purchase
  - sku (text): Product code

- **subtotal** (number): Sum of item prices
- **shipping** (number): Delivery cost
- **shippingMethod** (select): standard | express | pickup
- **tax** (number): Tax amount
- **total** (number): Final amount paid
- **delivery** (group): Shipping information
  - trackingNumber (text): Carrier tracking code
  - carrier (text): "FedEx", "USPS"
  - expectedDeliveryDate (date): Estimated arrival
  - actualDeliveryDate (date): When delivered
- **status** (select): pending | processing | shipped | delivered | cancelled
- **shippingAddress** (group): Where to deliver
  - name, phone, email, street, city, state, postalCode, country
- **billingAddress** (group): Billing information
- **paymentMethod** (select): paystack | card_manual | bank_transfer | cash | mobile_money
- **paymentStatus** (select): pending | paid | failed | refunded
- **paymentReference** (text): Payment gateway reference
- **transactionId** (text): Transaction identifier
- **paidAt** (date): When payment was received

**Why Snapshot Product Data?**
When an order is created, we save a copy of the product title and image. Why?
- Product details might change later (price, name, image)
- Order should show what customer actually bought
- Historical accuracy for records

**Important Hooks:**
1. **beforeChange**: 
   - Generates unique order number
   - Snapshots product data (title, image)
2. **afterChange**: Updates user's order history

**Access Control:**
- Create/Update/Delete: Authenticated users
- Read: Admins see all, customers see only their orders

### 5.3 Users Collection

**Purpose:** Stores customer and admin accounts

**Key Fields:**
- **name** (text): Full name
- **firstName** (text): First name
- **lastName** (text): Last name
- **email** (email): Login email (unique)
- **password** (password): Hashed password
- **avatar** (upload): Profile picture
- **role** (select): admin | customer
- **phone** (text): Contact number
- **gender** (select): male | female | nonbinary | undisclosed
- **dateOfBirth** (date): Birthday
- **addresses** (array): Saved addresses
  - type: billing | shipping
  - street, city, state, country, postalCode
  - isDefault (checkbox): Primary address
- **cart** (array): Shopping cart items
  - product (relationship): Product in cart
  - quantity (number): How many
  - addedAt (date): When added
- **wishlist** (array): Saved products
  - product (relationship): Favorited product
- **orderHistory** (array): Past orders
  - order (relationship): Link to order
- **verificationOTP** (text): Email verification code (hidden)
- **otpExpiry** (date): When OTP expires (hidden)

**Authentication Features:**
- Email verification with OTP
- Password reset functionality
- Role-based access (admin vs customer)

**Access Control:**
- Admin panel: Only admins can access
- Create: Anyone (for registration)
- Read/Update: Admins see all, users see only their data
- Delete: Authenticated users

### 5.4 Reviews Collection

**Purpose:** Customer product reviews and ratings

**Key Fields:**
- **product** (relationship): Product being reviewed
- **customer** (relationship): Who wrote the review
- **title** (text): Review headline - "Great laptop!"
- **comment** (textarea): Detailed review
- **rating** (number): 1-5 stars
- **status** (select): pending | approved | rejected
- **isVerifiedPurchase** (checkbox): Did customer buy this?
- **helpfulVotes** (number): How many found it helpful

**Important Hooks:**
1. **beforeChange**: Checks if customer actually bought the product
2. **afterChange**: Recalculates product rating
3. **afterDelete**: Updates product rating

**How Rating Calculation Works:**
```typescript
// Get all approved reviews for a product
const reviews = await payload.find({
  collection: 'reviews',
  where: { product: productId, status: 'approved' }
})

// Calculate average
const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

// Count star breakdown
const breakdown = {
  fiveStars: reviews.filter(r => r.rating === 5).length,
  fourStars: reviews.filter(r => r.rating === 4).length,
  // ... etc
}

// Update product
await payload.update({
  collection: 'products',
  id: productId,
  data: { rating: { average, count: reviews.length, breakdown } }
})
```

**Access Control:**
- Create: Logged-in users only
- Read: Everyone
- Update: Admins or review author
- Delete: Admins only
- Status field: Only admins can approve/reject

### 5.5 Categories Collection

**Purpose:** Organize products into groups

**Key Fields:**
- **title** (text): Category name - "Laptops"
- **slug** (text): URL-friendly - "laptops"
- **description** (textarea): Category description
- **parent** (relationship): For nested categories
  - Example: "Gaming Laptops" → parent: "Laptops"
- **productsCount** (number): How many products (auto-calculated)
- **image** (upload): Category thumbnail

**Nested Categories Example:**
```
Electronics
├── Laptops
│   ├── Gaming Laptops
│   └── Business Laptops
└── Phones
    ├── Android
    └── iPhone
```

### 5.6 Other Collections

**Promotions**
- Discount codes and sales
- Fields: code, discountType, discountValue, startDate, endDate

**ShippingZones**
- Delivery areas and costs
- Fields: name, regions, shippingCost, estimatedDays

**ProductReports**
- User reports of problematic products
- Fields: product, reporter, reason, description, status

**ContactSubmissions**
- Contact form submissions
- Fields: name, email, subject, message, status

**Media**
- Uploaded files (images, documents)
- Automatically managed by Payload

**Pages**
- CMS-managed pages (About, Terms, Privacy)
- Uses layout builder for flexible content

**Posts**
- Blog articles
- Fields: title, content, author, publishedDate

---

## 6. Frontend Structure

### 6.1 Next.js App Router

The project uses Next.js 15's **App Router** (not Pages Router). Key concepts:

**File-based Routing:**
```
src/app/
├── (frontend)/          ← Route group (doesn't affect URL)
│   ├── page.tsx        ← Homepage (/)
│   ├── about/
│   │   └── page.tsx    ← About page (/about)
│   ├── product/
│   │   └── [slug]/
│   │       └── page.tsx ← Dynamic route (/product/laptop-hp)
│   └── cart/
│       └── page.tsx    ← Cart page (/cart)
└── api/                ← API routes
    └── orders/
        └── route.ts    ← API endpoint (/api/orders)
```

**Route Groups:** `(frontend)` and `(payload)`
- Parentheses mean "don't include in URL"
- Used to organize files without affecting routes
- `(frontend)` = customer-facing pages
- `(payload)` = admin panel

**Dynamic Routes:** `[slug]`
- Square brackets = dynamic parameter
- `/product/[slug]/page.tsx` matches:
  - `/product/laptop-hp`
  - `/product/phone-samsung`
  - `/product/anything`

### 6.2 Server vs Client Components

**Server Components** (default)
- Run on the server
- Can directly access database
- Don't include JavaScript in browser
- Better performance
- Example: `page.tsx` files

**Client Components** (marked with 'use client')
- Run in the browser
- Can use React hooks (useState, useEffect)
- Handle user interactions
- Example: `page.client.tsx` files

**Pattern Used:**
```typescript
// page.tsx (Server Component)
export default async function ProductPage({ params }) {
  // Fetch data on server
  const product = await getProduct(params.slug)
  
  // Pass to client component
  return <ProductPageClient product={product} />
}

// page.client.tsx (Client Component)
'use client'
export default function ProductPageClient({ product }) {
  const [quantity, setQuantity] = useState(1)
  // Interactive UI here
}
```

### 6.3 Key Components

**Header Component** (`src/Header/Component.client.tsx`)
- Navigation bar
- Search functionality
- Cart and wishlist icons with counts
- User account dropdown
- Mobile responsive menu

**ProductCard Component** (`src/components/ProductCard/ProductCard.tsx`)
- Displays product in grid
- Shows image, title, price, rating
- Add to cart button
- Wishlist toggle
- Reusable across pages

**Layout Component** (`src/app/(frontend)/layout.tsx`)
- Wraps all pages
- Includes Header and Footer
- Provides global styles
- Sets up providers (Auth, Cart, Theme)

### 6.4 Context Providers

**What is a Provider?**
A way to share data across components without passing props manually.

**Cart Provider** (`src/providers/Cart`)
- Manages shopping cart state
- Functions: addToCart, removeFromCart, updateQuantity
- Persists cart in localStorage
- Provides cart count for header

**Wishlist Provider** (`src/providers/Wishlist`)
- Manages wishlist state
- Functions: addToWishlist, removeFromWishlist
- Syncs with user account if logged in

**Auth Provider** (`src/providers/Auth`)
- Manages user authentication
- Provides: user object, login, logout, register
- Checks if user is logged in

**Theme Provider** (`src/providers/Theme`)
- Manages dark/light mode
- Persists theme preference

**Usage Example:**
```typescript
// In any component
import { useCart } from '@/providers/Cart'

function MyComponent() {
  const { addToCart, totalItems } = useCart()
  
  return (
    <button onClick={() => addToCart(productId)}>
      Add to Cart ({totalItems})
    </button>
  )
}
```

---

## 7. Backend API Routes

### 7.1 API Route Structure

API routes are in `src/app/api/` and handle server-side logic.

**File naming:**
- `route.ts` = API endpoint
- HTTP methods: GET, POST, PUT, DELETE

**Example: Order API**
```typescript
// src/app/api/orders/[orderId]/route.ts
export async function GET(request, { params }) {
  const { orderId } = params
  const order = await payload.findByID({
    collection: 'orders',
    id: orderId
  })
  return NextResponse.json(order)
}
```

### 7.2 Authentication APIs

**Send OTP** (`/api/auth/send-otp`)
- Generates 6-digit code
- Saves to user record with expiry (10 minutes)
- Sends email via Resend
- Used for email verification

**Verify OTP** (`/api/auth/verify-otp`)
- Checks if code matches
- Checks if not expired
- Marks email as verified
- Returns success/error

**Flow:**
```
1. User registers → Account created (unverified)
2. System sends OTP email
3. User enters OTP
4. System verifies → Account activated
```

### 7.3 Payment Webhook

**Paystack Webhook** (`/api/payments/webhook`)
- Receives payment notifications from Paystack
- Verifies signature (security)
- Updates order status to "paid"
- Marks order as "processing"

**Why Webhooks?**
- Payment happens on Paystack's site
- Paystack notifies our server when payment succeeds
- We update order status automatically

**Security:**
```typescript
// Verify webhook is really from Paystack
const hash = crypto
  .createHmac('sha512', SECRET_KEY)
  .update(requestBody)
  .digest('hex')

if (hash !== signature) {
  // Reject - might be fake request
}
```

### 7.4 Other API Routes

**Products API** (`/api/products`)
- Search products
- Filter by category, price range
- Sort by price, rating, date

**Reviews API** (`/api/reviews`)
- Submit product review
- Get reviews for a product
- Mark review as helpful

**Shipping API** (`/api/shipping`)
- Calculate shipping cost
- Get available shipping methods
- Estimate delivery date

---

## 8. Authentication System

### 8.1 How Authentication Works

**Registration Flow:**
```
1. User fills registration form
2. POST /api/auth/register
3. Create user in database (role: customer)
4. Generate OTP
5. Send verification email
6. User enters OTP
7. POST /api/auth/verify-otp
8. Mark email as verified
9. User can now login
```

**Login Flow:**
```
1. User enters email + password
2. POST /api/auth/login
3. Check credentials
4. Create session token
5. Store in cookie
6. Redirect to dashboard
```

### 8.2 Session Management

**How Sessions Work:**
- When user logs in, server creates a token
- Token stored in HTTP-only cookie (secure)
- Every request includes cookie
- Server validates token
- If valid, user is authenticated

**Checking Auth Status:**
```typescript
import { useAuth } from '@/providers/Auth'

function MyComponent() {
  const { user, status } = useAuth()
  
  if (status === 'loading') return <div>Loading...</div>
  if (!user) return <div>Please login</div>
  
  return <div>Welcome {user.name}!</div>
}
```

### 8.3 Role-Based Access

**Two Roles:**
1. **Admin**: Full access to admin panel, can manage everything
2. **Customer**: Can shop, view orders, manage account

**Protecting Routes:**
```typescript
// Admin-only page
export default async function AdminPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }
  
  return <AdminDashboard />
}
```

**Protecting API Routes:**
```typescript
export async function DELETE(request) {
  const user = await getUser(request)
  
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  // Delete logic here
}
```

---

## 9. Payment Integration

### 9.1 Paystack Integration

**What is Paystack?**
- Payment gateway for African markets
- Handles credit cards, bank transfers, mobile money
- PCI-compliant (secure)

**Payment Flow:**
```
1. User adds items to cart
2. Goes to checkout
3. Enters shipping info
4. Clicks "Pay Now"
5. Redirected to Paystack
6. Enters payment details
7. Payment processed
8. Redirected back to our site
9. Webhook updates order status
10. User sees confirmation
```

### 9.2 Checkout Process

**Step 1: Create Order**
```typescript
// Create order with status "pending"
const order = await payload.create({
  collection: 'orders',
  data: {
    customer: userId,
    items: cartItems,
    total: calculateTotal(),
    status: 'pending',
    paymentStatus: 'pending'
  }
})
```

**Step 2: Initialize Payment**
```typescript
// Initialize Paystack transaction
const response = await fetch('https://api.paystack.co/transaction/initialize', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: user.email,
    amount: order.total * 100, // Convert to kobo
    metadata: { orderId: order.id }
  })
})

// Redirect user to payment page
const { authorization_url } = await response.json()
window.location.href = authorization_url
```

**Step 3: Handle Webhook**
```typescript
// Paystack sends webhook when payment succeeds
export async function POST(request) {
  const event = await request.json()
  
  if (event.event === 'charge.success') {
    const { orderId } = event.data.metadata
    
    // Update order
    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        paymentStatus: 'paid',
        status: 'processing',
        paidAt: new Date()
      }
    })
  }
}
```

### 9.3 Alternative Payment Methods

**Manual Payments** (for in-store purchases)
- Admin creates order manually
- Selects payment method: cash, card_manual, bank_transfer
- Marks as paid immediately
- No Paystack involved

---

## 10. Key Features

### 10.1 Product Search

**How it Works:**
```typescript
// User types in search box
const searchQuery = "laptop"

// API call
const results = await payload.find({
  collection: 'products',
  where: {
    or: [
      { title: { contains: searchQuery } },
      { description: { contains: searchQuery } },
      { brand: { contains: searchQuery } }
    ]
  }
})
```

**Search Features:**
- Full-text search across title, description, brand
- Filter by category
- Filter by price range
- Sort by: relevance, price, rating, newest

### 10.2 Shopping Cart

**Cart Storage:**
- Logged-in users: Saved in database (user.cart)
- Guest users: Saved in localStorage

**Cart Operations:**
```typescript
// Add to cart
addToCart(productId, quantity)

// Update quantity
updateQuantity(productId, newQuantity)

// Remove item
removeFromCart(productId)

// Clear cart
clearCart()

// Get total
const total = cart.reduce((sum, item) => 
  sum + (item.price * item.quantity), 0
)
```

**Cart Sync:**
- When guest logs in, merge localStorage cart with database cart
- When user logs out, keep cart in localStorage

### 10.3 Wishlist

**Purpose:** Save products for later

**Features:**
- Toggle heart icon to add/remove
- Syncs with user account
- Shows count in header
- Dedicated wishlist page

### 10.4 Order Tracking

**Order Statuses:**
1. **Pending**: Order created, awaiting payment
2. **Processing**: Payment received, preparing order
3. **Shipped**: Order dispatched, tracking number assigned
4. **Delivered**: Order received by customer
5. **Cancelled**: Order cancelled

**Tracking Information:**
- Tracking number
- Carrier name
- Expected delivery date
- Actual delivery date
- Status history

### 10.5 Product Reviews

**Review System:**
- 1-5 star rating
- Title and comment
- Verified purchase badge
- Admin moderation (approve/reject)
- Helpful votes

**Review Validation:**
- Must be logged in
- Can only review once per product
- Automatically marked as verified if purchased

### 10.6 Email Notifications

**Emails Sent:**
1. **Welcome Email**: After registration
2. **Verification OTP**: Email verification code
3. **Order Confirmation**: After successful payment
4. **Shipping Notification**: When order ships
5. **Delivery Confirmation**: When order delivered
6. **Password Reset**: Forgot password link

**Email Service:** Resend
- Transactional email API
- HTML email templates
- Delivery tracking

---

## 11. File Structure Explained

```
project-root/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/        # Customer-facing pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── product/       # Product pages
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── checkout/      # Checkout process
│   │   │   └── ...
│   │   ├── (payload)/         # Admin panel
│   │   │   └── admin/         # Payload CMS admin
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication APIs
│   │   │   ├── orders/        # Order APIs
│   │   │   ├── payments/      # Payment webhooks
│   │   │   └── ...
│   │   └── auth/              # Auth pages (login, register)
│   ├── collections/           # Payload collections (data models)
│   │   ├── Products/          # Products collection
│   │   ├── Orders.ts          # Orders collection
│   │   ├── Users/             # Users collection
│   │   └── ...
│   ├── components/            # Reusable React components
│   │   ├── ProductCard/       # Product card component
│   │   ├── Header/            # Header component
│   │   ├── Footer/            # Footer component
│   │   └── ui/                # shadcn/ui components
│   ├── providers/             # React context providers
│   │   ├── Auth/              # Authentication provider
│   │   ├── Cart/              # Shopping cart provider
│   │   ├── Wishlist/          # Wishlist provider
│   │   └── Theme/             # Theme provider
│   ├── utilities/             # Helper functions
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   ├── Header/                # Header configuration
│   ├── Footer/                # Footer configuration
│   └── payload.config.ts      # Payload CMS configuration
├── public/                    # Static files (images, fonts)
│   └── assets/                # Images and media
├── .env.local                 # Environment variables (secrets)
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.mjs        # Tailwind CSS configuration
└── next.config.js             # Next.js configuration
```

### Important Files

**payload.config.ts**
- Main Payload CMS configuration
- Defines all collections
- Sets up database connection
- Configures plugins
- Admin panel settings

**package.json**
- Lists all dependencies
- Defines npm scripts (dev, build, start)
- Project metadata

**.env.local**
- Environment variables (secrets)
- Database URL
- API keys (Paystack, Resend)
- Never commit to git!

**next.config.js**
- Next.js configuration
- Image domains
- Redirects
- Webpack config

**tailwind.config.mjs**
- Tailwind CSS configuration
- Custom colors
- Custom fonts
- Plugins

---

## 12. How Everything Works Together

### Complete User Journey: Buying a Product

**Step 1: Browse Products**
```
User visits homepage (/)
  ↓
Server renders page.tsx
  ↓
Fetches featured products from database
  ↓
Returns HTML with products
  ↓
Browser displays product grid
```

**Step 2: View Product Details**
```
User clicks product card
  ↓
Navigate to /product/laptop-hp
  ↓
Server fetches product by slug
  ↓
Fetches related products
  ↓
Fetches product reviews
  ↓
Renders product page
  ↓
User sees details, images, reviews
```

**Step 3: Add to Cart**
```
User clicks "Add to Cart"
  ↓
Client component calls addToCart()
  ↓
Cart provider updates state
  ↓
If logged in: Save to database
  ↓
If guest: Save to localStorage
  ↓
Update cart count in header
  ↓
Show success toast notification
```

**Step 4: Checkout**
```
User clicks cart icon
  ↓
Navigate to /cart
  ↓
Display cart items
  ↓
User clicks "Checkout"
  ↓
Navigate to /checkout
  ↓
User enters shipping address
  ↓
Selects shipping method
  ↓
Reviews order summary
  ↓
Clicks "Pay Now"
```

**Step 5: Payment**
```
POST /api/orders/create
  ↓
Create order in database (status: pending)
  ↓
Initialize Paystack transaction
  ↓
Get payment URL
  ↓
Redirect user to Paystack
  ↓
User enters card details
  ↓
Paystack processes payment
  ↓
Paystack sends webhook to our server
  ↓
POST /api/payments/webhook
  ↓
Verify webhook signature
  ↓
Update order (status: processing, paymentStatus: paid)
  ↓
Redirect user to /order-confirmation
```

**Step 6: Order Confirmation**
```
User sees confirmation page
  ↓
Display order number
  ↓
Display order details
  ↓
Send confirmation email
  ↓
Clear cart
  ↓
Add order to user's order history
```

**Step 7: Order Fulfillment (Admin)**
```
Admin logs into /admin
  ↓
Views orders list
  ↓
Clicks order
  ↓
Updates status to "shipped"
  ↓
Enters tracking number
  ↓
Sets expected delivery date
  ↓
Saves order
  ↓
System sends shipping notification email
```

**Step 8: Delivery**
```
Order delivered
  ↓
Admin updates status to "delivered"
  ↓
Sets actual delivery date
  ↓
System sends delivery confirmation email
  ↓
Customer can now review product
```

### Data Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────┐
│  Next.js    │
│   Server    │
└──────┬──────┘
       │ Query
       ↓
┌─────────────┐
│  Payload    │
│    CMS      │
└──────┬──────┘
       │ Database Query
       ↓
┌─────────────┐
│   MongoDB   │
│  Database   │
└─────────────┘
```

### Key Interactions

**1. Product Rating Update**
```
User submits review
  ↓
Review saved (status: pending)
  ↓
Admin approves review
  ↓
afterChange hook triggers
  ↓
Calculate new average rating
  ↓
Count star breakdown
  ↓
Update product.rating
  ↓
Product card shows new rating
```

**2. Inventory Management**
```
Order created
  ↓
For each item in order:
  ↓
  Get product
  ↓
  Reduce stock by quantity
  ↓
  If stock reaches 0:
    ↓
    Set status to "out-of-stock"
  ↓
Product page shows "Out of Stock"
```

**3. Category Product Count**
```
Product created/updated/deleted
  ↓
afterChange/afterDelete hook triggers
  ↓
Get all affected categories
  ↓
For each category:
  ↓
  Count products in category
  ↓
  Update category.productsCount
  ↓
Category page shows correct count
```

---

## Conclusion

This e-commerce project is a full-featured online store with:
- **Frontend**: Modern React/Next.js UI with responsive design
- **Backend**: Payload CMS for data management and admin panel
- **Database**: MongoDB for flexible data storage
- **Authentication**: Secure user accounts with email verification
- **Payments**: Paystack integration for online payments
- **Features**: Cart, wishlist, reviews, order tracking, search

**Key Technologies:**
- Next.js 15 (React framework)
- Payload CMS (headless CMS)
- MongoDB (database)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Paystack (payments)
- Resend (emails)

**Architecture:**
- Monolithic (frontend + backend in one app)
- Server-side rendering for performance
- API routes for backend logic
- Context providers for state management
- Collection-based data modeling

This guide covers the fundamentals. To dive deeper:
1. Read the code in `src/collections/` to understand data models
2. Explore `src/app/(frontend)/` for page implementations
3. Check `src/app/api/` for backend logic
4. Review `src/components/` for reusable UI components
5. Study `src/providers/` for state management

Happy coding! 🚀
