import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Eye, 
  Activity, 
  Heart, 
  Dna, 
  Shield, 
  Zap, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  Database,
  Lock,
  Smartphone,
  Globe,
  Layers,
  Search,
  ArrowLeft,
  CirclePlay
} from 'lucide-react';

const IntelligenceCard = ({ icon: Icon, title, description, tags, features, color, lightMode }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative h-full"
  >
    <div className={`absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`} />
    <div className={`relative h-full backdrop-blur-3xl border rounded-[3rem] p-10 flex flex-col justify-between transition-all duration-500 ${
      lightMode 
        ? "bg-white/80 border-gray-100 shadow-xl hover:border-emerald-200/50 hover:shadow-2xl" 
        : "bg-stone-950/40 border-white/5 hover:border-white/20"
    }`}>
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-inner ${
            lightMode ? "bg-gray-50" : "bg-white/5"
          }`} style={{ color: color }}>
            <Icon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-2xl font-black tracking-tighter uppercase ${lightMode ? "text-black" : "text-white"}`}>{title}</h3>
            <div className="flex gap-2">
              {tags.map((tag: string, i: number) => (
                <span key={i} className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                  lightMode ? "bg-gray-100 text-gray-400" : "bg-white/5 text-white/40"
                }`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className={`text-lg font-medium leading-relaxed mb-8 ${lightMode ? "text-gray-600" : "text-white/70"}`}>
          {description}
        </p>
        <div className="space-y-4">
          {features.map((feature: string, i: number) => (
            <div key={i} className={`flex items-center gap-3 text-sm font-bold transition-colors ${
              lightMode ? "text-gray-400 group-hover:text-black" : "text-white/50 group-hover:text-white/90"
            }`}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              {feature}
            </div>
          ))}
        </div>
      </div>
      <div className={`mt-10 pt-8 border-t ${lightMode ? "border-gray-100" : "border-white/5"}`}>
        <button className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all ${
          lightMode ? "text-black" : "text-white"
        }`}>
          Explore Architecture <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

const SectionHeading = ({ title, subtitle, badge }: any) => (
  <div className="text-center mb-20 space-y-6">
    {badge && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 backdrop-blur-md"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {badge}
      </motion.div>
    )}
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-7xl font-black text-white leading-none tracking-[ -0.05em]"
    >
      {title}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-medium"
    >
      {subtitle}
    </motion.p>
  </div>
);

const RealTimeLogs = () => {
  return (
    <div className="space-y-1.5 text-[8px] font-mono text-gray-500">
      {[
        "INITIALIZING VEDA-v3 CORE...",
        "NEURAL PATH: SYMPTOM -> DOSHA [OK]",
        "DATA: MAPPING 420 LANDMARKS...",
        "QUERY: CHARAKA SAMHITA DATASET...",
        "CORRELATION: AGNI x METABOLISM...",
        "SCANNING LINGUAL TOPOGRAPHY...",
        "DETECTING MICRO-EXPRESSIONS...",
        "UPDATING BIOMARKER BluePrint...",
        "SECURE KEY VERIFIED: AI-v99",
        "SYNC COMPLETE: SYSTEM NOMINAL."
      ].map((log, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: [0, 1, 0.4], x: 0 }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            delay: i * 0.8,
            repeatDelay: 2
          }}
          className="flex items-center gap-2"
        >
          <span className="text-emerald-500 whitespace-nowrap">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
          <span className="truncate">{log}</span>
        </motion.div>
      ))}
    </div>
  );
};

