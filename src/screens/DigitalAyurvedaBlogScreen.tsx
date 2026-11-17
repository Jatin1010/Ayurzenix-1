import { motion } from 'motion/react';
import { 
  Shield, 
  ChevronLeft, 
  Zap, 
  Sparkles, 
  Activity, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Brain,
  Globe,
  Users,
  Database,
  Search,
  Leaf
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../lib/utils';

const COLORS = {
  purple: '#A259FF',
  teal: '#00BFA6',
  coral: '#FF6B6B',
  yellow: '#FFB400',
  azure: '#006BDF',
  midnight: '#040F49',
  violet: '#241446',
  lavender: '#474787',
  forest: '#124622',
  slate: '#0A2F30',
  textLight: '#F7FCF9'
};

const FEATURES = [
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Artificial Intelligence",
    desc: "Advanced neural networks trained on 5,000+ years of Vedic text to identify subtle bio-patterns.",
    color: COLORS.purple
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Smart Health Algorithms",
    desc: "Real-time processing of symptoms, lifestyle, and dietary signals for instant scoring.",
    color: COLORS.teal
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Vedic Data Models",
    desc: "Proprietary database linking modern diagnostic markers with traditional Dosha imbalances.",
    color: COLORS.azure
  }
];

const USAGE_STEPS = [
  { num: "01", title: "Select Feature", desc: "Choose your focus area: Heart, Skin, Weight, or Mind." },
  { num: "02", title: "Vibe Analysis", desc: "Our AI maps your metabolic rhythm using ancient Vedic logic." },
  { num: "03", title: "Report Generation", desc: "Get a detailed score and identify hidden bio-imbalances." },
  { num: "04", title: "Daily Routine", desc: "Follow the personalized 'Dinacharya' plan for 21 days." },
  { num: "05", title: "Shop Herbs", desc: "Order pure, AI-recommended herbal protocols from the store." },
  { num: "06", title: "Watch Progress", desc: "Rescan weekly to see your 'Ojas' levels rise digitally." }
];

const FAQS = [
  { 
    q: "How does AI connect with a 5,000-year-old science?", 
    a: "Ayurveda is based on patterns. AI is the world's best pattern recognition engine. Ayurzenix uses neural networks to decode the complex relationships between your symptoms and the Vata-Pitta-Kapha axis that were documented in the Caraka Samhita." 
  },
  { 
    q: "Is Digital Ayurveda accurate?", 
    a: "Our models are trained on thousands of case studies and validated Ayurvedic protocols. While not a clinical diagnosis, the 'Vibe Scan' provides a highly accurate reflection of your current metabolic state." 
  },
  { 
    q: "Do I need special equipment for the scans?", 
    a: "No. All scans within the Ayurzenix app use simple inputs, questionnaires, and vision-based AI (like the Face Glow scan) directly from your smartphone." 
  },
  {
    q: "Are the herbal recommendations safe?",
    a: "Yes. All our recommendations are based on standard Ayurvedic pharmacopeia. However, if you are pregnant or on medication, always consult your physician before starting new herbs."
  }
];

export default function DigitalAyurvedaBlogScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F7FCF9] text-black font-sans selection:bg-[#A259FF] selection:text-white pb-40">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white backdrop-blur-xl shadow-2xl flex items-center justify-center border border-gray-100 active:scale-90 transition-all hover:bg-gray-50"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* 1. Hero Section - DNA Format */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center pt-20">
        <motion.div 
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 0.3, scale: 1 }}
           transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
           className="absolute inset-0 z-0"
        >
            <img src="/src/assets/images/ayurvedic_ai_future_1778560603439.png" alt="Future Ayurveda" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F7FCF9]/80 to-[#F7FCF9]" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#A259FF]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00BFA6]/10 blur-[120px] rounded-full animate-pulse delay-1000" />

        <div className="relative z-10 w-full px-6 max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FFB400]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00BFA6]">India's #1 Digital Platform</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase text-black">
              India’s First <br />
              Digital <span style={{ color: COLORS.teal }}>Ayurveda</span> <br />
              <span style={{ color: COLORS.purple }}>Platform</span> Powered by AI
            </h1>
            <p className="text-gray-600 text-xl font-semibold leading-relaxed max-w-2xl mx-auto pt-4">
              प्राचीन आयुर्वेदिक ज्ञान को modern artificial intelligence के साथ जोड़कर users को 
              <span className="text-black font-black ml-1 italic underline decoration-[#FF6B6B]">personalized, fast और data-driven health solutions।</span>
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-4 pt-10"
          >
             <div className="w-px h-24 bg-gradient-to-b from-gray-200 to-transparent" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A259FF]">Scroll to Explore the Evolution</p>
          </motion.div>
        </div>
      </section>

      {/* 2. Symptom/Problem Section - The "Metabolism Trap" Style */}
      <section className="px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-2xl max-w-6xl mx-auto overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B6B]/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
                <h3 className="text-4xl font-black tracking-tighter uppercase leading-none text-black">
                    Why <span style={{ color: COLORS.coral }}>Ayurveda + AI</span> <br />
                    is the Future?
                </h3>
                <div className="space-y-6">
                    <p className="text-gray-600 text-lg leading-relaxed font-bold">
                        आज की तेज़ रफ्तार ज़िंदगी में health issues बढ़ रहे हैं—stress, heart problems, hair fall, gut issues, hormonal imbalance—लेकिन इनका root cause समझना आसान नहीं है।
                    </p>
                    <div className="space-y-4">
                        {[
                            "Traditional diagnosis is time-consuming",
                            "Expert availability is globally limited",
                            "Lack of data-driven tracking tools",
                            "One-size-fits-all generic remedies"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
                                <span className="text-sm font-black uppercase tracking-widest text-gray-400">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="grid gap-4">
                {FEATURES.map((feature, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex gap-6 hover:bg-white transition-all cursor-default shadow-sm">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: feature.color, color: 'white' }}>
                            {feature.icon}
                        </div>
                        <div className="space-y-1">
                            <h5 className="font-black text-lg uppercase tracking-tight text-black">{feature.title}</h5>
                            <p className="text-xs text-gray-500 leading-relaxed font-black">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Personalized Treatment Section - H2 Section */}
      <section className="px-6 py-24 max-w-5xl mx-auto relative">
         <div className="absolute -left-20 top-0 w-64 h-64 bg-[#006BDF]/5 blur-[100px] rounded-full pointer-events-none" />
         
         <div className="space-y-20">
            <div className="space-y-8">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none text-black">
                    <span style={{ color: COLORS.yellow }}>AI-Based</span> <br />
                    Ayurvedic Health Analysis
                </h2>
                <div className="pl-8 border-l-4 border-[#00BFA6]">
                    <p className="text-xl text-[#00BFA6] font-black italic">
                        "Your health score is not a metric. It's a bio-rhythmic signal."
                    </p>
                </div>
                <p className="text-lg text-gray-700 font-bold leading-relaxed">
                    Ayurzenix का सबसे powerful feature है—AI-based health analysis system। User को बस कुछ basic details डालनी होती हैं: Age, Gender, Symptoms, और Lifestyle habits। इसके बाद AI system body patterns analyze करता है, Dosha imbalance detect करता है, और Risk factors identify करता है।
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { title: "Instant Analysis", desc: "No waiting. Results generated in under 60 seconds.", color: COLORS.purple },
                    { title: "24/7 Availability", desc: "Expert assessment available anytime, anywhere.", color: COLORS.teal },
                    { title: "Consistent Logic", desc: "Scientific precision removed from human bias.", color: COLORS.azure }
                ].map((card, i) => (
                    <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl space-y-4 hover:border-[#00BFA6]/40 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#00BFA6]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight text-black">{card.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-bold">{card.desc}</p>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* 4. Personalized Herbal Treatment - H2 Section */}
      <section className="px-6 py-24">
         <div className="bg-white rounded-[4rem] p-16 border border-gray-100 relative overflow-hidden max-w-6xl mx-auto shadow-3xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00BFA6]/5 rotate-12 blur-[100px] pointer-events-none" />
            
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                    <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-black">
                        Personalized <br />
                        <span style={{ color: COLORS.yellow }}>Herbal Treatment</span> Plans
                    </h2>
                    <p className="text-gray-700 text-lg font-bold leading-relaxed">
                        Ayurveda का core principle है—हर व्यक्ति अलग है। इसलिए Ayurzenix सिर्फ general advice नहीं देता—यह देता है <strong>Personalized Herbal Treatment Plans।</strong>
                    </p>
                    <div className="space-y-4">
                        {[
                           { label: "Specific Herbs", text: "Ashwagandha, Triphala, Giloy, Shatavari" },
                           { label: "Dosha-Diet", text: "Custom food mapping for your metabolism" },
                           { label: "Dinacharya", text: "Daily routine corrections for longevity" }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-[#00BFA6] flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm font-black uppercase tracking-widest text-[#00BFA6]">{item.label}: <span className="text-black ml-2">{item.text}</span></p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-2xl space-y-8">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A259FF]">Sample Protocol</span>
                            <span className="text-[10px] font-black text-gray-400">ID: AZ-2026-X</span>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
                                <Leaf className="w-8 h-8 text-[#00BFA6]" />
                                <div>
                                    <h6 className="font-black text-sm uppercase text-black">Brahmi Gold Infusion</h6>
                                    <p className="text-[10px] text-gray-500 font-bold">Optimizes Vata rhythm in the nervous system.</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
                                <Activity className="w-8 h-8 text-[#FF6B6B]" />
                                <div>
                                    <h6 className="font-black text-sm uppercase text-black">Pitta Calm Protocol</h6>
                                    <p className="text-[10px] text-gray-500 font-bold">Reduces inflammation marks by 40% in 14 days.</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                             <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: '70.5%' }}
                                  viewport={{ once: true }}
                                  className="h-full bg-[#00BFA6]" 
                                />
                             </div>
                             <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#00BFA6] mt-2">Personalization Match: 98.4%</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* 5. Online Dosha Analysis - H2 Section */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
         <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-black">
                Online <span style={{ color: COLORS.purple }}>Dosha Analysis</span> Platform
            </h2>
            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">The Foundation of Personalized Healing</p>
         </div>

         <div className="grid md:grid-cols-3 gap-8">
            {[
                { name: "Vata", type: "Rhythm & Space", color: "#FFB400", desc: "Controls all movement in the body and mind." },
                { name: "Pitta", type: "Energy & Fire", color: "#FF6B6B", desc: "Manages metabolism, digestion, and heat." },
                { name: "Kapha", type: "Structure & Shield", color: "#00BFA6", desc: "Provides immunity, lubrication, and strength." }
            ].map((dosha, i) => (
                <div key={i} className="group p-8 rounded-[3rem] bg-white border border-gray-100 text-center space-y-6 hover:-translate-y-4 transition-all duration-500 shadow-xl">
                    <div className="w-24 h-24 rounded-full mx-auto border-4 border-gray-50 flex items-center justify-center text-4xl font-black transition-all group-hover:scale-110" style={{ color: dosha.color, borderColor: `${dosha.color}20` }}>
                        {dosha.name[0]}
                    </div>
                    <div>
                        <h4 className="text-2xl font-black uppercase tracking-tighter text-black">{dosha.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{dosha.type}</p>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed font-bold">{dosha.desc}</p>
                </div>
            ))}
         </div>
      </section>

      {/* 6. Deep Content Section */}
      <section className="px-6 py-12 max-w-4xl mx-auto space-y-16">
         <div className="space-y-10 text-gray-700 text-xl font-semibold leading-relaxed border-t border-gray-100 pt-20">
            <h3 className="text-3xl font-black text-black uppercase tracking-tight">Who Should Use Ayurzenix?</h3>
            <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <p className="text-[#A259FF] font-black uppercase tracking-widest text-sm">Working Professionals</p>
                    <p className="text-base text-gray-500 font-bold">Manage high-cortisol stress and brain fog using AI-vibe techniques.</p>
                </div>
                <div className="space-y-4">
                    <p className="text-[#00BFA6] font-black uppercase tracking-widest text-sm">Health Enthusiasts</p>
                    <p className="text-base text-gray-500 font-bold">Optimize your longevity bio-markers using ancient DNA logic.</p>
                </div>
                <div className="space-y-4">
                    <p className="text-[#FF6B6B] font-black uppercase tracking-widest text-sm">Chronic Care</p>
                    <p className="text-base text-gray-500 font-bold">Identify metabolic triggers for hair fall, gut issues, and mood swings.</p>
                </div>
                <div className="space-y-4">
                    <p className="text-[#FFB400] font-black uppercase tracking-widest text-sm">Seniors</p>
                    <p className="text-base text-gray-500 font-bold">Gentle, safe, and effective cardiovascular and joint support protocols.</p>
                </div>
            </div>
         </div>

         <div className="bg-white rounded-[3rem] p-10 text-center space-y-8 relative overflow-hidden border border-gray-100 shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#A259FF]/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
             <h3 className="text-4xl font-black tracking-tighter uppercase leading-tight text-black">The Future of Digital <br /> Ayurveda in India is <span style={{ color: COLORS.purple }}>Live</span></h3>
             <p className="text-gray-500 max-w-2xl mx-auto font-bold italic">
                India में digital health तेजी से grow कर रहा है, लेकिन Ayurveda sector अभी भी largely offline है। 
                Ayurzenix is filling this gap. Experience the revolution today.
             </p>
         </div>
      </section>

      {/* 7. Sticky Footer CTA */}
      <div className="fixed bottom-10 left-6 right-6 z-50 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/health-scan')}
          className="w-full max-w-md h-20 rounded-[2.5rem] bg-[#A259FF] text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-between px-8 shadow-[0_20px_40px_rgba(162,89,255,0.3)] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#A259FF]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span>Vibe Check Now</span>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
        </motion.button>
      </div>
    </div>
  );
}
