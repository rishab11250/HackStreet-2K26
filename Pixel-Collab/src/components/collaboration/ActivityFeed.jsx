import React from 'react';
import useStore from '../../store/useStore';

const ActivityFeed = () => {
  const activityLog = useStore((state) => state.activityLog);

  const formatTime = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-full pb-8 scrollbar-hide">
      {activityLog.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <div className="w-6 h-6 border-2 border-dashed border-gray-200 rounded-full" />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] italic">No activity yet. Your team's actions will appear here.</p>
        </div>
      ) : (
        activityLog.map((event) => (
          <div key={event.id} className="flex gap-3 animate-in slide-in-from-right-2 duration-300">
            <div 
              className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
              style={{ backgroundColor: event.userColor }}
            >
              {event.userName.substring(0, 1)}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="text-[11px] leading-tight text-[var(--color-text-primary)]">
                <span className="font-semibold">{event.userName}</span> {event.action}
              </div>
              <div className="text-[9px] text-[var(--color-text-muted)] mt-1">
                {formatTime(event.timestamp)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityFeed;
