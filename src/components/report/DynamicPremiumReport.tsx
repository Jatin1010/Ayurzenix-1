import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  MapPin, 
  TrendingDown,
  Calendar,
  Layers,
  Zap
} from 'lucide-react';

interface DynamicPremiumReportProps {
  data: any;
  featureName: string;
}

export default function DynamicPremiumReport({ data, featureName }: DynamicPremiumReportProps) {
  const premium = data?.premium;
  
  if (!premium) return null;

  const riskPrediction = premium?.riskPrediction;
  const deepAnalysis = premium?.deepAnalysis || premium?.marmaMapping;
  const roadmap = premium?.roadmap30Day || premium?.roadmap;
  const herbs = premium?.herbs;
  const routine = premium?.routine;

  return (
    <div className="space-y-12">
      {/* 1. Deep Biological Analysis Section */}
      {deepAnalysis && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-20%] w-[40vw] h-[40vw] bg-emerald-100/30 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Deep {featureName} Intelligence</h3>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Premium Core Analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-4">
              <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Key Focus Point</p>
                <p className="text-lg font-black text-slate-900">{deepAnalysis?.point || deepAnalysis?.focus || "Primary Biological Link"}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Energetic Status</p>
                <p className="text-sm font-bold text-slate-700">{deepAnalysis?.status || "Analyzing imbalance density..."}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 bg-stone-900 rounded-3xl text-white">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">AI Verdict & Guidance</p>
              <p className="text-sm font-medium leading-relaxed italic text-gray-300">
                {deepAnalysis?.guidance || deepAnalysis?.description || "Wait for precision data..."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Predictive Forecasting Section */}
      {riskPrediction && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-stone-950 p-10 rounded-[4rem] text-white space-y-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight">5-Year {featureName} Outlook</h3>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Predictive Engine Status: Active</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              <div className="flex items-center gap-8">
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white">{riskPrediction?.current || "0"}%</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Base Risk Level</p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                    <p className="text-4xl font-black text-emerald-400">{riskPrediction?.projection5Year || "0"}%</p>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Post-Protocol Target</p>
                </div>
              </div>
              
              <p className="text-sm font-medium leading-relaxed text-gray-400 border-l-2 border-emerald-500/30 pl-4 py-1">
                {riskPrediction?.explanation || "Predicting long-term biological trends based on current markers..."}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Intelligence Badge</p>
                <h4 className="text-lg font-bold">Molecular Optimization Ready</h4>
              </div>
              <div className="mt-6 flex items-center gap-3 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Advanced Protection Enabled</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. 30-Day Recovery Roadmap */}
      {roadmap && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-900" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Transformation Roadmap</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">30-Day Protocol</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {roadmap?.map((week: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * i }}
                className="group bg-white p-6 rounded-[2.5rem] border border-black/[0.03] shadow-sm flex items-center gap-6 hover:shadow-md transition-all cursor-default"
              >
                <div className="w-16 h-16 rounded-3xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-500">Week</span>
                  <span className="text-xl font-black">{week.week || (i + 1)}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-black text-slate-900 text-base">{week.milestone || week.title}</h4>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">{week.focus || week.description}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-emerald-500 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Eternal Protocol - Herbs & Routine */}
      {(herbs || routine) && (
        <div className="bg-slate-950 p-10 rounded-[4rem] text-white space-y-10 relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">The Alchemical Protocol</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Bio-Herb & Circadian Sync</p>
            </div>
          </div>

          <div className="space-y-12 relative z-10">
            {/* Herbs */}
            {herbs && (
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Molecular Herbal Support</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {herbs.map((herb: any, i: number) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2.5rem] space-y-3 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-white">{herb.name}</h4>
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs font-medium text-slate-400 leading-relaxed italic">"{herb.why}"</p>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit border border-emerald-500/20">
                        {herb.usage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Routine */}
            {routine && (
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Circadian Alignment</p>
                <div className="grid gap-3">
                  {routine.map((item: any, i: number) => (
                    <div key={i} className="flex gap-6 items-center bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/5 hover:bg-white/[0.06] transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex flex-col items-center justify-center font-black text-[10px] text-white">
                        <Clock className="w-4 h-4 mb-1 text-emerald-400" />
                        {item.time}
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-black text-white">{item.task}</p>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{item.benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
