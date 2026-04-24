import client from './client';
import type { LeadStats } from '../types/lead';

export async function fetchStats(): Promise<LeadStats> {
  const { data } = await client.get('/api/leads/stats');
  return data;
}
