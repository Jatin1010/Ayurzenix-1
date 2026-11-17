import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Activity, Scissors, Utensils, ShieldAlert, Sparkles, 
  Search, FileText, Zap, Camera, Brain, TrendingUp, Target, 
  Smile, MessageCircle, Moon, Wind, User, ShoppingBag, BookOpen,
  LayoutGrid, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface FeatureExplorerProps {
  onSelect: (path: string) => void;
}

const categories = [
  {
    id: 'health-concerns',
    title: 'Choose Your Concern',
    icon: ShieldAlert,
    description: 'Direct access to AI solutions based on your specific health challenges.',
    features: [
      { id: 'bp-concern', title: 'Blood Pressure', icon: Heart, path: '/heart-health-landing', color: 'bg-red-50 text-red-600' },
      { id: 'pcos-concern', title: 'PCOS & Periods', icon: Activity, path: '/hormonal-balance-landing', color: 'bg-pink-50 text-pink-600' },
      { id: 'hair-concern', title: 'Hair Loss', icon: Scissors, path: '/hair-fall-landing', color: 'bg-indigo-50 text-indigo-600' },
      { id: 'digestion-concern', title: 'Acidity & Gas', icon: Utensils, path: '/gut-landing', color: 'bg-emerald-50 text-emerald-600' },
      { id: 'liver-concern', title: 'Fatty Liver', icon: ShieldAlert, path: '/liver-landing', color: 'bg-orange-50 text-orange-600' },
      { id: 'skin-concern', title: 'Acne & Glow', icon: Sparkles, path: '/face-glow-landing', color: 'bg-amber-50 text-amber-600' },
      { id: 'weight-concern', title: 'Weight Gain', icon: Target, path: '/weight-loss-landing', color: 'bg-rose-50 text-rose-600' },
      { id: 'sleep-concern', title: 'Sleep Issues', icon: Moon, path: '/better-sleep-landing', color: 'bg-blue-50 text-blue-600' },
      { id: 'stress-concern', title: 'Stress & Anxiety', icon: Wind, path: '/stress-relief-landing', color: 'bg-indigo-50 text-indigo-600' },
      { id: 'energy-concern', title: 'Low Energy', icon: Zap, path: '/energy-landing', color: 'bg-yellow-50 text-yellow-600' },
    ]
  },
  {
    id: 'ai-scanners',
    title: 'AI Analysis & Scanners',
    icon: LayoutGrid,
    description: 'Advanced diagnostic engines powered by Ayurvedic logic.',
    features: [
      { id: 'heart', title: 'Heart Health', icon: Heart, path: '/heart-health-landing', color: 'bg-red-50 text-red-600' },
      { id: 'hormonal', title: 'Hormonal Balance', icon: Activity, path: '/hormonal-balance-landing', color: 'bg-pink-50 text-pink-600' },
      { id: 'hair', title: 'Hair Fall', icon: Scissors, path: '/hair-fall-landing', color: 'bg-indigo-50 text-indigo-600' },
      { id: 'gut', title: 'Gut & Digestion', icon: Utensils, path: '/gut-landing', color: 'bg-emerald-50 text-emerald-600' },
      { id: 'liver', title: 'Liver Health', icon: ShieldAlert, path: '/liver-landing', color: 'bg-orange-50 text-orange-600' },
      { id: 'face', title: 'Face Glow', icon: Sparkles, path: '/face-glow-landing', color: 'bg-amber-50 text-amber-600' },
      { id: 'symptom', title: 'Symptom Checker', icon: Search, path: '/symptom-checker-landing', color: 'bg-blue-50 text-blue-600' },
      { id: 'report', title: 'Report Analyst', icon: FileText, path: '/report-analyzer-landing', color: 'bg-slate-50 text-slate-600' },
      { id: 'smart-scan', title: 'Smart Scan', icon: Zap, path: '/smart-scan-landing', color: 'bg-yellow-50 text-yellow-600' },
      { id: 'body-scan', title: 'AI Body Scan', icon: Camera, path: '/body-scan-landing', color: 'bg-cyan-50 text-cyan-600' },
      { id: 'mental', title: 'Mental Scan', icon: Brain, path: '/smart-mental-landing', color: 'bg-purple-50 text-purple-600' },
    ]
  },
  {
    id: 'future',
    title: 'Future & Wellness',
    icon: TrendingUp,
    description: 'Predictive intelligence for your long-term health.',
    features: [
      { id: 'future-predictor', title: 'Future Predictor', icon: TrendingUp, path: '/future-predictor-landing', color: 'bg-violet-50 text-violet-600' },
      { id: 'daily-routine', title: 'Daily Routine', icon: Target, path: '/daily-routine-landing', color: 'bg-emerald-50 text-emerald-600' },
      { id: 'mood', title: 'Mood Ayurveda', icon: Smile, path: '/mood-ayurveda-landing', color: 'bg-amber-50 text-amber-600' },
      { id: 'chat', title: 'Ask Ayurzenix', icon: MessageCircle, path: '/chat', color: 'bg-blue-50 text-blue-600' },
    ]
  },
  {
    id: 'goal-plans',
    title: 'Goal-Based Plans',
    icon: Target,
    description: 'Dedicated protocols for specific wellness outcomes.',
    features: [
      { id: 'weight-loss', title: 'Weight Loss', icon: Target, path: '/weight-loss-landing', color: 'bg-rose-50 text-rose-600' },
      { id: 'stress-relief', title: 'Stress Relief', icon: Wind, path: '/stress-relief-landing', color: 'bg-indigo-50 text-indigo-600' },
      { id: 'sleep', title: 'Better Sleep', icon: Moon, path: '/better-sleep-landing', color: 'bg-blue-50 text-blue-600' },
      { id: 'energy', title: 'Energy Booster', icon: Zap, path: '/energy-landing', color: 'bg-yellow-50 text-yellow-600' },
    ]
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle & Resources',
    icon: ShoppingBag,
    description: 'Your gateway to a premium Ayurvedic lifestyle.',
    features: [
      { id: 'consultation', title: 'Expert Consult', icon: User, path: '/consultation', color: 'bg-stone-50 text-stone-600' },
      { id: 'store', title: 'Ayurzenix Store', icon: ShoppingBag, path: '/store', color: 'bg-ayur-teal/5 text-ayur-teal' },
      { id: 'blog', title: 'Wellness Blogs', icon: BookOpen, path: '/blog', color: 'bg-stone-50 text-stone-600' },
    ]
  }
];

