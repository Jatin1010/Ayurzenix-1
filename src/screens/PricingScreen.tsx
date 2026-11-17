import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';

// Modular Components
import PricingHero from '../components/pricing/PricingHero';
import ReportPlanCards from '../components/pricing/ReportPlanCards';
import UpgradeComparisonTable from '../components/pricing/UpgradeComparisonTable';
import FAQSection from '../components/pricing/FAQSection';
import TrustSection from '../components/pricing/TrustSection';
import StickyCTA from '../components/pricing/StickyCTA';

interface PricingScreenProps {
  userData: any;
  appConfig?: any;
}

export default function PricingScreen({ userData, appConfig }: PricingScreenProps) {
  const navigate = useNavigate();
  const [activeTier, setActiveTier] = useState('premium');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsStickyVisible(true);
      } else {
        setIsStickyVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectReportPlan = (planId: string) => {
    if (!userData || userData.is_guest || userData.uid === 'guest') {
      navigate('/auth', { state: { from: '/pricing', planId } });
      return;
    }
    // Logic to handle plan selection - redirect to wallet for now
    navigate('/wallet', { state: { planId } });
  };

  const handleRecharge = (amount: number) => {
    navigate('/wallet', { state: { addAmount: amount.toString() } });
  };

  return (
    <div className="min-h-screen bg-ayur-bg relative pb-40">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-ayur-purple z-[110] origin-left"
        style={{ scaleX }}
      />

      {/* Luxury Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 transition-all bg-white/40 backdrop-blur-3xl border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center text-black active:scale-90 transition-transform"
              >
                 <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                 <h1 className="text-sm font-black text-black uppercase tracking-tightest">Ayurzenix Elite</h1>
                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Protocol 3.0 Transparency</p>
              </div>
           </div>

           <button 
             onClick={() => navigate('/wallet')}
             className="px-6 py-2.5 bg-black rounded-xl flex items-center gap-3 shadow-premium active:scale-95 transition-all group"
           >
              <Wallet className="w-4 h-4 text-ayur-teal group-hover:rotate-12 transition-transform" />
              <div className="text-left">
                 <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Vault</p>
                 <p className="text-xs font-black text-white leading-none">₹{userData?.wallet_balance || 0}</p>
              </div>
           </button>
        </div>
      </header>

      {/* Main Content Sections */}
      <div className="space-y-0">
        <PricingHero onCtaClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} />
        
        <ReportPlanCards onSelect={handleSelectReportPlan} />
        
        <UpgradeComparisonTable />
        
        <FAQSection />
        
        <TrustSection />
      </div>

      {/* Sticky Bottom CTA */}
      <StickyCTA 
        isVisible={isStickyVisible} 
        activeTier={isStickyVisible ? 'premium' : 'basic'} 
        onCtaClick={() => navigate('/wallet')} 
      />
    </div>
  );
}
