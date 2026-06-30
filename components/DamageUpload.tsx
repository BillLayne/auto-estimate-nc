
import React, { useRef, useState } from 'react';
import DocumentScanner from './DocumentScanner';
import StepIndicator from './StepIndicator';
import { LEGAL } from '../config';

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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDoc = mode === 'document';
  
  // Logic to determine text: Use custom props if provided, otherwise default logic
  const title = customTitle || (isDoc ? "Upload Estimate Documents" : "Visual Damage Analysis");
  const subTitle = customSubtitle || (isDoc ? "Scan photos of each page or upload PDF/Images." : "Add multiple clear photos from different angles.");
  const buttonText = customButtonText || (isDoc ? `Analyze Estimate (${previews.length} Pages)` : `Analyze All Photos (${previews.length})`);
  
  const readBlobAsDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const isPdfFile = (file: File) =>
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  const isHeicFile = (file: File) => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const hasHeicExtension = fileName.endsWith('.heic') || fileName.endsWith('.heif');
    return (
      fileType === 'image/heic' ||
      fileType === 'image/heif' ||
      (fileType === 'application/octet-stream' && hasHeicExtension) ||
      hasHeicExtension
    );
  };

  const normalizeImageBlob = async (file: File): Promise<Blob> => {
    if (!isHeicFile(file)) {
      return file;
    }

    const { default: heic2any } = await import('heic2any');
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9
    });

    return Array.isArray(converted) ? converted[0] : converted;
  };

  const convertFileToUploadData = async (file: File): Promise<string> => {
    if (isPdfFile(file)) {
      return readBlobAsDataUrl(file);
    }

    const sourceBlob = await normalizeImageBlob(file);

    try {
      const bitmap = await createImageBitmap(sourceBlob);
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
      return readBlobAsDataUrl(sourceBlob);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setUploadError(null);
      const files = Array.from(fileList);
      for (const file of files) {
        try {
          const dataUrl = await convertFileToUploadData(file);
          setPreviews(prev => [...prev, dataUrl]);
        } catch (error) {
          console.error('File conversion failed:', error);
          setUploadError(`We couldn't read "${file.name}". Please try exporting that photo as JPG or PNG and upload it again.`);
        }
      }
    }

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (previews.length > 0 && agreed) {
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
      {!isDoc && <StepIndicator current={2} />}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 sm:p-8 max-w-2xl mx-auto animate-fadeIn">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 font-display">{title}</h2>
            <p className="text-slate-500 mt-1">{subTitle}</p>
          </div>
          <button onClick={onBack} aria-label="Go back" className="shrink-0 text-slate-400 hover:text-brand-navy p-2 -mr-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {!isDoc && (
          <div className="mb-5 rounded-xl bg-blue-50/70 ring-1 ring-blue-100 p-4">
            <p className="text-xs font-bold text-brand-navy uppercase tracking-wide mb-2">📸 For the best estimate, add:</p>
            <ul className="text-sm text-slate-600 space-y-1.5">
              <li className="flex items-start gap-2.5"><Dot/><span>A <b className="font-semibold text-slate-700">wide shot</b> of the whole damaged area</span></li>
              <li className="flex items-start gap-2.5"><Dot/><span>A <b className="font-semibold text-slate-700">close-up</b> of the worst dent or scratch</span></li>
              <li className="flex items-start gap-2.5"><Dot/><span>A <b className="font-semibold text-slate-700">different angle</b> to catch hidden damage</span></li>
            </ul>
          </div>
        )}

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
            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-navy bg-slate-50 flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <div className="bg-slate-200 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-slate-600 group-hover:text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              Upload Files
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
          {/* Required consent + plain-language disclaimer */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 ring-1 ring-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 shrink-0 accent-brand-navy cursor-pointer"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">I understand this is a free AI estimate for general information only</span> —
              not a quote, appraisal, or guarantee. Actual repair costs may be higher or lower, photos can't reveal hidden damage,
              and I'll confirm any coverage or claim decision with my insurer.
            </span>
          </label>

          <button
            onClick={handleConfirm}
            disabled={previews.length === 0 || !agreed}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${previews.length > 0 && agreed ? 'bg-brand-navy hover:bg-brand-navy-dk active:scale-[0.98]' : 'bg-slate-300 cursor-not-allowed'}`}
          >
            {buttonText}
            {previews.length > 0 && agreed && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
          </button>
          {previews.length > 0 && !agreed && (
            <p className="text-center text-xs text-brand-navy font-semibold">Please check the box above to continue.</p>
          )}
          <p className="text-center text-xs text-slate-400">
            {isDoc
              ? "We can read clear photos of paper estimates or PDF files, including iPhone HEIC images."
              : "Multiple angles help our AI spot hidden damage and give a more accurate guide, including iPhone HEIC photos."}
          </p>
          {uploadError && (
            <p className="text-center text-sm text-red-600">{uploadError}</p>
          )}
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

const Dot: React.FC = () => (
  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-[7px]" />
);

export default DamageUpload;
