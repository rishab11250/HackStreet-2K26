import { Share2, Download, ZoomIn, ZoomOut, Menu } from 'lucide-react';
import useStore from '../../store/useStore';
import AvatarRow from '../collaboration/AvatarRow';

const TopBar = () => {
  const { 
    setExportModalOpen, 
    viewport, 
    zoomIn, 
    zoomOut, 
    resetZoom, 
    toggleActivityFeed,
    showActivityFeed 
  } = useStore();

  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <header className="h-[52px] bg-white border-b border-[var(--color-border)] px-4 flex items-center justify-between z-30 shadow-sm">
      {/* Left section: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold">C</div>
        <span className="font-semibold text-[var(--color-text-primary)] hidden sm:block">CollabBoard</span>
      </div>

      {/* Center: Placeholder for future features */}
      <div className="hidden md:flex items-center bg-[var(--color-primary-light)] px-3 py-1 rounded-full border border-[var(--color-primary)]/10">
        <span className="text-xs font-medium text-[var(--color-primary)]">Personal Workspace</span>
      </div>

      {/* Right section: Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        <AvatarRow />

        <div className="h-6 w-[1px] bg-[var(--color-border)] mx-1 hidden sm:block" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-md border border-gray-100">
          <button onClick={zoomOut} className="p-1 hover:bg-white rounded transition-colors text-gray-600">
            <ZoomOut size={14} />
          </button>
          <button onClick={resetZoom} className="px-1 text-[11px] font-semibold text-gray-700 min-w-[36px] text-center hover:bg-white rounded">
            {zoomPercent}%
          </button>
          <button onClick={zoomIn} className="p-1 hover:bg-white rounded transition-colors text-gray-600">
            <ZoomIn size={14} />
          </button>
        </div>

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
