import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  MapPin, 
  Lock,
  Heart,
  TrendingDown,
  Calendar
} from 'lucide-react';

interface HeartPremiumReportProps {
  data: any;
}

export default function HeartPremiumReport({ data }: HeartPremiumReportProps) {
  const premium = data?.premium;
  const riskPrediction = premium?.riskPrediction;
  const marmaMapping = premium?.marmaMapping;
  const roadmap = premium?.roadmap30Day;

  return (
    <div className="space-y-10">
      {/* 1. Marma Mapping - Seat of Ojas */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-[-20%] right-[-20%] w-[40vw] h-[40vw] bg-emerald-100/30 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Hridaya Marma Mapping</h3>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Seat of Ojas Analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-4">
            <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Target Marma Point</p>
              <p className="text-lg font-black text-slate-900">{marmaMapping?.point || "Hridaya Marma"}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Vulnerability Status</p>
              <p className="text-sm font-bold text-slate-700">{marmaMapping?.status || "Minor Agitation detected"}</p>
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 bg-stone-900 rounded-3xl text-white">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Marma Guidance</p>
            <p className="text-sm font-medium leading-relaxed italic text-gray-300">
              {marmaMapping?.guidance || "Gentle application of Brahmi oil on the heart center is recommended to stabilize the Prana."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. Predictive Heart Risk Outlook */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-stone-950 p-10 rounded-[3rem] text-white space-y-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight">Predictive Cardio Outlook</h3>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">5-Year Forecasting Engine</p>
          </div>
          <Activity className="w-8 h-8 text-rose-500 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <p className="text-3xl font-black text-white">{riskPrediction?.current || "24"}%</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Current Risk</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                  <p className="text-3xl font-black text-emerald-400">{riskPrediction?.projection5Year || "8"}%</p>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Projected (With Protocol)</p>
              </div>
            </div>
            
            <p className="text-sm font-medium leading-relaxed text-gray-400">
              {riskPrediction?.explanation || "Based on your current Vata-Pitta pulse, your cardio-load is expected to decrease significantly if the 30-day Hridaya reset is followed."}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Risk Mitigation Strategy</p>
              <h4 className="text-lg font-bold">Molecular Rejuvenation</h4>
            </div>
            <div className="mt-6 flex items-center gap-3 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">System Stabilized</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. 30-Day Heart Transformation Roadmap */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">30-Day Recovery Roadmap</h3>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {roadmap?.map((week: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className="group bg-white p-6 rounded-[2rem] border border-black/[0.03] shadow-sm flex items-center gap-6 hover:shadow-md transition-all cursor-default"
            >
              <div className="w-16 h-16 rounded-2.5xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <span className="text-[10px] font-black uppercase">Week</span>
                <span className="text-xl font-black">{week.week}</span>
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-black text-slate-900 text-base">{week.milestone}</h4>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">{week.focus}</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Eternal Protocol - Herbs & Routine (Already in screen, but re-styled here for depth) */}
      <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white space-y-10 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-[#A259FF]/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-2.5xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#FFB400]">
            <Sparkles className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">Alchemical Protocol</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precision Bio-Herbs & Rhythms</p>
          </div>
        </div>

        <div className="space-y-12 relative z-10">
          {/* Herbs */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Molecular Herbal Support</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {premium?.herbs?.map((herb: any, i: number) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-white">{herb.name}</h4>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                  </div>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed italic">"{herb.why}"</p>
                  <p className="text-[10px] font-black text-[#FFB400] uppercase tracking-widest bg-[#FFB400]/10 px-3 py-1 rounded-full w-fit">
                    {herb.usage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Routine */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Circadian Heart Alignment</p>
            <div className="grid gap-4">
              {premium?.routine?.map((item: any, i: number) => (
                <div key={i} className="flex gap-6 items-center bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/5 hover:bg-white/[0.07] transition-all">
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
        </div>
      </div>
    </div>
  );
}
