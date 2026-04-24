export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'quoted' | 'converted' | 'lost';

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  postcode: string;
  property_type: string;
  rooms_to_heat: string;
  current_heating: string;
  message: string | null;
  gdpr_consent: boolean;
  status: LeadStatus;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
  deleted_at: string | null;
  emails: LeadEmail[];
  lead_notes: LeadNote[];
}

export interface LeadEmail {
  id: string;
  lead_id: string;
  step_number: number;
  subject: string;
  sent_at: string;
  opened_at: string | null;
  clicked_at: string | null;
  error: string | null;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  author: string;
  created_at: string;
}

export interface PaginatedLeads {
  items: Lead[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface LeadStats {
  total_leads: number;
  leads_today: number;
  leads_this_week: number;
  leads_this_month: number;
  by_status: Record<LeadStatus, number>;
  conversion_rate: number;
  average_response_time_hours: number;
}

export interface LeadFilters {
  status?: LeadStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}
