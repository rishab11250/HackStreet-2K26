import useStore from '../../store/useStore';
import ActivityFeed from '../collaboration/ActivityFeed';

const RightPanel = () => {
  const showActivityFeed = useStore((state) => state.showActivityFeed);

  return (
    <div 
      className={`h-full bg-white border-l border-[var(--color-border)] transition-all duration-300 ease-in-out overflow-hidden shadow-xl z-20 ${
        showActivityFeed ? 'w-[280px]' : 'w-0 border-l-0'
      }`}
    >
      <div className="w-[280px] p-4 h-full flex flex-col">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 border-b border-gray-100 pb-2">
          Activity Feed
        </h2>
        <div className="flex-1 overflow-hidden">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
