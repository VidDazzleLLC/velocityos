/**
 * Google Workspace OAuth 2.0 Integration
 * 
 * This module handles Google Workspace OAuth authentication and token management
 * for VelocityOS B2B clients.
 */

import { GoogleAuthProvider, OAuthCredential, UserCredential } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Google Workspace OAuth scopes for full integration
 * These scopes provide access to Gmail, Calendar, Drive, and Contacts
 */
export const GOOGLE_WORKSPACE_SCOPES = [
  // Gmail scopes
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  
  // Calendar scopes
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  
  // Drive scopes
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  
  // Contacts scopes
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/directory.readonly',
];

/**
 * Interface for stored Google Workspace tokens
 */
export interface GoogleWorkspaceTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  scopes: string[];
  email: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Create a Google Auth Provider with Workspace scopes
 * @returns GoogleAuthProvider configured for Google Workspace
 */
export function createGoogleWorkspaceProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  
  // Add all Google Workspace scopes
  GOOGLE_WORKSPACE_SCOPES.forEach(scope => {
    provider.addScope(scope);
  });
  
  // Request offline access to get refresh token
  provider.setCustomParameters({
    access_type: 'offline',
    prompt: 'consent', // Force consent screen to ensure refresh token
  });
  
  return provider;
}

/**
 * Store Google Workspace tokens in Firestore
 * @param userId - Firebase user ID
 * @param credential - OAuth credential from Google sign-in
 * @param userEmail - User's email address
 */
export async function storeGoogleWorkspaceTokens(
  userId: string,
  credential: OAuthCredential,
  userEmail: string
): Promise<void> {
  if (!db) {
    console.error('Firestore not initialized');
    return;
  }

  const accessToken = credential.accessToken;
  const idToken = credential.idToken;
  
  if (!accessToken) {
    console.error('No access token in credential');
    return;
  }

  // Calculate expiration time (Google tokens typically expire in 1 hour)
  const expiresAt = Date.now() + (3600 * 1000); // 1 hour from now

  const tokens: GoogleWorkspaceTokens = {
    accessToken,
    refreshToken: credential.secret, // Refresh token if available
    expiresAt,
    scopes: GOOGLE_WORKSPACE_SCOPES,
    email: userEmail,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    const userTokensRef = doc(db, 'userTokens', userId);
    await setDoc(userTokensRef, {
      googleWorkspace: tokens,
      updatedAt: Date.now(),
    }, { merge: true });
    
    console.log('Google Workspace tokens stored successfully');
  } catch (error) {
    console.error('Error storing Google Workspace tokens:', error);
    throw error;
  }
}

/**
 * Retrieve Google Workspace tokens from Firestore
 * @param userId - Firebase user ID
 * @returns Google Workspace tokens or null if not found
 */
export async function getGoogleWorkspaceTokens(
  userId: string
): Promise<GoogleWorkspaceTokens | null> {
  if (!db) {
    console.error('Firestore not initialized');
    return null;
  }

  try {
    const userTokensRef = doc(db, 'userTokens', userId);
    const docSnap = await getDoc(userTokensRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.googleWorkspace || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving Google Workspace tokens:', error);
    return null;
  }
}

/**
 * Check if Google Workspace tokens are expired
 * @param tokens - Google Workspace tokens
 * @returns true if tokens are expired or about to expire
 */
export function areTokensExpired(tokens: GoogleWorkspaceTokens): boolean {
  // Add 5 minute buffer to refresh before actual expiration
  const bufferMs = 5 * 60 * 1000;
  return Date.now() >= (tokens.expiresAt - bufferMs);
}

/**
 * Update Google Workspace token expiration after refresh
 * @param userId - Firebase user ID
 * @param newAccessToken - New access token
 */
export async function updateGoogleWorkspaceTokens(
  userId: string,
  newAccessToken: string
): Promise<void> {
  if (!db) {
    console.error('Firestore not initialized');
    return;
  }

  try {
    const userTokensRef = doc(db, 'userTokens', userId);
    const expiresAt = Date.now() + (3600 * 1000); // 1 hour from now

    await updateDoc(userTokensRef, {
      'googleWorkspace.accessToken': newAccessToken,
      'googleWorkspace.expiresAt': expiresAt,
      'googleWorkspace.updatedAt': Date.now(),
    });
    
    console.log('Google Workspace tokens updated successfully');
  } catch (error) {
    console.error('Error updating Google Workspace tokens:', error);
    throw error;
  }
}

/**
 * Check if this is a first-time Google Workspace login
 * @param userId - Firebase user ID
 * @returns true if user has no stored tokens
 */
export async function isFirstTimeGoogleLogin(userId: string): Promise<boolean> {
  const tokens = await getGoogleWorkspaceTokens(userId);
  return tokens === null;
}
