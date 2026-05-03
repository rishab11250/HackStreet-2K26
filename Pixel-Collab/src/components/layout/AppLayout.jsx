import useStore from '../../store/useStore';
import TopBar from './TopBar';
import LeftToolbar from '../toolbar/LeftToolbar';
import BottomOptions from '../toolbar/BottomOptions';
import RightPanel from './RightPanel';
import StickyNote from '../elements/StickyNote';
import ExportModal from '../ui/ExportModal';
import TypingIndicator from '../collaboration/TypingIndicator';

const AppLayout = ({ children }) => {
  const elements = useStore((state) => state.elements);
  const presentationMode = useStore((state) => state.presentationMode);
  const stickyNotes = elements.filter((el) => el.type === 'sticky');

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--color-canvas-bg)] transition-colors duration-300">
      {!presentationMode && <TopBar />}
      <div className="flex-1 flex overflow-hidden relative">
        {!presentationMode && <LeftToolbar />}

        <main className="flex-1 relative overflow-hidden h-full transition-opacity duration-300">
          {children}

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {stickyNotes.map((note) => (
              <div key={note.id} className="pointer-events-auto">
                <StickyNote element={note} />
              </div>
            ))}
          </div>

          {!presentationMode && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
              <TypingIndicator />
            </div>
          )}

          {!presentationMode && <BottomOptions />}
          {!presentationMode && <ExportModal />}
        </main>

        {!presentationMode && <RightPanel />}
      </div>

      {presentationMode && (
        <button
          type="button"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[600] px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold shadow-lg opacity-90 hover:opacity-100 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={() => useStore.getState().setPresentationMode(false)}
        >
          Exit presentation (Esc)
        </button>
      )}
    </div>
  );
};

export default AppLayout;
