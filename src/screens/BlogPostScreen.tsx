import { useParams, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../lib/blogService';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Zap, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  ChevronDown,
  ArrowRight,
  Play,
  Share2,
  Bookmark,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { AdUnit } from '../components/AdUnit';
import { SEO } from '../components/SEO';
import { useState, useMemo } from 'react';
import { cn } from '../lib/utils';
import ProductCard from '../components/ProductCard';

export default function BlogPostScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.id === id);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const sections = useMemo(() => {
    if (!post) return null;
    
    const parts = post.content.split(/\n##\s/);
    const parsed: Record<string, string> = {
      title: post.title,
      intro: post.excerpt
    };
    
    parts.forEach(part => {
      const lines = part.split('\n');
      const header = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      
      if (header.includes('🟢 Introduction')) parsed.intro = content;
      else if (header.includes('📋')) parsed.symptoms = content;
      else if (header.includes('⚖️')) parsed.comparison = content;
      else if (header.includes('📊 Sample')) parsed.report = content;
      else if (header.includes('🟡 How to Use')) parsed.howTo = content;
      else if (header.includes('🔵 Benefits You Get')) parsed.benefits = content;
      else if (header.includes('🌿 Benefits of Ayurveda')) parsed.ayurveda = content;
      else if (header.includes('🔥 Why This Feature is Unique')) parsed.unique = content;
      else if (header.includes('📊 Quick Tips')) parsed.tips = content;
      else if (header.includes('❓ FAQs')) parsed.faqs = content;
      else if (header.includes('🟣 Conclusion')) parsed.conclusion = content;
      else if (header.startsWith('# ')) parsed.title = header.replace('# ', '');
      else if (header.length > 0) parsed[header] = content;
    });

    return parsed;
  }, [post]);

  // Recommendations based on category
  const recommendations = useMemo(() => {
    return BLOG_POSTS
      .filter(p => p.category === post?.category && p.id !== post?.id)
      .slice(0, 3);
  }, [post]);

  if (!post || !sections) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-gray-50">
        <div className="space-y-4">
          <p className="text-gray-500 font-bold">Article not found.</p>
          <button onClick={() => navigate('/blog')} className="text-emerald-600 font-black uppercase tracking-widest text-xs flex items-center gap-2 mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const parseList = (text?: string) => {
    if (!text) return [];
    return text.split('\n')
      .map(line => line.replace(/^[-*]\s|\d+\.\s/, '').trim())
      .filter(line => line.length > 0);
  };

  const parseFaqs = (text?: string) => {
    if (!text) return [];
    const qaPairs: { q: string, a: string }[] = [];
    const lines = text.split('\n');
    let currentQ = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('**Q:') || trimmed.startsWith('Q:')) {
        currentQ = trimmed.replace(/^\*\*Q:|\*\*|Q:/g, '').trim();
      } else if (trimmed.startsWith('**A:') || trimmed.startsWith('A:')) {
        if (currentQ) {
          qaPairs.push({ 
            q: currentQ, 
            a: trimmed.replace(/^\*\*A:|\*\*|A:/g, '').trim() 
          });
          currentQ = '';
        }
      }
    });
    return qaPairs;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40 selection:bg-black selection:text-white font-sans">
      <SEO 
        title={post.title}
        description={post.excerpt}
        image={post.imageUrl}
      />

      {/* Sticky Top Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-8 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate('/blog')} 
          className="w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center text-black border border-gray-100 pointer-events-auto active:scale-90 transition-all"
        >
          <ArrowLeft className="w-6 h-6 outline-none" strokeWidth={3} />
        </button>
      </div>

      {/* 1. Hero Section - Magazine Style */}
      <section className="relative h-[95vh] overflow-hidden flex items-end">
        <motion.img 
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "linear" }}
          src={post.imageUrl} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/30 to-transparent" />
        
        <div className="relative z-10 w-full px-6 pb-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-xl text-emerald-600 shadow-2xl border border-white/50">
                <Sparkles className="w-5 h-5 fill-current" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">{post.category}</span>
              </div>
              <div className="flex gap-4">
                 <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <Share2 className="w-6 h-6" />
                 </button>
                 <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={cn("w-14 h-14 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all", 
                  isBookmarked ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/10 text-white hover:bg-white hover:text-black")}
                 >
                    <Bookmark className={cn("w-6 h-6", isBookmarked && "fill-current")} />
                 </button>
              </div>
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-black leading-[0.85] uppercase">
              {post.title.split(':').map((part, i) => (
                <span key={i} className={i === 1 ? "text-emerald-600 block mt-4" : ""}>{part} </span>
              ))}
            </h1>

            <div className="flex flex-wrap items-center gap-8 pt-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                 <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-emerald-500 shadow-3xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current" />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Listen to Summary</p>
                    <p className="text-sm font-black text-black">Vedic Pulse Audio • 2:45</p>
                 </div>
              </div>

              <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-8 border-l border-gray-200">
                <div className="flex items-center gap-2 text-black">
                  <User className="w-4 h-4" /> {post.author}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {post.readTime}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20 space-y-24">
        
        {/* 2. Introduction Card */}
        {sections.intro && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3.5rem] p-12 shadow-3xl border border-gray-100 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 blur-[100px] rounded-full pointer-events-none transition-transform group-hover:scale-125" />
            <div className="relative space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Activity className="w-7 h-7" />
                </div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Deep Insights</h2>
              </div>
              <div className="prose prose-2xl max-w-none">
                <div className="text-2xl text-black leading-relaxed font-black">
                  <ReactMarkdown>
                    {sections.intro}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2.1 Symptom Checker Card */}
        {sections.symptoms && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-rose-50 relative overflow-hidden"
          >
             <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-black">Symptom Checker</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {parseList(sections.symptoms).map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-1">
                        <ArrowRight className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <p className="text-gray-900 font-bold leading-tight">{item}</p>
                    </div>
                  ))}
                </div>
             </div>
          </motion.div>
        )}

        {/* 3. Problem vs. Solution Grid */}
        {sections.comparison && (
          <div className="space-y-12">
            <div className="text-center">
              <h3 className="text-4xl font-black uppercase tracking-tighter text-black">Modern Chaos <span className="text-emerald-600 text-3xl">vs</span> Ancient Flow</h3>
            </div>
            <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl">
               <div className="prose prose-xl max-w-none p-12 overflow-x-auto">
                 <ReactMarkdown 
                   components={{
                     table: ({children}) => <table className="w-full border-collapse">{children}</table>,
                     thead: ({children}) => <thead className="bg-gray-50 border-b-2 border-gray-100">{children}</thead>,
                     tbody: ({children}) => <tbody>{children}</tbody>,
                     tr: ({children}) => <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">{children}</tr>,
                     th: ({children}) => <th className="px-6 py-8 text-left text-sm font-black uppercase tracking-widest text-gray-500">{children}</th>,
                     td: ({children}) => <td className="px-6 py-8 text-lg font-bold text-gray-900">{children}</td>,
                   }}
                 >
                   {sections.comparison}
                 </ReactMarkdown>
               </div>
            </div>
          </div>
        )}

        {/* 4. Deep Content Rendering */}
        <div className="space-y-20">
          {Object.entries(sections).map(([key, value]) => {
            if (['intro', 'howTo', 'benefits', 'ayurveda', 'unique', 'tips', 'faqs', 'conclusion', 'title', 'symptoms', 'comparison', 'report'].includes(key)) return null;
            return (
              <div key={key} className="space-y-8">
                <div className="inline-flex items-center gap-4">
                  <div className="w-px h-10 bg-emerald-500" />
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase leading-none">{key}</h2>
                </div>
                <div className="prose prose-xl max-w-none text-gray-800 font-bold leading-relaxed bg-white p-12 rounded-[3rem] border border-gray-50 shadow-sm">
                  <ReactMarkdown 
                    components={{
                       h1: ({children}) => <h1 id={children as string} className="text-4xl font-black text-black uppercase tracking-tighter mb-8">{children}</h1>,
                       h2: ({children}) => <h2 id={children as string} className="text-3xl font-black text-black uppercase tracking-tighter mb-6">{children}</h2>,
                       h3: ({children}) => <h3 id={children as string} className="text-2xl font-black text-black uppercase tracking-tighter mb-4">{children}</h3>,
                       p: ({children}) => <p className="mb-6">{children}</p>,
                       ul: ({children}) => <ul className="list-none space-y-4 mb-8">{children}</ul>,
                       li: ({children}) => (
                         <li className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                            <span>{children}</span>
                         </li>
                       )
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4.1 Sample Report Preview */}
        {sections.report && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl"
          >
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full" />
             <div className="relative space-y-12">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[2rem] bg-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-600/40">
                    <Activity className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">AI Insight <span className="text-emerald-500">Report</span></h3>
                    <p className="text-emerald-500/50 font-black uppercase tracking-widest text-[10px] mt-2">Personalized Biological Analysis Preview</p>
                 </div>
               </div>
               
               <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-8">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                           <svg className="w-full h-full -rotate-90">
                              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="50.2" className="text-emerald-500" />
                           </svg>
                           <span className="absolute text-xl font-black">80%</span>
                        </div>
                        <div>
                           <p className="text-sm font-black text-white/50 uppercase tracking-widest leading-none mb-1">Vitality Score</p>
                           <p className="text-xl font-black uppercase">Optimizing</p>
                        </div>
                     </div>
                     <div className="prose prose-invert prose-xl font-bold leading-relaxed opacity-80">
                        <ReactMarkdown>{sections.report}</ReactMarkdown>
                     </div>
                  </div>
                  <div className="bg-emerald-500/10 rounded-[3rem] p-12 border border-emerald-500/20 flex flex-col justify-center gap-8">
                     <div className="space-y-2">
                        <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">AI Verdict</p>
                        <p className="text-3xl font-black leading-tight italic uppercase tracking-tighter">"Your system is clearing Ama effectively. Keep the Agni high."</p>
                     </div>
                     <button className="w-full h-20 rounded-3xl bg-emerald-600 text-white font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-colors shadow-xl shadow-emerald-600/20">
                        Unlock Full Analysis
                     </button>
                  </div>
               </div>
             </div>
          </motion.div>
        )}

        {/* 5. How to Use Section */}
        {sections.howTo && (
          <div className="space-y-12">
            <div className="space-y-2">
              <h3 className="text-5xl font-black tracking-tighter text-black uppercase">Action <span className="text-emerald-500">Protocol</span></h3>
              <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">Follow these AI-guided steps for maximum result</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {parseList(sections.howTo).map((step, i) => (
                <div key={i} className="group p-10 rounded-[3rem] bg-white border border-gray-100 shadow-xl hover:border-emerald-500 transition-all flex gap-8 items-start">
                  <div className="text-6xl font-black text-gray-100 group-hover:text-emerald-500/20 transition-colors">
                    0{i + 1}
                  </div>
                  <p className="text-xl text-black font-black leading-tight pt-4 tracking-tight">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Why Unique Feature Section */}
        {sections.unique && (
          <div className="bg-emerald-950 rounded-[4rem] p-16 text-white relative overflow-hidden group border border-emerald-500/20 shadow-3xl">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full" />
             <div className="relative space-y-12">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                      <Zap className="w-6 h-6 fill-current" />
                   </div>
                   <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">The <span className="text-emerald-500 italic">Zenith</span> Edge</h3>
                </div>
                <div className="prose prose-invert prose-2xl text-emerald-100 font-bold leading-relaxed max-w-4xl">
                   <ReactMarkdown>{sections.unique}</ReactMarkdown>
                </div>
             </div>
          </div>
        )}

        {/* 7. Quick Tips Section */}
        {sections.tips && (
          <div className="space-y-12">
            <h3 className="text-4xl font-black tracking-tighter text-black uppercase">
              Vedic <span className="text-amber-500">Bio-Hacks</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-8">
              {parseList(sections.tips).map((tip, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl flex items-start gap-8 hover:shadow-3xl transition-all"
                >
                  <div className="w-16 h-16 rounded-[2rem] bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="text-lg text-black font-black leading-relaxed pt-2 tracking-tight">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 8. FAQs Section */}
        {sections.faqs && (
          <div className="space-y-16">
            <div className="text-center space-y-4">
              <h3 className="text-5xl font-black tracking-tighter text-black uppercase">Deep <span className="text-emerald-600">Clarification</span></h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Answering your most critical health doubts</p>
            </div>
            <div className="space-y-6">
              {parseFaqs(sections.faqs).map((faq, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "rounded-[3rem] border overflow-hidden transition-all duration-500",
                    activeFaq === idx ? "bg-white shadow-3xl border-emerald-500" : "bg-white border-gray-100"
                  )}
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-10 text-left flex items-center justify-between gap-8 group"
                  >
                    <div className="flex items-center gap-8">
                       <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center text-xl font-black transition-all", activeFaq === idx ? "bg-emerald-600 text-white shadow-xl" : "bg-gray-50 text-gray-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 shadow-sm")}>
                          0{idx + 1}
                       </div>
                       <span className="font-black text-black text-2xl tracking-tight leading-tight">{faq.q}</span>
                    </div>
                    <ChevronDown className={cn("w-8 h-8 shrink-0 transition-all text-gray-300 group-hover:text-emerald-600", activeFaq === idx ? "rotate-180 text-emerald-600" : "")} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-10 pb-10"
                      >
                        <p className="text-xl text-gray-600 font-bold leading-relaxed border-t border-gray-50 pt-10">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Conclusion */}
        {sections.conclusion && (
          <div className="text-center space-y-12 py-24 border-t border-gray-100">
             <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full" />
             <div className="prose prose-2xl max-w-4xl mx-auto">
                <div className="font-black text-black uppercase tracking-tight italic leading-tight">
                  <ReactMarkdown>
                    {sections.conclusion}
                  </ReactMarkdown>
                </div>
             </div>
             
             <AdUnit className="mt-12" />
          </div>
        )}

        {/* 10. Recommended Products - Affiliate Integration */}
        <section className="space-y-12 pt-12 border-t border-gray-100">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <h3 className="text-5xl font-black tracking-tighter text-black uppercase">Pure <span className="text-emerald-600">Herbal</span> Solutions</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Scientifically verified Ayurvedic supplements for {post.category}</p>
              </div>
              <button className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] group">
                View Full Apothecary <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProductCard 
                title="Suddha Shilajit Resin" 
                price="₹1,249" 
                image="https://images.unsplash.com/photo-1611073100862-234208006e89?q=80&w=600&auto=format&fit=crop" 
                rating={5}
              />
              <ProductCard 
                title="Ashwagandha KSM-66" 
                price="₹899" 
                image="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=600&auto=format&fit=crop" 
                rating={4}
              />
              <ProductCard 
                title="Triphala Digestive Reset" 
                price="₹499" 
                image="https://images.unsplash.com/photo-1628131338278-56ec178e3e4a?q=80&w=600&auto=format&fit=crop" 
                rating={5}
              />
           </div>
        </section>

        {/* 11. Community Trust & Experts */}
        <section className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8">
              <ShieldCheck className="w-20 h-20 text-emerald-50/50" />
           </div>
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                 <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-14 h-14 rounded-full border-4 border-white bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
                      +12k
                    </div>
                 </div>
                 <h4 className="text-3xl font-black text-black uppercase tracking-tight">Join 12,000+ others healing through AI-Ayurveda.</h4>
                 <div className="flex gap-4">
                    <button className="px-8 py-4 bg-black text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Join Community</button>
                    <button className="px-8 py-4 border-2 border-gray-100 rounded-3xl font-black uppercase text-[10px] tracking-widest">Read Stories</button>
                 </div>
              </div>
              <div className="p-8 bg-emerald-50 rounded-[3rem] border border-emerald-100 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
                       <MessageCircle className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-black text-black uppercase tracking-widest">Ayurzenix Expert Verdict</p>
                 </div>
                 <p className="text-sm text-gray-600 font-bold leading-relaxed italic">
                    "We have seen a 40% increase in success rates when users combine this protocol with our Smart Health Scan every 15 days."
                 </p>
              </div>
           </div>
        </section>

        {/* 12. Related Articles */}
        {recommendations.length > 0 && (
          <section className="space-y-12 pb-24">
             <h3 className="text-4xl font-black tracking-tighter text-black uppercase">Deepen Your <span className="text-stone-400">Knowledge</span></h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendations.map((p) => (
                  <motion.div 
                    key={p.id}
                    whileHover={{ y: -10 }}
                    onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(`/blog/${p.id}`);
                    }}
                    className="group cursor-pointer space-y-6"
                  >
                    <div className="aspect-[4/3] rounded-[3rem] overflow-hidden">
                       <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="space-y-3 px-2">
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{p.category}</p>
                       <h4 className="text-xl font-black text-black leading-tight uppercase group-hover:text-emerald-600 transition-colors">{p.title}</h4>
                    </div>
                  </motion.div>
                ))}
             </div>
          </section>
        )}
      </div>

      {/* 10. Sticky Bottom CTA */}
      <div className="fixed bottom-12 left-6 right-6 z-50 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/health-scan')}
          className="w-full max-w-xl h-24 rounded-[3rem] bg-black text-white font-black text-sm uppercase tracking-[0.4em] flex items-center justify-between px-12 shadow-[0_40px_80px_rgba(0,0,0,0.4)] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-emerald-600/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xl">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xs md:text-sm">Start Your Digital Pulse Scan</span>
          </div>
          <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform relative z-10 text-emerald-500" />
        </motion.button>
      </div>
    </div>
  );
}
