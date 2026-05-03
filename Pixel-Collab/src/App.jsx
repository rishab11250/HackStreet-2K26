import React from 'react'
import AppLayout from './components/layout/AppLayout'
import WhiteboardCanvas from './canvas/WhiteboardCanvas'
import MockCursors from './components/collaboration/MockCursors'
import { useMockCollaboration } from './hooks/useMockCollaboration'
import { useKeyboard } from './hooks/useKeyboard'

function App() {
  useMockCollaboration();
  useKeyboard();

  return (
    <AppLayout>
      <WhiteboardCanvas />
      <MockCursors />
    </AppLayout>
  )
}

export default App
