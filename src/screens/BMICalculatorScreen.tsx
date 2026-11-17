import React from 'react';
import { SEO } from '../components/SEO';
import { BMICalculator } from '../components/home/BMICalculator';
import { motion } from 'motion/react';
import { Scale, Heart, ShieldCheck } from 'lucide-react';

export default function BMICalculatorScreen() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Ayurvedic BMI Calculator – Calculate Your Body Veda Index"
        description="Use the Ayurvedic BMI Calculator to understand your body volume and its relation to your Dosha. Get personalized weight management tips based on Ayurveda."
        keywords="Ayurvedic BMI Calculator, Body Veda Index, BMI Test Online, Ayurveda Weight Analysis, Ayurzenix"
      />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Scale className="w-3 h-3" />
            Metabolic Intelligence
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Ayurvedic <span className="text-emerald-600">BMI Calculator</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Traditional BMI doesn't tell the whole story. Our calculator contextualizes your weight and height within the framework of Ayurvedic Dhatus (tissues).
          </p>
        </div>

        <BMICalculator />

        <div className="max-w-4xl mx-auto px-6 py-24">
           <div className="bg-stone-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <h2 className="text-3xl font-black italic">The Ayurvedic Perspective on Weight</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                       In Ayurveda, weight is seen as an accumulation of Kapha. However, muscle mass (Mamsa) and fat (Medas) are treated differently. A higher BMI might be natural for a Kapha-dominant individual.
                    </p>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <Heart className="w-5 h-5 text-emerald-500" />
                          <span className="text-xs font-bold uppercase tracking-widest">Heart-First Wellness</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          <span className="text-xs font-bold uppercase tracking-widest">Sustainable Nutrition</span>
                       </div>
                    </div>
                 </div>
                 <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Did you know?</p>
                    <p className="text-lg font-medium leading-relaxed italic">
                       "A person with a balanced Agni (digestive fire) can maintain an optimal BMI naturally, regardless of their dominant Dosha."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
