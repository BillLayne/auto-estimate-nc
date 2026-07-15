import React from 'react';
import { PhotoGuide } from '../homePhotoGuides';

interface PhotoGuideOverlayProps {
  guide: PhotoGuide;
  onClose: () => void;
}

/**
 * Pop-up photo coaching shown when the customer reaches the photo step.
 * Category-specific shot list so the AI gets multiple useful angles.
 */
const PhotoGuideOverlay: React.FC<PhotoGuideOverlayProps> = ({ guide, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[70] bg-brand-navy-deep/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={guide.title}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-xl max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-navy-deep via-brand-navy to-brand-navy-dk rounded-t-3xl p-6 text-center relative">
          <button
            onClick={onClose}
            aria-label="Close photo guide"
            className="absolute top-4 right-4 text-blue-200 hover:text-white p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-brand-gold-lt" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-xl font-display leading-snug">{guide.title}</h3>
          <p className="text-blue-100 text-sm mt-2">{guide.intro}</p>
        </div>

        {/* Shot list */}
        <div className="p-5 sm:p-6">
          <ol className="space-y-3.5">
            {guide.shots.map((shot, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span className="w-8 h-8 shrink-0 rounded-full bg-gold-grad text-brand-navy-deep font-extrabold text-sm flex items-center justify-center font-display shadow-sm">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="font-bold text-slate-800 text-sm leading-snug">{shot.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{shot.hint}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* iPhone reassurance */}
          <div className="mt-5 rounded-xl bg-blue-50/70 ring-1 ring-blue-100 p-3.5 flex items-start gap-2.5">
            <span className="text-lg leading-none mt-0.5">📱</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">iPhone &amp; Android photos work automatically</span> —
              including Apple HEIC photos. Take them right from your camera or pick from your library.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full py-4 rounded-xl bg-gold-grad text-brand-navy-deep font-bold hover:bg-gold-grad-hover active:scale-[0.98] transition-all shadow-glow-gold"
          >
            Got it — I'm ready 📸
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-3">
            You can add, retake, or remove photos before anything is analyzed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoGuideOverlay;
