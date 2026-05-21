#!/bin/bash
# Push all env vars from .env.local to Vercel production.
# Run AFTER `vercel` has linked the project.
# Usage: PROD_URL=https://earnhq.vercel.app bash scripts/vercel-env-setup.sh

set -e

if [ -z "$PROD_URL" ]; then
  echo "ERROR: Set PROD_URL first, e.g.:"
  echo "  PROD_URL=https://earnhq.vercel.app bash scripts/vercel-env-setup.sh"
  exit 1
fi

ENV_FILE="$(dirname "$0")/../.env.local"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env.local not found at $ENV_FILE"
  exit 1
fi

add_env() {
  local name=$1
  local value=$2
  printf '%s' "$value" | vercel env add "$name" production --force 2>/dev/null || \
    printf '%s' "$value" | vercel env add "$name" production
  echo "  ✓ $name"
}

# Load values from .env.local
source "$ENV_FILE"

echo "Setting env vars for production (PROD_URL=$PROD_URL)..."

add_env NEXT_PUBLIC_SUPABASE_URL        "$NEXT_PUBLIC_SUPABASE_URL"
add_env NEXT_PUBLIC_SUPABASE_ANON_KEY   "$NEXT_PUBLIC_SUPABASE_ANON_KEY"
add_env SUPABASE_SERVICE_ROLE_KEY       "$SUPABASE_SERVICE_ROLE_KEY"
add_env GOOGLE_CLIENT_ID                "$GOOGLE_CLIENT_ID"
add_env GOOGLE_CLIENT_SECRET            "$GOOGLE_CLIENT_SECRET"
add_env GOOGLE_REDIRECT_URI             "${PROD_URL}/api/gmail/callback"
add_env OPENAI_API_KEY                  "$OPENAI_API_KEY"
add_env ENCRYPTION_KEY                  "$ENCRYPTION_KEY"
add_env NEXT_PUBLIC_APP_URL             "$PROD_URL"

echo ""
echo "All done! Now run:  vercel --prod"
echo ""
echo "Then add this URI to Google Cloud Console > OAuth Client > Authorized redirect URIs:"
echo "  ${PROD_URL}/api/gmail/callback"
