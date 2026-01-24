import { auth } from './firebase';

/**
 * Get the current user's ID token
 * @returns Promise<string | null> - The ID token or null if no user is signed in
 */
export async function getIdToken(): Promise<string | null> {
  if (!auth) return null;
  
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
}

/**
 * Set the authentication cookie via API route
 * @param token - The Firebase ID token
 */
export async function setAuthCookie(token: string): Promise<void> {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    throw error;
  }
}

/**
 * Clear the authentication cookie
 */
export async function clearAuthCookie(): Promise<void> {
  try {
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error clearing auth cookie:', error);
    throw error;
  }
}
