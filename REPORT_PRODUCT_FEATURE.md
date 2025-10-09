# Report a Product Feature

## Overview

A comprehensive product reporting system that allows users to report problematic products on your e-commerce platform.

## Features Implemented

### 1. Report Product Page (`/report-product`)

A user-friendly form with all required fields:

#### Form Fields:

- **Name**: Reporter's first and last name (required)
- **State**: Dropdown of all 37 Nigerian states (required)
- **Requester Type**: Individual or Organization (required)
- **Reason for Reporting**: 4 predefined options (required)
  1. Product description appears to be wrong or misleading information
  2. Product description contains inappropriate content
  3. Product appears to be counterfeit
  4. Product may be prohibited or banned by law
- **Additional Details**: Text area for extra information (optional)
- **Email Address**: Reporter's email (required)
- **Phone Number**: Reporter's phone (required)
- **Company Name**: Required if requester type is "Organization"
- **Product Link**: Full URL of the product being reported (required)

### 2. Form Validation

- All required fields must be filled
- Email format validation
- URL format validation for product link
- Company name required only for organizations
- Clear error messages

### 3. Success Handling

- Success message displayed after submission
- Automatic redirect to homepage after 3 seconds
- Form reset after successful submission

### 4. Database Collection

**ProductReports Collection** stores all reports with:

- Reporter information
- Report details
- Status tracking (Pending, Investigating, Resolved, Dismissed)
- Admin notes field
- Timestamps

### 5. Admin Panel Integration

Admins can:

- View all product reports
- Filter by status
- Update report status
- Add internal notes
- Track investigation progress

## User Flow

1. User finds a problematic product
2. Navigates to `/report-product`
3. Fills out the form with details
4. Submits the report
5. Sees success confirmation
6. Gets redirected to homepage

## Admin Workflow

1. Report appears in admin panel
2. Status: "Pending Review"
3. Admin reviews the report
4. Updates status to "Under Investigation"
5. Investigates the product
6. Takes appropriate action
7. Updates status to "Resolved" or "Dismissed"
8. Adds admin notes for record keeping

## API Endpoint

**POST** `/api/report-product`

### Request Body:

```json
{
  "name": "John Doe",
  "state": "Lagos",
  "requesterType": "individual",
  "reason": "Product appears to be counterfeit",
  "additionalDetails": "The product looks fake...",
  "email": "john@example.com",
  "phone": "+234 800 000 0000",
  "companyName": "",
  "productLink": "https://example.com/product/123"
}
```

### Response:

```json
{
  "success": true,
  "reportId": "abc123",
  "message": "Report submitted successfully"
}
```

## Design Features

### Styling:

- Matches website theme (#084710 green)
- Clean, professional layout
- Responsive design
- Clear visual hierarchy
- Accessible form labels

### User Experience:

- Clear instructions
- Required field indicators (\*)
- Helpful placeholder text
- Error messages
- Success feedback
- Cancel button to go back

## Nigerian States Included

All 37 states and FCT:

- Abia, Adamawa, Akwa Ibom, Anambra, Bauchi, Bayelsa, Benue, Borno
- Cross River, Delta, Ebonyi, Edo, Ekiti, Enugu, FCT, Gombe
- Imo, Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi, Kwara
- Lagos, Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau
- Rivers, Sokoto, Taraba, Yobe, Zamfara

## Report Reasons

1. **Misleading Information**: Wrong or misleading product descriptions
2. **Inappropriate Content**: Offensive or inappropriate content
3. **Counterfeit**: Fake or counterfeit products
4. **Prohibited**: Products that may be illegal or banned

## Status Options

- **Pending Review**: New report awaiting admin review
- **Under Investigation**: Admin is investigating the report
- **Resolved**: Issue has been resolved (product removed/updated)
- **Dismissed**: Report was reviewed and dismissed

## Access Control

### Public Access:

- Anyone can submit a report (no login required)
- Form is publicly accessible at `/report-product`

### Admin Access:

- Only authenticated admins can view reports
- Only admins can update report status
- Only admins can add internal notes

## Files Created

1. `src/app/(frontend)/report-product/page.tsx` - Route definition
2. `src/app/(frontend)/report-product/page.client.tsx` - Form component
3. `src/app/api/report-product/route.ts` - API endpoint
4. `src/collections/ProductReports.ts` - Database collection
5. Updated `src/payload.config.ts` - Added collection to config

## Usage

### For Users:

Navigate to: `https://yourdomain.com/report-product`

### For Admins:

Access reports at: `https://yourdomain.com/admin/collections/product-reports`

## Next Steps (Optional Enhancements)

1. Email notifications to admins when new reports are submitted
2. Email confirmation to reporters
3. Ability to attach screenshots/evidence
4. Report tracking system for users
5. Automated product flagging based on report count
6. Integration with product moderation workflow
7. Analytics dashboard for report trends
8. Bulk actions for admins
9. Report categories/tags
10. Priority levels for reports

## Security Features

- Form validation on both client and server
- Rate limiting (can be added)
- Sanitized inputs
- Admin-only access to sensitive data
- Audit trail with timestamps

## Benefits

✅ Helps maintain product quality
✅ Protects customers from fraud
✅ Builds trust in the platform
✅ Provides accountability
✅ Easy for users to report issues
✅ Streamlined admin workflow
✅ Comprehensive record keeping
