# Admin User Management Guide

This guide explains how administrators can manage user accounts, including suspending accounts and resending verification OTPs.

## Features

### 1. Suspend User Accounts

Administrators can suspend user accounts to prevent them from logging in. This is useful for:

- Temporarily blocking problematic users
- Investigating suspicious activity
- Enforcing account restrictions

#### How to Suspend a User

**Via Admin Panel:**

1. Log in to the admin panel at `/admin`
2. Navigate to Collections → Users
3. Select the user you want to suspend
4. Check the "Suspended" checkbox in the sidebar
5. Click "Save"

**Via API:**

```bash
POST /api/admin/suspend-user
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "userId": "user-id-here",
  "suspended": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "User suspended successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "suspended": true
  }
}
```

#### How to Unsuspend a User

Follow the same steps but set `suspended` to `false` or uncheck the checkbox.

#### Important Notes:

- Admins cannot suspend their own accounts
- Suspended users will see an error message when trying to log in
- Both credential-based and OAuth (Google) logins are blocked for suspended users

---

### 2. Resend OTP for Unverified Users

Administrators can manually resend verification OTPs to users who haven't verified their email addresses.

#### How to Resend OTP

**Via API:**

```bash
POST /api/admin/resend-otp
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "userId": "user-id-here"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully to user",
  "email": "user@example.com"
}
```

#### Error Cases:

**User Already Verified:**

```json
{
  "error": "User is already verified"
}
```

**User Not Found:**

```json
{
  "error": "User not found"
}
```

**Unauthorized (Non-Admin):**

```json
{
  "error": "Admin access required"
}
```

---

## User Collection Schema

The Users collection now includes:

```typescript
{
  // ... existing fields

  suspended: boolean // Account suspension status
  verificationOTP: string // 6-digit OTP code (hidden in admin UI)
  otpExpiry: Date // OTP expiration time (hidden in admin UI)
}
```

---

## Security Features

### Account Suspension

- Only admins can suspend/unsuspend accounts
- Admins cannot suspend themselves
- Suspended status is checked during both credential and OAuth login
- Clear error messages are shown to suspended users

### OTP Resend

- Only admins can trigger OTP resend
- OTPs expire after 10 minutes
- Professional email template is sent to users
- Cannot resend OTP to already verified users

---

## API Authentication

All admin endpoints require authentication via Bearer token:

```javascript
headers: {
  'Authorization': 'Bearer <admin-token>',
  'Content-Type': 'application/json'
}
```

The token should be the admin user's ID or JWT token depending on your authentication setup.

---

## Email Template

When an OTP is resent, users receive a professional email with:

- 6-digit verification code
- 10-minute expiration notice
- Step-by-step instructions
- Security notice
- Support contact information

---

## Testing the Features

### Test Suspending a User:

1. Create a test customer account
2. Log in as admin
3. Suspend the test account
4. Try logging in with the suspended account
5. Verify the error message appears

### Test Resending OTP:

1. Create a new user account (don't verify)
2. Log in as admin
3. Call the resend OTP endpoint with the user's ID
4. Check the user's email for the OTP
5. Verify the OTP on the verification page

---

## Common Use Cases

### Scenario 1: User Reports Account Issues

If a user can't receive their verification email:

1. Verify the user exists in the system
2. Check their email address is correct
3. Use the resend OTP endpoint to send a new code
4. Confirm with the user they received it

### Scenario 2: Suspicious Activity

If you detect suspicious activity from an account:

1. Immediately suspend the account
2. Investigate the activity
3. Contact the user if needed
4. Unsuspend once resolved or take further action

### Scenario 3: Bulk User Management

For managing multiple users:

1. Use the admin panel's user list
2. Filter by verification status or other criteria
3. Take action on individual accounts as needed

---

## Troubleshooting

### OTP Email Not Sending

- Check RESEND_API_KEY is set in environment variables
- Verify the sender domain is verified in Resend
- Check server logs for email errors

### Suspension Not Working

- Verify the admin has proper role permissions
- Check the suspended field is being saved
- Clear any cached sessions

### API Returns 401/403

- Verify the Authorization header is correct
- Ensure the user making the request is an admin
- Check the token is valid and not expired

---

## Best Practices

1. **Document Actions**: Keep a log of why accounts were suspended
2. **Communicate**: Inform users when their accounts are suspended
3. **Review Regularly**: Periodically review suspended accounts
4. **Use Sparingly**: Only suspend when necessary
5. **Quick Response**: Resend OTPs promptly when users request help

---

## Related Files

- User Collection: `src/collections/Users/index.ts`
- User Types: `src/types/User.ts`
- Auth Configuration: `src/lib/auth.ts`
- Suspend API: `src/app/api/admin/suspend-user/route.ts`
- Resend OTP API: `src/app/api/admin/resend-otp/route.ts`
- Send OTP API: `src/app/api/auth/send-otp/route.ts`
- Verify OTP API: `src/app/api/auth/verify-otp/route.ts`
