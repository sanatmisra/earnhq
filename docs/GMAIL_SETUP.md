# Gmail OAuth Setup

## 1. Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. **APIs & Services → Library** → search "Gmail API" → Enable
4. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `http://localhost:3000/api/gmail/callback` (local dev)
     - `https://yourdomain.com/api/gmail/callback` (production)
5. Copy **Client ID** and **Client Secret**

## 2. OAuth Consent Screen

1. **APIs & Services → OAuth consent screen**
2. User type: **External**
3. Add scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
4. Add your email as a test user while in development

## 3. Environment Variables

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback
ENCRYPTION_KEY=  # 32-byte hex: openssl rand -hex 32
```

## 4. Flow

```
User clicks "Connect Gmail"
  → GET /api/gmail/connect
  → Redirects to Google consent screen
  → User approves
  → Google redirects to /api/gmail/callback?code=...
  → App exchanges code for access_token + refresh_token
  → Tokens encrypted (AES-256-GCM) and stored in profiles table
  → User redirected to /dashboard?gmail=connected

User clicks "Sync Gmail"
  → POST /api/gmail/sync
  → Fetches last 6 months of sponsorship threads
  → Each thread parsed by GPT-4o-mini
  → Results shown on /dashboard/gmail-import for review
  → User confirms/edits/skips deals
  → Confirmed deals saved to deals table
```
