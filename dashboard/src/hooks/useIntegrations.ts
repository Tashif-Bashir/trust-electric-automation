import { useQuery } from '@tanstack/react-query';
import {
  fetchMonthlyLeads,
  fetchUnleashedAlerts,
  fetchUnleashedProducts,
  fetchUnleashedStock,
  fetchUnleashedSummary,
  fetchXeroRevenue,
  fetchXeroStatus,
  fetchXeroSummary,
  fetchUnleashedStatus,
} from '../api/integrations';

const OPTS = { staleTime: 60_000, refetchInterval: 60_000 };

export function useXeroStatus() {
  return useQuery({ queryKey: ['xero', 'status'], queryFn: fetchXeroStatus, ...OPTS });
}

export function useXeroSummary() {
  return useQuery({ queryKey: ['xero', 'summary'], queryFn: fetchXeroSummary, ...OPTS });
}

export function useXeroRevenue(months = 6) {
  return useQuery({ queryKey: ['xero', 'revenue', months], queryFn: () => fetchXeroRevenue(months), ...OPTS });
}

export function useUnleashedStatus() {
  return useQuery({ queryKey: ['unleashed', 'status'], queryFn: fetchUnleashedStatus, ...OPTS });
}

export function useUnleashedStock() {
  return useQuery({ queryKey: ['unleashed', 'stock'], queryFn: fetchUnleashedStock, ...OPTS });
}

export function useUnleashedProducts() {
  return useQuery({ queryKey: ['unleashed', 'products'], queryFn: fetchUnleashedProducts, ...OPTS });
}

export function useUnleashedAlerts() {
  return useQuery({ queryKey: ['unleashed', 'alerts'], queryFn: fetchUnleashedAlerts, ...OPTS });
}

export function useUnleashedSummary() {
  return useQuery({ queryKey: ['unleashed', 'summary'], queryFn: fetchUnleashedSummary, ...OPTS });
}

export function useMonthlyLeads(months = 6) {
  return useQuery({ queryKey: ['leads', 'monthly', months], queryFn: () => fetchMonthlyLeads(months), ...OPTS });
}
