import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Download, Share2, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StickyBottomCTAProps {
  onChat: () => void;
  onShare: () => void;
  onDownload?: () => void;
  isPremium: boolean;
}

export default function StickyBottomCTA({ onChat, onShare, onDownload, isPremium }: StickyBottomCTAProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-6">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/5 flex items-center justify-between gap-3"
      >
        <button 
          onClick={onChat}
          className="flex-1 py-4 bg-ayur-purple rounded-[1.8rem] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-glow-purple/20"
        >
          <MessageSquare className="w-4 h-4" />
          Talk to Guru
        </button>

        <div className="flex items-center gap-2 pr-2">
          <button 
            onClick={onShare}
            className="w-12 h-12 rounded-full bg-black/5 border border-black/5 flex items-center justify-center text-black/60 hover:bg-black/10 hover:text-black transition-all active:scale-90"
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          <button 
             onClick={onDownload}
             className={cn(
               "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 relative",
               isPremium 
                ? "bg-ayur-teal text-white shadow-glow-teal/20" 
                : "bg-black/5 border border-black/5 text-black/20"
             )}
          >
             <Download className="w-5 h-5" />
             {!isPremium && <Zap className="w-2.5 h-2.5 text-ayur-amber absolute -top-1 -right-1" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
