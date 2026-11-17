import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, Info, Zap, Flame, Mountain } from 'lucide-react';

export function BMICalculator() {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const analysis = useMemo(() => {
    if (!weight || !height) return null;
    const h = Number(height) / 100;
    const w = Number(weight);
    if (h <= 0 || w <= 0) return null;
    
    const bmi = Number((w / (h * h)).toFixed(1));
    
    let type = "";
    let icon = null;
    let color = "";
    let description = "";

    if (bmi < 18.5) {
      type = "Vata Tendency";
      icon = Zap;
      color = "text-blue-500";
      description = "Your slender frame suggests a dominant Vata nature. Focus on grounding foods and regular routines.";
    } else if (bmi >= 18.5 && bmi < 25) {
      type = "Pitta Balance";
      icon = Flame;
      color = "text-orange-600";
      description = "Your balanced proportion suggests a healthy Pitta-Vata alignment. Maintain this with moderate activity.";
    } else {
      type = "Kapha Tendency";
      icon = Mountain;
      color = "text-emerald-600";
      description = "Your solid frame suggests a dominant Kapha nature. Focus on stimulating activities and light, warm foods.";
    }

    return { bmi, type, icon, color, description };
  }, [weight, height]);

  return (
    <section className="px-6 py-16 bg-white overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-xl mx-auto space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Scale className="w-3 h-3" />
            Body Metrics
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Ayurvedic <span className="text-emerald-600">BMI Calculator</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium">Map your physical dimensions to your biological nature.</p>
        </div>

        <div className="bg-stone-50 rounded-[2.5rem] p-8 md:p-10 border border-stone-100 shadow-sm transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Weight (kg)</label>
              <input 
                type="number" 
                placeholder="e.g. 65"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setShowResult(true);
                }}
                className="w-full px-6 py-4 bg-white rounded-2xl border border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Height (cm)</label>
              <input 
                type="number" 
                placeholder="e.g. 170"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  setShowResult(true);
                }}
                className="w-full px-6 py-4 bg-white rounded-2xl border border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-gray-900"
              />
            </div>
          </div>

          <AnimatePresence>
            {showResult && analysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6 pt-6 border-t border-stone-200"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calculated BMI</p>
                    <p className="text-5xl font-black text-gray-900">{analysis.bmi}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm text-right flex flex-col items-end">
                    <analysis.icon className={`w-6 h-6 mb-2 ${analysis.color}`} />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ayurvedic Bias</p>
                    <p className={`text-lg font-black ${analysis.color}`}>{analysis.type}</p>
                  </div>
                </div>

                <div className="p-5 bg-emerald-600 rounded-3xl text-white shadow-lg shadow-emerald-200/50">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-medium leading-relaxed">
                      {analysis.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <p className="text-center text-[10px] font-bold text-gray-400 px-8">
          Note: In Ayurveda, body volume reflects 'Medas' and 'Mamsa' Dhatus. A higher BMI doesn't always mean poor health, but characterizes your Dosha dominance.
        </p>
      </motion.div>
    </section>
  );
}
