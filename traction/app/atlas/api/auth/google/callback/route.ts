import { NextRequest, NextResponse } from 'next/server';
import { getSettingsCollection, getUsersCollection } from '@/lib/db-atlas';
import { createToken, setSessionCookie } from '@/lib/atlas-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/atlas/login?error=google_auth_failed', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/atlas/login?error=no_code', request.url));
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('Missing Google OAuth environment variables');
    return NextResponse.redirect(new URL('/atlas/login?error=server_config', request.url));
  }

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/atlas/api/auth/google/callback`;

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(new URL('/atlas/login?error=token_exchange', request.url));
    }

    const { access_token } = tokenData;

    // 2. Fetch user profile from Google
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const profileData = await profileResponse.json();
    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', profileData);
      return NextResponse.redirect(new URL('/atlas/login?error=profile_fetch', request.url));
    }

    const email = profileData.email;
    const name = profileData.name || 'Google User';
    const avatar = profileData.picture || '';

    // 3. Check MongoDB for existing user and global settings
    const users = await getUsersCollection();
    let existingUser = await users.findOne({ email });

    const settings = await getSettingsCollection();
    const globalSettings = await settings.findOne({ _id: 'global' as any });
    const isAccessOpen = globalSettings?.isAccessOpen ?? false;

    if (!existingUser) {
      if (isAccessOpen) {
        // In Open Access mode, automatically create the user account
        const newUser = {
          name,
          email,
          avatar,
          role: 'user',
          isApproved: true,
          createdAt: new Date().toISOString()
        };
        const insertResult = await users.insertOne(newUser);
        existingUser = { _id: insertResult.insertedId, ...newUser } as any;
      } else {
        // In Closed Access mode, reject login if user is not pre-approved by admin
        return NextResponse.redirect(new URL('/atlas/login?error=unauthorized_email', request.url));
      }
    }

    if (!existingUser) {
      throw new Error("existingUser is still null despite insertion or return");
    }

    const userIdStr = existingUser._id.toString();
    
    // Update avatar/name from Google if they were just invited with an email
    await users.updateOne(
      { _id: existingUser._id },
      { 
        $set: { 
          avatar: existingUser.avatar || avatar, 
          name: existingUser.name || name,
          isApproved: true // Ensure they are marked approved
        } 
      }
    );

    // 4. Create session and redirect
    const token = await createToken(userIdStr);
    await setSessionCookie(token);

    return NextResponse.redirect(new URL('/atlas/discover', request.url));

  } catch (err) {
    console.error('Google OAuth Callback Error:', err);
    return NextResponse.redirect(new URL('/atlas/login?error=internal', request.url));
  }
}
