import React, { useRef, useState } from 'react';
import { Award, Printer, GraduationCap, X } from 'lucide-react';

interface CertificateProps {
  userName: string;
  moduleTitle: string;
  date: string;
  onClose?: () => void;
}

export function Certificate({ userName, moduleTitle, date, onClose }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certScale, setCertScale] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update scale based on container width
  React.useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = Math.min(containerWidth / 1200, 1);
        setCertScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const displayName = userName || "Master Student";

  return (
    <div className="bg-card border border-border w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl relative mx-4 sm:mx-0 print:shadow-none print:border-none print:m-0 print:max-w-none print:rounded-none">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors z-50 print:hidden"
        >
          <X className="w-5 h-5 sm:w-6 h-6" />
        </button>
      )}
      
      <div className="p-4 sm:p-8 text-center space-y-6 print:p-0 print:space-y-0">
        <div className="space-y-1 print:hidden">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-primary">Congratulations!</h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">You've officially mastered {moduleTitle}</p>
        </div>
        
        {/* Certificate Preview Container */}
        <div ref={containerRef} className="relative border-4 border-blue-500/10 rounded-[24px] overflow-hidden bg-[#0b1622] w-full print:border-none print:rounded-none print:bg-white">
          <div 
            ref={certificateRef}
            data-cert-container
            className="relative bg-[#0b1622] overflow-hidden select-none print:scale-100 print:m-0 print:static print:w-[297mm] print:h-[210mm]"
            style={{ 
              width: '1200px', 
              height: '848px', 
              transform: `scale(${certScale})`, 
              transformOrigin: 'top left',
              marginBottom: `-${848 * (1 - certScale)}px`
            }}
          >
            {/* ================= ROYAL BLUE & PURPLE GRADIENT ================= */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1622] via-[#1e1b4b] to-[#2e1065] pointer-events-none print:from-[#0b1622] print:to-[#2e1065]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.08),transparent_70%)] pointer-events-none" />

            {/* ================= CORNER BORDERS ================= */}
            <div className="absolute top-8 left-8 w-24 h-24 border-l-4 border-t-4 border-[#00d4ff]/80 rounded-tl-2xl" />
            <div className="absolute top-8 right-8 w-24 h-24 border-r-4 border-t-4 border-[#00d4ff]/80 rounded-tr-2xl" />
            <div className="absolute bottom-8 left-8 w-24 h-24 border-l-4 border-b-4 border-[#00d4ff]/80 rounded-bl-2xl" />
            <div className="absolute bottom-8 right-8 w-24 h-24 border-r-4 border-b-4 border-[#00d4ff]/80 rounded-br-2xl" />

            {/* ================= TOP LOGO ================= */}
            <div className="absolute top-12 left-0 right-0 flex justify-center items-center gap-3 z-20">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-[#00d4ff]" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white">EduPulse AI</span>
            </div>

            {/* ================= MAIN CONTENT ================= */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center pt-16">
              {/* Heading */}
              <div className="mb-10">
                <h1 className="text-[#00d4ff] text-7xl font-extrabold tracking-tight">
                  CERTIFICATE
                </h1>
                <p className="text-white/60 tracking-[0.4em] uppercase mt-3 text-xl font-bold">
                  Of Excellence
                </p>
              </div>

              <p className="text-white/80 text-2xl mb-8">
                This professional credential is proudly presented to
              </p>

              {/* Name */}
              <h2 className="text-[#c7ff4d] text-6xl font-black italic tracking-wide uppercase mb-10 border-b-2 border-[#c7ff4d]/20 pb-4 min-w-[500px]">
                {displayName}
              </h2>

              {/* Description */}
              <div className="max-w-4xl space-y-4">
                <p className="text-white/70 text-xl leading-relaxed">
                  for successfully completing the production-ready curriculum and mastering
                </p>
                <p className="text-[#00d4ff] text-4xl font-black tracking-tight uppercase">
                  {moduleTitle}
                </p>
              </div>

              {/* ================= FOOTER ================= */}
              <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end">
                {/* Date */}
                <div className="text-left">
                  <div className="w-56 h-[1px] bg-[#00d4ff]/40 mb-3" />
                  <p className="text-white/40 text-xs tracking-widest uppercase font-bold mb-1">
                    Date Issued
                  </p>
                  <p className="text-white text-lg font-bold">
                    {date}
                  </p>
                </div>

                {/* Signature */}
                <div className="text-right">
                  <p
                    className="text-[#c7ff4d] text-4xl leading-none mb-2"
                    style={{ fontFamily: "'Brush Script MT', 'Pacifico', cursive" }}
                  >
                    EduPulse AI
                  </p>
                  <div className="w-56 h-[1px] bg-[#00d4ff]/40 mb-3 ml-auto" />
                  <p className="text-[#00d4ff] font-black text-lg tracking-tighter">
                    Certification Board
                  </p>
                  <p className="text-white/40 text-xs tracking-widest uppercase font-bold">
                    EduPulse AI Official
                  </p>
                </div>
              </div>
            </div>
            
            {/* Watermark */}
            <div className="absolute bottom-16 right-1/2 translate-x-1/2 opacity-5 pointer-events-none">
              <Award className="w-96 h-96 text-white" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto px-12 py-4 bg-primary text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <Printer className="w-5 h-5" /> Print / Save as PDF
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground font-medium print:hidden">
          Use "Print to PDF" in your browser for a high-quality digital copy.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          /* Target the specific certificate container */
          [data-cert-container], [data-cert-container] * {
            visibility: visible;
          }
          [data-cert-container] {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw !important;
            height: 100vh !important;
            transform: none !important;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
