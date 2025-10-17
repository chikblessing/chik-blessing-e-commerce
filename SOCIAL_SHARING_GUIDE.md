# Social Sharing Feature Guide

## Overview

The product detail page now has fully functional social sharing buttons for multiple platforms.

## Platforms Supported

### 1. ✅ Facebook

**Status**: Fully functional
**How it works**: Opens Facebook's share dialog with product URL and description
**User experience**: Click → Facebook opens → Share to timeline/story

### 2. ✅ Twitter/X

**Status**: Fully functional
**How it works**: Opens Twitter's tweet composer with product details
**User experience**: Click → Twitter opens → Tweet with product link

### 3. ✅ WhatsApp

**Status**: Fully functional
**How it works**: Opens WhatsApp with pre-filled message
**User experience**: Click → WhatsApp opens → Select contact → Send

### 4. ✅ Telegram

**Status**: Fully functional (NEW!)
**How it works**: Opens Telegram's share interface
**User experience**: Click → Telegram opens → Select chat → Send

### 5. ✅ Instagram

**Status**: Functional with instructions (NEW!)
**How it works**: Copies link to clipboard with instructions
**User experience**: Click → Link copied → Follow instructions to share on Instagram
**Note**: Instagram doesn't have a web share API, so this is the best solution

### 6. ✅ Copy Link

**Status**: Fully functional
**How it works**: Copies product URL to clipboard
**User experience**: Click → Link copied → Tooltip shows confirmation

## Button Locations

The share buttons appear on the product detail page:

- **Desktop**: Below the "Add to Cart" button
- **Mobile**: Same location, responsive layout
- **Label**: "Share this product:"

## Button Styles

Each platform has its brand colors:

- **Facebook**: Blue (#1877F2)
- **Twitter/X**: Black
- **WhatsApp**: Green (#25D366)
- **Telegram**: Blue (#0088cc)
- **Instagram**: Gradient (Pink/Purple/Blue)
- **Copy Link**: Gray

## What Gets Shared

### Facebook:

```
URL: https://yoursite.com/product/product-name
Quote: Product short description or "Check out [Product Name] for ₦[Price]"
```

### Twitter/X:

```
Text: Check out [Product Name] - ₦[Price]
URL: https://yoursite.com/product/product-name
```

### WhatsApp:

```
Message: Check out [Product Name] - ₦[Price] https://yoursite.com/product/product-name
```

### Telegram:

```
Text: Check out [Product Name] - ₦[Price]
URL: https://yoursite.com/product/product-name
```

### Instagram:

```
Copied text: Check out [Product Name] - ₦[Price]
https://yoursite.com/product/product-name

Instructions shown:
✅ Product link copied!

To share on Instagram:
1. Open Instagram app
2. Create a new post or story
3. Paste the link in your caption or bio
```

## Technical Details

### File Location:

`src/app/(frontend)/product/[slug]/page.client.tsx`

### Functions:

- `handleShareFacebook()` - Opens Facebook share dialog
- `handleShareTwitter()` - Opens Twitter tweet composer
- `handleShareWhatsApp()` - Opens WhatsApp with message
- `handleShareTelegram()` - Opens Telegram share interface
- `handleShareInstagram()` - Copies link with instructions
- `handleCopyLink()` - Copies URL to clipboard

### Share URLs:

```typescript
// Facebook
https://www.facebook.com/sharer/sharer.php?u=[URL]&quote=[DESCRIPTION]

// Twitter/X
https://twitter.com/intent/tweet?url=[URL]&text=[TEXT]

// WhatsApp
https://wa.me/?text=[MESSAGE]

// Telegram
https://t.me/share/url?url=[URL]&text=[TEXT]
```

## User Experience

### Desktop:

1. User clicks share button
2. New window/tab opens (600x600px for Facebook, 600x400px for Twitter)
3. User completes share on the platform
4. Window closes automatically (on some platforms)

### Mobile:

1. User clicks share button
2. Platform app opens (if installed)
3. Or mobile web version opens
4. User completes share
5. Returns to your site

### Copy Link:

1. User clicks copy button
2. Link copied to clipboard
3. Tooltip appears: "Link copied!"
4. Tooltip disappears after 2 seconds

### Instagram:

1. User clicks Instagram button
2. Alert shows with instructions
3. Link is copied to clipboard
4. User follows instructions to share

## Why Instagram is Different

Instagram doesn't provide a web share API like other platforms. The options are:

1. ❌ **Deep linking**: Only works in mobile apps, not web
2. ❌ **Instagram Graph API**: Requires business account and approval
3. ✅ **Copy link with instructions**: Best user experience for web

Our implementation:

- Copies the product link automatically
- Shows clear instructions
- Works on all devices
- No special permissions needed

## Best Practices

### 1. Product Descriptions

- Keep short descriptions under 200 characters
- They're used in Facebook and other shares
- Make them compelling and clear

### 2. Product Images

- Use high-quality images
- They appear in social media previews
- Recommended: 1200x630px for best results

### 3. Meta Tags (Optional Enhancement)

Add Open Graph tags to improve social sharing:

```html
<meta property="og:title" content="Product Name" />
<meta property="og:description" content="Product Description" />
<meta property="og:image" content="Product Image URL" />
<meta property="og:url" content="Product URL" />
```

## Troubleshooting

### Issue: Facebook shows blank page

**Cause**: Facebook's share dialog needs proper URL encoding
**Solution**: Already fixed - using proper `encodeURIComponent()`

### Issue: WhatsApp doesn't open

**Cause**: User doesn't have WhatsApp installed
**Solution**: WhatsApp Web will open instead

### Issue: Instagram button doesn't work

**Cause**: Instagram has no web share API
**Solution**: Already implemented - copies link with instructions

### Issue: Copy link doesn't work

**Cause**: Browser doesn't support clipboard API
**Solution**: Add fallback (future enhancement)

## Future Enhancements (Optional)

1. **LinkedIn Sharing**: Add LinkedIn button for B2B products
2. **Pinterest**: Add Pinterest for visual products
3. **Email Sharing**: Add "Share via Email" button
4. **Native Share API**: Use browser's native share on mobile
5. **Share Analytics**: Track which platforms are most used
6. **Custom Messages**: Let users edit message before sharing
7. **QR Code**: Generate QR code for easy mobile sharing

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

  // Rest of function...
}
```

## Summary

✅ **6 sharing options**: Facebook, Twitter, WhatsApp, Telegram, Instagram, Copy Link
✅ **Fully functional**: All buttons work correctly
✅ **Mobile-friendly**: Works on all devices
✅ **Brand colors**: Each button uses platform's official colors
✅ **User-friendly**: Clear feedback and instructions
✅ **No dependencies**: Uses native browser APIs

The social sharing feature is now complete and ready to use!
