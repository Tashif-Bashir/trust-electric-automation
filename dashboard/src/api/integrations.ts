import client from './client';

export interface XeroInvoice {
  invoice_number: string;
  contact_name: string;
  status: string;
  date: string;
  due_date: string;
  amount_total: number;
  amount_due: number;
  amount_paid: number;
}

export interface XeroOutstanding {
  total_outstanding: number;
  overdue_count: number;
  overdue_amount: number;
  overdue_invoices: XeroInvoice[];
  current_count: number;
  current_amount: number;
}

export interface XeroAccountsSummary {
  bank_balances: { account_name: string; balance: number; currency: string }[];
  month_income: number;
  month_expenses: number;
  month_profit: number;
  outstanding: XeroOutstanding;
}

export interface XeroRevenueMonth {
  month: string;
  revenue: number;
  expenses: number;
}

export interface IntegrationStatus {
  connected: boolean;
  mock_mode: boolean;
}

export interface UnleashedStock {
  product_code: string;
  product_description: string;
  qty_on_hand: number;
  available_qty: number;
  allocated_qty: number;
  warehouse_name: string;
  last_stocktake: string;
}

export interface UnleashedProduct {
  product_code: string;
  product_description: string;
  default_sell_price: number;
  last_cost: number;
  is_active: boolean;
}

export interface UnleashedSummary {
  month_orders: number;
  month_value: number;
  top_product: string;
  pending_orders: number;
}

export interface MonthlyLeads {
  month: string;
  leads: number;
}

export async function fetchXeroStatus(): Promise<IntegrationStatus> {
  const { data } = await client.get('/api/integrations/xero/status');
  return data;
}

export async function fetchXeroSummary(): Promise<XeroAccountsSummary> {
  const { data } = await client.get('/api/integrations/xero/summary');
  return data;
}

export async function fetchXeroRevenue(months = 6): Promise<XeroRevenueMonth[]> {
  const { data } = await client.get('/api/integrations/xero/revenue', { params: { months } });
  return data;
}

export async function fetchUnleashedStatus(): Promise<IntegrationStatus> {
  const { data } = await client.get('/api/integrations/unleashed/status');
  return data;
}

export async function fetchUnleashedStock(): Promise<UnleashedStock[]> {
  const { data } = await client.get('/api/integrations/unleashed/stock');
  return data;
}

export async function fetchUnleashedProducts(): Promise<UnleashedProduct[]> {
  const { data } = await client.get('/api/integrations/unleashed/products');
  return data;
}

export async function fetchUnleashedAlerts(): Promise<UnleashedStock[]> {
  const { data } = await client.get('/api/integrations/unleashed/alerts');
  return data;
}

export async function fetchUnleashedSummary(): Promise<UnleashedSummary> {
  const { data } = await client.get('/api/integrations/unleashed/summary');
  return data;
}

export async function fetchMonthlyLeads(months = 6): Promise<MonthlyLeads[]> {
  const { data } = await client.get('/api/leads/monthly', { params: { months } });
  return data;
}
