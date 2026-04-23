/**
 * Shared TypeScript types for the Trust Electric Heating automation system.
 * Used across the landing-page, dashboard, and ai-content frontends.
 */

// ────────────────────────────────────────────────────────────
// Lead
// ────────────────────────────────────────────────────────────

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "quoted"
  | "converted"
  | "lost";

export type PropertyType =
  | "flat"
  | "terraced"
  | "semi-detached"
  | "detached"
  | "bungalow"
  | "commercial";

export type RoomsToHeat = "1-2" | "3-4" | "5-6" | "7+";

export type CurrentHeating =
  | "gas-boiler"
  | "oil-boiler"
  | "storage-heaters"
  | "lpg"
  | "other";

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  postcode: string;
  property_type: PropertyType;
  rooms_to_heat: RoomsToHeat;
  current_heating: CurrentHeating;
  message: string | null;
  gdpr_consent: boolean;
  status: LeadStatus;
  source: string;
  notes: string | null;
  created_at: string; // ISO 8601
  updated_at: string;
  contacted_at: string | null;
  deleted_at: string | null;
}

export interface LeadCreate {
  full_name: string;
  email: string;
  phone: string;
  postcode: string;
  property_type: PropertyType;
  rooms_to_heat: RoomsToHeat;
  current_heating: CurrentHeating;
  message?: string;
  gdpr_consent: boolean;
}

export interface LeadUpdate {
  status?: LeadStatus;
  notes?: string;
  contacted_at?: string;
}

// ────────────────────────────────────────────────────────────
// Lead Email (follow-up tracking)
// ────────────────────────────────────────────────────────────

export interface LeadEmail {
  id: string;
  lead_id: string;
  step_number: 1 | 2 | 3 | 4;
  subject: string;
  sent_at: string;
  opened_at: string | null;
  clicked_at: string | null;
  error: string | null;
}

// ────────────────────────────────────────────────────────────
// Lead Note
// ────────────────────────────────────────────────────────────

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  author: string;
  created_at: string;
}

// ────────────────────────────────────────────────────────────
// Stats
// ────────────────────────────────────────────────────────────

export interface LeadStats {
  total_leads: number;
  leads_today: number;
  leads_this_week: number;
  leads_this_month: number;
  conversion_rate: number; // 0-100 percentage
  average_response_time_hours: number;
}

// ────────────────────────────────────────────────────────────
// Pagination
// ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ────────────────────────────────────────────────────────────
// API Query Params
// ────────────────────────────────────────────────────────────

export interface LeadQueryParams {
  status?: LeadStatus | LeadStatus[];
  search?: string;
  date_from?: string; // ISO 8601 date
  date_to?: string;
  page?: number;
  page_size?: number;
}

// ────────────────────────────────────────────────────────────
// Content Generator
// ────────────────────────────────────────────────────────────

export type ContentType =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "email_newsletter"
  | "blog_outline"
  | "google_ads"
  | "product_description"
  | "sms";

export type ContentTone =
  | "professional"
  | "friendly"
  | "technical"
  | "urgent"
  | "educational";

export interface ContentGenerateRequest {
  topic: string;
  content_types: ContentType[];
  tone: ContentTone;
  audience?: string;
  selling_points?: string;
  cta?: string;
}

export type ContentGenerateResponse = Record<ContentType, unknown>;

// ────────────────────────────────────────────────────────────
// Integration Status
// ────────────────────────────────────────────────────────────

export interface IntegrationStatus {
  connected: boolean;
  last_sync: string | null;
  using_mock_data: boolean;
}

// ────────────────────────────────────────────────────────────
// Xero
// ────────────────────────────────────────────────────────────

export interface XeroInvoice {
  invoice_number: string;
  contact_name: string;
  status: "DRAFT" | "SUBMITTED" | "AUTHORISED" | "PAID" | "VOIDED";
  date: string;
  due_date: string;
  amount_total: number;
  amount_due: number;
  amount_paid: number;
}

export interface XeroSummary {
  bank_balances: Array<{ name: string; balance: number }>;
  month_income: number;
  month_expenses: number;
  month_profit: number;
  total_outstanding: number;
  overdue_count: number;
  overdue_amount: number;
}

export interface MonthlyRevenue {
  month: string; // e.g. "Oct 2025"
  revenue: number;
}

// ────────────────────────────────────────────────────────────
// Unleashed
// ────────────────────────────────────────────────────────────

export interface UnleashedProduct {
  product_code: string;
  product_description: string;
  default_sell_price: number;
  last_cost: number;
  is_active: boolean;
}

export interface StockOnHand {
  product_code: string;
  product_description: string;
  qty_on_hand: number;
  available_qty: number;
  allocated_qty: number;
  warehouse_name: string;
  last_stocktake: string | null;
}

export interface UnleashedOrder {
  order_number: string;
  customer_name: string;
  order_date: string;
  required_date: string;
  status: "Placed" | "Parked" | "Completed" | "Deleted";
  total: number;
  line_count: number;
}

export interface UnleashedSalesSummary {
  month_orders: number;
  month_value: number;
  top_product: string;
  pending_orders: number;
}

// ────────────────────────────────────────────────────────────
// Brand constants (shared for reference)
// ────────────────────────────────────────────────────────────

export const BRAND_COLORS = {
  dark: "#1a1a2e",
  amber: "#e8833a",
  tan: "#d4a574",
  cream: "#f5f1ec",
  success: "#2d6a4f",
  warning: "#c9302c",
} as const;

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  quoted: "Quoted",
  converted: "Converted",
  lost: "Lost",
};
