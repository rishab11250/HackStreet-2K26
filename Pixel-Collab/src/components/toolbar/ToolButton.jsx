import React from 'react';

const ToolButton = ({ icon: Icon, name, shortcut, active, onClick, tooltipSide = 'right' }) => {
  return (
    <div className="relative group flex justify-center py-1">
      <button
        onClick={onClick}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
          active 
            ? 'bg-[var(--color-primary)] text-white shadow-md scale-105' 
            : 'text-[var(--color-toolbar-icon)] hover:bg-[var(--color-toolbar-hover-bg,rgba(255,255,255,0.1))] hover:text-white'
        }`}
        title={`${name} (${shortcut})`}
      >
        <Icon size={20} />
      </button>
      
      {/* Tooltip */}
      <div className={`absolute ${tooltipSide === 'right' ? 'left-full ml-3' : 'bottom-full mb-3'} top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg`}>
        {name} <span className="text-gray-400 ml-1">{shortcut}</span>
      </div>
    </div>
  );
};

export default ToolButton;
