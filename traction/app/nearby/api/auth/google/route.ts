import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: 'Google Client ID not configured' }, { status: 500 });
  }

  // Construct the Google OAuth authorization URL
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/nearby/api/auth/google/callback`;

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(authUrl.toString());
}
