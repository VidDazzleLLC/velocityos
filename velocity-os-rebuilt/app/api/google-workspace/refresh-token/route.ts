/**
 * API Route: Refresh Google Workspace Tokens
 * 
 * This endpoint refreshes expired Google Workspace OAuth tokens using the refresh token.
 * Includes comprehensive error handling and logging for production use.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get the auth cookie to verify the user is authenticated
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken')?.value;

    if (!authToken) {
      console.warn('Token refresh attempted without authentication');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { refreshToken } = body;

    if (!refreshToken) {
      console.warn('Token refresh attempted without refresh token');
      return NextResponse.json(
        { error: 'Bad Request', message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const clientId = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials in environment variables');
      return NextResponse.json(
        { error: 'Server Configuration Error', message: 'OAuth credentials not configured' },
        { status: 500 }
      );
    }

    // Call Google's token endpoint to refresh the access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Token refresh failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: error,
      });

      // Handle specific error cases
      if (tokenResponse.status === 400) {
        return NextResponse.json(
          { error: 'Invalid Refresh Token', message: 'The refresh token is invalid or expired' },
          { status: 400 }
        );
      }

      if (tokenResponse.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid OAuth credentials' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Token Refresh Failed', message: error.error_description || 'Failed to refresh token' },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Token refresh succeeded but no access_token in response:', tokenData);
      return NextResponse.json(
        { error: 'Invalid Response', message: 'No access token in refresh response' },
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;
    console.log(`Token refresh successful in ${duration}ms`);

    return NextResponse.json({
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in || 3600,
      tokenType: tokenData.token_type || 'Bearer',
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('Unexpected error in refresh-token endpoint:', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
    });
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: 'An unexpected error occurred while refreshing the token',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