export const FeatureExplorer: React.FC<FeatureExplorerProps> = ({ onSelect }) => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  return (
    <section className="bg-stone-50/50 py-12 lg:py-20" id="feature-explorer">
      <div className="section-container">
        <div className="mb-12 text-center max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-heading font-black mb-4 text-[#000000] uppercase tracking-tighter leading-none">
            Intelligence Directory
          </h2>
          <p className="text-[#111827] text-sm md:text-lg font-medium opacity-70">
            Explore 22 precision engines combining ancient wisdom with next-gen AI.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 px-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border",
                activeCategory === cat.id 
                  ? "bg-ayur-neon text-black border-ayur-neon shadow-[0_10px_25px_rgba(204,255,0,0.3)] scale-105" 
                  : "bg-white text-gray-400 border-stone-200 hover:border-black active:scale-95"
              )}
            >
              <cat.icon className="w-3 h-3" />
              {cat.title}
            </button>
          ))}
        </div>

        {/* Features Content */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ayur-teal/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="space-y-2 relative z-10 text-center md:text-left">
                   <p className="text-[10px] font-black text-ayur-teal uppercase tracking-[0.4em] mb-1">
                     {categories.find(c => c.id === activeCategory)?.title}
                   </p>
                   <h3 className="text-2xl font-black text-black tracking-tight uppercase italic leading-none">
                     {categories.find(c => c.id === activeCategory)?.description}
                   </h3>
                </div>
                <div className="flex -space-x-3 relative z-10">
                   {categories.find(c => c.id === activeCategory)?.features.slice(0, 4).map((f, i) => (
                     <div key={i} className={cn("w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-lg", f.color)}>
                        <f.icon className="w-5 h-5" />
                     </div>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {categories.find(c => c.id === activeCategory)?.features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelect(feature.path)}
                    className="group cursor-pointer"
                  >
                    <div className="h-full bg-white rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center gap-4 border border-white shadow-luxury hover:shadow-premium transition-all duration-300 relative overflow-hidden sharp-card gpu-accelerated">
                      <div className={cn(
                        "p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                        feature.color
                      )}>
                        <feature.icon className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-[#000000] tracking-tight text-[11px] md:text-xs uppercase">
                          {feature.title}
                        </h4>
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-[8px] font-black text-ayur-teal uppercase tracking-widest">Connect</span>
                           <ChevronRight className="w-2 h-2 text-ayur-teal" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
