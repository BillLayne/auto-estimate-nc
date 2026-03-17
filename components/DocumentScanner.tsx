
import React, { useRef, useEffect, useState } from 'react';

interface DocumentScannerProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Unable to access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // High quality jpeg
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      onCapture(imageData);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      {/* Header / Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        <span className="text-white font-bold text-sm tracking-widest uppercase">Scan Estimate Page</span>
        <button 
          onClick={onClose} 
          className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Main Viewfinder */}
      <div className="flex-grow relative bg-black overflow-hidden flex items-center justify-center">
        {!error ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-center p-6">
            <p className="text-red-400 font-bold mb-2">{error}</p>
            <button onClick={onClose} className="underline text-sm">Close Camera</button>
          </div>
        )}

        {/* Document Guide Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
          <div className="w-full max-w-md aspect-[3/4] border-2 border-white/50 rounded-lg relative shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1"></div>
            
            <div className="absolute top-1/2 left-0 right-0 text-center -mt-3">
               <p className="text-white/80 text-xs font-bold uppercase tracking-widest shadow-black drop-shadow-md">Align Page Here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Shutter */}
      <div className="bg-black p-8 flex justify-center pb-12">
        <button 
          onClick={handleCapture}
          className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 shadow-lg active:scale-95 transition-transform flex items-center justify-center group"
        >
          <div className="w-16 h-16 bg-white rounded-full border-2 border-black group-active:bg-slate-200"></div>
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default DocumentScanner;
