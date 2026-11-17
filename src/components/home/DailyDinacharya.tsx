import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Droplets, Sun, Moon, Utensils, Brain, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const HABITS = [
  { id: 'h1', title: 'Ushapan', time: 'Morning', desc: 'Warm water with lemon', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'h2', title: 'Jihwa Nirlekhana', time: 'Morning', desc: 'Tongue scraping', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'h3', title: 'Pranayama', time: 'Evening', desc: 'Breath alignment', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export function DailyDinacharya() {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleHabit = (id: string) => {
    setCompleted(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const progress = (completed.length / HABITS.length) * 100;

  return (
    <div className="px-6 py-10">
      <div className="bg-white rounded-[3rem] p-8 border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-black tracking-tight uppercase">Daily Dinacharya</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Habit alignment protocol</p>
          </div>
          
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#f3f4f6" strokeWidth="6" />
              <motion.circle 
                cx="32" cy="32" r="28" fill="none" stroke="#CCFF00" strokeWidth="6"
                strokeDasharray="176"
                initial={{ strokeDashoffset: 176 }}
                animate={{ strokeDashoffset: 176 - (176 * progress / 100) }}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-black">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {HABITS.map((habit) => {
            const isDone = completed.includes(habit.id);
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={cn(
                  "p-5 rounded-[2rem] flex items-center justify-between transition-all group border-2",
                  isDone 
                    ? "bg-ayur-neon border-ayur-neon shadow-[0_10px_30px_rgba(204,255,0,0.3)]" 
                    : "bg-gray-50 border-transparent hover:border-black/5"
                )}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                    isDone ? "bg-black/10" : habit.bg
                  )}>
                    <habit.icon className={cn("w-6 h-6", isDone ? "text-black" : habit.color)} />
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-xs font-black uppercase tracking-tight",
                      isDone ? "text-black" : "text-black"
                    )}>{habit.title}</h4>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      isDone ? "text-black/50" : "text-gray-400"
                    )}>{habit.desc}</p>
                  </div>
                </div>
                
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-black fill-current" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-200" />
                )}
              </button>
            );
          })}
        </div>

        {progress === 100 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-ayur-neon/10 rounded-2xl border border-ayur-neon/20 flex items-center gap-3"
          >
            <Zap className="w-5 h-5 text-ayur-neon" />
            <p className="text-[10px] font-black text-black uppercase tracking-widest underline decoration-ayur-neon decoration-2">Ojas Level Critical Point Reached! 🔥</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
