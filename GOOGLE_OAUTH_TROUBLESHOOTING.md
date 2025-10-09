# Google OAuth "Access Denied" Troubleshooting Guide

## 🔍 **Common Causes & Solutions:**

### **1. OAuth Consent Screen Not Published**

**Problem:** Your OAuth consent screen is in "Testing" mode and the user isn't added as a test user.

**Solution:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **OAuth consent screen**
3. Either:
   - **Option A (Recommended for Development):** Add your Google account as a test user
     - Scroll to "Test users"
     - Click "Add Users"
     - Add your email address
   - **Option B (For Production):** Publish the app
     - Click "Publish App"
     - Note: This requires verification if you request sensitive scopes

### **2. Incorrect Redirect URI**

**Problem:** The redirect URI in Google Cloud Console doesn't match your app's callback URL.

**Solution:**

1. Go to **APIs & Services** → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", ensure you have:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Click "Save"
5. **Important:** Wait 5-10 minutes for changes to propagate

### **3. Missing or Incorrect Environment Variables**

**Problem:** Environment variables are not set correctly.

**Current Values in .env.local:**

```env
GOOGLE_CLIENT_ID=207010605219-kaa3f18k8gp9fed9s5u29ncgl28gfl3m.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=IULxjppdoNJuSiDzwCJQYYGgUsCXbzc3XTYnd2kDW+M=
```

**Verify:**

- ✅ GOOGLE_CLIENT_ID ends with `.apps.googleusercontent.com`
- ✅ GOOGLE_CLIENT_SECRET starts with `GOCSPX-`
- ✅ NEXTAUTH_URL matches your development URL
- ✅ NEXTAUTH_SECRET is set

### **4. Server Not Restarted**

**Problem:** Environment variables changed but server wasn't restarted.

**Solution:**

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### **5. Browser Cache Issues**

**Problem:** Old OAuth session cached in browser.

**Solution:**

1. Clear browser cache and cookies for localhost
2. Try in incognito/private browsing mode
3. Or use a different browser

## 🚀 **Quick Fix Steps:**

### **Step 1: Add Yourself as Test User**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **OAuth consent screen**
3. Scroll to **Test users**
4. Click **Add Users**
5. Enter your Gmail address
6. Click **Save**

### **Step 2: Verify Redirect URI**

1. **APIs & Services** → **Credentials**
2. Click your OAuth 2.0 Client ID
3. Check **Authorized redirect URIs** includes:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. If not, add it and click **Save**

### **Step 3: Restart Server**

```bash
# Stop server (Ctrl+C)
npm run dev
```

### **Step 4: Test Again**

1. Clear browser cache or use incognito mode
2. Go to `http://localhost:3000/auth/login`
3. Click "Login with Google"
4. Should work now! ✅

## 🔧 **Still Not Working?**

### **Check Server Logs:**

Look for errors in your terminal when clicking "Login with Google"

### **Check Browser Console:**

1. Open DevTools (F12)
2. Go to Console tab
3. Look for any error messages

### **Verify Google Cloud Project:**

1. Make sure the correct project is selected in Google Cloud Console
2. Verify the OAuth 2.0 Client ID you're using matches the one in `.env.local`

### **Test with Different Account:**

Try logging in with a different Google account to see if it's account-specific

## 📝 **For Production Deployment:**

When deploying to production:

1. **Update Redirect URI:**

   ```
   https://yourdomain.com/api/auth/callback/google
   ```

2. **Update Environment Variables:**

   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

3. **Publish OAuth Consent Screen:**
   - Go through Google's verification process
   - This is required for public apps

## ✅ **Expected Behavior After Fix:**

1. Click "Login with Google"
2. Redirected to Google sign-in page
3. Select your Google account
4. Grant permissions
5. Redirected back to your app
6. Logged in successfully! 🎉
