import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Cloud, Zap, Moon, Heart, Smile } from 'lucide-react';
import { cn } from '../../lib/utils';

const MOODS = [
  { id: 'calm', label: 'Sattvic (Calm)', icon: Smile, color: 'bg-emerald-500', text: 'text-emerald-500' },
  { id: 'active', label: 'Rajasic (Active)', icon: Zap, color: 'bg-amber-500', text: 'text-amber-500' },
  { id: 'dull', label: 'Tamasic (Heavier)', icon: Moon, color: 'bg-indigo-500', text: 'text-indigo-500' },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (id: string) => {
    setSelectedMood(id);
    // In a real app, save this to Firestore
  };

  return (
    <div className="px-6 py-10">
      <div className="bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-black/5 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-ayur-neon/10 blur-3xl -mr-16 -mt-16" />
        
        <div className="relative z-10 space-y-8">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Current Guna (Mood)</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Track your mental energy today</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-[2.5rem] transition-all border-2",
                  selectedMood === mood.id
                    ? "bg-ayur-neon border-ayur-neon shadow-lg"
                    : "bg-gray-50 border-transparent hover:border-black/5"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform",
                  selectedMood === mood.id ? "bg-white/40 scale-110" : "bg-white"
                )}>
                  <mood.icon className={cn("w-6 h-6", selectedMood === mood.id ? "text-black" : mood.text)} />
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest text-center",
                  selectedMood === mood.id ? "text-black" : "text-gray-400"
                )}>
                  {mood.label.split(' ')[1]}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-6 bg-ayur-neon/10 border border-ayur-neon/20 rounded-[2rem] space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ayur-neon" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">AI Insight</span>
                </div>
                <p className="text-xs font-bold leading-relaxed text-black">
                  {selectedMood === 'calm' && "Aapka mann abhi bilkul Sattvic hai. This is the best time for meditation."}
                  {selectedMood === 'active' && "Rajasic energy is high! Pranayma se ise balance karein to avoid burnout."}
                  {selectedMood === 'dull' && "Thoda Tamasic feel kar rahe hain? Go for a quick walk to refresh."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
