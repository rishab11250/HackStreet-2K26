import React from 'react'
import AppLayout from './components/layout/AppLayout'
import WhiteboardCanvas from './canvas/WhiteboardCanvas'
import MockCursors from './components/collaboration/MockCursors'
import { useMockCollaboration } from './hooks/useMockCollaboration'

function App() {
  useMockCollaboration();

  return (
    <AppLayout>
      <WhiteboardCanvas />
      <MockCursors />
    </AppLayout>
  )
}

export default App
