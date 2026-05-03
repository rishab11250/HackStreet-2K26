import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';

const ActivityFeed = () => {
  const activityLog = useStore((state) => state.activityLog);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRelative = (ts) => {
    const diff = Math.floor((now - ts) / 1000);
    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const formatAbsolute = (ts) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(new Date(ts));
    } catch {
      return new Date(ts).toLocaleString();
    }
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-full pb-8 scrollbar-hide">
      {activityLog.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="w-12 h-12 bg-[var(--color-canvas-bg)] rounded-full flex items-center justify-center mb-3">
            <div className="w-6 h-6 border-2 border-dashed border-[var(--color-border)] rounded-full" />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] italic">
            No activity yet. Create or edit elements to see live updates.
          </p>
        </div>
      ) : (
        activityLog.map((event) => (
          <div
            key={event.id}
            className="flex gap-3 animate-in slide-in-from-right-2 duration-300 transition-opacity"
          >
            <div
              className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
              style={{ backgroundColor: event.userColor || '#5B6AF0' }}
              aria-hidden
            >
              {(event.userName || '?').substring(0, 1)}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="text-[11px] leading-tight text-[var(--color-text-primary)]">
                <span className="font-semibold">{event.userName || 'Someone'}</span>{' '}
                <span className="text-[var(--color-text-secondary)]">{event.action}</span>
              </div>
              <div className="text-[9px] text-[var(--color-text-muted)] mt-1 flex flex-col gap-0.5">
                <time dateTime={new Date(event.timestamp).toISOString()} title={formatAbsolute(event.timestamp)}>
                  {formatRelative(event.timestamp)}
                </time>
                <span className="opacity-70">{formatAbsolute(event.timestamp)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityFeed;
