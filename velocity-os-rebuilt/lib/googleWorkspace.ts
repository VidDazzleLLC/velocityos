/**
 * Google Workspace OAuth 2.0 Integration for AI-Autonomous Operations
 * 
 * This module handles Google Workspace OAuth authentication and token management
 * for VelocityOS - a fully AUTONOMOUS AI-DRIVEN business operating system.
 * 
 * ARCHITECTURE: VelocityOS operates with ZERO human intervention. Gemini AI
 * autonomously manages all business processes including:
 * - Reading and responding to customer emails
 * - Scheduling and managing calendar events
 * - Creating and organizing documents/files
 * - Managing contacts and customer data
 * - Making business decisions and executing actions
 * 
 * The AI requires FULL permissions to operate autonomously 24/7.
 */

import { GoogleAuthProvider, OAuthCredential, UserCredential } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Google Workspace OAuth scopes for FULL AI-AUTONOMOUS operations
 * 
 * These scopes provide COMPLETE access for Gemini AI to autonomously:
 * - Read, send, modify, delete emails (Gmail)
 * - Create, update, delete calendar events (Calendar)
 * - Read, write, delete files and folders (Drive)
 * - Read, create, update, delete contacts (Contacts)
 * - Access all Google Workspace services on behalf of the business
 * 
 * CRITICAL: AI needs full control to operate without human intervention
 */
export const GOOGLE_WORKSPACE_SCOPES = [
  // Gmail scopes - FULL AUTONOMOUS ACCESS
  'https://www.googleapis.com/auth/gmail.readonly',      // Read all emails
  'https://www.googleapis.com/auth/gmail.send',          // Send emails autonomously
  'https://www.googleapis.com/auth/gmail.modify',        // Modify emails (labels, etc)
  'https://www.googleapis.com/auth/gmail.compose',       // Compose drafts
  'https://www.googleapis.com/auth/gmail.insert',        // Insert emails
  'https://www.googleapis.com/auth/gmail.labels',        // Manage labels
  'https://www.googleapis.com/auth/gmail.settings.basic', // Modify settings
  'https://www.googleapis.com/auth/gmail.settings.sharing', // Manage sharing settings
  
  // Calendar scopes - FULL AUTONOMOUS ACCESS
  'https://www.googleapis.com/auth/calendar',            // Full calendar access
  'https://www.googleapis.com/auth/calendar.events',     // Create/modify/delete events
  'https://www.googleapis.com/auth/calendar.settings.readonly', // Read settings
  
  // Drive scopes - FULL AUTONOMOUS ACCESS
  'https://www.googleapis.com/auth/drive',               // Full drive access
  'https://www.googleapis.com/auth/drive.file',          // Create/modify files
  'https://www.googleapis.com/auth/drive.appdata',       // App-specific data
  'https://www.googleapis.com/auth/drive.metadata',      // Read/write metadata
  'https://www.googleapis.com/auth/drive.metadata.readonly', // Read metadata
  'https://www.googleapis.com/auth/drive.readonly',      // Read all files
  
  // Contacts/People scopes - FULL AUTONOMOUS ACCESS
  'https://www.googleapis.com/auth/contacts',            // Full contacts access
  'https://www.googleapis.com/auth/contacts.readonly',   // Read contacts
  'https://www.googleapis.com/auth/directory.readonly',  // Read directory
  'https://www.googleapis.com/auth/userinfo.email',      // User email info
  'https://www.googleapis.com/auth/userinfo.profile',    // User profile info
  
  // Admin SDK scopes - For business-wide operations (if admin)
  'https://www.googleapis.com/auth/admin.directory.user.readonly', // Read all users
  'https://www.googleapis.com/auth/admin.directory.group.readonly', // Read groups
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

/**
 * ============================================================================
 * AI AUTONOMOUS OPERATIONS SUPPORT
 * ============================================================================
 * 
 * The following interfaces and functions support Gemini AI's autonomous
 * operations across Google Workspace services with zero human intervention.
 */

/**
 * Interface for AI autonomous operation configuration
 */
export interface AIAutonomousConfig {
  enabled: boolean;
  userId: string;
  workspaceEmail: string;
  geminiApiKey?: string;
  automationLevel: 'read-only' | 'standard' | 'full-autonomous';
  backgroundJobsEnabled: boolean;
  autoResponseEnabled: boolean;
  autoSchedulingEnabled: boolean;
  autoDocumentCreationEnabled: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Store AI autonomous configuration for a user/business
 * @param userId - Firebase user ID
 * @param config - AI autonomous configuration
 */
export async function storeAIAutonomousConfig(
  userId: string,
  config: Partial<AIAutonomousConfig>
): Promise<void> {
  if (!db) {
    console.error('Firestore not initialized');
    return;
  }

  try {
    const aiConfigRef = doc(db, 'aiAutonomousConfig', userId);
    const fullConfig: AIAutonomousConfig = {
      enabled: true,
      userId,
      workspaceEmail: config.workspaceEmail || '',
      automationLevel: config.automationLevel || 'full-autonomous',
      backgroundJobsEnabled: config.backgroundJobsEnabled !== false,
      autoResponseEnabled: config.autoResponseEnabled !== false,
      autoSchedulingEnabled: config.autoSchedulingEnabled !== false,
      autoDocumentCreationEnabled: config.autoDocumentCreationEnabled !== false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...config,
    };

    await setDoc(aiConfigRef, fullConfig, { merge: true });
    console.log('AI Autonomous configuration stored successfully');
  } catch (error) {
    console.error('Error storing AI autonomous configuration:', error);
    throw error;
  }
}

/**
 * Get AI autonomous configuration
 * @param userId - Firebase user ID
 * @returns AI autonomous configuration or null
 */
export async function getAIAutonomousConfig(
  userId: string
): Promise<AIAutonomousConfig | null> {
  if (!db) {
    console.error('Firestore not initialized');
    return null;
  }

  try {
    const aiConfigRef = doc(db, 'aiAutonomousConfig', userId);
    const docSnap = await getDoc(aiConfigRef);

    if (docSnap.exists()) {
      return docSnap.data() as AIAutonomousConfig;
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving AI autonomous configuration:', error);
    return null;
  }
}

/**
 * Check if user has AI autonomous mode enabled
 * @param userId - Firebase user ID
 * @returns true if AI autonomous operations are enabled
 */
export async function isAIAutonomousModeEnabled(userId: string): Promise<boolean> {
  const config = await getAIAutonomousConfig(userId);
  return config?.enabled === true && config?.automationLevel === 'full-autonomous';
}

/**
 * Get tokens for AI autonomous operations
 * This function ensures tokens are valid and refreshes if needed
 * @param userId - Firebase user ID
 * @returns Valid tokens for AI operations or null
 */
export async function getTokensForAIOperations(
  userId: string
): Promise<GoogleWorkspaceTokens | null> {
  const tokens = await getGoogleWorkspaceTokens(userId);
  
  if (!tokens) {
    console.warn('No tokens found for AI operations');
    return null;
  }

  // Check if tokens are expired and need refresh
  if (areTokensExpired(tokens)) {
    console.log('Tokens expired, refresh needed for AI operations');
    // The background job or calling code should handle token refresh
    return null;
  }

  return tokens;
}
