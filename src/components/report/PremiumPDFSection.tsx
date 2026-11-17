import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, Crown, ShieldCheck, CheckCircle2, Loader2, Sparkles, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PremiumPDFSectionProps {
  isLocked: boolean;
  onUpgrade?: () => void;
}

export default function PremiumPDFSection({ isLocked, onUpgrade }: PremiumPDFSectionProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const steps = [
    'Initializing 8K vector alignment Engine...',
    'Analyzing neural Agni & Dosha matrices...',
    'Rendering clinical high-contrast anatomy grids...',
    'Signing biological ledger key [SHA-256]...',
    'Finalizing 8K high-definition medical blueprint...'
  ];

  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadProgress(0);
    setCurrentStep(steps[0]);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        const next = prev + 5;
        const stepIndex = Math.min(Math.floor((next / 100) * steps.length), steps.length - 1);
        setCurrentStep(steps[stepIndex]);

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloading(false);
            alert('Your 8K High-Fidelity Diagnostic PDF has been downloaded successfully to local storage.');
          }, 800);
          return 100;
        }
        return next;
      });
    }, 150);
  };

  return (
    <section className="px-6">
      <div className={cn(
        "p-12 flex flex-col items-center text-center space-y-8 relative overflow-hidden group transition-all duration-700 bg-stone-950 rounded-[3rem] border border-stone-850 shadow-[0_24px_60px_rgba(0,0,0,0.4)] md:max-w-4xl md:mx-auto",
        isLocked ? "opacity-90" : "text-white"
      )}>
        {/* Glow ambient laser backdrops */}
        <div className="absolute top-[-30%] right-[-10%] w-[50vw] h-[50vw] max-w-lg max-h-lg bg-[#A259FF]/10 rounded-full blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Watermark File graphic in the back */}
        <div className="absolute top-0 right-0 p-12 text-stone-900 -mr-16 -mt-16 group-hover:scale-110 transition-transform">
           <FileText className="w-80 h-80 rotate-12" />
        </div>

        {/* Circular Ring Header */}
        <div className={cn(
          "w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-2 transition-all duration-500 shadow-inner relative z-10",
          isLocked 
            ? "bg-stone-900 text-stone-600 border border-stone-800" 
            : "bg-emerald-950/80 text-emerald-400 border border-emerald-900 animate-pulse"
        )}>
          {isLocked ? <Download className="w-8 h-8" /> : <FileSpreadsheet className="w-8 h-8 text-[#A259FF]" />}
        </div>

        <div className="space-y-4 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-800 bg-stone-900/60 shadow-inner">
            <Crown className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Biological PDF Certificate / विनिर्णय पत्र</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
            Download 8K High-Fidelity Ledger 
          </h2>
          <p className="text-sm font-bold text-stone-400 leading-relaxed italic max-w-md mx-auto">
            "A high-definition medical-standard life blueprint engineered with deep algorithmic insight. Seamlessly share with your Vaidya or clinical practitioners."
          </p>
        </div>

        {/* Interactive Simulated Download Engine */}
        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            {downloading ? (
              <motion.div 
                key="downloading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-stone-900/80 border border-stone-800 p-8 rounded-[2.5rem] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-[#A259FF] animate-spin" />
                    <span className="text-[10px] font-black uppercase text-[#A259FF] tracking-wider">Compiling System Data</span>
                  </div>
                  <span className="text-xl font-black text-white">{downloadProgress}%</span>
                </div>

                <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#A259FF] to-emerald-500 rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>

                <p className="text-[10px] font-mono font-bold text-stone-400 italic text-left tracking-wide leading-relaxed animate-pulse">
                  {currentStep}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {!isLocked ? (
                  <button 
                    onClick={handleDownload}
                    className="w-full py-5 bg-[#A259FF] hover:bg-purple-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                  >
                    Download 8K High-Fidelity Ledger <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </button>
                ) : (
                  <button 
                    onClick={onUpgrade}
                    className="w-full py-5 bg-gradient-to-r from-stone-900 to-stone-950 hover:from-stone-850 hover:to-stone-900 text-white border border-stone-800 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <div className="flex items-center gap-2 text-stone-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Unlock 8K Printable PDF Ledger</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Benefits Indicators */}
        <div className="pt-4 flex flex-wrap justify-center gap-6 relative z-10 border-t border-stone-900 w-full max-w-xl mx-auto">
           {[
             { label: '8K Vector Resolution', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" /> },
             { label: '20-Page Comprehensive Life Plan', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" /> },
             { label: 'Clinical Laboratory Format', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" /> }
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-2">
               <div>{item.icon}</div>
               <span className="text-[9px] font-black uppercase tracking-wider text-stone-400">{item.label}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
