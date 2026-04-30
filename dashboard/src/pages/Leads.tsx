import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  Phone,
  MapPin,
  Home,
  Flame,
  Search,
  X,
  Plus,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import { useAddNote, useDeleteLead, useLead, useLeads, useUpdateLead } from '../hooks/useLeads';
import { StatusBadge } from '../components/leads/StatusBadge';
import { Skeleton } from '../components/ui/Skeleton';
import type { Lead, LeadFilters, LeadStatus } from '../types/lead';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'quoted', 'converted', 'lost'];

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  quoted: 'Quoted',
  converted: 'Converted',
  lost: 'Lost',
};

// ---------------------------------------------------------------------------
// Lead detail panel
// ---------------------------------------------------------------------------

function DetailPanel({
  leadId,
  onClose,
}: {
  leadId: string;
  onClose: () => void;
}) {
  const { data: lead, isLoading } = useLead(leadId);
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const addNote = useAddNote(leadId);
  const [noteText, setNoteText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  function handleStatusChange(status: LeadStatus) {
    updateLead.mutate({ id: leadId, payload: { status } });
  }

  function handleAddNote() {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    addNote.mutate(
      { note: trimmed, author: 'Sales Team' },
      { onSuccess: () => setNoteText('') }
    );
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteLead.mutate(leadId, { onSuccess: onClose });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-dash-border shrink-0">
        <h2 className="text-sm font-semibold text-dash-text truncate pr-4">
          {isLoading ? <Skeleton className="h-4 w-36" /> : lead?.full_name}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/5 text-dash-muted hover:text-dash-text transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        ) : !lead ? (
          <p className="text-dash-muted text-sm">Lead not found.</p>
        ) : (
          <>
            {/* Status */}
            <section>
              <label className="text-xs font-medium text-dash-muted uppercase tracking-wide block mb-2">
                Status
              </label>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="w-full bg-dash-bg border border-dash-border text-dash-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-brand-amber/60 cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              {updateLead.isPending && (
                <p className="text-xs text-dash-muted mt-1">Saving…</p>
              )}
            </section>

            {/* Contact info */}
            <section>
              <label className="text-xs font-medium text-dash-muted uppercase tracking-wide block mb-2">
                Contact
              </label>
              <div className="space-y-2">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2.5 text-sm text-dash-text hover:text-brand-amber transition-colors"
                >
                  <Mail size={14} className="text-dash-muted shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </a>
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-2.5 text-sm text-dash-text hover:text-brand-amber transition-colors"
                >
                  <Phone size={14} className="text-dash-muted shrink-0" />
                  {lead.phone}
                </a>
                <div className="flex items-center gap-2.5 text-sm text-dash-text">
                  <MapPin size={14} className="text-dash-muted shrink-0" />
                  {lead.postcode}
                </div>
              </div>
            </section>

            {/* Property info */}
            <section>
              <label className="text-xs font-medium text-dash-muted uppercase tracking-wide block mb-2">
                Property
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-sm text-dash-text">
                  <Home size={14} className="text-dash-muted shrink-0" />
                  {lead.property_type} · {lead.rooms_to_heat} rooms
                </div>
                <div className="flex items-center gap-2.5 text-sm text-dash-text">
                  <Flame size={14} className="text-dash-muted shrink-0" />
                  Current: {lead.current_heating}
                </div>
              </div>
            </section>

            {/* Message */}
            {lead.message && (
              <section>
                <label className="text-xs font-medium text-dash-muted uppercase tracking-wide block mb-2">
                  Message
                </label>
                <p className="text-sm text-dash-text bg-dash-bg rounded-lg p-3 border border-dash-border leading-relaxed">
                  {lead.message}
                </p>
              </section>
            )}

            {/* Timeline */}
            <section>
              <label className="text-xs font-medium text-dash-muted uppercase tracking-wide block mb-2">
                Timeline
              </label>
              <div className="space-y-1 text-xs text-dash-muted">
                <div>
                  Submitted{' '}
                  <span className="text-dash-text">
                    {format(new Date(lead.created_at), 'dd MMM yyyy, HH:mm')}
                  </span>
                </div>
                {lead.contacted_at && (
                  <div>
                    Contacted{' '}
                    <span className="text-dash-text">
                      {format(new Date(lead.contacted_at), 'dd MMM yyyy, HH:mm')}
                    </span>
                  </div>
                )}
                <div>Source: <span className="text-dash-text capitalize">{lead.source}</span></div>
              </div>
            </section>

            {/* Email history */}
            {(lead.emails?.length ?? 0) > 0 && (
              <section>
                <label className="text-xs font-medium text-dash-muted uppercase tracking-wide block mb-2">
                  Emails Sent ({lead.emails?.length ?? 0})
                </label>
                <div className="space-y-1.5">
                  {lead.emails.map((e) => (
                    <div
                      key={e.id}
                      className="text-xs flex items-start justify-between gap-2 bg-dash-bg rounded-lg px-3 py-2 border border-dash-border"
                    >
                      <div className="truncate">
                        <span className="text-dash-muted">Step {e.step_number}:</span>{' '}
                        <span className="text-dash-text">{e.subject}</span>
                      </div>
                      <div className="text-dash-muted shrink-0">
                        {e.error ? (
                          <span className="text-red-400">Failed</span>
                        ) : e.opened_at ? (
                          <span className="text-green-400">Opened</span>
                        ) : (
                          <span>Sent</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Notes */}
            <section>
              <label className="text-xs font-medium text-dash-muted uppercase tracking-wide block mb-2">
                Notes ({lead.lead_notes?.length ?? 0})
              </label>

              {(lead.lead_notes?.length ?? 0) > 0 && (
                <div className="space-y-2 mb-3">
                  {[...lead.lead_notes]
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )
                    .map((n) => (
                      <div
                        key={n.id}
                        className="bg-dash-bg rounded-lg p-3 border border-dash-border"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-brand-amber">{n.author}</span>
                          <span className="text-xs text-dash-muted">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-dash-text leading-relaxed">{n.note}</p>
                      </div>
                    ))}
                </div>
              )}

              <div className="space-y-2">
                <textarea
                  ref={noteRef}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddNote();
                  }}
                  placeholder="Add a note… (Ctrl+Enter to save)"
                  rows={3}
                  className="w-full bg-dash-bg border border-dash-border text-dash-text text-sm rounded-lg px-3 py-2 placeholder:text-dash-muted focus:outline-none focus:border-brand-amber/60 resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || addNote.isPending}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-brand-amber/10 text-brand-amber border border-brand-amber/30 rounded-lg hover:bg-brand-amber/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={12} />
                  {addNote.isPending ? 'Saving…' : 'Add Note'}
                </button>
              </div>
            </section>
          </>
        )}
      </div>

      {/* Footer — delete */}
      {!isLoading && lead && (
        <div className="p-5 border-t border-dash-border shrink-0">
          <button
            onClick={handleDelete}
            disabled={deleteLead.isPending}
            className="flex items-center gap-2 text-xs px-3 py-1.5 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 disabled:opacity-40 transition-colors"
          >
            <Trash2 size={12} />
            {confirmDelete ? 'Click again to confirm' : 'Delete Lead'}
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Leads page
// ---------------------------------------------------------------------------

export function Leads() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [page, setPage] = useState(1);
  const selectedId = searchParams.get('selected');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const filters: LeadFilters = {
    page,
    page_size: 20,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter && { status: statusFilter }),
  };

  const { data, isLoading } = useLeads(filters);

  function selectLead(id: string) {
    setSearchParams({ selected: id });
  }

  function closeLead() {
    setSearchParams({});
  }

  function exportCSV() {
    if (!data?.items?.length) return;
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Postcode',
      'Property Type',
      'Rooms',
      'Current Heating',
      'Status',
      'Source',
      'Submitted',
    ];
    const rows = data.items.map((l) => [
      l.full_name,
      l.email,
      l.phone,
      l.postcode,
      l.property_type,
      l.rooms_to_heat,
      l.current_heating,
      l.status,
      l.source,
      format(new Date(l.created_at), 'dd/MM/yyyy HH:mm'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trust-electric-leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full gap-0">
      {/* Table panel */}
      <div
        className={`flex flex-col min-w-0 transition-all duration-300 ${
          selectedId ? 'flex-1' : 'w-full'
        }`}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, postcode…"
              className="w-full bg-dash-card border border-dash-border text-dash-text text-sm rounded-lg pl-8 pr-3 py-2 placeholder:text-dash-muted focus:outline-none focus:border-brand-amber/60"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dash-muted hover:text-dash-text"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as LeadStatus | '');
              setPage(1);
            }}
            className="bg-dash-card border border-dash-border text-dash-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-brand-amber/60 cursor-pointer"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          {/* Export */}
          <button
            onClick={exportCSV}
            disabled={!data?.items?.length}
            className="flex items-center gap-1.5 text-sm px-3 py-2 bg-dash-card border border-dash-border text-dash-muted hover:text-brand-amber hover:border-brand-amber/40 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 bg-dash-card border border-dash-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dash-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-dash-muted">Name</th>
                  <th className="px-4 py-3 text-xs font-medium text-dash-muted hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-dash-muted hidden lg:table-cell">
                    Property
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-dash-muted">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-dash-muted hidden sm:table-cell">
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-dash-muted hidden xl:table-cell">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dash-border/50">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : (data?.items?.length ?? 0) === 0
                  ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-16 text-center text-dash-muted text-sm">
                          <MessageSquare size={28} className="mx-auto mb-3 opacity-30" />
                          No leads match your filters.
                        </td>
                      </tr>
                    )
                  : data?.items.map((lead: Lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => selectLead(lead.id)}
                        className={`cursor-pointer transition-colors hover:bg-white/3 ${
                          selectedId === lead.id ? 'bg-brand-amber/5' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-dash-text">{lead.full_name}</div>
                          <div className="text-xs text-dash-muted md:hidden">{lead.email}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="text-dash-text truncate max-w-40">{lead.email}</div>
                          <div className="text-xs text-dash-muted">{lead.phone}</div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-dash-muted">
                          <div>{lead.property_type}</div>
                          <div className="text-xs">{lead.postcode}</div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-xs text-dash-muted">
                          {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell text-xs text-dash-muted">
                          {(lead.lead_notes?.length ?? 0) > 0 ? (
                            <span className="text-brand-amber/80">
                              {lead.lead_notes.length} note
                              {lead.lead_notes.length !== 1 ? 's' : ''}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm">
            <span className="text-xs text-dash-muted">
              {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of {data.total} leads
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-dash-border text-dash-muted hover:text-dash-text hover:border-brand-amber/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs text-dash-muted">
                {page} / {data.total_pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page === data.total_pages}
                className="p-1.5 rounded-lg border border-dash-border text-dash-muted hover:text-dash-text hover:border-brand-amber/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedId && (
        <div className="w-80 xl:w-96 shrink-0 ml-4 bg-dash-card border border-dash-border rounded-xl overflow-hidden flex flex-col">
          <DetailPanel leadId={selectedId} onClose={closeLead} />
        </div>
      )}
    </div>
  );
}
