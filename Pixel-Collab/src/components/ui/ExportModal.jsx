import { useState } from 'react';
import { X, Image as ImageIcon, FileText, Download, Check } from 'lucide-react';
import useStore from '../../store/useStore';
import { exportCanvas } from '../../utils/exportCanvas';

const ExportModal = () => {
  const { isExportModalOpen, setExportModalOpen } = useStore();
  const [format, setFormat] = useState('png'); // 'png' | 'pdf'
  const [options, setOptions] = useState({
    includeBackground: true,
    cropToContent: true,
  });

  if (!isExportModalOpen) return null;

  const handleExport = async () => {
    await exportCanvas(format, options);
    setExportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Export Board</h2>
            <p className="text-xs text-gray-500">Download your work to share with others</p>
          </div>
          <button 
            onClick={() => setExportModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* Preview Placeholder */}
          <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={32} strokeWidth={1} />
            <span className="text-[10px] mt-2 font-medium">Snapshot Preview</span>
          </div>

          {/* Format Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setFormat('png')}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                format === 'png' 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' 
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <ImageIcon size={24} className={format === 'png' ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
              <span className={`text-xs font-bold ${format === 'png' ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>PNG Image</span>
            </button>
            <button 
              onClick={() => setFormat('pdf')}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                format === 'pdf' 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' 
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <FileText size={24} className={format === 'pdf' ? 'text-[var(--color-primary)]' : 'text-gray-400'} />
              <span className={`text-xs font-bold ${format === 'pdf' ? 'text-[var(--color-primary)]' : 'text-gray-600'}`}>PDF Document</span>
            </button>
          </div>

          {/* Settings */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => setOptions({ ...options, includeBackground: !options.includeBackground })}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  options.includeBackground ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-gray-300'
                }`}
              >
                {options.includeBackground && <Check size={14} className="text-white" />}
              </div>
              <span className="text-xs font-medium text-gray-700">Include background (dot grid)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => setOptions({ ...options, cropToContent: !options.cropToContent })}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  options.cropToContent ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-gray-300'
                }`}
              >
                {options.cropToContent && <Check size={14} className="text-white" />}
              </div>
              <span className="text-xs font-medium text-gray-700">Crop to content only</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button 
            onClick={() => setExportModalOpen(false)}
            className="flex-1 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleExport}
            className="flex-1 py-2.5 text-sm font-bold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
