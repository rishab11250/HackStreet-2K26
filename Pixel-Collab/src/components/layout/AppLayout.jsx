import useStore from '../../store/useStore';
import TopBar from './TopBar';
import LeftToolbar from '../toolbar/LeftToolbar';
import BottomOptions from '../toolbar/BottomOptions';
import ExportModal from '../ui/ExportModal';

import ActivityFeed from '../collaboration/ActivityFeed';

const AppLayout = ({ children }) => {
  const showActivityFeed = useStore((state) => state.showActivityFeed);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--color-canvas-bg)]">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <LeftToolbar />
        
        <main className="flex-1 relative overflow-hidden h-full">
          {children}
          <BottomOptions />
          <ExportModal />
        </main>

        {/* Right Panel */}
        <div 
          className={`h-full bg-white border-l border-[var(--color-border)] transition-all duration-300 ease-in-out overflow-hidden shadow-xl z-20 ${
            showActivityFeed ? 'w-[280px]' : 'w-0 border-l-0'
          }`}
        >
          <div className="w-[280px] p-4 h-full flex flex-col">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 border-b border-gray-100 pb-2">Activity Feed</h2>
            <div className="flex-1 overflow-hidden">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
