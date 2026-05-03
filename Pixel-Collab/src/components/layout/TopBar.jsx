import React from 'react';
import { Share2, Download, Menu } from 'lucide-react';
import useStore from '../../store/useStore';
import AvatarRow from '../collaboration/AvatarRow';
import ZoomControls from '../ui/ZoomControls';

const TopBar = () => {
  const { 
    setExportModalOpen, 
    toggleActivityFeed,
    showActivityFeed 
  } = useStore();

  return (
    <header className="h-[52px] bg-white border-b border-[var(--color-border)] px-4 flex items-center justify-between z-30 shadow-sm">
      {/* Left section: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold">C</div>
        <span className="font-semibold text-[var(--color-text-primary)] hidden sm:block">CollabBoard</span>
      </div>

      {/* Center: Placeholder */}
      <div className="hidden md:flex items-center bg-[var(--color-primary-light)] px-3 py-1 rounded-full border border-[var(--color-primary)]/10">
        <span className="text-xs font-medium text-[var(--color-primary)]">Personal Workspace</span>
      </div>

      {/* Right section: Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        <AvatarRow />

        <div className="h-6 w-[1px] bg-[var(--color-border)] mx-1 hidden sm:block" />

        <ZoomControls />

        <div className="h-6 w-[1px] bg-[var(--color-border)] mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Share2 size={14} />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button 
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-md text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={toggleActivityFeed}
            className={`p-1.5 rounded-md transition-colors ${showActivityFeed ? 'bg-gray-100 text-[var(--color-primary)]' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
