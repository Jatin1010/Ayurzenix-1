import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, 
  Sparkles, 
  Camera, 
  Utensils, 
  Activity, 
  Brain, 
  Zap, 
  Heart, 
  Shield, 
  Wind, 
  Flame, 
  Moon, 
  Headphones, 
  Calendar, 
  Clock, 
  LineChart, 
  History, 
  ShoppingBag, 
  Stethoscope,
  ChevronRight,
  Search,
  Dna,
  Scale,
  CloudLightning,
  Sun,
  Eye,
  Layers,
  Bot
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface PlatformFeaturesProps {
  onSelect: (path: string) => void;
}

const CATEGORIES = [
  { id: 'diagnostics', label: 'Bio-Diagnostics', icon: Scan },
  { id: 'engines', label: 'Precision Engines', icon: CloudLightning },
  { id: 'mind', label: 'Mind & Sleep', icon: Moon },
  { id: 'lifestyle', label: 'Ancient Rhythms', icon: Sun },
];

// Helper to keep icons consistent
const EmeraldIcon = Activity;

const FEATURES = [
  // Bio-Diagnostics
  { 
    id: 'smart-scan', 
    category: 'diagnostics', 
    title: 'Smart Health Scan', 
    desc: 'Full-body Ayurvedic digital snapshot.', 
    icon: Scan, 
    path: '/smart-scan-landing', 
    color: '#10b981', // emerald
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    premium: true 
  },
  { 
    id: 'face-glow', 
    category: 'diagnostics', 
    title: 'Face Glow Scan', 
    desc: 'AI analysis for skin health & radiance.', 
    icon: Sparkles, 
    path: '/face-glow-landing', 
    color: '#ec4899', // pink
    bg: 'bg-pink-50',
    text: 'text-pink-600'
  },
  { 
    id: 'body-scan', 
    category: 'diagnostics', 
    title: '360° Body Scan', 
    desc: 'Morphology & posture intelligence.', 
    icon: Camera, 
    path: '/body-scan-landing', 
    color: '#3b82f6', // blue
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  { 
    id: 'aahar', 
    category: 'diagnostics', 
    title: 'Aahar Scanner', 
    desc: 'Meal compatibility & Agni scoring.', 
    icon: Utensils, 
    path: '/aahar-scanner-landing', 
    color: '#f97316', // orange
    bg: 'bg-orange-50',
    text: 'text-orange-600'
  },
  { 
    id: 'hair-fall', 
    category: 'diagnostics', 
    title: 'Hair Intelligence', 
    desc: 'Root analysis & scalp wellness.', 
    icon: Layers, 
    path: '/hair-fall-landing', 
    color: '#6366f1', // indigo
    bg: 'bg-indigo-50',
    text: 'text-indigo-600'
  },
  { 
    id: 'gut-health', 
    category: 'diagnostics', 
    title: 'Gut Analyzer', 
    desc: 'Microbiome & digestive fire mapping.', 
    icon: Activity, 
    path: '/gut-landing', 
    color: '#14b8a6', // teal
    bg: 'bg-teal-50',
    text: 'text-teal-600'
  },

  // Precision Engines
  { 
    id: 'prana', 
    category: 'engines', 
    title: 'Prana Engine', 
    desc: 'Heart & Respiratory analytics.', 
    icon: Wind, 
    path: '/heart-health-landing', 
    color: '#f43f5e', // rose
    bg: 'bg-rose-50',
    text: 'text-rose-600'
  },
  { 
    id: 'agni', 
    category: 'engines', 
    title: 'Agni Engine', 
    desc: 'Metabolic & Digestive fire logic.', 
    icon: Flame, 
    path: '/gut-landing', 
    color: '#f97316', // orange
    bg: 'bg-orange-50',
    text: 'text-orange-600'
  },
  { 
    id: 'yakrut', 
    category: 'engines', 
    title: 'Yakrut Engine', 
    desc: 'Liver detox & metabolic purity.', 
    icon: EmeraldIcon, 
    path: '/liver-landing', 
    color: '#10b981', // emerald
    bg: 'bg-emerald-50',
    text: 'text-emerald-600'
  },
  { 
    id: 'shakti', 
    category: 'engines', 
    title: 'Shakti Engine', 
    desc: 'Hormonal & Vitality mapping.', 
    icon: Zap, 
    path: '/hormonal-balance-landing', 
    color: '#f59e0b', // amber
    bg: 'bg-amber-50',
    text: 'text-amber-600'
  },
  { 
    id: 'ojas', 
    category: 'engines', 
    title: 'Ojas Engine', 
    desc: 'Immunity & Defense intelligence.', 
    icon: Shield, 
    path: '/symptom-checker-landing', 
    color: '#8b5cf6', // violet
    bg: 'bg-violet-50',
    text: 'text-violet-600'
  },
  { 
    id: 'future', 
    category: 'engines', 
    title: 'Future Health', 
    desc: 'Predictive Ayurvedic longevity.', 
    icon: LineChart, 
    path: '/future-predictor-landing', 
    color: '#0ea5e9', // sky
    bg: 'bg-sky-50',
    text: 'text-sky-600'
  },

  // Mind & Sleep
  { 
    id: 'manas', 
    category: 'mind', 
    title: 'Manas Engine', 
    desc: 'Neuro-wellness & stress mapping.', 
    icon: Brain, 
    path: '/mood-ayurveda-landing', 
    color: '#8b5cf6', // violet
    bg: 'bg-violet-50',
    text: 'text-violet-600'
  },
  { 
    id: 'sleep', 
    category: 'mind', 
    title: 'Sleep Intelligence', 
    desc: 'Lunar cycle sleep architecture.', 
    icon: Moon, 
    path: '/sleep-intelligence-landing', 
    color: '#3b82f6', // blue
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  { 
    id: 'sound', 
    category: 'mind', 
    title: 'Soundscapes', 
    desc: 'Vedic frequencies for focus.', 
    icon: Headphones, 
    path: '/soundscapes', 
    color: '#10b981', // emerald
    bg: 'bg-emerald-50',
    text: 'text-emerald-600'
  },

  // Rhythms
  { 
    id: 'dinacharya', 
    category: 'lifestyle', 
    title: 'Daily Dinacharya', 
    desc: 'Personalized routine protocol.', 
    icon: Clock, 
    path: '/daily-routine-landing', 
    color: '#f59e0b', // amber
    bg: 'bg-amber-50',
    text: 'text-amber-600'
  },
  { 
    id: 'ritucharya', 
    category: 'lifestyle', 
    title: 'Seasonal Guide', 
    desc: 'Adapting to cosmic shifts.', 
    icon: Sun, 
    path: '/smart-scan-landing', 
    color: '#f97316', // orange
    bg: 'bg-orange-50',
    text: 'text-orange-600'
  },
  { 
    id: 'bmi', 
    category: 'lifestyle', 
    title: 'Ayur-BMI', 
    desc: 'Body composition by Dosha.', 
    icon: Scale, 
    path: '/bmi-calculator', 
    color: '#14b8a6', // teal
    bg: 'bg-teal-50',
    text: 'text-teal-600'
  },
  { 
    id: 'consult', 
    category: 'lifestyle', 
    title: 'AI Consultation', 
    desc: '24/7 Ayurvedic intelligence.', 
    icon: Bot, 
    path: '/consultation', 
    color: '#4f46e5', // indigo
    bg: 'bg-indigo-50',
    text: 'text-indigo-600'
  },
];

export const PlatformFeatures: React.FC<PlatformFeaturesProps> = ({ onSelect }) => {
  const [activeCategory, setActiveCategory] = useState('diagnostics');

  const filteredFeatures = FEATURES.filter(f => f.category === activeCategory);

  return (
    <section className="py-24 bg-white overflow-hidden" id="platform-features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100"
            >
              <Dna className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Unified Architecture</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight tracking-tight uppercase">
              Ayurzenix <span className="text-emerald-500">Platform</span>
            </h2>
            <p className="text-gray-600 font-medium text-lg leading-relaxed">
              Explore our comprehensive suite of AI engines and diagnostic tools designed for high-definition health mapping.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-[2rem] overflow-x-auto no-scrollbar scroll-smooth">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeCategory === cat.id 
                    ? "bg-black text-white shadow-xl shadow-black/20" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredFeatures.map((feature, idx) => (
              <motion.div
                key={feature.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => onSelect(feature.path)}
                className="group relative cursor-pointer"
              >
                {/* Cinematic Card Layout */}
                <div className="relative h-full bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                  
                  {/* Decorative Background Elements */}
                  <div 
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                    style={{ backgroundColor: feature.color }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className={cn(
                      "w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                      feature.bg, feature.text
                    )}>
                      <feature.icon className="w-8 h-8" />
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-black tracking-tight uppercase leading-none">
                          {feature.title}
                        </h3>
                        {feature.premium && (
                          <div className="px-2 py-0.5 bg-black text-white rounded text-[8px] font-black uppercase tracking-widest">
                            Pro
                          </div>
                        )}
                      </div>
                      <p className="text-gray-500 font-medium text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-black font-black text-[10px] uppercase tracking-widest leading-none">
                        Analyze Now
                        <div className="w-4 h-4 rounded-full bg-black/5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                      
                      <div className="text-[10px] font-black text-emerald-500/0 group-hover:text-emerald-500 transition-colors uppercase tracking-[0.2em]">
                        60s Results
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

