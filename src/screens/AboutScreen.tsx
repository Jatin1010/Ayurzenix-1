import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  ChevronLeft, 
  Leaf, 
  Sparkles, 
  Compass, 
  Target, 
  MessageCircle, 
  Heart, 
  Smile, 
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Activity,
  Users,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';

const COLORS = {
  purple: '#A259FF',
  teal: '#00BFA6',
  coral: '#FF6B6B',
  yellow: '#FFB400',
  azure: '#006BDF',
  midnight: '#040F49',
  forest: '#124622',
  bg: '#F7FCF9',
  primary: '#00BFA6'
};

const SectionHeader = ({ icon: Icon, title, color = COLORS.teal }: { icon: any, title: string, color?: string }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: color }}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-2xl font-black tracking-tighter text-[#000000] uppercase leading-none">{title}</h3>
  </div>
);

const Card = ({ children, className = "", style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] ${className}`}
    style={style}
  >
    {children}
  </motion.div>
);

export default function AboutScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-40" style={{ backgroundColor: COLORS.bg }}>
      <SEO 
        title="About Ayurzenix - Our Mission & Vision" 
        description="Learn about Ayurzenix, our journey, and how we combined ancient Ayurvedic wisdom with modern AI technology."
        url="/about"
      />
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex items-center gap-4 sticky top-0 z-50 transition-all" style={{ backgroundColor: `${COLORS.bg}cc`, backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/50 rounded-full transition-colors border border-transparent active:border-gray-100">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">About Ayurzenix</span>
      </div>

      <div className="px-6 space-y-24">
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-left pt-12 space-y-10 max-w-4xl mx-auto"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-teal-100 shadow-sm">
              <Sparkles className="w-4 h-4" style={{ color: COLORS.yellow }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00BFA6]">India's #1 Digital Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-[#000000] leading-[1.05] tracking-tighter uppercase">
              India’s First <br/>
              Digital <span style={{ color: COLORS.teal }}>Ayurveda</span> <br/>
              Platform Powered by <span style={{ color: COLORS.purple }}>AI</span>
            </h1>
          </div>
          
          <div className="space-y-6 text-[#111827] text-xl font-medium leading-relaxed">
            <p>
              In today’s fast-paced world, health issues like stress, heart problems, hair fall, digestive disorders, and hormonal imbalance are becoming increasingly common. While modern medicine focuses on symptom relief, more people are now seeking root-cause healing and natural solutions.
            </p>
            <p className="pl-6 border-l-4 border-[#00BFA6] italic font-bold text-[#00BFA6]">
              This is where Ayurveda stands out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <div className="space-y-4">
               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">The Problem</h4>
               <ul className="space-y-3">
                  {["Limited accessibility", "Time-consuming consultations", "Lack of personalization at scale"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 font-bold">
                       <ShieldCheck className="w-5 h-5 text-[#FF6B6B]" />
                       {item}
                    </li>
                  ))}
               </ul>
            </div>
            <div className="space-y-4">
               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#00BFA6]">The Ayurzenix Bridge</h4>
               <p className="text-sm text-gray-500 font-medium leading-relaxed">
                 Ayurzenix is India’s AI-powered digital Ayurveda platform that combines ancient Ayurvedic wisdom with modern artificial intelligence to deliver personalized, instant, and data-driven health solutions.
               </p>
            </div>
          </div>
        </motion.div>

        {/* AYURVEDA + AI */}
        <section className="max-w-6xl mx-auto">
           <Card className="bg-white text-gray-900 border border-gray-100 overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#A259FF]/5 blur-[100px] rounded-full" />
              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                     <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-black">
                        Ayurveda + AI = <br/>
                        <span style={{ color: COLORS.teal }}>The Future</span> of Healthcare
                     </h2>
                     <p className="text-[#111827] text-lg leading-relaxed font-semibold">
                        Ayurveda is a 5,000-year-old science that focuses on balancing the body, mind, and lifestyle. Ayurzenix transforms Ayurveda by integrating Smart diagnostic algorithms and Personalized health modeling.
                     </p>
                     <div className="flex flex-wrap gap-4">
                        {["Artificial Intelligence", "Smart diagnostic algorithms", "Personalized health modeling"].map((tag, i) => (
                          <div key={i} className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[10px] font-black uppercase tracking-widest text-[#00BFA6]">
                             {tag}
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-[#A259FF] p-8 rounded-[2rem] space-y-6 text-white">
                     <div className="flex items-center gap-3">
                        <Zap className="w-6 h-6 text-white" />
                        <span className="font-black uppercase tracking-widest text-white">The Result</span>
                     </div>
                     <p className="text-3xl font-black tracking-tighter uppercase text-white">Fast, scalable, and highly personalized Ayurveda</p>
                  </div>
              </div>
           </Card>
        </section>

        {/* AI HEALTH ANALYSIS */}
        <section className="max-w-4xl mx-auto space-y-12">
          <SectionHeader icon={Activity} title="AI-Based Ayurvedic Health Analysis" color={COLORS.purple} />
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="space-y-6">
               <h4 className="text-xl font-black uppercase tracking-tight text-[#000000]">How It Works</h4>
               <div className="space-y-4">
                  {[
                    "Analyzes body patterns",
                    "Identifies Dosha imbalance",
                    "Detects potential health risks",
                    "Suggests preliminary remedies"
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                       <span className="text-[#A259FF] font-black">0{i+1}</span>
                       <p className="text-gray-600 font-bold">{item}</p>
                    </div>
                  ))}
               </div>
            </Card>
            <Card className="bg-white text-gray-900 border border-gray-100 shadow-2xl">
               <h4 className="text-xl font-black uppercase tracking-tight mb-6" style={{ color: COLORS.teal }}>What You Get</h4>
               <div className="space-y-4">
                  {[
                    { label: "Health Score", val: "Quantitative wellness index" },
                    { label: "Risk Level", val: "Low / Moderate / High metrics" },
                    { label: "Root Cause", val: "Deep Ayurvedic perspective" }
                  ].map((item, i) => (
                    <div key={i} className="pb-4 border-b border-gray-50 last:border-0">
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#A259FF] mb-1">{item.label}</p>
                       <p className="text-lg font-black text-black">{item.val}</p>
                    </div>
                  ))}
               </div>
            </Card>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             {["Heart Health", "Hair Fall", "Stress", "Digestion"].map((use, i) => (
               <div key={i} className="p-6 rounded-3xl bg-white border border-gray-100 text-center space-y-2 py-8">
                  <div className="w-10 h-10 rounded-full bg-[#A259FF]/10 mx-auto flex items-center justify-center text-[#A259FF]">
                     <Activity className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-tighter text-gray-900">{use}</p>
               </div>
             ))}
          </div>

          <div className="bg-[#F7FCF9] p-10 rounded-[3rem] border border-[#00BFA6]/20">
             <h4 className="text-2xl font-black tracking-tighter uppercase text-[#00BFA6] mb-6">Why AI is a Game Changer?</h4>
             <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Traditional Diagnosis</p>
                   <p className="text-sm font-bold text-gray-600 leading-relaxed">Requires physical time, appointment booking, and results can depend on specific practitioner availability.</p>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BFA6]">Ayurzenix AI</p>
                   <p className="text-sm font-bold text-gray-900 leading-relaxed">Delivers instant, consistent, and unbiased insights available 24/7 on your device.</p>
                </div>
             </div>
          </div>
        </section>

        {/* PERSONALIZED TREATMENT */}
        <section className="max-w-4xl mx-auto space-y-12">
          <SectionHeader icon={Leaf} title="Personalized Herbal Treatment Plans" color={COLORS.teal} />
          
          <Card className="bg-white text-gray-900 border border-gray-100 p-12 shadow-2xl">
             <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                   <h4 className="text-3xl font-black tracking-tighter uppercase leading-tight text-black">Every individual is <span style={{ color: COLORS.teal }}>Unique</span>.</h4>
                   <p className="text-[#111827] font-semibold leading-relaxed">
                     Ayurzenix embraces this by offering personalized herbal treatment plans, instead of generic advice. 
                   </p>
                   <div className="space-y-4">
                      {["Specific Herbs (Ashwagandha, Triphala)", "Dosha-based diet plan", "Daily routine (Dinacharya)", "Lifestyle corrections"].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 font-black text-sm uppercase tracking-tight">
                           <div className="w-2 h-2 rounded-full bg-[#00BFA6]" />
                           {item}
                        </div>
                      ))}
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#FFB400]">Personalization Logic</p>
                      <p className="text-xs text-gray-600 leading-relaxed font-bold">The system considers Body constitution, Symptoms, Eating habits, Sleep patterns, and Stress levels to generate a fully customized plan.</p>
                   </div>
                   <div className="p-6 rounded-3xl bg-[#00BFA6] text-white shadow-lg">
                       <p className="text-xl font-black uppercase text-white">Root-Cause Healing</p>
                       <p className="text-xs font-black opacity-90 mt-1 uppercase tracking-tighter text-white">Deep, holistic approach tailored to your specific metabolism.</p>
                   </div>
                </div>
             </div>
          </Card>
        </section>

        {/* ONLINE DOSHA ANALYSIS */}
        <section className="max-w-4xl mx-auto space-y-12">
          <SectionHeader icon={Sparkles} title="Online Dosha Analysis Platform" color={COLORS.yellow} />
          
          <div className="grid md:grid-cols-3 gap-6">
             {[
               { name: "Vata", color: COLORS.yellow, desc: "Air & Space elements" },
               { name: "Pitta", color: COLORS.coral, desc: "Fire & Water elements" },
               { name: "Kapha", color: COLORS.teal, desc: "Water & Earth elements" }
             ].map((dosha, i) => (
               <div key={i} className="p-8 rounded-[3rem] bg-white border border-gray-100 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl font-black" style={{ backgroundColor: `${dosha.color}15`, color: dosha.color }}>
                    {dosha.name[0]}
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight text-gray-900">{dosha.name}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{dosha.desc}</p>
               </div>
             ))}
          </div>

          <Card className="space-y-8">
             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                   <h5 className="font-black uppercase tracking-tight text-gray-900">How It Works</h5>
                   <p className="text-sm text-gray-500 leading-relaxed">Users answer simple questions related to body structure, energy levels, and mental tendencies. The AI calculates your Primary and Secondary Dosha instantly.</p>
                </div>
                <div className="space-y-4">
                   <h5 className="font-black uppercase tracking-tight text-[#00BFA6]">Why Dosha Matters?</h5>
                   <p className="text-sm text-gray-500 leading-relaxed">Understanding your Dosha helps you choose the right diet, optimize your lifestyle, and prevent diseases naturally. In Ayurveda, prevention is the most powerful treatment.</p>
                </div>
             </div>
          </Card>
        </section>

        {/* PLATFORM OVERVIEW */}
        <section className="max-w-4xl mx-auto">
           <SectionHeader icon={Zap} title="Platform Features Overview" />
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Health Analyzers", desc: "Heart, Hair, Stress & Gut checkers.", icon: Activity },
                { title: "AI Consultation", desc: "Instant chat-based symptom guidance.", icon: MessageCircle },
                { title: "Dosha Test", desc: "Accurate body type identification.", icon: Sparkles },
                { title: "Herbal Recommendations", desc: "Natural and safe remedy matching.", icon: Leaf },
                { title: "Lifestyle Optimization", desc: "Routine & personalized diet planning.", icon: Target }
              ].map((f, i) => (
                <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 space-y-3">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <f.icon className="w-5 h-5" />
                   </div>
                   <h5 className="font-black text-sm uppercase tracking-tight text-gray-900">{f.title}</h5>
                   <p className="text-xs text-gray-400 font-medium">{f.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* WHO SHOULD USE */}
        <section className="max-w-4xl mx-auto space-y-12">
           <SectionHeader icon={Users} title="Who Should Use Ayurzenix?" color={COLORS.azure} />
           <div className="grid md:grid-cols-2 gap-6">
              {[
                { group: "Working Professionals", focus: "Stress management & energy optimization" },
                { group: "Women", focus: "Hormonal balance & hair health solutions" },
                { group: "Elderly", focus: "Heart care & joint health support" },
                { group: "Students", focus: "Focus improvement & mental clarity" }
              ].map((item, i) => (
                <Card key={i} className="flex gap-6 items-center p-6 rounded-[2.5rem]">
                   <div className="w-14 h-14 rounded-2xl bg-[#006BDF]/10 flex items-center justify-center text-[#006BDF] shrink-0">
                      <Users className="w-6 h-6" />
                   </div>
                   <div>
                      <h5 className="font-black uppercase text-sm tracking-tight text-gray-900">{item.group}</h5>
                      <p className="text-xs text-gray-400 font-bold mt-1">{item.focus}</p>
                   </div>
                </Card>
              ))}
           </div>
        </section>

        {/* FOUNDERS & LEGACY */}
        <section className="max-w-4xl mx-auto space-y-12">
          <SectionHeader icon={Award} title="Founders & Legacy" color={COLORS.yellow} />
          
          <div className="bg-teal-50/50 p-8 rounded-[3rem] border border-teal-100 text-center text-base font-bold text-gray-600 italic leading-relaxed">
            "The Verma family comes from the Sonar (Jewellery) community, where <span className="text-gray-900 font-black">purity, trust, and craftsmanship</span> are deeply rooted values — principles that continue to shape Ayurzenix today."
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Jatin Verma",
                role: "Founder",
                desc: "Visionary entrepreneur focused on building AI-driven wellness solutions. Bringing innovation to scale Ayurveda globally.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
              },
              {
                name: "Pratap Verma",
                role: "Co-Founder",
                desc: "Bringing decades of real-world business wisdom, discipline, and legacy values to ensure Ayurzenix remains grounded in trust.",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
              }
            ].map((f, i) => (
              <Card key={i} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-[#F7FCF9] shadow-xl overflow-hidden mb-6 p-0.5 bg-gradient-to-tr from-[#FFB400] to-[#00BFA6]">
                   <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-black text-3xl uppercase">
                    {f.name[0]}
                   </div>
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-1">{f.name}</h4>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#FFB400] bg-[#FFB400]/10 px-4 py-1.5 rounded-full mb-4">
                  {f.role}
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* MEDICAL EXPERTS */}
        <section className="max-w-4xl mx-auto space-y-12">
          <SectionHeader icon={ShieldCheck} title="Medical Experts & Advisors" color={COLORS.teal} />
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Dr. Abhay Jayprakash Gandhi",
                role: "Ayurvedic Expert",
                desc: "Decades of experience in Ayurvedic research and consultation."
              },
              {
                name: "Dr. Jalpa Abhay Gandhi",
                role: "Ayurvedic Expert",
                desc: "Specialist in Ayurvedic Gynecology (M.S.), leading Panchakarma and fertility care."
              }
            ].map((e, i) => (
              <Card key={i} className="flex flex-col border-l-8 border-[#00BFA6]">
                 <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-teal-100">
                    <ShieldCheck className="w-3 h-3" /> Verified Expert
                 </div>
                <h4 className="text-xl font-black text-gray-900 leading-tight">{e.name}</h4>
                <p className="text-xs text-[#00BFA6] font-black mb-4 uppercase tracking-widest">{e.role}</p>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{e.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* FUTURE VISION */}
        <section className="max-w-4xl mx-auto space-y-12">
           <SectionHeader icon={Globe} title="The Future of Digital Ayurveda" color={COLORS.forest} />
           <div className="space-y-6 text-[#111827] text-lg font-medium leading-relaxed">
              <p>
                India is rapidly adopting digital health solutions. However, Ayurveda is still largely offline. Ayurzenix is leading the transformation by Digitizing Ayurveda and making it scalable globally.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 pt-6">
                 {[
                   "AI-based diagnosis will become standard",
                   "Personalized treatment will dominate",
                   "Preventive health will replace reactive"
                 ].map((text, i) => (
                   <div key={i} className="p-6 rounded-3xl bg-[#124622]/5 border border-[#124622]/10 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#124622]">{text}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Important Disclaimer */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-rose-50 rounded-[2.5rem] p-10 border border-rose-100 space-y-6 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 text-[#FF6B6B]">
            <ShieldCheck className="w-8 h-8" />
            <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Important Disclaimer</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-rose-900 text-xl font-black leading-[1.2] uppercase tracking-tighter">
              Ayurzenix is NOT a medical diagnosis or treatment tool.
            </p>
            <p className="text-rose-700 text-base font-medium leading-relaxed">
              Ayurzenix provides general wellness guidance based on Ayurveda and AI. It is not intended to diagnose, treat, cure, or prevent any disease. Please consult a qualified healthcare professional for medical concerns.
            </p>
          </div>
        </motion.section>

        {/* FINAL CTA */}
        <section className="text-center py-24 px-12 rounded-[3.5rem] text-white relative overflow-hidden bg-white border border-gray-100 shadow-2xl max-w-4xl mx-auto" style={{ color: '#000' }}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00BFA6]/5 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#A259FF]/5 blur-[120px] rounded-full -z-10" />
          
          <div className="space-y-8">
            <Sparkles className="w-16 h-16 mx-auto mb-10 text-[#FFB400]" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[1.1]">
               Experience the <br/>
               <span style={{ color: COLORS.teal }}>Future</span> of <br/>
               <span style={{ color: COLORS.purple }}>Ayurveda</span>
            </h2>
            <p className="text-gray-500 font-bold text-lg max-w-md mx-auto">Analyze your health, discover your Dosha, and get personalized herbal treatment now.</p>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/health-scan')}
              className="px-12 py-6 rounded-[2rem] font-black text-white transition-all shadow-2xl uppercase tracking-[0.2em] text-sm"
              style={{ backgroundColor: COLORS.purple }}
            >
              Launch Platform
            </motion.button>
          </div>
        </section>

        <div className="text-center pt-4 pb-12">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
            Ayurzenix • India's Leading Digital Ayurveda Ecosystem
           </p>
        </div>
      </div>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="fixed bottom-10 left-6 right-6 z-50">
        <motion.button 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/health-scan')}
          className="w-full h-20 rounded-[2.5rem] shadow-[0_20px_40px_rgba(162,89,255,0.3)] flex items-center justify-between px-10 text-white font-black uppercase tracking-widest text-xs border border-white/20"
          style={{ backgroundColor: COLORS.purple }}
        >
          <div className="flex items-center gap-3">
             <Zap className="w-6 h-6 fill-white" />
             <span>Get Started</span>
          </div>
          <ArrowRight className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
