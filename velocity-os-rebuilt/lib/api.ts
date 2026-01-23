// API Client for VelocityOS
// Centralized module for all API calls to Firebase Functions

import type {
  AnalyticsDashboard,
  Customer,
  Campaign,
  VocFeedback,
  ApiResponse,
  CreateCustomerPayload,
  StartCampaignPayload,
  SubmitFeedbackPayload,
} from '@/types/api';

/**
 * Base API Client class
 */
export class ApiClient {
  private baseUrl: string;

  constructor() {
    // Use environment variable or default to /api for same-origin requests
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchWithErrorHandling<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${options?.method || 'GET'} ${url}`, options?.body);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authentication headers when auth is implemented (PR #6)
          // 'Authorization': `Bearer ${token}`,
          ...options?.headers,
        },
      });

      // Parse response
      const data = await response.json();

      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] Response:`, data);
      }

      // Handle error responses
      if (!response.ok) {
        throw new Error(data.error || data.message || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`[API] Error:`, error);
      }

      // Re-throw with user-friendly message
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }

  /**
   * Get Analytics Dashboard Data
   * @returns Analytics metrics for the dashboard
   */
  async getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
    const response = await this.fetchWithErrorHandling<ApiResponse<AnalyticsDashboard>>(
      '/analytics/dashboard'
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error('Invalid response format from analytics endpoint');
  }

  /**
   * List all customers
   * @returns Array of customers
   */
  async listCustomers(): Promise<Customer[]> {
    const response = await this.fetchWithErrorHandling<ApiResponse<Customer[]>>(
      '/customer/list'
    );
    
    if (response.data) {
      return response.data;
    }
    
    // Return empty array if no data
    return [];
  }

  /**
   * Create a new customer
   * @param data Customer creation payload
   * @returns Created customer
   */
  async createCustomer(data: CreateCustomerPayload): Promise<Customer> {
    const response = await this.fetchWithErrorHandling<ApiResponse<Customer>>(
      '/customer/create',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error('Failed to create customer');
  }

  /**
   * Start a new campaign
   * @param data Campaign start payload
   * @returns Created campaign
   */
  async startCampaign(data: StartCampaignPayload): Promise<Campaign> {
    const response = await this.fetchWithErrorHandling<ApiResponse<Campaign>>(
      '/campaign/start',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error('Failed to start campaign');
  }

  /**
   * Submit VOC feedback
   * @param data Feedback payload
   */
  async submitFeedback(data: SubmitFeedbackPayload): Promise<void> {
    await this.fetchWithErrorHandling<ApiResponse<void>>(
      '/voc/feedback',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
