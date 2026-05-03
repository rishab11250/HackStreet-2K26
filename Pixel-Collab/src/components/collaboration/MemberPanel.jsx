import { useState, useCallback, useEffect } from 'react';
import { X, Loader2, Search, UserPlus } from 'lucide-react';
import useStore from '../../store/useStore';
import { searchDirectory, inviteMember, persistMembers } from '../../services/workspaceApi';

const ROLES = [
  { id: 'viewer', label: 'Viewer' },
  { id: 'editor', label: 'Editor' },
  { id: 'owner', label: 'Owner' },
];

export default function MemberPanel({ open, onClose }) {
  const workspaceMembers = useStore((s) => s.workspaceMembers);
  const addWorkspaceMember = useStore((s) => s.addWorkspaceMember);
  const updateWorkspaceMemberRole = useStore((s) => s.updateWorkspaceMemberRole);
  const removeWorkspaceMember = useStore((s) => s.removeWorkspaceMember);
  const currentUserId = useStore((s) => s.currentUserId);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const runSearch = useCallback(async (q) => {
    setLoading(true);
    setError(null);
    try {
      const { results: r, error: err } = await searchDirectory(q);
      if (err) setError(err);
      setResults(r || []);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      void runSearch('');
    }, 0);
    return () => clearTimeout(t);
  }, [open, runSearch]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/40 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-panel-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-[var(--color-panel-bg)] border border-[var(--color-border)] shadow-2xl flex flex-col transition-colors duration-300">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 id="member-panel-title" className="text-sm font-semibold text-[var(--color-text-primary)]">
            Workspace members
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-canvas-bg)] text-[var(--color-text-muted)]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-[var(--color-border)]">
          <label className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] block mb-2">
            Invite / search directory
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runSearch(query);
              }}
              placeholder="Name or email…"
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas-bg)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <button
            type="button"
            onClick={() => runSearch(query)}
            className="mt-2 text-xs font-semibold text-[var(--color-primary)]"
          >
            Search
          </button>
          {error && <p className="text-xs text-[var(--color-danger)] mt-2">{error}</p>}
          <div className="mt-3 max-h-40 overflow-y-auto rounded-lg border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-[var(--color-text-muted)]">
                <Loader2 className="animate-spin" size={22} />
              </div>
            ) : (
              results.map((row) => (
                <div key={row.id} className="flex items-center justify-between px-3 py-2 gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[var(--color-text-primary)] truncate">{row.name}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)] truncate">{row.email}</div>
                  </div>
                  <button
                    type="button"
                    disabled={saving || workspaceMembers.some((m) => m.email === row.email)}
                    onClick={async () => {
                      setSaving(true);
                      setError(null);
                      const { member, error: invErr } = await inviteMember({
                        name: row.name,
                        email: row.email,
                        role: row.role || 'editor',
                      });
                      if (invErr || !member) {
                        setError(invErr || 'Invite failed');
                        setSaving(false);
                        return;
                      }
                      addWorkspaceMember(member);
                      await persistMembers(useStore.getState().workspaceMembers);
                      setSaving(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold bg-[var(--color-primary)] text-white disabled:opacity-40"
                  >
                    <UserPlus size={12} />
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] mb-2">Current members</h3>
          <ul className="space-y-2">
            {workspaceMembers.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-[var(--color-canvas-bg)] border border-[var(--color-border)]"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: m.color }}
                >
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                    {m.name}
                    {m.id === currentUserId && (
                      <span className="ml-1 text-[10px] text-[var(--color-primary)]">(you)</span>
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)] truncate">{m.email || '—'}</div>
                </div>
                <select
                  value={m.role}
                  disabled={m.id === currentUserId || saving}
                  onChange={async (e) => {
                    const role = e.target.value;
                    setSaving(true);
                    updateWorkspaceMemberRole(m.id, role);
                    await persistMembers(useStore.getState().workspaceMembers);
                    setSaving(false);
                  }}
                  className="text-[10px] border border-[var(--color-border)] rounded-md px-1 py-1 bg-[var(--color-panel-bg)] text-[var(--color-text-primary)]"
                  aria-label={`Role for ${m.name}`}
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {m.id !== currentUserId && (
                  <button
                    type="button"
                    className="text-[10px] text-[var(--color-danger)] px-2"
                    onClick={async () => {
                      setSaving(true);
                      removeWorkspaceMember(m.id);
                      await persistMembers(useStore.getState().workspaceMembers);
                      setSaving(false);
                    }}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
