# Environment Setup Guide

This guide explains how to properly configure environment variables for the XpertFarmer Admin Dashboard.

## Required Environment Variables

### 1. NEXTAUTH_URL
**What it is:** The URL where your application is hosted. NextAuth uses this to validate callback URLs and construct authentication endpoints.

**Local Development:**
```
NEXTAUTH_URL=http://localhost:3000
```

**Production:**
```
NEXTAUTH_URL=https://yourdomain.com
```

### 2. NEXTAUTH_SECRET
**What it is:** A secret key used by NextAuth to encrypt tokens and sessions. This MUST be a secure random string.

**How to generate:**
```bash
# On macOS/Linux:
openssl rand -base64 32

# Result example:
# KVbxC8p0K2fGzP/W4j9kL3mN5qR7sT0uV2wX3yZ8aB1cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8aB9cD0eF
```

**Local Development (for testing only):**
```
NEXTAUTH_SECRET=your-secret-key-change-in-production
```

> ⚠️ **Important:** Never use a simple password in production. Always generate a secure random string.

### 3. NEXT_PUBLIC_API_URL
**What it is:** The base URL of the XpertFarmer API. This is public because it's used from the client side.

**Local Development:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Production:**
```
NEXT_PUBLIC_API_URL=https://api.xpertfarmer.com
```

## Setting Up Environment Variables

### In Development (Local Machine)

1. Copy the example file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and fill in your values:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=KVbxC8p0K2fGzP/W4j9kL3mN5qR7sT0uV2wX3yZ8aB1cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8aB9cD0eF
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

### In Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable:
   - `NEXTAUTH_URL`: Your production domain
   - `NEXTAUTH_SECRET`: Your secure secret (generate a new one)
   - `NEXT_PUBLIC_API_URL`: Your production API URL

4. Redeploy your application

### In Production (Other Hosting)

1. Set environment variables in your hosting provider's dashboard
2. Or create a `.env` file (not `.env.local`) with your production values
3. Deploy your application

## Troubleshooting

### Error: "Failed to construct 'URL': Invalid URL"
This error occurs when:
- `NEXTAUTH_URL` is not set or is invalid
- `NEXT_PUBLIC_API_URL` is not set or is invalid

**Fix:**
1. Verify both URLs are properly formatted (http:// or https://)
2. Make sure there are no trailing slashes or extra spaces
3. Ensure variables are set in your hosting environment

### Error: "Credentials do not match"
This error occurs when:
- The API is not running or not accessible
- The API URL in `NEXT_PUBLIC_API_URL` is incorrect

**Fix:**
1. Verify your XpertFarmer API is running
2. Check that `NEXT_PUBLIC_API_URL` matches your API's actual URL
3. Test the API URL in your browser to ensure it's accessible

### Authentication Not Working
Make sure:
1. `NEXTAUTH_SECRET` is set and consistent across deployments
2. `NEXTAUTH_URL` matches your actual application URL
3. Your API is properly configured and accessible

## Security Best Practices

1. **Never commit `.env.local` to git** - Add it to `.gitignore` (already done)
2. **Rotate `NEXTAUTH_SECRET` in production** - Generate a new secret annually
3. **Use HTTPS in production** - Always use `https://` for production URLs
4. **Keep API credentials secure** - Store API tokens as separate environment variables
5. **Monitor token expiration** - Implement token refresh mechanisms

## Next Steps

1. Set up your environment variables as described above
2. Ensure your XpertFarmer API is running and accessible
3. Start the dashboard with `npm run dev`
4. Visit `http://localhost:3000` and log in
