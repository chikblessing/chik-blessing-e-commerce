# Related Products Feature Guide

## Overview

The product detail page now displays related products at the bottom, using the manually selected products from the admin panel.

## How It Works

### Priority System:

1. **First Priority**: Manually selected related products (from admin panel)
2. **Fallback**: Category-based related products (if no manual selection)

### Admin Panel Setup

To add related products to a product:

1. **Go to Payload Admin** → Products
2. **Edit a product**
3. **Scroll to "Related Products" field**
4. **Click "Add Relationship"**
5. **Select products** you want to show as related (up to 4 recommended)
6. **Save the product**

### Frontend Display

The related products section appears at the bottom of the product detail page:

```
Product Details
Product Images | Product Info
Tabs (Details, Reviews)
---
Related Products  ← Shows here
[Card] [Card] [Card] [Card]
```

## Features

### ✅ Manual Selection (Priority)

- Admin can manually select which products to show
- Shows exactly what you choose in the admin panel
- Automatically filters out:
  - Unpublished products
  - Null/invalid products
- Limits to 4 products maximum

### ✅ Automatic Fallback

- If no manual selection, shows products from same categories
- Excludes the current product
- Only shows published products
- Limits to 4 products

### ✅ Responsive Design

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns
- Equal height cards

### ✅ Full Product Card Features

- Product image
- Title and price
- Discount badge (if applicable)
- Rating and reviews
- Wishlist button
- Add to cart button
- Quick view on hover

## Use Cases

### Use Case 1: Cross-Selling

**Scenario**: Selling a laptop
**Related Products**: Mouse, keyboard, laptop bag, USB hub

**How to set up**:

1. Edit the laptop product
2. Add related products: Mouse, Keyboard, Laptop Bag, USB Hub
3. Save

### Use Case 2: Upselling

**Scenario**: Selling a basic phone
**Related Products**: Premium phone models

**How to set up**:

1. Edit the basic phone product
2. Add related products: Mid-range phone, Premium phone
3. Save

### Use Case 3: Complementary Products

**Scenario**: Selling a camera
**Related Products**: Memory card, camera bag, tripod, lens

**How to set up**:

1. Edit the camera product
2. Add related products: Memory Card, Camera Bag, Tripod, Lens
3. Save

### Use Case 4: Same Category (Automatic)

**Scenario**: No manual selection
**Result**: Automatically shows other products from the same category

## Best Practices

### 1. Choose Relevant Products

- Select products that complement the main product
- Consider what customers typically buy together
- Think about the customer's needs

### 2. Limit to 4 Products

- Too many options can overwhelm customers
- 4 products fit nicely in a row on desktop
- Keeps the page clean and focused

### 3. Update Regularly

- Review related products periodically
- Update based on sales data
- Remove discontinued products

### 4. Test Different Combinations

- Try different product combinations
- Monitor which related products get clicked
- Adjust based on performance

## Technical Details

### File Locations:

- **Server Component**: `src/app/(frontend)/product/[slug]/page.tsx`
- **Client Component**: `src/app/(frontend)/product/[slug]/page.client.tsx`
- **Product Collection**: `src/collections/Products/index.ts`
- **Product Card**: `src/components/ProductCard/ProductCard.tsx`

### Data Flow:

```
1. User visits product page
   ↓
2. Server fetches product (with depth: 2)
   ↓
3. Check if product.relatedProducts exists
   ↓
4a. If YES: Use manually selected products
4b. If NO: Query products from same categories
   ↓
5. Pass to client component
   ↓
6. Render ProductCard for each related product
```

### Query Details:

**Manual Selection**:

- Uses `product.relatedProducts` field
- Already populated with depth: 2
- Filters published products only
- Limits to 4 products

**Category-Based Fallback**:

```typescript
where: {
  and: [
    { categories: { in: categoryIds } },
    { id: { not_equals: currentProductId } },
    { status: { equals: 'published' } },
  ],
}
limit: 4
```

## Troubleshooting

### Issue: Related products not showing

**Check**:

1. Are related products added in admin panel?
2. Are the related products published?
3. Does the product have categories assigned?
4. Check browser console for errors

### Issue: Wrong products showing

**Solution**:

1. Go to admin panel
2. Edit the product
3. Update the related products field
4. Save and refresh the page

### Issue: Only showing 1-2 products

**Reason**:

- Some related products might be unpublished
- Some might be null/invalid

**Solution**:

1. Add more related products in admin
2. Ensure all related products are published

## Future Enhancements (Optional)

1. **Smart Recommendations**: Use AI/ML to suggest related products
2. **Frequently Bought Together**: Track purchase patterns
3. **Recently Viewed**: Show products user recently viewed
4. **Personalized**: Show different products based on user history
5. **A/B Testing**: Test different product combinations
6. **Analytics**: Track which related products get clicked most

## Summary

✅ **Manual Control**: Choose exactly which products to show
✅ **Automatic Fallback**: Smart category-based suggestions
✅ **Easy Setup**: Just select products in admin panel
✅ **Responsive**: Works on all devices
✅ **Performance**: Efficient queries with proper depth

The related products feature is now fully functional and ready to use!
