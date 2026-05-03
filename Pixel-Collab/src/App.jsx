import { useEffect } from 'react'
import AppLayout from './components/layout/AppLayout'
import WhiteboardCanvas from './canvas/WhiteboardCanvas'
import { useMockCollaboration } from './hooks/useMockCollaboration'
import { useKeyboard } from './hooks/useKeyboard'
import useStore from './store/useStore'
import { deserializeBoard } from './utils/persistence'

function App() {
  useMockCollaboration();
  useKeyboard();
  const setElements = useStore(state => state.setElements);

  useEffect(() => {
    const loadBoard = async () => {
      // Load board from URL hash on mount
      const hash = window.location.hash.slice(1);
      if (hash) {
        const elements = await deserializeBoard(hash);
        if (elements && elements.length > 0) {
          setElements(elements);
        }
      }
    };
    
    loadBoard();
  }, [setElements]);

  return (
    <AppLayout>
      <WhiteboardCanvas />
    </AppLayout>
  )
}

export default App
