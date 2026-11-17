import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, FileText, Send, Sparkles, Brain, User, Activity } from 'lucide-react';

interface AssistantProps {
  onChat: () => void;
  onAnalyze: () => void;
}

export const AIAssistant: React.FC<AssistantProps> = ({ onChat, onAnalyze }) => {
  return (
    <section className="relative overflow-hidden py-12 lg:py-20 px-4">
      {/* Soft AI Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] bg-violet-50/50 rounded-full blur-[150px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100"
              >
                <Brain className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">Cognitive Vedic Synthesis</span>
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-[1.1]">
                Your 24/7 AI <br />
                <span className="premium-gradient-text">Ayurvedic Mentor.</span>
              </h2>
              
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Connect with the world's most sophisticated Ayurvedic AI for instant symptom decoding, diet correction, and holistic guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <motion.button 
                 whileHover={{ y: -5 }}
                 onClick={onChat}
                 className="glass-card p-6 flex flex-col items-start gap-4 hover:bg-white group"
               >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                     <h3 className="font-bold text-slate-900">Ask Anything</h3>
                     <p className="text-xs text-slate-400 font-medium mt-1">Instant chat support for any wellness query.</p>
                  </div>
               </motion.button>
               
               <motion.button 
                 whileHover={{ y: -5 }}
                 onClick={onAnalyze}
                 className="glass-card p-6 flex flex-col items-start gap-4 hover:bg-white group"
               >
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                     <h3 className="font-bold text-slate-900">Upload Reports</h3>
                     <p className="text-xs text-slate-400 font-medium mt-1">AI-powered medical report decoding.</p>
                  </div>
               </motion.button>
            </div>

            <div className="pt-6">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Try Asking</p>
               <div className="flex flex-wrap gap-2">
                  {["Fatigue after eating?", "Stress & Sleep?", "Skin Glow?", "Belly Fat?"].map((q, i) => (
                    <button key={i} onClick={onChat} className="px-4 py-2 rounded-xl bg-white/50 border border-slate-100 text-xs font-bold text-slate-600 hover:bg-white hover:text-ayur-primary transition-all">
                       {q}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Chat Preview UI */}
          <div className="order-1 lg:order-2">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               whileInView={{ opacity: 1, scale: 1, y: 0 }}
               className="glass-card p-1 bg-slate-50/50 shadow-2xl relative"
             >
                <div className="bg-white rounded-[2rem] p-6 md:p-10 space-y-8 relative overflow-hidden h-[500px] flex flex-col">
                   {/* Chat Header */}
                   <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
                            <Sparkles className="w-6 h-6 text-white" />
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900">Ayurzenix AI</h4>
                            <div className="flex items-center gap-1.5">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                               <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Active Intelligence</span>
                            </div>
                         </div>
                      </div>
                      <Activity className="w-5 h-5 text-slate-200" />
                   </div>

                   {/* Chat Messages */}
                   <div className="flex-1 space-y-6 pt-4">
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-slate-400" />
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 max-w-[80%]">
                            <p className="text-sm font-semibold text-slate-700">"I feel low energy and digestive discomfort."</p>
                         </div>
                      </div>

                      <div className="flex gap-4 justify-end">
                         <div className="bg-violet-600 p-6 rounded-3xl rounded-tr-none text-white shadow-xl shadow-violet-100 max-w-[85%] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                               <Sparkles className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-bold leading-relaxed relative z-10">
                              "Your symptoms indicate localized <span className="text-violet-200 uppercase tracking-wider text-[10px]">Agni</span> imbalance with elevated <span className="text-violet-200 uppercase tracking-wider text-[10px]">Vata</span> influence. Your energy patterns suggest metabolic overload."
                            </p>
                            
                            <motion.div 
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="mt-4 flex gap-1"
                            >
                               <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                               <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                               <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            </motion.div>
                         </div>
                      </div>
                   </div>

                   {/* Mock Input */}
                   <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
                      <div className="flex-1 h-12 rounded-2xl bg-slate-50 border border-slate-100 px-6 flex items-center">
                         <span className="text-xs text-slate-400 font-medium italic">Type your symptoms...</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                         <Send className="w-5 h-5 translate-x-0.5" />
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
