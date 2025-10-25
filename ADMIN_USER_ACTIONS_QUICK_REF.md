# Admin User Actions - Quick Reference

## Suspend User Account

**Admin Panel:**

1. Go to `/admin` → Users
2. Select user → Check "Suspended" → Save

**API:**

```bash
POST /api/admin/suspend-user
Authorization: Bearer <admin-token>

{
  "userId": "user-id",
  "suspended": true  # or false to unsuspend
}
```

---

## Resend Verification OTP

**API Only:**

```bash
POST /api/admin/resend-otp
Authorization: Bearer <admin-token>

{
  "userId": "user-id"
}
```

**Requirements:**

- User must NOT be verified
- Admin authentication required
- OTP expires in 10 minutes

---

## Quick Checks

**Is user suspended?**

- Check Users collection → "Suspended" field

**Is user verified?**

- Check Users collection → "\_verified" field

**Need to help user verify?**

- Use resend OTP endpoint

**Need to block user?**

- Suspend their account

---

## Error Messages

| Error                                 | Meaning                               |
| ------------------------------------- | ------------------------------------- |
| "Account suspended"                   | User tried to login while suspended   |
| "User is already verified"            | Cannot resend OTP to verified user    |
| "Admin access required"               | Non-admin tried to use admin endpoint |
| "You cannot suspend your own account" | Admin tried to suspend themselves     |

---

## Files Modified

- ✅ `src/collections/Users/index.ts` - Added suspended field
- ✅ `src/types/User.ts` - Added suspended, verificationOTP, otpExpiry types
- ✅ `src/lib/auth.ts` - Added suspension checks during login
- ✅ `src/app/api/admin/suspend-user/route.ts` - New endpoint
- ✅ `src/app/api/admin/resend-otp/route.ts` - New endpoint
