import React from 'react'
import AppLayout from './components/layout/AppLayout'
import MockCursors from './components/collaboration/MockCursors'
import { useMockCollaboration } from './hooks/useMockCollaboration'
import { useKeyboard } from './hooks/useKeyboard'

function App() {
  useMockCollaboration();
  useKeyboard();

  return (
    <AppLayout>
      <MockCursors />
      <div className="w-full h-full flex items-center justify-center text-gray-400 select-none">
        <div className="text-center">
          <p className="text-sm font-medium">Canvas area</p>
          <p className="text-xs">Zoom/Pan enabled</p>
        </div>
      </div>
    </AppLayout>
  )
}

export default App