const BioAvatar = () => (
  <div className="relative w-[350px] h-[500px] flex items-center justify-center">
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/50 to-transparent rounded-full blur-[100px] scale-150 opacity-10" />
    
    {/* Human Silhouette SVG (Stylized) */}
    <svg viewBox="0 0 200 400" className="w-full h-full text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.15)]">
      <defs>
        <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Bio-Nodes */}
      <motion.circle cx="100" cy="50" r="1.2" fill="#10B981" animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
      <motion.circle cx="100" cy="120" r="1.2" fill="#10B981" animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />
      <motion.circle cx="70" cy="200" r="1.2" fill="#3B82F6" animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} />
      <motion.circle cx="130" cy="200" r="1.2" fill="#3B82F6" animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 1.5 }} />

      <motion.path 
        d="M100 20 C 110 20, 125 35, 125 55 C 125 75, 110 90, 100 90 C 90 90, 75 75, 75 55 C 75 35, 90 20, 100 20 M100 90 L 100 110 M100 110 L 140 160 L 130 220 M100 110 L 60 160 L 70 220 M100 110 L 100 240 M100 240 L 80 380 M100 240 L 120 380" 
        fill="none" 
        stroke="url(#avatarGradient)" 
        strokeWidth="1.2" 
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      
      {/* Scan Line */}
      <motion.line 
        x1="10" x2="190" 
        y1="0" y2="0" 
        stroke="#10B981" 
        strokeWidth="1"
        strokeDasharray="4 2"
        animate={{ y: [40, 360, 40] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Scan Overlay */}
      <motion.rect 
        x="10" width="180" 
        height="20" 
        fill="rgba(16,185,129,0.03)"
        animate={{ y: [40, 360, 40] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </svg>

    {/* Floating HUD Elements */}
    <div className="absolute top-1/4 -right-20 flex flex-col gap-12">
       <div className="space-y-1">
          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Neural Resonance</p>
          <div className="w-32 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
       </div>
       <div className="space-y-1">
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Cellular Matrix</p>
          <div className="w-32 h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />
       </div>
       <div className="space-y-1">
          <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Dosha Vector</p>
          <div className="w-32 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
       </div>
    </div>
  </div>
);

export default function IntelligenceScreen() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={containerRef} className="bg-[#FDFDFF] min-h-screen text-black overflow-hidden selection:bg-emerald-500/10 selection:text-emerald-600">
      
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.05)_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(59,130,246,0.05)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-8 flex justify-between items-center bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all text-gray-400 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black italic shadow-[0_4px_12px_rgba(16,185,129,0.2)]">A</div>
          <span className="text-xl font-black uppercase tracking-tighter text-black">Ayurzenix <span className="text-emerald-500 italic">IQ</span></span>
        </div>
        <button className="px-6 py-2 rounded-full bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
          Get Started
        </button>
      </nav>

      {/* 1. Cinematic Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Floating AI Particles */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                scale: Math.random() * 2 
              }}
              animate={{ 
                y: ["-10%", "110%"],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: Math.random() * 10 + 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 10
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-20 space-y-12 max-w-6xl"
        >
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black uppercase tracking-[0.4em] backdrop-blur-xl">
            <Sparkles className="w-4 h-4" />
            The Intelligence System
          </div>
          
          <h1 className="text-6xl md:text-[12rem] font-black text-black leading-[0.85] tracking-[-0.07em] uppercase">
            Ancient <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-400 italic">Biological</span> <br />
            Wisdom.
          </h1>

          <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mx-auto" />

          <p className="text-xl md:text-3xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
            Ayurzenix combines Ayurvedic intelligence with advanced AI systems to understand your body, symptoms, and habits in real time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
            <button className="group px-12 py-6 rounded-full bg-black text-white font-black text-lg uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-500 hover:text-white transition-all duration-500 shadow-2xl">
              Launch Analysis <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="px-10 py-6 rounded-full bg-white border border-gray-100 text-black font-black text-lg uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-3 shadow-sm">
              <CirclePlay className="w-6 h-6" /> Explore Brain
            </button>
          </div>
        </motion.div>

        <motion.div 
          style={{ opacity: useTransform(springScroll, [0, 0.1], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Scroll to Deep Dive</span>
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500/30 to-transparent" />
        </motion.div>
      </section>

      {/* 2. The AI Brain Behind Ayurzenix */}
      <section className="py-40 px-6 relative z-10 bg-[#FDFDFF] text-black">
        <div className="absolute inset-0 pointer-events-none opacity-40">
           <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-[150px]" />
           <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10">
          <SectionHeading 
            badge="Neural Architecture"
            title="The AI Brain"
            subtitle="Three distinct layers of intelligence working synchronously to map your biological state."
            lightMode
          />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
            <IntelligenceCard 
              icon={Eye}
              color="#10B981"
              title="Vision Intelligence"
              tags={["CV", "Biometrics"]}
              description="Studies subtle biological patterns invisible to the human eye using advanced Computer Vision."
              features={[
                "Face Glow Analysis",
                "Tongue Texture Mapping",
                "Skin Integrity Scan",
                "Vedic Landmark Detection"
              ]}
              lightMode
            />
            <IntelligenceCard 
              icon={Brain}
              color="#3B82F6"
              title="Ayurvedic Engine"
              tags={["NLP", "Expert Systems"]}
              description="Simulates advanced Ayurvedic reasoning using Dosha, Agni, Guna, and symptom intelligence."
              features={[
                "Symptom-to-Dosha Logic",
                "Deep Gut Health Mapping",
                "Root Cause Extrapolation",
                "Future Risk Prediction"
              ]}
              lightMode
            />
            <IntelligenceCard 
              icon={Activity}
              color="#A855F7"
              title="Emotional IQ"
              tags={["Affective Computing"]}
              description="Understands the mental-emotional layer of your health to provide a truly holistic recovery path."
              features={[
                "Mood Sentiment Analysis",
                "Stress Pattern Decoding",
                "Guna Balance Matrix",
                "Psycho-Somatic Insights"
              ]}
              lightMode
            />
          </div>

          {/* Visual Visualization Block */}
          <div className="max-w-6xl mx-auto h-[700px] border border-gray-100 rounded-[4rem] relative overflow-hidden bg-white/50 group shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.05)_0%,_transparent_70%)]" />
            
            {/* Logic Logs Terminal (Top Left) */}
            <div className="absolute top-12 left-12 z-20 w-80 h-56 backdrop-blur-3xl bg-white/60 border border-white rounded-3xl p-6 shadow-xl overflow-hidden">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logic Engine Feed</span>
                  </div>
                  <span className="text-[8px] font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">STABLE</span>
               </div>
               <div className="space-y-2 h-full overflow-hidden">
                  <RealTimeLogs />
               </div>
            </div>

            {/* 3D Bio-Avatar Container (Center) */}
            <div className="absolute inset-0 flex items-center justify-center">
               <BioAvatar />
            </div>

            {/* Tech Stats (Top Right) */}
            <div className="absolute top-12 right-12 z-20 space-y-3">
               {[
                 { l: "Neural Load", v: "42.8%", c: "text-emerald-500", b: "bg-emerald-50" },
                 { l: "Vedic Sync", v: "99.2%", c: "text-blue-500", b: "bg-blue-50" },
                 { l: "Processing", v: "1.2ms", c: "text-purple-500", b: "bg-purple-50" }
               ].map((stat, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="px-5 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between w-48 group/stat hover:border-emerald-200 transition-all"
                 >
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover/stat:text-black transition-colors">{stat.l}</span>
                    <div className={`px-2 py-1 rounded-lg ${stat.b} ${stat.c} text-[10px] font-black`}>
                       {stat.v}
                    </div>
                 </motion.div>
               ))}
            </div>
            
            <div className="absolute bottom-12 left-12 right-12 z-20 flex justify-between items-end">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Biological Stream</span>
                </div>
                <div className="flex gap-1.5 h-16 items-end">
                  {[...Array(16)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ height: [`${20 + Math.random() * 80}%`, `${10 + Math.random() * 50}%`, `${20 + Math.random() * 80}%`] }} 
                      transition={{ repeat: Infinity, duration: Math.random() * 1 + 1, ease: "easeInOut" }}
                      className="w-1.5 bg-emerald-500/20 rounded-full" 
                    />
                  ))}
                </div>
              </div>
              <div className="p-10 backdrop-blur-3xl bg-white/80 border border-white rounded-[2.5rem] max-w-sm shadow-2xl hover:scale-105 transition-transform duration-500 relative group/card overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover/card:scale-110 transition-transform">
                           <Database className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protocol Sync</p>
                           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Charaka Samhita Dataset v4.2</p>
                        </div>
                     </div>
                     <p className="text-base font-bold text-gray-800 leading-relaxed italic">
                       "Every scan correlates 400+ bio-markers with 25,000+ classical Ayurvedic protocols."
                     </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Secure Digital Biological Identity */}
      <section className="py-40 px-6 bg-stone-950/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
              <Lock className="w-4 h-4" />
              Privacy Protocol
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">
              Your Digital <br/>
              <span className="text-blue-500 italic">Bio-Identity</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/50 font-medium leading-relaxed">
              Your wellness journey evolves intelligently with every interaction, stored in a secure, encrypted biological blueprint.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Shield, t: "End-to-End Encryption", d: "Your clinical data is strictly your own." },
                { icon: Database, t: "Wellness Memory", d: "The AI remembers your recovery patterns." },
                { icon: Layers, t: "Cross-Device Sync", d: "Unified health data across all endpoints." },
                { icon: Smartphone, t: "Biometric Portal", d: "Instant access via secured biological keys." }
              ].map((item, i) => (
                <div key={i} className="space-y-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                  <item.icon className="w-8 h-8 text-blue-500" />
                  <h4 className="text-lg font-black text-white uppercase">{item.t}</h4>
                  <p className="text-sm font-bold text-white/40">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative aspect-square">
             <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[120px]" />
             <motion.div 
              style={{ rotate: 10 }}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="absolute inset-0 border border-white/10 rounded-[4rem] bg-stone-900 shadow-2xl p-8 overflow-hidden"
             >
                <div className="h-full flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">Ayurzenix ID</span>
                         <h4 className="text-2xl font-black text-white tracking-widest">AZ-99812-X</h4>
                      </div>
                      <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-blue-500">
                         <Shield className="w-6 h-6" />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "75%" }}
                          className="h-full bg-blue-500" 
                         />
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                         <span>Data Hardening</span>
                         <span className="text-blue-500">75.4%</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                      ))}
                   </div>

                   <p className="text-xs font-bold text-white/30 italic">
                      "Biometric signature verified with 0.001ms latency."
                   </p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Fintech Wellness Engine */}
      <section className="py-40 px-6 overflow-hidden bg-white text-black relative">
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[120px] -mr-40 -mt-40 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-50 rounded-full blur-[100px] -ml-20 -mb-20" />
         </div>
         
         <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
            <div className="text-center mb-20 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Wellness Wallet
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-7xl font-black text-black leading-none tracking-[ -0.05em]"
              >
                Seamless Utility
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium"
              >
                Unlock premium reports and expert insights with a frictionless, high-speed economic engine.
              </motion.p>
            </div>
            
            <div className="relative h-[400px] flex items-center justify-center">
               <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[400px] h-[400px] rounded-full border border-emerald-200 border-dashed opacity-50" 
               />
               <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="relative z-20 w-[320px] p-10 bg-white border border-gray-100 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] space-y-10"
               >
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Premium Balance</span>
                     <Zap className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-6xl font-black text-black tracking-tighter">
                     ₹5,240
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                        <span>Daily Limits</span>
                        <span>∞</span>
                     </div>
                     <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-emerald-500" />
                     </div>
                  </div>
                  <button className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                     Quick Add Credits
                  </button>
               </motion.div>
            </div>

            <p className="text-lg font-medium text-gray-400 max-w-xl mx-auto">
               Instantly unlock Deep Diagnostic Reports, Future Health Scans, and AI-Powered Lifestyle Hacks without any interruption.
            </p>
         </div>
      </section>

      {/* 5. Fluid Experience Engine */}
      <section className="py-40 px-6 bg-white text-black relative">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[150px]" />
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1">
                <div className="relative aspect-[9/16] max-w-[320px] mx-auto border-[12px] border-white rounded-[3rem] shadow-2xl bg-gray-50 overflow-hidden group border-white">
                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-transparent to-blue-100 opacity-30" />
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-white rounded-full shadow-inner" />
                   
                   <div className="p-8 pt-16 space-y-8">
                      <div className="w-20 h-2 bg-gray-200 rounded-full" />
                      <div className="space-y-4">
                         <div className="w-full h-12 bg-white rounded-2xl border border-gray-100 shadow-sm" />
                         <div className="w-full h-12 bg-white rounded-2xl border border-gray-100 shadow-sm" />
                         <div className="w-full h-12 bg-white rounded-2xl border border-gray-100 shadow-sm" />
                      </div>
                      <motion.div 
                        animate={{ y: [0, -100, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-40 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center shadow-inner"
                      >
                         <Activity className="w-12 h-12 text-emerald-500/20" />
                      </motion.div>
                   </div>
                </div>
             </div>
             
             <div className="order-1 lg:order-2 space-y-12 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                   Human-Centric Motion
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-black leading-tight tracking-[ -0.05em] uppercase">
                  Designed <br/>
                  To Feel <br/>
                  <span className="text-emerald-500 italic">Alive</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Every movement inside Ayurzenix is crafted to feel calm, fluid, and emotionally intelligent. Experience a wellness OS that breathes with you.
                </p>
                <ul className="space-y-6">
                   {[
                     "60fps Fluid Interaction",
                     "Stochastic Response Engine",
                     "Context-Aware UI Adaptation",
                     "Emotion-Reactive Transitions"
                   ].map((t, i) => (
                     <li key={i} className="flex items-center gap-4 text-lg font-bold text-gray-600 justify-center lg:justify-start">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                        {t}
                     </li>
                   ))}
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Ayurvedic Knowledge Engine */}
      <section className="py-20 px-6">
         <div className="max-w-7xl mx-auto bg-stone-950/50 border border-white/5 rounded-[4rem] p-12 md:p-24 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <h2 className="text-5xl md:text-[6rem] font-black leading-[0.9] tracking-tighter uppercase">
                     A Living <br/>
                     <span className="text-emerald-500">Library</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed">
                     The library is not static; it is an evolving intelligence that continuously parses thousands of clinical cases and Samhita verses.
                  </p>
                  <div className="flex gap-4">
                     <button className="px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs">Explore Blogs</button>
                     <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs">Vedic Trends</button>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  {[
                    "Dosha Logic", "Agni Tech", "Herb Mapping", "Season Sync"
                  ].map((card, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="aspect-square p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col justify-between"
                    >
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Globe className="w-5 h-5" />
                       </div>
                       <span className="text-sm font-black uppercase tracking-widest">{card}</span>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 7. Final Future CTA */}
      <section className="py-60 px-6 text-center space-y-16">
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-[0.3em]">
             Not a wellness app
          </div>
          <h2 className="text-6xl md:text-[10rem] font-black leading-[0.8] tracking-[-0.05em] uppercase">
            The <br/>
            <span className="text-emerald-500 italic">Operating</span> <br/>
            System.
          </h2>
          <p className="text-2xl md:text-3xl text-white/50 max-w-2xl mx-auto font-medium">
             It is time to upgrade your biological hardware with the power of AI-powered Ayurveda.
          </p>
          <div className="pt-12">
            <button 
              onClick={() => navigate('/auth')}
              className="group relative px-20 py-8 rounded-full bg-emerald-500 text-black font-black text-xl md:text-2xl uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-6 mx-auto"
            >
              Start Personalized Analysis 
              <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform duration-500" />
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

const CheckCircle = ({ className, ...props }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className} 
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
