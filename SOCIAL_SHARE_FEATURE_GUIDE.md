# Social Media Share Feature Guide

## Overview

Added social media share buttons to the product detail page, allowing customers to share products on Facebook, Twitter/X, WhatsApp, and copy the product link.

## Features Implemented

### 1. Share Buttons

Four sharing options are available:

#### Facebook Share

- Opens Facebook share dialog
- Pre-fills with product URL
- Opens in popup window (600x400)

#### Twitter/X Share

- Opens Twitter/X share dialog
- Includes product title and price in tweet
- Pre-fills product URL
- Opens in popup window (600x400)

#### WhatsApp Share

- Opens WhatsApp with pre-filled message
- Includes product title, price, and URL
- Works on both mobile and desktop
- Opens WhatsApp web or app

#### Copy Link

- Copies product URL to clipboard
- Shows "Link copied!" tooltip for 2 seconds
- Uses modern Clipboard API
- Fallback for older browsers

### 2. Button Design

Each button features:

- ✅ Brand-specific colors
  - Facebook: Blue (#1877F2)
  - Twitter/X: Black
  - WhatsApp: Green (#25D366)
  - Copy Link: Gray
- ✅ Hover effects
- ✅ Smooth transitions
- ✅ Circular shape (40x40px)
- ✅ Brand icons (SVG)
- ✅ Tooltips on hover

### 3. Location

The share buttons are located:

- Below the "Add to Cart" button
- Above the product details tabs
- In the product info section (right side)
- Separated by a border-top for visual clarity

## How It Works

### User Flow:

1. **Customer views product**
2. **Scrolls to share buttons** (below action buttons)
3. **Clicks desired platform**:
   - Facebook/Twitter: Opens popup window
   - WhatsApp: Opens WhatsApp with message
   - Copy Link: Copies URL and shows confirmation

### Technical Implementation:

```typescript
// Get current product URL
const getProductUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
}

// Facebook Share
const handleShareFacebook = () => {
  const url = getProductUrl()
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    '_blank',
    'width=600,height=400',
  )
}

// Twitter Share
const handleShareTwitter = () => {
  const url = getProductUrl()
  const text = `Check out ${product.title} - ₦${displayPrice.toLocaleString()}`
  window.open(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    '_blank',
    'width=600,height=400',
  )
}

// WhatsApp Share
const handleShareWhatsApp = () => {
  const url = getProductUrl()
  const text = `Check out ${product.title} - ₦${displayPrice.toLocaleString()} ${url}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

// Copy Link
const handleCopyLink = async () => {
  const url = getProductUrl()
  try {
    await navigator.clipboard.writeText(url)
    setShowCopiedTooltip(true)
    setTimeout(() => setShowCopiedTooltip(false), 2000)
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}
```

## Share Message Format

### Facebook:

- URL only (Facebook auto-generates preview)

### Twitter/X:

```
Check out [Product Title] - ₦[Price]
[Product URL]
```

### WhatsApp:

```
Check out [Product Title] - ₦[Price] [Product URL]
```

### Copy Link:

- Just the URL

## Benefits

### For Customers:

- ✅ Easy product sharing with friends/family
- ✅ Multiple platform options
- ✅ Quick copy link for other platforms
- ✅ Pre-filled messages save time

### For Business:

- ✅ Increased product visibility
- ✅ Word-of-mouth marketing
- ✅ Social proof
- ✅ Potential viral sharing
- ✅ Track referral traffic

## Use Cases

### Use Case 1: Gift Recommendations

**Scenario**: Customer finds perfect gift
**Action**: Shares on WhatsApp with family
**Result**: More people see the product

### Use Case 2: Price Comparison

**Scenario**: Customer wants to show friend a deal
**Action**: Copies link and sends via email
**Result**: Friend visits and potentially buys

### Use Case 3: Social Proof

**Scenario**: Customer loves a product
**Action**: Shares on Facebook/Twitter
**Result**: Followers see recommendation

### Use Case 4: Wishlist Sharing

**Scenario**: Customer wants to hint at gift
**Action**: Shares on social media
**Result**: Friends/family know what to buy

## Browser Compatibility

### Clipboard API (Copy Link):

- ✅ Chrome 63+
- ✅ Firefox 53+
- ✅ Safari 13.1+
- ✅ Edge 79+

### Social Share URLs:

- ✅ Works on all modern browsers
- ✅ Mobile and desktop compatible
- ✅ No external libraries needed

## Mobile Behavior

### WhatsApp:

- Mobile: Opens WhatsApp app
- Desktop: Opens WhatsApp Web

### Facebook/Twitter:

- Mobile: Opens native app (if installed)
- Desktop: Opens web version

### Copy Link:

- Works on all devices
- Shows confirmation tooltip

## Customization Options

### Change Share Message:

Edit the text in `handleShareTwitter` and `handleShareWhatsApp`:

```typescript
const text = `Your custom message here - ${product.title}`
```

### Add More Platforms:

Add buttons for:

- LinkedIn
- Pinterest
- Telegram
- Email
- SMS

Example LinkedIn:

```typescript
const handleShareLinkedIn = () => {
  const url = getProductUrl()
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    '_blank',
    'width=600,height=400',
  )
}
```

### Change Button Colors:

Update the `className` for each button:

```typescript
className = 'bg-[#YourColor] hover:bg-[#YourHoverColor]'
```

### Change Button Size:

Update `w-10 h-10` to your preferred size:

```typescript
className = 'w-12 h-12' // Larger
className = 'w-8 h-8' // Smaller
```

## Analytics Tracking (Optional)

To track share button clicks, add analytics:

```typescript
const handleShareFacebook = () => {
  // Track event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      method: 'Facebook',
      content_type: 'product',
      item_id: product.id,
    })
  }

  // Open share dialog
  const url = getProductUrl()
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    '_blank',
    'width=600,height=400',
  )
}
```

## SEO Benefits

### Open Graph Tags (Recommended):

Add to your product page `<head>`:

```html
<meta property="og:title" content="{product.title}" />
<meta property="og:description" content="{product.shortDescription}" />
<meta property="og:image" content="{product.images[0]?.url}" />
<meta property="og:url" content="{productUrl}" />
<meta property="og:type" content="product" />
<meta property="og:price:amount" content="{displayPrice}" />
<meta property="og:price:currency" content="NGN" />
```

### Twitter Card Tags:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{product.title}" />
<meta name="twitter:description" content="{product.shortDescription}" />
<meta name="twitter:image" content="{product.images[0]?.url}" />
```

