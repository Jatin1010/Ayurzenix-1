import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function LoadingYogi({ fullScreenSplash = false, message }: { fullScreenSplash?: boolean, message?: string }) {
  const [imageError, setImageError] = useState(false);

  const yogiImage = (
    <div className="relative">
      {/* Shimmering Aura */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-purple-400/20 rounded-full blur-[100px] w-full h-full"
      />

      {/* 3D Yogi Image or Fallback SVG */}
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10 flex items-center justify-center pointer-events-none gpu-accelerated"
      >
        {!imageError ? (
          <img
            src="/yogi-3d.png"
            alt="Ayurvedic Yogi"
            className="w-[200px] h-auto object-contain drop-shadow-[0_30px_60px_rgba(162,89,255,0.3)]"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-[120px] h-[120px] bg-purple-100 rounded-full flex items-center justify-center border-4 border-purple-200">
             <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
          </div>
        )}
      </motion.div>
    </div>
  );

  const skeletonLines = (
    <div className="w-full max-w-[280px] space-y-4 relative z-10 mx-auto px-6">
      <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden relative">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
        />
      </div>
      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden relative w-2/3 mx-auto">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent"
        />
      </div>
    </div>
  );

  if (!fullScreenSplash) {
    // Show as a smaller centered card for process dialogs
    return (
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-purple-200/50 border border-stone-50 flex flex-col items-center justify-center space-y-6 max-w-sm w-full mx-auto relative z-50 overflow-hidden gpu-accelerated">
         <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-purple-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
         
         <div className="scale-[0.7] origin-bottom flex items-center justify-center relative -mb-10 mt-6">
           {yogiImage}
         </div>
         
         <div className="w-full z-10">
           {skeletonLines}
         </div>
         
         <div className="text-center mt-4 w-full">
           <motion.div animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 3, repeat: Infinity }} className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center gap-3 text-purple-600">
                <Sparkles className="w-5 h-5 fill-purple-600" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Quantum Synthesis</span>
              </div>
              
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">{message || "Initializing..."}</p>
           </motion.div>
         </div>
      </div>
    );
  }

  // Large Splash Screen
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 space-y-12 relative overflow-hidden gpu-accelerated">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center z-20"
      >
        <h1 
          className="text-4xl font-display font-black tracking-tighter text-black lowercase pb-1"
        >
          ayurzen<span className="text-purple-600 italic">ix</span>
        </h1>
        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Neural Wellness Intelligence</p>
      </motion.div>

      <div className="relative flex flex-col items-center">
         {yogiImage}
      </div>

      <div className="w-full relative z-[25] -mt-12">
         {skeletonLines}
      </div>

      <div className="text-center space-y-4">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex items-center justify-center gap-4 text-stone-950"
        >
          <Sparkles className="w-6 h-6 fill-purple-600 text-purple-600" />
          <span className="text-base font-black uppercase tracking-[0.3em] italic">{message || "Aligning Energies"}</span>
        </motion.div>
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] opacity-80">
          Syncing with Ancient Intelligence
        </p>
      </div>
    </div>
  );
}
