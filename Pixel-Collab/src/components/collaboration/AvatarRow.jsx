import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import useStore from '../../store/useStore';
import MemberPanel from './MemberPanel';

const AvatarRow = () => {
  const workspaceMembers = useStore((state) => state.workspaceMembers);
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <div className="flex items-center -space-x-2 mr-2">
        {workspaceMembers.slice(0, 5).map((user) => (
          <div key={user.id} className="relative group cursor-help">
            <div
              className="w-8 h-8 rounded-full border-2 border-[var(--color-panel-bg)] flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-all duration-200 hover:scale-110 hover:z-10"
              style={{ backgroundColor: user.color }}
            >
              {user.initials}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4CAF7D] border-2 border-[var(--color-panel-bg)] rounded-full" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {user.name} · {user.role}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="w-8 h-8 rounded-full border-2 border-dashed border-[var(--color-border)] bg-[var(--color-canvas-bg)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] cursor-pointer transition-all duration-300 shadow-sm ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          title="Add members"
          aria-label="Open member management"
        >
          <UserPlus size={16} />
        </button>
      </div>
      <MemberPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
};

export default AvatarRow;
