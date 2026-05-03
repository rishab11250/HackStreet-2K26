import { useState } from 'react';
import { X, Image as ImageIcon, FileText, Download, Check } from 'lucide-react';
import useStore from '../../store/useStore';
import { exportCanvas } from '../../utils/exportCanvas';

const ExportModal = () => {
  const { isExportModalOpen, setExportModalOpen, elements } = useStore();
  const [format, setFormat] = useState('png'); // 'png' | 'pdf'
  const [includeBackground, setIncludeBackground] = useState(true);
  const [cropToContent, setCropToContent] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isExportModalOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await exportCanvas(format, elements, {
        includeBackground,
        cropToContent,
      });
      setExportModalOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setExportModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Export Board</h2>
              <p className="text-sm text-gray-500 mt-1">Download your whiteboard as an image or PDF</p>
            </div>
            <button 
              onClick={() => setExportModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Format Selector */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setFormat('png')}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                format === 'png' 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]' 
                  : 'border-gray-100 hover:border-gray-200 text-gray-500'
              }`}
            >
              <ImageIcon size={32} className="mb-2" />
              <span className="text-sm font-bold">PNG Image</span>
              <div className={`mt-2 w-5 h-5 rounded-full flex items-center justify-center ${format === 'png' ? 'bg-[var(--color-primary)] text-white' : 'border border-gray-200'}`}>
                {format === 'png' && <Check size={12} />}
              </div>
            </button>

            <button
              onClick={() => setFormat('pdf')}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                format === 'pdf' 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]' 
                  : 'border-gray-100 hover:border-gray-200 text-gray-500'
              }`}
            >
              <FileText size={32} className="mb-2" />
              <span className="text-sm font-bold">PDF Document</span>
              <div className={`mt-2 w-5 h-5 rounded-full flex items-center justify-center ${format === 'pdf' ? 'bg-[var(--color-primary)] text-white' : 'border border-gray-200'}`}>
                {format === 'pdf' && <Check size={12} />}
              </div>
            </button>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                checked={includeBackground}
                onChange={(e) => setIncludeBackground(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Include background</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                checked={cropToContent}
                onChange={(e) => setCropToContent(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Crop to content</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={() => setExportModalOpen(false)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-bold hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg disabled:opacity-50"
            >
              <Download size={18} />
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
