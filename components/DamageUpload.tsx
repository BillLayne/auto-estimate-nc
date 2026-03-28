
import React, { useRef, useState } from 'react';
import DocumentScanner from './DocumentScanner';

interface DamageUploadProps {
  onImagesCaptured: (images: string[]) => void;
  onBack: () => void;
  mode?: 'damage' | 'document';
  // New optional props for customization
  customTitle?: string;
  customSubtitle?: string;
  customButtonText?: string;
}

const DamageUpload: React.FC<DamageUploadProps> = ({ 
  onImagesCaptured, 
  onBack,
  mode = 'damage',
  customTitle,
  customSubtitle,
  customButtonText
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDoc = mode === 'document';
  
  // Logic to determine text: Use custom props if provided, otherwise default logic
  const title = customTitle || (isDoc ? "Upload Estimate Documents" : "Visual Damage Analysis");
  const subTitle = customSubtitle || (isDoc ? "Scan photos of each page or upload PDF/Images." : "Add multiple clear photos from different angles.");
  const buttonText = customButtonText || (isDoc ? `Analyze Estimate (${previews.length} Pages)` : `Analyze All Photos (${previews.length})`);
  
  const convertFileToJpegDataUrl = async (file: File): Promise<string> => {
    try {
      const bitmap = await createImageBitmap(file);
      const MAX = 4096;
      let w = bitmap.width, h = bitmap.height;
      if (w > MAX || h > MAX) {
        const s = MAX / Math.max(w, h);
        w = Math.round(w * s);
        h = Math.round(h * s);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      canvas.width = 0;
      canvas.height = 0;
      return dataUrl;
    } catch {
      // Fallback to FileReader for formats canvas can't handle
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const files = Array.from(fileList);
      for (const file of files) {
        const dataUrl = await convertFileToJpegDataUrl(file);
        setPreviews(prev => [...prev, dataUrl]);
      }
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (previews.length > 0) {
      onImagesCaptured(previews);
    }
  };

  const getPreviewContent = (src: string) => {
    if (src.includes('application/pdf')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-700">
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          <span className="text-xs font-bold">PDF Document</span>
        </div>
      );
    }
    return <img src={src} alt="Upload preview" className="w-full h-full object-cover" />;
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-500">{subTitle}</p>
          </div>
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {previews.map((src, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border shadow-sm group bg-slate-50">
              {getPreviewContent(src)}
              <div className="absolute top-1 right-1 flex gap-1">
                 <span className="bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {idx + 1}
                 </span>
              </div>
              <button 
                onClick={() => removeImage(idx)}
                className="absolute bottom-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Action Buttons */}
          <button 
            onClick={() => setShowScanner(true)}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <div className="bg-slate-200 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-slate-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Scan Page
            </span>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50 flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <div className="bg-slate-200 p-3 rounded-full group-hover:bg-emerald-100 transition-colors">
              <svg className="w-6 h-6 text-slate-600 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Upload PDF
            </span>
          </button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept={isDoc ? "image/*,application/pdf,.heic,.heif" : "image/*,.heic,.heif,image/heic,image/heif"} 
          multiple
          className="hidden" 
        />

        <div className="mt-8 space-y-3">
          <button 
            onClick={handleConfirm}
            disabled={previews.length === 0}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all shadow-lg ${previews.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            {buttonText}
          </button>
          <p className="text-center text-xs text-slate-400">
            {isDoc 
              ? "We can read clear photos of paper estimates or PDF files." 
              : "Multiple angles help Gemini AI identify hidden damage and provide a more accurate guide."}
          </p>
        </div>
      </div>

      {showScanner && (
        <DocumentScanner 
          onCapture={(img) => {
            setPreviews(prev => [...prev, img]);
            setShowScanner(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
};

export default DamageUpload;
