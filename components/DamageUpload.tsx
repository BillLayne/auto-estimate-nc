import React, { useRef, useState } from 'react';
import DocumentScanner from './DocumentScanner';
import StepIndicator from './StepIndicator';
import PhotoGuideOverlay from './PhotoGuideOverlay';
import { PhotoGuide } from '../homePhotoGuides';

const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB per file

interface DamageUploadProps {
  onImagesCaptured: (images: string[]) => void;
  onBack: () => void;
  mode?: 'damage' | 'document';
  customTitle?: string;
  customSubtitle?: string;
  customButtonText?: string;
  /** Override the photo-tip bullets (each entry supports "**bold**" markers). */
  customTips?: string[];
  /** Override the consent checkbox copy (home flow uses contractor wording). */
  consentText?: React.ReactNode;
  /** Category-specific photo coaching — pops up automatically on arrival. */
  photoGuide?: PhotoGuide;
  /** Photos to restore (e.g. returning after a failed API call) — nothing is lost. */
  initialImages?: string[];
  /** Recoverable error banner passed from parent workflow when an API request fails. */
  errorBanner?: string | null;
}

const DamageUpload: React.FC<DamageUploadProps> = ({
  onImagesCaptured,
  onBack,
  mode = 'damage',
  customTitle,
  customSubtitle,
  customButtonText,
  customTips,
  consentText,
  photoGuide,
  initialImages,
  errorBanner,
}) => {
  const [previews, setPreviews] = useState<string[]>(initialImages || []);
  const [showScanner, setShowScanner] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(
    !!photoGuide && !(initialImages && initialImages.length > 0)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const isDoc = mode === 'document';

  const title =
    customTitle || (isDoc ? 'Upload Estimate Documents' : 'Upload Vehicle Damage Photos');
  const subTitle =
    customSubtitle ||
    (isDoc
      ? 'Take clear photos of each page or choose a PDF or image file.'
      : 'Add clear photos of the damaged area from several angles.');
  const buttonText =
    customButtonText ||
    (isDoc
      ? `Explain Estimate (${previews.length} ${previews.length === 1 ? 'Page' : 'Pages'})`
      : `Review Cost Guide (${previews.length} ${previews.length === 1 ? 'Photo' : 'Photos'})`);

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
      quality: 0.9,
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
      let w = bitmap.width,
        h = bitmap.height;
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
        if (file.size > MAX_FILE_BYTES) {
          setUploadError(
            `"${file.name}" is larger than the 25 MB limit. Please choose a smaller photo or PDF.`
          );
          continue;
        }
        try {
          const dataUrl = await convertFileToUploadData(file);
          setPreviews((prev) => [...prev, dataUrl]);
        } catch (error) {
          console.error('File conversion failed:', error);
          setUploadError(
            `We couldn't read "${file.name}". Please try a JPG, PNG, WebP, HEIC${
              isDoc ? ', or PDF' : ''
            } file.`
          );
        }
      }
    }

    e.target.value = '';
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replaceIndex !== null) {
      setUploadError(null);
      if (file.size > MAX_FILE_BYTES) {
        setUploadError(
          `"${file.name}" is larger than the 25 MB limit. Please choose a smaller photo or PDF.`
        );
      } else {
        try {
          const dataUrl = await convertFileToUploadData(file);
          setPreviews((prev) =>
            prev.map((item, idx) => (idx === replaceIndex ? dataUrl : item))
          );
        } catch (error) {
          console.error('File replacement failed:', error);
          setUploadError(
            `We couldn't read "${file.name}". Please try a JPG, PNG, WebP, HEIC${
              isDoc ? ', or PDF' : ''
            } file.`
          );
        }
      }
    }
    setReplaceIndex(null);
    e.target.value = '';
  };

  const triggerReplace = (index: number) => {
    setReplaceIndex(index);
    replaceInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (previews.length > 0 && agreed) {
      onImagesCaptured(previews);
    }
  };

  const getPreviewContent = (src: string, idx: number) => {
    if (src.includes('application/pdf')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF7F0] text-[#0A1F44] p-2 text-center">
          <svg
            className="w-9 h-9 mb-1.5 text-[#0A1F44]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.9"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs font-bold">PDF Page {idx + 1}</span>
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={`Selected upload ${idx + 1}`}
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <>
      {!isDoc && <StepIndicator current={2} />}
      <div className="bg-white rounded-[20px] shadow-[0_8px_24px_rgba(10,31,68,0.06)] border border-[#E2E8F0] p-5 sm:p-8 max-w-2xl mx-auto animate-fadeIn">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A1F44] hover:underline mb-2 min-h-[36px] rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <h2 className="text-2xl font-bold text-[#0A1F44] font-display">{title}</h2>
            <p className="text-[#6B7280] mt-1 text-[16px]">{subTitle}</p>
          </div>
        </div>

        {(errorBanner || uploadError) && (
          <div
            role="alert"
            className="mb-5 rounded-[12px] bg-red-50 border border-red-200 px-4 py-3.5 text-sm text-red-800"
          >
            <p className="font-semibold">{errorBanner || uploadError}</p>
          </div>
        )}

        {!isDoc && (
          <div className="mb-5 rounded-[12px] bg-[#EFF6FC] border border-[#B8D4EE] p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-bold text-[#0A1F44] uppercase tracking-wide">
                What photos to include:
              </p>
              {photoGuide && (
                <button
                  type="button"
                  onClick={() => setShowGuide(true)}
                  className="shrink-0 text-xs font-bold text-[#0A1F44] underline underline-offset-2 hover:text-[#122A52]"
                >
                  Photo guide
                </button>
              )}
            </div>
            <ul className="text-sm text-[#1B2432] space-y-1.5">
              {(photoGuide
                ? photoGuide.shots.map((s) => `**${s.label}**`)
                : customTips && customTips.length > 0
                ? customTips
                : [
                    'A **wider view** of the vehicle and damaged area',
                    'A **close-up** of the dent, scratch, or panel damage',
                    'A **second angle** showing depth and adjacent panels',
                  ]
              ).map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Dot />
                  <span>{renderTip(tip)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Primary Upload Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="min-h-[54px] px-4 py-3 rounded-[12px] border-[1.5px] border-[#0A1F44] bg-white hover:bg-[#FAF7F0] text-[#0A1F44] font-bold text-[16px] flex items-center justify-center gap-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Take a photo</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[54px] px-4 py-3 rounded-[12px] border-[1.5px] border-[#E8B84B] bg-[#FFF8E8] hover:bg-[#FDF3D7] text-[#0A1F44] font-bold text-[16px] flex items-center justify-center gap-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1F44]"
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span>Choose files</span>
          </button>
        </div>

        <p className="text-[13px] text-[#6B7280] mb-5">
          {isDoc
            ? 'Supported formats: PDF, JPG, PNG, WebP, HEIC/HEIF · Up to 25 MB per file.'
            : 'Supported formats: JPG, PNG, WebP, HEIC/HEIF · Up to 25 MB per file.'}
        </p>

        {/* Selected-file Previews */}
        {previews.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0A1F44] mb-2.5">
              Selected files ({previews.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative rounded-[12px] overflow-hidden border border-[#E2E8F0] bg-[#FAF7F0] flex flex-col"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    {getPreviewContent(src, idx)}
                    <span className="absolute top-2 left-2 bg-[#0A1F44]/85 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[#E2E8F0] border-t border-[#E2E8F0] bg-white">
                    <button
                      type="button"
                      onClick={() => triggerReplace(idx)}
                      aria-label={`Replace file ${idx + 1}`}
                      className="min-h-[40px] px-2 py-1.5 text-[12px] font-semibold text-[#0A1F44] hover:bg-[#FAF7F0] transition-colors flex items-center justify-center gap-1"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label={`Remove file ${idx + 1}`}
                      className="min-h-[40px] px-2 py-1.5 text-[12px] font-semibold text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={
            isDoc
              ? 'image/*,application/pdf,.heic,.heif'
              : 'image/*,.heic,.heif,image/heic,image/heif'
          }
          multiple
          className="hidden"
        />

        <input
          type="file"
          ref={replaceInputRef}
          onChange={handleReplaceFileChange}
          accept={
            isDoc
              ? 'image/*,application/pdf,.heic,.heif'
              : 'image/*,.heic,.heif,image/heic,image/heif'
          }
          className="hidden"
        />

        <div className="mt-6 space-y-3.5">
          {/* Required consent + plain-language disclaimer */}
          <label className="flex items-start gap-3 p-4 rounded-[12px] bg-[#FAF7F0] border border-[#E2E8F0] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 shrink-0 accent-[#0A1F44] cursor-pointer"
            />
            <span className="text-[13px] text-[#1B2432] leading-relaxed">
              {consentText || (
                <>
                  <span className="font-semibold text-[#0A1F44]">
                    I understand this is a preliminary AI guide for general information only
                  </span>{' '}
                  — not a final repair quote, appraisal, or guarantee. Hidden damage and parts availability can change the final cost, and a repair professional must inspect the vehicle.
                </>
              )}
            </span>
          </label>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={previews.length === 0 || !agreed}
            className={`w-full min-h-[54px] py-3.5 px-6 rounded-[12px] font-bold text-[16px] transition-all flex items-center justify-center gap-2 ${
              previews.length > 0 && agreed
                ? 'bg-[#E8B84B] hover:bg-[#D4A93C] text-[#0A1F44] shadow-sm active:scale-[0.99]'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>{buttonText}</span>
            {previews.length > 0 && agreed && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            )}
          </button>
          {previews.length > 0 && !agreed && (
            <p className="text-center text-xs text-[#0A1F44] font-semibold">
              Please check the box above to continue.
            </p>
          )}
        </div>
      </div>

      {showScanner && (
        <DocumentScanner
          onCapture={(img) => {
            setPreviews((prev) => [...prev, img]);
            setShowScanner(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      {photoGuide && showGuide && (
        <PhotoGuideOverlay guide={photoGuide} onClose={() => setShowGuide(false)} />
      )}
    </>
  );
};

const Dot: React.FC = () => (
  <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84B] shrink-0 mt-[7px]" />
);

/** Renders "**bold**" segments inside a tip string. */
const renderTip = (tip: string): React.ReactNode =>
  tip.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <b key={i} className="font-semibold text-[#0A1F44]">
        {part}
      </b>
    ) : (
      part
    )
  );

export default DamageUpload;

