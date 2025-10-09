# Resend Email Setup Guide

## ✅ **Current Setup:**

Your OTP emails are now configured to use Resend's API directly, which is more reliable than SMTP.

### **Current Configuration:**

- **From Email**: `onboarding@resend.dev` (Resend's test email)
- **API Key**: Set in `.env.local`
- **Method**: Direct API calls to Resend

## 🚀 **Testing the Email:**

1. **Restart your server:**

   ```bash
   npm run dev
   ```

2. **Try registering:**
   - Go to `/auth/register`
   - Fill in the form
   - Submit
   - Check your email (including spam folder)

3. **Check server logs:**
   - Look for "Email sent successfully" message
   - Or any error messages

## 📧 **Using Resend's Test Email:**

**Pros:**

- ✅ Works immediately
- ✅ No domain verification needed
- ✅ Good for development

**Cons:**

- ⚠️ Emails might go to spam
- ⚠️ Not professional for production
- ⚠️ Limited to test purposes

## 🌐 **Setting Up Custom Domain (Recommended for Production):**

### **Step 1: Add Domain to Resend**

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `chikblessingglobal.com`)
4. Click "Add"

### **Step 2: Verify Domain**

Resend will provide DNS records to add:

**SPF Record:**

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Records:**

```
Type: TXT
Name: resend._domainkey
Value: [provided by Resend]
```

**DMARC Record (Optional but recommended):**

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

### **Step 3: Update Your Code**

Once domain is verified, update the send-otp route:

```typescript
from: 'Chik Blessing Global Store <noreply@chikblessingglobal.com>',
```

## 🔧 **Troubleshooting:**

### **Email Not Received:**

1. **Check Spam Folder**
   - Resend test emails often go to spam

2. **Check Server Logs**
   - Look for "Email sent successfully" or error messages

3. **Verify API Key**
   - Make sure `RESEND_API_KEY` is set in `.env.local`
   - Check it's the correct key from Resend dashboard

4. **Check Resend Dashboard**
   - Go to [Resend Logs](https://resend.com/emails)
   - See if email was sent and its status

### **Common Errors:**

**"Invalid API key":**

- Check your `RESEND_API_KEY` in `.env.local`
- Get a new key from [Resend API Keys](https://resend.com/api-keys)

**"Domain not verified":**

- Use `onboarding@resend.dev` for testing
- Or verify your custom domain

**"Rate limit exceeded":**

- Resend free tier: 100 emails/day
- Wait or upgrade plan

## 📊 **Resend Free Tier Limits:**

- ✅ 100 emails per day
- ✅ 3,000 emails per month
- ✅ 1 verified domain
- ✅ Email logs for 30 days

## 🎯 **Current Email Flow:**

1. User registers → OTP generated
2. API calls Resend → Email sent
3. User receives email → Enters OTP
4. Account verified ✅

## 📝 **Email Template:**

Your OTP emails include:

- ✅ Professional design
- ✅ Brand colors and logo
- ✅ Clear 6-digit OTP code
- ✅ Expiry information (10 minutes)
- ✅ Security notice
- ✅ Mobile responsive

## 🔐 **Security Best Practices:**

1. **Never commit API keys** - Already in `.env.local` ✅
2. **Use environment variables** - Already configured ✅
3. **Verify domain for production** - Recommended
4. **Monitor email logs** - Check Resend dashboard
5. **Set up DMARC** - Prevents email spoofing

## ✅ **Next Steps:**

1. **Test the email** - Try registering now
2. **Check spam folder** - If using test email
3. **Verify custom domain** - For production (optional)
4. **Monitor Resend dashboard** - Check email delivery

Your email system is now properly configured and should work! 🎉
