# Environment Variables Setup

Add these environment variables to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Existing Payload/MongoDB Configuration (keep these)
DATABASE_URI=your-mongodb-connection-string
PAYLOAD_SECRET=your-payload-secret
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

## How to get Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your environment variables

## Generate NextAuth Secret:

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```
