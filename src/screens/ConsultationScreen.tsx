import { Stethoscope, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';

import { getFeaturePricing } from '../lib/pricing';

export default function ConsultationScreen({ appConfig }: { appConfig?: any }) {
  const pricing = getFeaturePricing('ai-consultation', appConfig);
  const doctors = [
    { name: 'Dr. Aarav Sharma', specialty: 'Ayurvedic Physician', experience: '12 years', rating: 4.9 },
    { name: 'Dr. Ishani Patel', specialty: 'Panchakarma Expert', experience: '8 years', rating: 4.8 },
    { name: 'Dr. Vikram Mehra', specialty: 'Herbal Medicine Specialist', experience: '15 years', rating: 5.0 },
  ];

  return (
    <div className="px-6 py-8 space-y-8 bg-ayur-bg min-h-screen">
      <div className="modern-hero mb-8">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-ayur-neon rounded-full blur-[60px] opacity-20" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3 text-ayur-neon mb-2">
            <Stethoscope className="w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight text-white">Expert <span className="text-ayur-neon">Consultation</span></h2>
          </div>
          <p className="text-gray-400 text-sm font-medium">Certified Ayurvedic Doctors</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-[2rem] text-white shadow-2xl shadow-ayur-neon/10 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-ayur-neon/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-ayur-neon/30 transition-colors duration-500"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Book a Video Call</h3>
          <p className="text-gray-400 text-xs mb-6 font-medium leading-relaxed">Get personalized guidance from certified Ayurvedic doctors from the comfort of your home.</p>
          <button className="w-full py-4 rounded-2xl bg-gradient-to-b from-ayur-neon to-green-500 text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(57,255,20,0.4)] border-x-2 border-t-2 border-b-[4px] border-green-700 active:border-b-2 active:translate-y-0.5 transition-all">
            Book Now
          </button>
        </div>
      </motion.div>

      <div className="space-y-6">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Available Doctors</h4>
        <div className="space-y-4">
          {doctors.map((doc, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-card p-4 flex items-center gap-4 group hover:border-ayur-neon/30 transition-all active:scale-[0.98]"
            >
              <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center text-gray-400 border border-black/5 group-hover:bg-ayur-neon/5 transition-colors">
                <User className="w-8 h-8 group-hover:text-ayur-neon transition-colors" />
              </div>
              <div className="flex-1">
                <h5 className="font-black text-gray-900 tracking-tight">{doc.name}</h5>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{doc.specialty}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] bg-ayur-neon/10 text-ayur-neon px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">{doc.experience} exp</span>
                  <span className="text-[9px] bg-ayur-gold/10 text-ayur-gold px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">★ {doc.rating}</span>
                </div>
              </div>
              <button className="w-12 h-12 bg-gradient-to-b from-ayur-neon to-green-500 rounded-2xl flex items-center justify-center text-black border-x-2 border-t-2 border-b-[4px] border-green-700 active:border-b-2 active:translate-y-0.5 shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all">
                <Calendar className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-black/5 p-8 rounded-[2rem] border border-black/5 text-center space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ayur-neon/20 to-transparent"></div>
        <Clock className="w-10 h-10 text-gray-300 mx-auto" />
        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Coming Soon: Instant Consult</h4>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed max-w-[200px] mx-auto">Connect with an available doctor in under 5 minutes for urgent queries.</p>
      </div>
    </div>
  );
}
