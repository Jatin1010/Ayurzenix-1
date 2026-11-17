import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DoshaTest() {
  const navigate = useNavigate();

  const scrollToInfographic = () => {
    const el = document.getElementById('platform-features');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="dosha-test-center" className="px-6 py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl" />
         <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center shadow-inner"
            >
              <Sparkles className="w-12 h-12 text-emerald-600" />
            </motion.div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tighter">
            Take Your <span className="text-emerald-600">Dosha Test Online</span> <br /> in 60 Seconds
          </h2>
          
          <p className="text-gray-500 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            AI-powered Ayurveda analysis to decode your Prakriti and unlock the secrets to your mental and physical peak.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/symptom-checker-landing')}
            className="group relative px-14 py-7 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-4 mx-auto overflow-hidden transition-all hover:bg-stone-950"
          >
            <span className="relative z-10">Start Free Dosha Test</span>
            <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-emerald-600/10 to-emerald-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
          
          <div className="flex flex-col items-center gap-4">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
               No Medical Documents Required • 100% Secure
             </p>
             
             <motion.button
               onClick={scrollToInfographic}
               animate={{ y: [0, 5, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="flex flex-col items-center gap-1 group"
             >
                <span className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Explore How it Works</span>
                <ChevronDown className="w-4 h-4 text-emerald-600/40 group-hover:text-emerald-600 transition-colors" />
             </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
