import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, Wallet, ShieldCheck, Zap, Sparkles, Crown, Check, Lock, Info, ArrowRight } from 'lucide-react';
import { getFeaturePricing } from '../lib/pricing';
import { cn } from '../lib/utils';

// Reuse modular components where possible or create Paywall specific variants
import UpgradeComparisonTable from '../components/pricing/UpgradeComparisonTable';
import FAQSection from '../components/pricing/FAQSection';
import TrustSection from '../components/pricing/TrustSection';
import StickyCTA from '../components/pricing/StickyCTA';

interface PaywallScreenProps {
  userData: any;
}

export default function PaywallScreen({ userData }: PaywallScreenProps) {
  const { featureId } = useParams<{ featureId: string }>();
  const navigate = useNavigate();
  const pricing = getFeaturePricing(featureId || '');
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsStickyVisible(true);
      } else {
        setIsStickyVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectPlan = (planId: string) => {
    if (!userData || userData.is_guest || userData.uid === 'guest') {
      navigate('/auth', { state: { from: `/paywall/${featureId}`, planId, featureId } });
      return;
    }
    navigate('/wallet', { state: { planId, featureId } });
  };

  return (
    <div className="min-h-screen bg-ayur-bg relative pb-40">
       <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-ayur-purple z-[110] origin-left"
        style={{ scaleX }}
      />

      <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 bg-white/40 backdrop-blur-3xl border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <button 
             onClick={() => navigate(-1)}
             className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center text-black active:scale-90 transition-transform"
           >
              <ArrowLeft className="w-5 h-5" />
           </button>
           
           <div className="text-center">
              <h1 className="text-xs font-black text-black uppercase tracking-tightest leading-none mb-1">Intelligence Unlock</h1>
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none">Feature: {featureId?.replace('-', ' ')}</p>
           </div>

           <button 
             onClick={() => navigate('/wallet')}
             className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-ayur-teal shadow-premium"
           >
              <Wallet className="w-4 h-4" />
           </button>
        </div>
      </header>

      {/* Hero / Feature Context */}
      <section className="pt-32 pb-16 px-6 text-center space-y-6">
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-ayur-purple/10 rounded-[2rem] flex items-center justify-center text-ayur-purple mx-auto shadow-glass"
         >
            <Sparkles className="w-10 h-10" />
         </motion.div>
         <div className="space-y-2">
            <h2 className="text-4xl font-black text-black uppercase tracking-tightest">Unlock Full <br/> Analysis</h2>
            <p className="text-base font-bold text-gray-500 italic max-w-sm mx-auto leading-relaxed">
              Experience the deep biological decoder for {featureId?.replace('-', ' ')}. Choose your depth of intelligence.
            </p>
         </div>
      </section>

      {/* Plan Selection Grid */}
      <section className="px-6 py-12 max-w-5xl mx-auto space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.plans.map((plan, i) => (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "relative p-8 rounded-[3rem] border-2 text-left transition-all duration-500 overflow-hidden",
                  selectedPlanId === plan.id 
                    ? "bg-white border-ayur-purple shadow-[0_40px_80px_-20px_rgba(162,89,255,0.15)] ring-4 ring-ayur-purple/5" 
                    : "bg-white/40 border-black/5 hover:border-black/10"
                )}
              >
                 {plan.badge && (
                    <div className="absolute top-0 right-0 p-1 px-4 bg-ayur-purple rounded-bl-2xl">
                       <span className="text-[8px] font-black text-white uppercase tracking-widest">{plan.badge}</span>
                    </div>
                 )}

                 <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-start">
                       <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                          selectedPlanId === plan.id ? "bg-ayur-purple text-white shadow-glow-purple" : "bg-stone-50 text-gray-400"
                       )}>
                          {plan.id === 'premium' ? <Crown className="w-6 h-6" /> : plan.id === 'pro' ? <Zap className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-black tracking-tightest leading-none">₹{plan.price}</p>
                          <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Single Use</p>
                       </div>
                    </div>

                    <div className="space-y-1">
                       <h3 className="text-lg font-black text-black uppercase tracking-tight">{plan.name}</h3>
                       <p className="text-[10px] font-bold text-gray-500 italic line-clamp-2">{plan.description}</p>
                    </div>

                    <div className="space-y-3">
                       {plan.benefits?.slice(0, 3).map((benefit, j) => (
                         <div key={j} className="flex items-center gap-3">
                            <Check className={cn("w-3 h-3 shrink-0", selectedPlanId === plan.id ? "text-ayur-teal" : "text-gray-300")} />
                            <span className="text-[10px] font-bold text-gray-600 line-clamp-1">{benefit}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </motion.button>
            ))}
         </div>

         {/* Plan Specific Action Button */}
         <div className="pt-6">
            <motion.button 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPlan(selectedPlanId)}
              className="w-full bg-black text-white py-7 rounded-[2.5rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] flex items-center justify-between px-10 group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-ayur-teal">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                     <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] leading-none mb-1">Secure Unlock</p>
                     <p className="text-lg font-black text-white uppercase tracking-tightest leading-none">Unlock {selectedPlanId} Intelligence</p>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <span className="text-2xl font-black text-white">₹{getFeaturePricing(featureId || '').plans.find(p => p.id === selectedPlanId)?.price || 0}</span>
                  <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center group-hover:translate-x-1 transition-transform">
                     <ArrowRight className="w-6 h-6" />
                  </div>
               </div>
            </motion.button>
         </div>
      </section>

      {/* Comparison Helper */}
      <UpgradeComparisonTable />

      {/* FAQ & Trust */}
      <FAQSection />
      <TrustSection />

      {/* Sticky CTA - Dynamic based on selection */}
      <StickyCTA 
        isVisible={isStickyVisible} 
        activeTier={selectedPlanId} 
        onCtaClick={() => handleSelectPlan(selectedPlanId)} 
      />
    </div>
  );
}
