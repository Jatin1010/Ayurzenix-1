import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionNudgeProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
}

export default function SubscriptionNudge({ isOpen, onClose, planName = "Pro Report" }: SubscriptionNudgeProps) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
          >
            {/* Visual Header */}
            <div className="h-40 bg-gray-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-ayur-green to-ayur-teal" />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center border border-white/20 shadow-glow-green animate-bounce">
                  <Crown className="w-8 h-8 text-ayur-gold" />
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-8 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ayur-green/10 text-ayur-green text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Successful Purchase
              </div>
              
              <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">
                Prime Wellness <span className="text-ayur-gold">Access</span>
              </h3>
              
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                You just unlocked a {planName}! Subscribers get <span className="text-black font-black">Unlimited Reports</span> + priority AI speed for just ₹99.
              </p>

              <div className="space-y-3 pt-4">
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/pricing');
                  }}
                  className="glow-button-green w-full py-5 rounded-2xl flex items-center justify-center gap-2 group"
                >
                  View Prime Plans <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={onClose}
                  className="w-full py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-ayur-green transition-colors"
                >
                  Continue with Current Report
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
