# Payload Configuration - Line by Line

## File: `src/payload.config.ts`

This is the **main configuration file** for Payload CMS.

### Imports Section

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
```
- **What:** Database adapter for MongoDB
- **Why:** Connects Payload to MongoDB database
- **How it works:** Translates Payload operations into MongoDB queries

```typescript
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
```
- **What:** Cloud storage plugin
- **Why:** Store files (images) in Vercel's cloud instead of your server
- **Benefits:** Faster, scalable, automatic CDN

```typescript
import sharp from 'sharp'
```
- **What:** Image processing library
- **Why:** Automatically resize and optimize images
- **Example:** Upload 5MB image → creates thumbnail, medium, large versions

```typescript
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
```
- **What:** Gets the current file's directory path
- **Why:** Payload needs to know where files are located
- **import.meta.url:** Current file's URL
- **fileURLToPath:** Converts URL to file system path

### Admin Panel Configuration

```typescript
admin: {
  components: {
    beforeLogin: ['@/components/BeforeLogin'],
    beforeDashboard: ['@/components/BeforeDashboard'],
  },
```
- **beforeLogin:** Component shown before login form
- **beforeDashboard:** Component shown on dashboard
- **@/:** Alias for `src/` directory

```typescript
  user: Users.slug,
```
- **What:** Which collection handles authentication
- **Users.slug:** The "users" collection
- **Result:** Users from this collection can log into admin panel

```typescript
  livePreview: {
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
    ],
  },
```
- **What:** Preview content at different screen sizes
- **Why:** Ensure content looks good on all devices
- **375x667:** iPhone SE size
- **768x1024:** iPad size
- **1440x900:** Desktop size

### Database Configuration

```typescript
db: mongooseAdapter({
  url: process.env.DATABASE_URI || '',
}),
```
- **mongooseAdapter:** Use MongoDB as database
- **process.env.DATABASE_URI:** Environment variable with connection string
- **Example:** `mongodb://localhost:27017/store` or MongoDB Atlas URL
- **|| '':** Fallback to empty string (will error - intentional)

### Collections Array

```typescript
collections: [
  Pages, Posts, Media, Categories,
  Products, Promotions, Orders, Reviews,
  ShippingZones, ProductReports,
  ContactSubmissions, Users,
],
```
- **What:** All data models in your system
- **Each collection:** Becomes a section in admin panel
- **Order:** Matters for some operations
- **Result:** Creates database tables/collections

### CORS Configuration

```typescript
cors: [getServerSideURL()].filter(Boolean),
```
- **CORS:** Cross-Origin Resource Sharing
- **What it does:** Controls which domains can access your API
- **getServerSideURL():** Your server's URL
- **.filter(Boolean):** Remove null/undefined values
- **Security:** Only your frontend can access backend

### Globals

```typescript
globals: [Header, Footer],
```
- **What:** Singleton data (only one instance)
- **Header:** Navigation menu data
- **Footer:** Footer content
- **Difference from collections:** Collections have many records, globals have one

### Plugins

```typescript
plugins: [
  ...plugins,
  vercelBlobStorage({
    enabled: process.env.BLOB_READ_WRITE_TOKEN ? true : false,
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN || '',
  }),
],
```
- **...plugins:** Spread operator - includes plugins from another file
- **enabled:** Only enable if we have API token
- **collections: { media: true }:** Use blob storage for media collection
- **token:** API key for Vercel Blob

### Secret Key

```typescript
secret: process.env.PAYLOAD_SECRET,
```
- **What:** Secret key for encryption
- **Used for:** JWT tokens, cookies, sessions
- **Security:** MUST be kept secret, never commit to git
- **Should be:** Long random string (32+ characters)

### TypeScript Configuration

```typescript
typescript: {
  outputFile: path.resolve(dirname, 'payload-types.ts'),
},
```
- **What:** Auto-generate TypeScript types
- **outputFile:** Where to save generated types
- **Result:** Creates types for all collections
- **Example:** `Product` type with all fields

### Jobs Configuration

```typescript
jobs: {
  access: {
    run: ({ req }: { req: PayloadRequest }): boolean => {
      if (req.user) return true
      
      const authHeader = req.headers.get('authorization')
      return authHeader === `Bearer ${process.env.CRON_SECRET}`
    },
  },
  tasks: [],
},
```
- **jobs:** Background task configuration
- **access.run:** Who can run background jobs
- **if (req.user):** Allow logged-in users
- **authHeader check:** Allow Vercel Cron jobs with secret
- **tasks:** Array of scheduled tasks (currently empty)
- **Use case:** Send emails, clean up old data, etc.

---

## Summary

This configuration file:
1. ✅ Connects to MongoDB database
2. ✅ Sets up cloud file storage
3. ✅ Configures admin panel
4. ✅ Defines all collections
5. ✅ Sets up authentication
6. ✅ Configures security (CORS, secrets)
7. ✅ Enables TypeScript types
8. ✅ Sets up background jobs

**Next:** See `02-PRODUCTS-COLLECTION-EXPLAINED.md` for Products collection details.
