import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Wallet, ArrowUpRight, Sparkles } from 'lucide-react';
import { useRealtimeWallet } from '../hooks/useRealtimeWallet';
import { useState, useEffect } from 'react';

export default function WalletSyncFeedback() {
  const { lastUpdateType, lastAmount } = useRealtimeWallet();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (lastUpdateType === 'increase' && lastAmount > 0) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdateType, lastAmount]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed top-10 left-0 right-0 z-[1000] flex justify-center px-6 pointer-events-none">
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.8 }}
            className="bg-black/90 backdrop-blur-3xl rounded-[2rem] p-4 flex items-center gap-4 border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-4 ring-emerald-500/5 relative overflow-hidden"
          >
            {/* Background Animation Beads */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               {[...Array(6)].map((_, i) => (
                 <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -100], 
                      x: [0, (i % 2 === 0 ? 20 : -20)],
                      opacity: [0, 0.5, 0] 
                    }}
                    transition={{ repeat: Infinity, duration: 2 + i, delay: i * 0.5 }}
                    className="absolute bottom-0 w-1 h-1 bg-emerald-400/20 rounded-full"
                    style={{ left: `${15 * i}%` }}
                 />
               ))}
            </div>

            <div className="relative">
               <motion.div
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40"
               >
                 <Wallet className="w-7 h-7" />
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                 >
                   <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 </motion.div>
               </motion.div>
            </div>

            <div className="pr-4 py-1">
               <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Instant Recharge Success</span>
                  <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400" />
               </div>
               <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white tracking-tighter">
                    +₹{lastAmount.toLocaleString('en-IN')}
                  </h3>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                     <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                     <span className="text-[9px] font-black text-emerald-400 uppercase">Credited</span>
                  </div>
               </div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Wallet Synced in Realtime</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
