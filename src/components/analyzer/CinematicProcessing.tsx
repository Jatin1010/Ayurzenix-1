import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Activity, ShieldCheck, Zap } from 'lucide-react';

interface ProcessingState {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STATES: ProcessingState[] = [
  {
    title: "Initializing Neural Mapping",
    description: "Aligning AI sensors with your wellness signals...",
    icon: <Sparkles className="w-8 h-8 text-ayur-purple" />
  },
  {
    title: "Decoding Dosha Patterns",
    description: "Analyzing Vata, Pitta, and Kapha imbalances...",
    icon: <Brain className="w-8 h-8 text-ayur-teal" />
  },
  {
    title: "Evaluating Agni Strength",
    description: "Calculating metabolic intelligence and fire...",
    icon: <Zap className="w-8 h-8 text-amber-500" />
  },
  {
    title: "Finalizing Intelligence Report",
    description: "Synthesizing ancient wisdom with AI insights...",
    icon: <ShieldCheck className="w-8 h-8 text-green-500" />
  }
];

export const CinematicProcessing = ({ onComplete }: { onComplete: () => void }) => {
  const [currentState, setCurrentState] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentState((prev) => {
        if (prev === STATES.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Background Neural Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[#A259FF]/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#00BFA6]/20 blur-[100px] rounded-full"
        />
      </div>

      <div className="relative z-10 text-center space-y-12 max-w-md w-full">
        {/* Central Visualization */}
        <div className="relative flex items-center justify-center h-48">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentState}
              initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 1.2, opacity: 0, rotateY: -180 }}
              className="relative p-8 bg-white rounded-[2.5rem] shadow-2xl border border-black/5"
            >
              {STATES[currentState].icon}
              
              {/* Particle Effects */}
              <div className="absolute inset-0">
                 {[...Array(6)].map((_, i) => (
                   <motion.div
                     key={i}
                     animate={{
                       scale: [0, 1, 0],
                       x: [0, (i % 2 === 0 ? 40 : -40) * Math.random()],
                       y: [0, (i < 3 ? 40 : -40) * Math.random()],
                       opacity: [0, 0.5, 0]
                     }}
                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                     className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-ayur-purple/30"
                   />
                 ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Orbiting Elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-black/5 rounded-full"
          />
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentState}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-black text-black tracking-tight">
                {STATES[currentState].title}
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                {STATES[currentState].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-8">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: `${((currentState + 1) / STATES.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-ayur-purple to-ayur-teal"
            />
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {STATES.map((_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${i === currentState ? 'w-6 bg-ayur-purple' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
