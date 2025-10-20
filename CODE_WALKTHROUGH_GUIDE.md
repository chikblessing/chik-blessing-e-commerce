# Complete Code Walkthrough Guide

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Payload CMS Configuration](#2-payload-cms-configuration)
3. [Collections](#3-collections)
4. [API Routes](#4-api-routes)
5. [Providers & Context](#5-providers--context)
6. [Frontend Components](#6-frontend-components)
7. [Authentication Flow](#7-authentication-flow)
8. [Payment Integration](#8-payment-integration)

---

## 1. Project Overview

This is a full-stack e-commerce application built with:

- **Framework**: Next.js 14 (App Router)
- **CMS**: Payload CMS 3.0
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js + Payload Auth
- **Payment**: Paystack
- **Storage**: Vercel Blob Storage
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Public-facing pages
│   ├── (payload)/         # Payload admin panel
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── collections/           # Payload collections (data models)
├── components/            # React components
├── providers/             # Context providers
├── lib/                   # Utility libraries
└── payload.config.ts      # Payload CMS configuration
```

---

## 2. Payload CMS Configuration

**File**: `src/payload.config.ts`

### Core Configuration

```typescript
export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Products,
    Promotions,
    Orders,
    Reviews,
    ShippingZones,
    ProductReports,
    ContactSubmissions,
    Users,
  ],
  globals: [Header, Footer],
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }) => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
```

### Key Features

- **Database**: MongoDB via Mongoose adapter
- **Storage**: Vercel Blob for media files
- **Editor**: Lexical rich text editor
- **Admin Panel**: Custom components for login/dashboard
- **Live Preview**: Responsive breakpoints for content preview
- **Jobs**: Background task support with cron authentication
- **TypeScript**: Auto-generated types from collections

---

## 3. Collections

Collections are Payload's data models. Each collection defines a database table/collection.

### 3.1 Products Collection

**File**: `src/collections/Products/index.ts`

#### Schema Overview

```typescript
{
  slug: 'products',
  access: {
    create: authenticated,
    read: () => true,  // Public read
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    // Basic Info
    'title', 'slug', 'shortDescription', 'description',

    // Pricing
    'price', 'salePrice',

    // Media
    'images' (array), 'gallery' (array),

    // Organization
    'categories' (relationship), 'brand', 'status',

    // Inventory
    'inventory' (group): {
      stock, lowStockThreshold, sku, trackInventory,
      weight, dimensions
    },

    // Additional
    'specifications' (array), 'rating' (group),
    'promotions', 'relatedProducts', 'tags', 'seo'
  ]
}
```

#### Key Features

**1. Automatic Slug Generation**

```typescript
hooks: {
  beforeChange: [
    ({ data }) => {
      if (!data.slug && data.title) {
        data.slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }
      return data
    },
  ]
}
```

**2. Auto Status Update**

```typescript
if (data.inventory?.stock === 0) {
  data.status = 'out-of-stock'
}
```

**3. Category Count Sync**

- After product create/update/delete
- Updates `productsCount` on related categories
- Handles multiple categories per product

**4. Rating System**

- Read-only field calculated from reviews
- Includes average, count, and breakdown (1-5 stars)

#### Field Types Explained

- **`text`**: Single-line string
- **`textarea`**: Multi-line string
- **`richText`**: Lexical editor with formatting
- **`number`**: Numeric values with min/max
- **`array`**: Repeatable field groups
- **`group`**: Nested object structure
- **`relationship`**: Links to other collections
- **`upload`**: File upload (links to Media)
- **`select`**: Dropdown with predefined options
- **`checkbox`**: Boolean value

---

### 3.2 Orders Collection

**File**: `src/collections/Orders.ts`

#### Schema Overview

```typescript
{
  slug: 'orders',
  fields: [
    'orderNumber',  // Auto-generated
    'customer' (relationship to users),
    'guestEmail',   // For non-logged-in users

    // Order Items
    'items' (array): {
      product, productTitle, productImage,
      quantity, price, sku
    },

    // Pricing
    'subtotal', 'shipping', 'tax', 'total',

    // Shipping
    'shippingMethod', 'shippingAddress', 'billingAddress',

    // Delivery Tracking
    'delivery' (group): {
      trackingNumber, carrier,
      expectedDeliveryDate, actualDeliveryDate
    },

    // Payment
    'paymentMethod', 'paymentStatus', 'paymentReference',
    'transactionId', 'paymentNotes', 'paidAt',

    // Status
    'status': pending | processing | shipped | delivered | cancelled
  ]
}
```

#### Key Features

**1. Product Data Snapshot**

```typescript
const snapshotProductData: CollectionBeforeChangeHook = async ({ data, req }) => {
  // Generate unique order number
  data.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`

  // Snapshot product details (title, image) at time of order
  // This preserves product info even if product is later deleted/modified
  for (let item of data.items) {
    const productDoc = await req.payload.findByID({
      collection: 'products',
      id: item.product,
      depth: 1,
    })
    item.productTitle = productDoc.title
    item.productImage = productDoc.images?.[0]?.image?.id
  }
}
```

**2. Access Control**

```typescript
access: {
  read: ({ req: { user } }) => {
    if (user?.role === 'admin') return true
    // Users can only see their own orders
    return { customer: { equals: user?.id } }
  }
}
```

**3. Order History Sync**

- After order creation, adds order to user's `orderHistory`
- Maintains bidirectional relationship

---

### 3.3 Users Collection

**File**: `src/collections/Users/index.ts`

#### Schema Overview

```typescript
{
  slug: 'users',
  auth: true,  // Enables authentication
  fields: [
    'name', 'firstName', 'lastName', 'avatar',
    'role': admin | customer,
    'phone', 'gender', 'dateOfBirth',

    // Customer-only fields
    'addresses' (array),
    'cart' (array),
    'wishlist' (array),
    'orderHistory' (array),

    // OTP Verification
    'verificationOTP', 'otpExpiry'
  ]
}
```

#### Key Features

**1. Role-Based Access**

```typescript
access: {
  admin: ({ req: { user } }) => user?.role === 'admin',
  create: () => true,  // Anyone can register
  read: ({ req: { user } }) => {
    if (user?.role === 'admin') return true
    return { id: { equals: user?.id } }  // Users see only themselves
  }
}
```

**2. Conditional Fields**

```typescript
{
  name: 'cart',
  admin: {
    condition: (data) => data.role === 'customer'  // Only show for customers
  }
}
```

**3. Email Verification**

```typescript
auth: {
  verify: {
    generateEmailHTML: ({ token, user }) => {
      return `<a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/verify-email?token=${token}">
        Verify Email
      </a>`
    }
  }
}
```

**4. Cart Structure**

```typescript
cart: [
  {
    product: relationship,
    quantity: number,
    addedAt: date,
  },
]
```

---

### 3.4 Reviews Collection

**File**: `src/collections/Reviews.ts`

#### Schema Overview

```typescript
{
  slug: 'reviews',
  fields: [
    'product' (relationship),
    'customer' (relationship),
    'title', 'comment',
    'rating' (1-5),
    'status': pending | approved | rejected,
    'isVerifiedPurchase',  // Auto-set
    'helpfulVotes'
  ]
}
```

#### Key Features

**1. Verified Purchase Check**

```typescript
beforeChange: [
  async ({ data, req, operation }) => {
    if (operation === 'create') {
      const orders = await req.payload.find({
        collection: 'orders',
        where: {
          and: [
            { customer: { equals: data.customer } },
            { status: { equals: 'delivered' } },
            { 'items.product': { equals: data.product } },
          ],
        },
      })
      data.isVerifiedPurchase = orders.totalDocs > 0
    }
  },
]
```

**2. Product Rating Update**

```typescript
async function updateProductRating(payload, productId) {
  const reviews = await payload.find({
    collection: 'reviews',
    where: {
      and: [{ product: { equals: productId } }, { status: { equals: 'approved' } }],
    },
  })

  const average = reviews.docs.reduce((sum, r) => sum + r.rating, 0) / reviews.totalDocs

  const breakdown = {
    fiveStars: reviews.docs.filter((r) => r.rating === 5).length,
    fourStars: reviews.docs.filter((r) => r.rating === 4).length,
    // ... etc
  }

  await payload.update({
    collection: 'products',
    id: productId,
    data: { rating: { average, count: reviews.totalDocs, breakdown } },
  })
}
```

---

### 3.5 Categories Collection

**File**: `src/collections/Category/index.ts`

#### Schema Overview

```typescript
{
  slug: 'categories',
  fields: [
    'title', 'slug', 'description',
    'parent' (self-relationship),  // For nested categories
    'image',
    'isActive', 'sortOrder',
    'productsCount'  // Auto-updated
  ]
}
```

#### Key Features

**1. Hierarchical Structure**

- Categories can have parent categories
- Enables multi-level navigation (e.g., Electronics > Laptops > Gaming Laptops)

**2. Auto Product Count**

- Updated by Product collection hooks
- Shows number of products in each category

---

## 4. API Routes

### 4.1 Authentication Routes

#### Send OTP

**File**: `src/app/api/auth/send-otp/route.ts`

```typescript
POST /api/auth/send-otp
Body: { email: string }

Flow:
1. Find user by email
2. Generate 6-digit OTP
3. Set expiry (10 minutes)
4. Update user with OTP
5. Send email via Resend API
6. Return success
```

**Email Template Features:**

- Professional HTML design
- Brand colors (#084710)
- Responsive layout
- Security notice
- 10-minute expiry warning

#### Verify OTP

**File**: `src/app/api/auth/verify-otp/route.ts`

```typescript
POST /api/auth/verify-otp
Body: { email: string, otp: string }

Flow:
1. Find user with matching email + OTP
2. Check if OTP expired
3. Set user._verified = true
4. Clear OTP fields
5. Return user data
```

---

### 4.2 Payment Webhook

**File**: `src/app/api/payments/webhook/route.ts`

```typescript
POST /api/payments/webhook
Headers: { x-paystack-signature: string }

Flow:
1. Get raw body text
2. Verify signature with HMAC SHA512
3. Parse event data
4. If charge.success:
   - Check idempotency (already paid?)
   - Update order status to 'paid'
   - Set payment reference
   - Return 200
5. Return 200 for other events
```

**Security:**

```typescript
const hash = crypto
  .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
  .update(bodyText)
  .digest('hex')

if (hash !== signature) {
  return new Response(null, { status: 400 })
}
```

---

## 5. Providers & Context

### 5.1 Auth Provider

**File**: `src/providers/Auth/index.tsx`

#### Features

**1. Dual Authentication**

- Payload JWT tokens (email/password)
- NextAuth (Google OAuth)

**2. State Management**

```typescript
const [user, setUser] = useState<User | null>(null)
const [token, setToken] = useState<string | null>(null)
const [loading, setLoading] = useState(true)
```

**3. Methods**

- `login(email, password)` - Payload auth
- `loginWithGoogle()` - OAuth
- `register(data)` - Create account
- `logout()` - Clear session
- `sendOTP(email)` - Email verification
- `verifyOTP(email, otp)` - Confirm email
- `forgotPassword(email)` - Reset request
- `resetPassword(token, password)` - Complete reset

**4. Token Storage**

```typescript
// Store in localStorage (client-side)
localStorage.setItem('payload-token', authToken)

// Include in API requests
headers: {
  Authorization: `Bearer ${token}`
}
```

---

### 5.2 Cart Provider

**File**: `src/providers/Cart/index.tsx`

#### Features

**1. Guest + Logged-in Support**

```typescript
// Guest: localStorage
// Logged-in: Synced to user.cart in database
```

**2. Cart Item Structure**

```typescript
type CartItem = {
  product: Product
  quantity: number
  variantSku: string // For product variants
}
```

**3. Methods**

- `addItem(product, variantSku, quantity)`
- `removeItem(productId, variantSku)`
- `updateQuantity(productId, variantSku, quantity)`
- `clearCart()`

**4. Auto-Sync Logic**

```typescript
useEffect(() => {
  if (!user) {
    // Guest: save to localStorage
    localStorage.setItem('cart', JSON.stringify(items))
  } else {
    // Logged-in: sync to server
    syncWithServer(items)
  }
}, [items, user])
```

**5. Login Merge**

```typescript
// When user logs in, merge guest cart with server cart
const mergeCart = async (guestCart) => {
  await syncWithServer(guestCart)
  localStorage.removeItem('cart')
}
```

---

### 5.3 Wishlist Provider

**File**: `src/providers/Wishlist/index.tsx`

Similar to Cart Provider but simpler:

- No quantities
- Just product references
- Guest + logged-in support
- Auto-sync on login

---

## 6. Frontend Components

### 6.1 Product Page

**File**: `src/app/(frontend)/product/[slug]/page.client.tsx`

#### Features

**1. Image Gallery**

- Main image display
- Thumbnail navigation
- Click to switch images

**2. Product Info**

- Title, rating, reviews count
- Price with discount badge
- Stock status indicator
- Quantity selector

**3. Action Buttons**

- Buy Now (add to cart + redirect to checkout)
- Add to Cart
- Add to Wishlist (toggle)

**4. Tabs**

- Product Details (description, features, shipping)
- Reviews (list, form, summary)

**5. Related Products**

- Grid of similar products
- Uses ProductCard component

#### State Management

```typescript
const [selectedImageIndex, setSelectedImageIndex] = useState(0)
const [quantity, setQuantity] = useState(1)
const [activeTab, setActiveTab] = useState('details')
const [isAddingToCart, setIsAddingToCart] = useState(false)
const [reviews, setReviews] = useState(initialReviews)
```

---

### 6.2 Checkout Page

**File**: `src/app/(frontend)/checkout/pageClient.tsx`

#### Features

**1. Payment Method Selection**

- Pay Online (Paystack)
- Pay on Pickup (Cash)

**2. Forms**

- Contact Information
- Shipping Address (online only)
- Billing Address (optional, separate)

**3. Order Summary**

- Cart items with images
- Subtotal, shipping, total
- Free shipping threshold (₦5,000)

**4. Validation**

```typescript
const validateForm = () => {
  if (!shippingForm.name || !shippingForm.phone || !shippingForm.email) {
    toast.error('Please fill in all contact information')
    return false
  }
  // ... more validation
  return true
}
```

**5. Submission**

```typescript
const onSubmit = async () => {
  const orderData = {
    items,
    shippingAddress,
    billingAddress,
    paymentMethod,
    total,
    subtotal,
    shipping,
  }

  const res = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData),
  })

  if (paymentMethod === 'pickup') {
    router.push(`/order-confirmation?orderId=${data.orderId}`)
  } else {
    window.location.href = data.authorization_url // Paystack
  }
}
```

---

### 6.3 Product Card

**File**: `src/components/ProductCard/ProductCard.tsx`

#### Features

**1. Product Display**

- Featured image
- Title, brand
- Star rating
- Price (with sale price)
- Stock status

**2. Wishlist Button**

- Heart icon (filled/outline)
- Tooltip on hover
- Animation on click

**3. Add to Cart Button**

- Shopping cart icon
- Disabled if out of stock

#### Props

```typescript
interface ProductCardProps {
  product: Product
  onWishlistToggle?: (productId: string, isInWishlist: boolean) => void
  onAddToCart?: (productId: string) => void
}
```

---

### 6.4 Header Component

**File**: `src/Header/Component.client.tsx`

#### Features

**1. Responsive Design**

- Desktop: Full navigation
- Tablet: Simplified nav
- Mobile: Drawer menu

**2. Search Bar**

- Input with icon
- Submit redirects to `/search?q=...`

**3. Navigation Links**

- Help dropdown
- Cart with badge
- Wishlist with badge
- Account dropdown

**4. User Menu (Logged In)**

- User name
- Wishlist
- Orders
- Account Settings
- Sign Out

**5. Guest Menu**

- Sign In button
- Create Account link
- Wishlist (guest)
- Orders (disabled)

**6. Scroll Behavior**

```typescript
const [isScrolled, setIsScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50)
  }
  window.addEventListener('scroll', handleScroll)
}, [])

// Changes background, shadow, and colors when scrolled
```

---

## 7. Authentication Flow

### 7.1 Registration Flow

```
1. User fills registration form
   ↓
2. POST /api/users (Payload)
   - Creates user with role='customer'
   - Sets _verified=false
   ↓
3. Payload sends verification email
   - Contains token link
   ↓
4. User clicks link → /verify-email?token=...
   ↓
5. POST /api/users/verify/:token
   - Sets _verified=true
   ↓
6. User can now login
```

### 7.2 OTP Verification Flow

```
1. User registers
   ↓
2. POST /api/auth/send-otp
   - Generates 6-digit OTP
   - Stores in user.verificationOTP
   - Sets 10-minute expiry
   - Sends email
   ↓
3. User enters OTP
   ↓
4. POST /api/auth/verify-otp
   - Validates OTP + expiry
   - Sets _verified=true
   - Clears OTP fields
   ↓
5. User can login
```

### 7.3 Login Flow

```
1. User enters email + password
   ↓
2. POST /api/users/login (Payload)
   - Validates credentials
   - Returns JWT token + user data
   ↓
3. Store token in localStorage
   ↓
4. Include token in subsequent requests:
   Authorization: Bearer <token>
```

### 7.4 Google OAuth Flow

```
1. User clicks "Sign in with Google"
   ↓
2. NextAuth redirects to Google
   ↓
3. User authorizes
   ↓
4. Google redirects back with code
   ↓
5. NextAuth exchanges code for tokens
   ↓
6. Creates/finds user in Payload
   ↓
7. Sets NextAuth session
   ↓
8. User is logged in
```

---

## 8. Payment Integration

### 8.1 Paystack Setup

**Environment Variables:**

```env
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
```

### 8.2 Checkout Flow

```
1. User completes checkout form
   ↓
2. POST /api/checkout
   - Creates order (status='pending', paymentStatus='pending')
   - Initializes Paystack transaction
   - Returns authorization_url
   ↓
3. Redirect user to Paystack
   ↓
4. User completes payment
   ↓
5. Paystack sends webhook → POST /api/payments/webhook
   - Verifies signature
   - Updates order (status='processing', paymentStatus='paid')
   ↓
6. Paystack redirects user to callback URL
   ↓
7. Show order confirmation
```

### 8.3 Webhook Security

```typescript
// 1. Get signature from header
const signature = request.headers.get('x-paystack-signature')

// 2. Compute HMAC
const hash = crypto
  .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
  .update(bodyText)
  .digest('hex')

// 3. Verify
if (hash !== signature) {
  return new Response(null, { status: 400 })
}
```

### 8.4 Idempotency

```typescript
// Check if order already paid
const order = await payload.findByID({
  collection: 'orders',
  id: orderId,
})

if (order.paymentStatus === 'paid') {
  return new Response(null, { status: 200 }) // Already processed
}
```

---

## Key Concepts Summary

### 1. Collections vs API Routes

- **Collections**: Data models (Products, Orders, Users)
- **API Routes**: Custom endpoints for specific logic

### 2. Hooks

- **beforeChange**: Modify data before saving
- **afterChange**: Trigger actions after saving
- **afterDelete**: Cleanup after deletion

### 3. Access Control

- **Function-based**: `({ req }) => boolean | query`
- **Admin-only**: `authenticated`
- **Public**: `() => true`

### 4. Relationships

- **hasMany**: One-to-many (Product → Categories)
- **Single**: One-to-one (Order → User)
- **Depth**: How deep to populate (0 = IDs only, 1+ = full objects)

### 5. State Management

- **Server**: Payload collections
- **Client**: React Context (Auth, Cart, Wishlist)
- **Sync**: useEffect + API calls

### 6. File Structure

- **(frontend)**: Public pages
- **(payload)**: Admin panel
- **api**: Custom endpoints
- **collections**: Data models
- **providers**: Global state

---

## Environment Variables

```env
# Database
DATABASE_URI=mongodb://...

# Payload
PAYLOAD_SECRET=...
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Storage
BLOB_READ_WRITE_TOKEN=...

# Email
RESEND_API_KEY=...

# Payment
PAYSTACK_SECRET_KEY=...
PAYSTACK_PUBLIC_KEY=...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Cron
CRON_SECRET=...
```

---

## Common Patterns

### 1. Fetching Data (Server Component)

```typescript
const payload = await getPayload({ config })
const products = await payload.find({
  collection: 'products',
  where: { status: { equals: 'published' } },
  limit: 10,
})
```

### 2. Fetching Data (Client Component)

```typescript
const response = await fetch('/api/products')
const data = await response.json()
```

### 3. Using Providers

```typescript
const { user, login, logout } = useAuth()
const { items, addItem, removeItem } = useCart()
const { isInWishlist, addItem } = useWishlist()
```

### 4. Protected Routes

```typescript
// In page component
if (!user) {
  redirect('/auth/login')
}
```

### 5. Toast Notifications

```typescript
import toast from 'react-hot-toast'

toast.success('Item added to cart')
toast.error('Failed to process payment')
```

---

## Troubleshooting

### Issue: "Cannot find module '@/payload.config'"

**Solution**: Check `tsconfig.json` has `"@/*": ["./src/*"]`

### Issue: Webhook not receiving events

**Solution**:

1. Check Paystack dashboard webhook URL
2. Verify signature validation
3. Check server logs

### Issue: Cart not syncing

**Solution**:

1. Check user is logged in
2. Verify token in localStorage
3. Check API endpoint `/api/users/cart`

### Issue: Images not loading

**Solution**:

1. Check Vercel Blob token
2. Verify media collection upload
3. Check image URL in database

---

## Next Steps

1. **Add Search**: Implement product search with filters
2. **Add Analytics**: Track user behavior
3. **Add Notifications**: Email order confirmations
4. **Add Admin Dashboard**: Sales reports, analytics
5. **Add Inventory Alerts**: Low stock notifications
6. **Add Promotions**: Coupon codes, discounts
7. **Add Shipping Zones**: Location-based shipping rates

---

**End of Guide**

For more information, refer to:

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Paystack Docs](https://paystack.com/docs)
