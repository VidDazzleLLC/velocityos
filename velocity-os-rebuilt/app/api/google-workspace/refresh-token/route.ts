/**
 * API Route: Refresh Google Workspace Tokens
 * 
 * This endpoint refreshes expired Google Workspace OAuth tokens using the refresh token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get the auth cookie to verify the user is authenticated
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Call Google's token endpoint to refresh the access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token refresh error:', error);
      return NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();

    return NextResponse.json({
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
    });
  } catch (error) {
    console.error('Error in refresh-token endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
