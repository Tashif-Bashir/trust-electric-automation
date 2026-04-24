import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addNote, deleteLead, fetchLead, fetchLeads, updateLead } from '../api/leads';
import type { Lead, LeadFilters } from '../types/lead';

export function useLeads(filters: LeadFilters = {}) {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => fetchLeads(filters),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useLead(id: string | null) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => fetchLead(id!),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Lead> }) =>
      updateLead(id, payload),
    onSuccess: (updated) => {
      qc.setQueryData(['lead', updated.id], updated);
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useAddNote(leadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ note, author }: { note: string; author?: string }) =>
      addNote(leadId, note, author),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lead', leadId] });
    },
  });
}
