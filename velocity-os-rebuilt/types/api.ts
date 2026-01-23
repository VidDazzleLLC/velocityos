// API Response Types for VelocityOS

/**
 * Analytics Dashboard Metrics
 */
export interface AnalyticsDashboard {
  totalCustomers: number;
  activeCampaigns: number;
  revenue: number;
  conversionRate: number;
  tasksCompleted: number;
  // Add more metrics as needed
}

/**
 * Customer entity
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
  // Add more fields as needed based on backend
}

/**
 * Campaign entity
 */
export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  recipients: string[];
  message?: string;
  createdAt: string;
  scheduledAt?: string;
  // Add more fields as needed
}

/**
 * VOC (Voice of Customer) Feedback
 */
export interface VocFeedback {
  rating: number; // 1-5 or 1-10
  comment: string;
  timestamp?: string;
  customerId?: string;
  // Add more fields as needed
}

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API Error response
 */
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: any;
}

/**
 * Customer creation payload
 */
export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Campaign start payload
 */
export interface StartCampaignPayload {
  name: string;
  recipients: string[];
  message: string;
  scheduledAt?: string;
}

/**
 * VOC Feedback submission payload
 */
export interface SubmitFeedbackPayload {
  rating: number;
  comment: string;
}
