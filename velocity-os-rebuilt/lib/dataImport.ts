/**
 * Google Workspace Data Import Service
 * 
 * This module handles importing existing Google Workspace data during first-time login.
 * Imports emails, calendar events, drive files, and contacts to provide immediate
 * context for AI autonomous operations.
 */

import { GoogleWorkspaceTokens } from './googleWorkspace';

/**
 * Interface for import status tracking
 */
export interface DataImportStatus {
  userId: string;
  startedAt: number;
  completedAt?: number;
  status: 'in_progress' | 'completed' | 'failed';
  emailsImported: number;
  contactsImported: number;
  calendarEventsImported: number;
  filesImported: number;
  errors: string[];
}

/**
 * Import all Google Workspace data for a user
 * @param userId - Firebase user ID
 * @param tokens - Google Workspace OAuth tokens
 * @returns Import status
 */
export async function importGoogleWorkspaceData(
  userId: string,
  tokens: GoogleWorkspaceTokens
): Promise<DataImportStatus> {
  const importStatus: DataImportStatus = {
    userId,
    startedAt: Date.now(),
    status: 'in_progress',
    emailsImported: 0,
    contactsImported: 0,
    calendarEventsImported: 0,
    filesImported: 0,
    errors: [],
  };

  try {
    // Import in parallel for faster initial setup
    const results = await Promise.allSettled([
      importGmailData(userId, tokens),
      importCalendarData(userId, tokens),
      importDriveData(userId, tokens),
      importContactsData(userId, tokens),
    ]);

    // Process results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const data = result.value;
        switch (index) {
          case 0: importStatus.emailsImported = data.count; break;
          case 1: importStatus.calendarEventsImported = data.count; break;
          case 2: importStatus.filesImported = data.count; break;
          case 3: importStatus.contactsImported = data.count; break;
        }
      } else {
        importStatus.errors.push(result.reason.message);
      }
    });

    importStatus.status = importStatus.errors.length > 0 ? 'failed' : 'completed';
    importStatus.completedAt = Date.now();

    // Store import status in Firestore
    await storeImportStatus(userId, importStatus);

    return importStatus;
  } catch (error: any) {
    importStatus.status = 'failed';
    importStatus.errors.push(error.message);
    importStatus.completedAt = Date.now();
    
    await storeImportStatus(userId, importStatus);
    throw error;
  }
}

/**
 * Import Gmail data (recent emails)
 * @param userId - Firebase user ID
 * @param tokens - OAuth tokens
 * @returns Import count
 */
async function importGmailData(
  userId: string,
  tokens: GoogleWorkspaceTokens
): Promise<{ count: number }> {
  try {
    // Fetch recent emails (last 30 days, max 100)
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100&q=newer_than:30d',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.statusText}`);
    }

    const data = await response.json();
    const messages = data.messages || [];

    // Fetch full message details for each email
    const emailDetails = await Promise.all(
      messages.slice(0, 50).map(async (msg: any) => {
        const detailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`,
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }
        );
        return detailResponse.json();
      })
    );

    // Store in Firestore for AI analysis
    // TODO: Implement Firestore storage
    console.log(`Imported ${emailDetails.length} emails for user ${userId}`);

    return { count: emailDetails.length };
  } catch (error) {
    console.error('Error importing Gmail data:', error);
    throw error;
  }
}

/**
 * Import Calendar data (upcoming events)
 * @param userId - Firebase user ID
 * @param tokens - OAuth tokens
 * @returns Import count
 */
async function importCalendarData(
  userId: string,
  tokens: GoogleWorkspaceTokens
): Promise<{ count: number }> {
  try {
    // Fetch upcoming calendar events (next 90 days)
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=100&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.statusText}`);
    }

    const data = await response.json();
    const events = data.items || [];

    // Store in Firestore for AI scheduling
    // TODO: Implement Firestore storage
    console.log(`Imported ${events.length} calendar events for user ${userId}`);

    return { count: events.length };
  } catch (error) {
    console.error('Error importing Calendar data:', error);
    throw error;
  }
}

/**
 * Import Drive data (recent files)
 * @param userId - Firebase user ID
 * @param tokens - OAuth tokens
 * @returns Import count
 */
async function importDriveData(
  userId: string,
  tokens: GoogleWorkspaceTokens
): Promise<{ count: number }> {
  try {
    // Fetch recent files (max 100)
    const response = await fetch(
      'https://www.googleapis.com/drive/v3/files?pageSize=100&fields=files(id,name,mimeType,createdTime,modifiedTime,owners,permissions)&orderBy=modifiedTime%20desc',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Drive API error: ${response.statusText}`);
    }

    const data = await response.json();
    const files = data.files || [];

    // Store file metadata in Firestore for AI organization
    // TODO: Implement Firestore storage
    console.log(`Imported ${files.length} Drive files for user ${userId}`);

    return { count: files.length };
  } catch (error) {
    console.error('Error importing Drive data:', error);
    throw error;
  }
}

/**
 * Import Contacts data
 * @param userId - Firebase user ID
 * @param tokens - OAuth tokens
 * @returns Import count
 */
async function importContactsData(
  userId: string,
  tokens: GoogleWorkspaceTokens
): Promise<{ count: number }> {
  try {
    // Fetch contacts using People API
    const response = await fetch(
      'https://people.googleapis.com/v1/people/me/connections?pageSize=100&personFields=names,emailAddresses,phoneNumbers,organizations',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`People API error: ${response.statusText}`);
    }

    const data = await response.json();
    const contacts = data.connections || [];

    // Store in Firestore for AI customer management
    // TODO: Implement Firestore storage
    console.log(`Imported ${contacts.length} contacts for user ${userId}`);

    return { count: contacts.length };
  } catch (error) {
    console.error('Error importing Contacts data:', error);
    throw error;
  }
}

/**
 * Store import status in Firestore
 * @param userId - Firebase user ID
 * @param status - Import status
 */
async function storeImportStatus(
  userId: string,
  status: DataImportStatus
): Promise<void> {
  // TODO: Implement Firestore storage
  console.log('Import status for user', userId, ':', status);
}

/**
 * Queue background data import job
 * This is called after first-time login to import data without blocking the user
 * @param userId - Firebase user ID
 * @param tokens - OAuth tokens
 */
export async function queueDataImport(
  userId: string,
  tokens: GoogleWorkspaceTokens
): Promise<void> {
  // In production, this would add to a background job queue (Cloud Tasks, Pub/Sub)
  // For now, we'll just log it
  console.log(`Queuing data import for user ${userId}`);
  
  // Start import asynchronously (don't await)
  importGoogleWorkspaceData(userId, tokens).catch(error => {
    console.error('Background data import failed:', error);
  });
}
