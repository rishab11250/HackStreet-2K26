import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import useStore from '../../store/useStore';

const ZoomControls = () => {
  const { viewport, zoomIn, zoomOut, resetZoom, fitToScreen } = useStore();
  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-md border border-gray-100">
      <button 
        onClick={zoomOut} 
        className="p-1 hover:bg-white rounded transition-colors text-gray-600"
        title="Zoom Out (Ctrl -)"
      >
        <ZoomOut size={14} />
      </button>
      
      <button 
        onClick={resetZoom} 
        className="px-1 text-[11px] font-semibold text-gray-700 min-w-[36px] text-center hover:bg-white rounded"
        title="Reset Zoom (Ctrl 0)"
      >
        {zoomPercent}%
      </button>
      
      <button 
        onClick={zoomIn} 
        className="p-1 hover:bg-white rounded transition-colors text-gray-600"
        title="Zoom In (Ctrl +)"
      >
        <ZoomIn size={14} />
      </button>

      <div className="w-[1px] h-3 bg-gray-200 mx-0.5" />

      <button 
        onClick={fitToScreen}
        className="p-1 hover:bg-white rounded transition-colors text-gray-600"
        title="Fit to Screen"
      >
        <Maximize size={14} />
      </button>
    </div>
  );
};

export default ZoomControls;