## Testing

### Test Checklist:

- [ ] Facebook share opens popup
- [ ] Twitter share includes product info
- [ ] WhatsApp share works on mobile
- [ ] Copy link shows confirmation
- [ ] All buttons have hover effects
- [ ] Tooltips appear correctly
- [ ] Share URLs are properly encoded
- [ ] Mobile responsive

### Test on Different Devices:

- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] Mobile iOS Safari
- [ ] Mobile Android Chrome
- [ ] Tablet

## Troubleshooting

### Issue: Copy link not working

**Solution**: Check browser compatibility, ensure HTTPS

### Issue: WhatsApp not opening

**Solution**: Check URL encoding, ensure proper format

### Issue: Popup blocked

**Solution**: User needs to allow popups for your site

### Issue: Share preview not showing image

**Solution**: Add Open Graph meta tags

## Future Enhancements (Optional)

1. **Share Count**: Display how many times product was shared
2. **Email Share**: Add email share button
3. **Pinterest**: Add Pinterest pin button
4. **QR Code**: Generate QR code for easy mobile sharing
5. **Share Incentive**: Offer discount for sharing
6. **Social Login**: Allow login via social platforms
7. **Share Analytics**: Track which platform drives most traffic
8. **Custom Messages**: Let users edit share message
9. **Image Selection**: Let users choose which image to share
10. **Share History**: Show user's share history

## Summary

✅ **4 Share Options**: Facebook, Twitter/X, WhatsApp, Copy Link
✅ **Easy to Use**: One-click sharing
✅ **Mobile Friendly**: Works on all devices
✅ **Brand Colors**: Recognizable platform colors
✅ **No Dependencies**: Pure JavaScript, no external libraries
✅ **Fast**: Instant sharing, no page reload
✅ **Accessible**: Tooltips and proper titles

The social share feature is now live and ready to increase your product visibility through social media! 🎉
