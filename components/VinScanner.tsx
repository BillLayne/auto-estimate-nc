
import React, { useRef, useEffect, useState } from 'react';
import { extractVinFromImage } from '../services/geminiService';

interface VinScannerProps {
  onVinFound: (vin: string) => void;
  onClose: () => void;
}

const VinScanner: React.FC<VinScannerProps> = ({ onVinFound, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Unable to access camera. Please enter VIN manually.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        const vin = await extractVinFromImage(imageData);
        if (vin) {
          onVinFound(vin);
        } else {
          setError("Could not identify a valid VIN. Please try again or get closer.");
        }
      } catch (e) {
        setError("Scanning failed. Please try again.");
      }
    }
    
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose} 
          className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="relative w-full max-w-lg aspect-[3/4] bg-black overflow-hidden rounded-2xl shadow-2xl">
        {!error ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white p-6 text-center">
            <p className="text-red-400 font-bold">{error}</p>
          </div>
        )}

        {/* Overlay Guide */}
        <div className="absolute inset-0 border-[50px] border-black/50 pointer-events-none flex items-center justify-center">
          <div className="w-full h-24 border-2 border-blue-400/80 rounded relative">
            <div className="absolute -top-6 left-0 w-full text-center text-white text-xs font-bold uppercase tracking-widest text-shadow">
              Align VIN Barcode or Text
            </div>
            {isAnalyzing && (
              <div className="absolute inset-0 bg-blue-500/20 animate-pulse flex items-center justify-center">
                 <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 px-6 w-full max-w-md">
        <button 
          onClick={handleCapture}
          disabled={isAnalyzing || !!error}
          className="w-full bg-gold-grad hover:bg-gold-grad-hover text-brand-navy-deep font-bold py-4 rounded-full shadow-glow-gold active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAnalyzing ? 'Reading VIN...' : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Capture & Scan
            </>
          )}
        </button>
        <p className="text-white/50 text-xs text-center mt-4">
          Works with door jamb stickers, windshield plates, and insurance papers.
        </p>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VinScanner;
