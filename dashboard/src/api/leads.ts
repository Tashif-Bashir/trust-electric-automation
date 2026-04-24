import client from './client';
import type { Lead, LeadFilters, LeadNote, PaginatedLeads } from '../types/lead';

export async function fetchLeads(params: LeadFilters = {}): Promise<PaginatedLeads> {
  const { data } = await client.get('/api/leads', { params });
  return data;
}

export async function fetchLead(id: string): Promise<Lead> {
  const { data } = await client.get(`/api/leads/${id}`);
  return data;
}

export async function updateLead(id: string, payload: Partial<Lead>): Promise<Lead> {
  const { data } = await client.patch(`/api/leads/${id}`, payload);
  return data;
}

export async function deleteLead(id: string): Promise<void> {
  await client.delete(`/api/leads/${id}`);
}

export async function addNote(
  leadId: string,
  note: string,
  author = 'Sales Team'
): Promise<LeadNote> {
  const { data } = await client.post(`/api/leads/${leadId}/notes`, { note, author });
  return data;
}
