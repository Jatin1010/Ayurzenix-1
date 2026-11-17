import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Heart, Moon, Zap, RefreshCw, Smartphone, ShieldCheck, ArrowRight, Bluetooth, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const WearableSync: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleConnect = () => {
    setSyncing(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setIsConnected(true);
      setSyncing(false);
    }, 2000);
  };

  const biometrics = [
    {
      label: "Heart Rate (Pulse)",
      val: "72 BPM",
      dosha: "Pitta Neutral",
      icon: Heart,
      color: "rose",
    },
    {
      label: "Restorative Sleep",
      val: "7h 45m",
      dosha: "Kapha Depth",
      icon: Moon,
      color: "violet",
    },
    {
      label: "Energy Expenditure",
      val: "1,200 CAL",
      dosha: "Vata Active",
      icon: Zap,
      color: "amber",
    }
  ];

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden px-4">
      {/* Dynamic Aura */}
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none translate-x-1/4 translate-y-1/4" />

      <div className="section-container relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
               <div className="space-y-4 md:space-y-6">
                 <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100"
                 >
                    <Bluetooth className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Real-time Biometric Pulse</span>
                 </motion.div>
                 
                 <h2 className="text-3xl md:text-6xl font-heading font-black text-slate-900 uppercase tracking-tighter leading-tight">
                    Sync Your <br />
                    <span className="premium-gradient-text italic">Body Graph.</span>
                 </h2>
                 
                 <p className="text-lg md:text-xl text-slate-500 font-medium font-body leading-relaxed max-w-xl">
                    Connect Google Fit or Apple Health to bridge the gap between your digital metrics and biological truth.
                 </p>
               </div>

               <div className="glass-card p-5 flex items-center gap-4 border-slate-100/50 max-w-md">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Privacy Sovereignty</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Local encryption protocol active. No Cloud Storage.</p>
                  </div>
               </div>

               <div className="pt-2">
                 {!isConnected ? (
                   <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleConnect}
                      disabled={syncing}
                      className="px-8 md:px-10 py-4 md:py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center gap-4 shadow-xl shadow-slate-200"
                   >
                      {syncing ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>Connect Wearables <Smartphone className="w-5 h-5" /></>
                      )}
                   </motion.button>
                 ) : (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100"
                   >
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                      Protocol Synchronized: Google Fit
                   </motion.div>
                 )}
               </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-blue-50 blur-[120px] rounded-full opacity-30" />
               
               <div className="space-y-3 md:space-y-4">
                  {biometrics.map((bio, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn(
                        "glass-card p-6 md:p-8 flex items-center justify-between border-slate-100/50 group hover:border-blue-200 transition-all",
                        !isConnected && "blur-[1.5px] opacity-40 grayscale pointer-events-none"
                      )}
                    >
                      <div className="flex items-center gap-5 md:gap-6">
                         <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border", `bg-${bio.color}-50 text-${bio.color}-500 border-${bio.color}-100`)}>
                            <bio.icon className="w-6 h-6 md:w-7 md:h-7" />
                         </div>
                         <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{bio.label}</p>
                            <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{bio.val}</p>
                         </div>
                      </div>
                      <div className="text-right hidden sm:block">
                         <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Biological Alignment</p>
                         <p className="text-xs font-bold text-slate-600 uppercase tracking-tight italic">{bio.dosha}</p>
                      </div>
                    </motion.div>
                  ))}

                  {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="bg-white px-8 py-4 rounded-full border border-slate-100 shadow-xl text-[10px] font-black uppercase tracking-widest text-slate-900"
                       >
                          Bridge Connection Required
                       </motion.div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

