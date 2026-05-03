import React from 'react';
import useStore from '../../store/useStore';
import TopBar from './TopBar';
import LeftToolbar from '../toolbar/LeftToolbar';
import BottomOptions from '../toolbar/BottomOptions';
import RightPanel from './RightPanel';
import StickyNote from '../elements/StickyNote';
import ExportModal from '../ui/ExportModal';
import TypingIndicator from '../collaboration/TypingIndicator';
import MockCursors from '../collaboration/MockCursors';

const AppLayout = ({ children }) => {
  const elements = useStore((state) => state.elements);
  const stickyNotes = elements.filter(el => el.type === 'sticky');

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--color-canvas-bg)]">
      <TopBar />
      <div className="flex-1 flex overflow-hidden relative">
        <LeftToolbar />
        
        <main className="flex-1 relative overflow-hidden h-full">
          {children}

          {/* Sticky Notes Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {stickyNotes.map(note => (
              <div key={note.id} className="pointer-events-auto">
                <StickyNote element={note} />
              </div>
            ))}
          </div>

          {/* Floating UI Elements */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
            <TypingIndicator />
          </div>

          <BottomOptions />
          <ExportModal />

          {/* Cursors Layer (Ensure they are on top of everything including stickies) */}
          <MockCursors />
        </main>

        <RightPanel />
      </div>
    </div>
  );
};

export default AppLayout;
