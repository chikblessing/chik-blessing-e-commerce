# Fix Google OAuth 403 Error in Production

## The Problem

You're getting a 403 Forbidden error because Google Cloud Console doesn't have your production domain authorized as a valid redirect URI.

## The Solution

### Step 1: Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one with your OAuth credentials)
3. Go to **APIs & Services** → **Credentials**

### Step 2: Edit Your OAuth 2.0 Client ID

1. Click on your OAuth 2.0 Client ID (the one you're using)
2. Scroll down to **Authorized redirect URIs**

### Step 3: Add Production Redirect URI

Add this exact URI to the authorized list:

```
https://www.chikblessing.com/api/auth/callback/google
```

**Important:** Make sure there's NO trailing slash!

### Step 4: Also Add These (if not already there)

```
http://localhost:3000/api/auth/callback/google
https://chikblessing.com/api/auth/callback/google
```

The first one is for local development, the second is for the non-www version of your domain.

### Step 5: Save Changes

Click **Save** at the bottom of the page.

### Step 6: Wait & Test

- Changes can take 5-10 minutes to propagate
- Clear your browser cache or try in incognito mode
- Try logging in with Google again

## Verify Your Setup

Your authorized redirect URIs should look like this:

```
✅ http://localhost:3000/api/auth/callback/google
✅ https://chikblessing.com/api/auth/callback/google
✅ https://www.chikblessing.com/api/auth/callback/google
```

## Still Getting Errors?

### Check Your Vercel Environment Variables

Make sure these are set in Vercel:

- `GOOGLE_CLIENT_ID` - Should end with `.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET` - Should start with `GOCSPX-`
- `NEXTAUTH_URL` - Should be `https://www.chikblessing.com` (your production URL)
- `NEXTAUTH_SECRET` - Should be a random string

### Check Your Authorized JavaScript Origins

In the same OAuth client settings, make sure you have:

```
https://www.chikblessing.com
https://chikblessing.com
http://localhost:3000
```

## Common Mistakes to Avoid

❌ Adding a trailing slash: `https://www.chikblessing.com/api/auth/callback/google/`
❌ Wrong protocol: `http://www.chikblessing.com/api/auth/callback/google`
❌ Missing `/api/auth/callback/google` path
❌ Typo in domain name

## After Fixing

Once you've added the correct redirect URI and saved:

1. Wait 5-10 minutes for Google to update
2. Clear your browser cache
3. Try signing in with Google again
4. The 403 error should be gone! ✅
