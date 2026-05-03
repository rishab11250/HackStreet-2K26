import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, UserRound, X } from 'lucide-react';
import useStore from '../../store/useStore';

export default function CurrentUserProfile() {
  const workspaceMembers = useStore((s) => s.workspaceMembers);
  const currentUserId = useStore((s) => s.currentUserId);
  const updateCurrentUserProfile = useStore((s) => s.updateCurrentUserProfile);
  const panelId = useId();
  const me = workspaceMembers.find((m) => m.id === currentUserId);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(me?.name ?? '');
  const wrapRef = useRef(null);

  const openDialog = () => {
    setDraft(me?.name ?? '');
    setOpen(true);
  };

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (ev) => {
      if (!wrapRef.current?.contains(ev.target)) close();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!me) return null;

  const save = () => {
    updateCurrentUserProfile({ name: draft });
    close();
  };

  return (
    <div className="relative flex items-center shrink-0" ref={wrapRef}>
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? `${panelId}-panel` : undefined}
        onClick={() => (open ? close() : openDialog())}
        className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas-bg)] hover:bg-[var(--color-primary-light)]/40 transition-colors duration-300 max-w-[min(200px,28vw)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        title="Your display name"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
          style={{ backgroundColor: me.color }}
        >
          {me.initials}
        </div>
        <span className="text-xs font-medium text-[var(--color-text-primary)] truncate hidden sm:inline">
          {me.name}
        </span>
        <UserRound size={14} className="text-[var(--color-text-muted)] shrink-0 sm:hidden" />
        <ChevronDown
          size={14}
          className={`text-[var(--color-text-muted)] shrink-0 hidden sm:block transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          id={`${panelId}-panel`}
          role="dialog"
          aria-labelledby={`${panelId}-title`}
          className="absolute right-0 top-[calc(100%+6px)] z-[500] w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-bg)] shadow-xl p-3 animate-in fade-in zoom-in-95 duration-200"
        >
          <h2 id={`${panelId}-title`} className="text-[11px] font-semibold text-[var(--color-text-primary)] mb-2">
            Your name
          </h2>
          <p className="text-[10px] text-[var(--color-text-muted)] mb-2">
            Shown in the activity feed and member list. Saved in this browser.
          </p>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                save();
              }
            }}
            className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-canvas-bg)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            maxLength={64}
            autoComplete="nickname"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-canvas-bg)]"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!draft.trim()}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-[var(--color-primary)] text-white disabled:opacity-40 hover:opacity-95"
            >
              <Check size={14} />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
