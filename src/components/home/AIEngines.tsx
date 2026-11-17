import React from 'react';
import { motion } from 'motion/react';
import { Brain, Heart, Zap, Leaf, Target, Activity } from 'lucide-react';

const engines = [
    { name: "Prana Engine", desc: "Heart Intelligence", icon: Heart, color: "rose", path: "/heart-health-landing" },
    { name: "Agni Engine", desc: "Gut Metabolism", icon: Utensils, color: "orange", path: "/gut-landing" },
    { name: "Yakrut Engine", desc: "Liver Detox", icon: Activity, color: "emerald", path: "/liver-landing" },
    { name: "Manas Engine", desc: "Neuro Wellness", icon: Brain, color: "sky", path: "/mood-ayurveda-landing" },
    { name: "Shakti Engine", desc: "Hormonal Balance", icon: Zap, color: "amber", path: "/hormonal-balance-landing" },
    { name: "Ojas Engine", desc: "Immunity Logic", icon: Leaf, color: "teal", path: "/symptom-checker-landing" },
];

// Re-doing the import since I need Utensils
import { Utensils } from 'lucide-react';

export const AIEngines = ({ onSelect }: { onSelect: (path: string) => void }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-black">Our Adaptive AI Intelligence System</h2>
          <p className="text-gray-500 font-medium mt-4">Powered by advanced algorithms designed to understand your specific physiology.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engines.map((engine, i) => (
            <motion.div 
               key={i}
               whileHover={{ y: -10 }}
               onClick={() => onSelect(engine.path)}
               className="p-8 rounded-3xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer"
            >
                <div className={`w-12 h-12 rounded-2xl bg-${engine.color}-100 flex items-center justify-center mb-6`}>
                    <engine.icon className={`w-6 h-6 text-${engine.color}-600`} />
                </div>
                <h3 className="text-lg font-black">{engine.name}</h3>
                <p className="text-sm text-gray-500 font-medium mt-2">{engine.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
