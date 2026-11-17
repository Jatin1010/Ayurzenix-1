import React from 'react';
import { SEO } from '../components/SEO';
import { DoshaTest } from '../components/home/DoshaTest';
import { Infographic } from '../components/home/Infographic';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Brain, Star, Clock } from 'lucide-react';

export default function DoshaTestScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Dosha Test Online – Find Your Ayurvedic Body Type"
        description="Take the most accurate Dosha Test Online. Discover if you are Vata, Pitta, or Kapha and get personalized Ayurvedic insights for your health."
        keywords="Dosha Test Online, Ayurvedic Body Type, Vata Pitta Kapha Quiz, Ayurzenix, Personalized Ayurveda"
      />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Star className="w-3 h-3 fill-current" />
            Most Accurate Analysis
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Dosha Test <span className="text-emerald-600">Online</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Ayurveda's foundation lies in the balance of the three Doshas. Use our AI-powered tool to identify your biological blueprint.
          </p>
        </div>

        <DoshaTest />
        
        <div className="mt-20">
          <Infographic onSelect={(path) => navigate(path)} />
        </div>

        <div className="max-w-4xl mx-auto px-6 py-24 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-4">
                <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center">
                   <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Why take this test?</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                   Understanding your Dosha helps you make better decisions about your diet, sleep, and exercise. It is the first step toward a personalized wellness journey.
                </p>
             </div>
             <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center">
                   <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Takes only 60 seconds</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                   Our AI-driven questionnaire is optimized to give you the most accurate results in the shortest possible time. No medical documents needed.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
