# Authentication Setup Guide

Your authentication system now supports both Payload CMS authentication and Google OAuth! Here's what has been implemented:

## 🚀 What's Been Set Up

### 1. Dual Authentication System

- **Payload Authentication**: Traditional email/password login using your existing Payload CMS setup
- **Google OAuth**: One-click login with Google accounts via NextAuth.js

### 2. Updated Components

- **Login Page** (`/auth/login`): Now supports both email/password and Google login
- **Register Page** (`/auth/register`): Now supports both registration methods and Google signup
- **Auth Provider**: Enhanced to handle both authentication methods seamlessly

### 3. Session Management

- NextAuth.js handles Google OAuth sessions
- Payload JWT tokens handle traditional authentication
- Unified user experience across both methods

## 📋 Setup Steps

### 1. Install Dependencies

```bash
npm install next-auth @auth/mongodb-adapter google-auth-library
npm install -D @types/google-auth-library
```

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Keep your existing Payload/MongoDB variables
DATABASE_URI=your-mongodb-connection-string
PAYLOAD_SECRET=your-payload-secret
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to your environment variables

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

## 🔧 How It Works

### For Users:

1. **Traditional Login**: Users can register/login with email and password as before
2. **Google Login**: Users can click "Login with Google" for instant authentication
3. **Unified Experience**: Both methods create the same user experience in your app

### For Developers:

1. **Single Auth Hook**: Use `useAuth()` from `@/providers/Auth` for all authentication needs
2. **Automatic User Creation**: Google OAuth users are automatically created in Payload CMS
3. **Session Persistence**: Sessions work seamlessly across both authentication methods

## 🎯 Available Auth Methods

```typescript
const {
  user, // Current user object
  token, // Payload JWT token (for traditional auth)
  login, // Email/password login
  register, // Email/password registration
  loginWithGoogle, // Google OAuth login
  logout, // Logout from both systems
  loading, // Loading state
} = useAuth()
```

## 🔒 Security Features

- **Secure Token Storage**: JWT tokens stored securely
- **Session Management**: Proper session handling for both auth methods
- **User Verification**: Email verification for traditional registration
- **Role-Based Access**: Maintains your existing role system (admin/customer)

## 📧 OTP Email Verification

Your system now includes OTP (One-Time Password) email verification:

### How it works:

1. **Registration**: User registers with email/password
2. **OTP Generation**: System generates a 6-digit OTP and sends it via email
3. **Verification**: User enters OTP on verification page
4. **Account Activation**: Account is verified and user is automatically logged in

### Email Setup Required:

- Configure email settings in Payload CMS (see `EMAIL_SETUP_GUIDE.md`)
- Add SMTP or email service credentials to environment variables
- Test email delivery in development

### User Flow:

```
Register → Receive OTP Email → Enter OTP → Account Verified → Logged In
```

## 🚀 Next Steps

1. Install the dependencies
2. Set up environment variables
3. Configure Google OAuth credentials
4. **Configure email settings for OTP verification**
5. Test both authentication methods
6. Test OTP email verification flow
7. Deploy and update production environment variables

Your authentication system is now ready to handle traditional login, social login, and secure email verification! 🎉
