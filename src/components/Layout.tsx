import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Home, Wallet, User, History, MessageSquare, Stethoscope, ShoppingBag, Instagram, Twitter, Linkedin, Facebook, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { BannerAd } from './AdManager';
import MainMenu from './MainMenu';

interface LayoutProps {
  userData: any;
}

export default function Layout({ userData }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomeScreen = location.pathname === '/';
  const isHeartHealth = location.pathname === '/heart-health';
  const isLandingPage = location.pathname.endsWith('-landing');
  const isHeartHealthLanding = (isHeartHealth && location.hash !== '#form') || isLandingPage;
  const isFullScreen = isHomeScreen || isHeartHealth || isLandingPage;
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-ayur-bg flex flex-col w-full relative shadow-2xl overflow-x-hidden selection:bg-ayur-neon selection:text-white">
      {!isHomeScreen && (
        <header className={cn(
          "border-b border-black/5 z-[400]",
          isHeartHealthLanding ? "absolute top-0 left-0 right-0 bg-transparent border-none" : "bg-ayur-bg/90 backdrop-blur-xl sticky top-0"
        )}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between relative">
            <div className="flex items-center">
              <MainMenu userData={userData} />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/Logo.png" 
                alt="Ayurzenix Logo" 
                className="h-12 md:h-20 object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <NavLink 
              to="/wallet"
              className={cn(
                "px-4 py-2 rounded-2xl flex items-center gap-2 border transition-all active:scale-95",
                isHeartHealthLanding ? "bg-white/10 border-white/20 text-white backdrop-blur-md" : "bg-ayur-neon/10 border-ayur-neon/20 hover:scale-105"
              )}
            >
              <Wallet className={cn("w-4 h-4", isHeartHealthLanding ? "text-white" : "text-ayur-neon")} />
              <span className={cn("text-xs md:text-sm font-black", isHeartHealthLanding ? "text-white" : "text-gray-900")}>₹{userData?.wallet_balance || 0}</span>
            </NavLink>
          </div>
        </header>
      )}

      <main ref={mainRef} className={cn("flex-1 pb-32 overflow-y-auto w-full mx-auto gpu", isFullScreen ? "pt-0 px-0 max-w-none" : "pt-4 md:pt-8 max-w-7xl px-4 md:px-6")}>
        <Outlet />
        
        {/* Ad Placement */}
        <div className="px-6 py-8">
          <BannerAd />
        </div>        {/* Professional Website Footer */}
        <footer className="bg-gradient-to-b from-white to-stone-50 text-stone-600 py-24 px-6 mt-12 overflow-hidden relative border-t border-stone-200">
          {/* subtle glow */}
          <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -mr-64 -mt-64" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 border-b border-stone-100 pb-16">
              {/* Column 1: Brand */}
              <div className="space-y-8">
                <div className="flex flex-col gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white p-3 shadow-premium">
                    <img 
                      src="/Logo.png" 
                      alt="Ayurzenix Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h2 className="text-black text-2xl font-black tracking-tighter uppercase">Ayurzenix.</h2>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.4em]">Ancient + AI Intelligence</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-stone-500 max-w-xs font-medium">
                  The world's first AI-powered Ayurvedic ecosystem. Bridging 5,000 years of Vedic wisdom with 
                  next-generation predictive intelligence for human flourishing.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: <Instagram className="w-5 h-5" />, link: '#' },
                    { icon: <Twitter className="w-5 h-5" />, link: '#' },
                    { icon: <Linkedin className="w-5 h-5" />, link: '#' },
                    { icon: <Facebook className="w-5 h-5" />, link: '#' }
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.link} 
                      className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-white hover:border-emerald-500 hover:text-emerald-600 hover:shadow-premium transition-all"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 2: AI Ecosystem */}
              <div className="space-y-8">
                <h3 className="text-black text-xs font-black uppercase tracking-[0.3em]">AI Ecosystem</h3>
                <ul className="space-y-4">
                  {[
                    { label: 'AI Symptom Engine', path: '/symptom-checker' },
                    { icon: true, label: 'Body Scan Intelligence', path: '/body-scan' },
                    { label: 'Smart Mental Scan', path: '/smart-mental-scan' },
                    { label: 'Metabolism (Agni) Engine', path: '/agni-engine-scan' },
                    { label: 'Ayurvedic Blogs', path: '/blog' },
                    { label: 'Vedic Soundscapes', path: '/soundscapes' }
                  ].map((item, i) => (
                    <li key={i}>
                      <NavLink 
                        to={item.path} 
                        className="text-sm font-bold text-stone-500 hover:text-emerald-600 transition-colors flex items-center gap-2 group"
                      >
                        {item.label}
                        {item.icon && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Corporate */}
              <div className="space-y-8">
                <h3 className="text-black text-xs font-black uppercase tracking-[0.3em]">Corporate</h3>
                <ul className="space-y-4">
                  {[
                    { label: 'Privacy Protocol', path: '/privacy' },
                    { label: 'Terms of Service', path: '/terms' },
                    { label: 'Shipping Mastery', path: '/shipping' },
                    { label: 'Pricing Engine', path: '/pricing' },
                    { label: 'Consultation Hub', path: '/consultation' },
                    { label: 'Help & Support', path: '/help' },
                    { label: 'Referral Program', path: '/referral' }
                  ].map((item, i) => (
                    <li key={i}>
                      <NavLink 
                        to={item.path} 
                        className="text-sm font-bold text-stone-500 hover:text-emerald-600 transition-colors"
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Contact */}
              <div className="space-y-8">
                <h3 className="text-black text-xs font-black uppercase tracking-[0.3em]">Direct Access</h3>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Email Protocol</p>
                      <a href="mailto:help@ayurzenix.in" className="text-stone-900 font-bold hover:text-emerald-600 transition-colors">help@ayurzenix.in</a>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Corporate Node</p>
                      <p className="text-stone-900 font-bold leading-relaxed">A Unit of IQ AI LABS<br />India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">
                  © 2026 IQ AI LABS • All Rights Reserved
                </p>
                <div className="flex gap-4 italic text-[9px] text-stone-500">
                  <span>* Traditional claims, not clinical advice</span>
                  <span>|</span>
                  <span>* AI powered by Neural-Veda Core</span>
                </div>
              </div>

              <div className="px-6 py-3 rounded-full bg-white border border-stone-100 shadow-premium flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow-emerald" />
                <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Core Systems Online</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation - Mobile Optimized Ultra High End */}
      {!isLandingPage && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-white/60 backdrop-blur-3xl border border-white/40 px-6 py-4 flex justify-between items-center z-50 rounded-[3rem] shadow-premium md:hidden gpu">
          <NavLink 
            to="/" 
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1.5 transition-all duration-500 px-4 py-2 rounded-2xl relative mobile-touch-target justify-center",
              isActive ? "text-ayur-purple scale-110" : "text-gray-400 hover:text-gray-900"
            )}
          >
            {({ isActive }) => (
              <>
                <Home className={cn("w-6 h-6 transition-all", isActive && "fill-ayur-purple/20")} />
                <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
                {isActive && <motion.div layoutId="nav-bg" className="absolute -inset-1 bg-ayur-purple/5 rounded-2xl -z-10 shadow-glow-purple" />}
              </>
            )}
          </NavLink>

          <NavLink 
            to="/history" 
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1.5 transition-all duration-500 px-4 py-2 rounded-2xl relative mobile-touch-target justify-center",
              isActive ? "text-ayur-purple scale-110" : "text-gray-400 hover:text-gray-900"
            )}
          >
            {({ isActive }) => (
              <>
                <History className={cn("w-6 h-6 transition-all", isActive && "fill-ayur-purple/20")} />
                <span className="text-[10px] font-black uppercase tracking-widest">History</span>
                {isActive && <motion.div layoutId="nav-bg" className="absolute -inset-1 bg-ayur-purple/5 rounded-2xl -z-10 shadow-glow-purple" />}
              </>
            )}
          </NavLink>

          <NavLink 
            to="/chat" 
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1.5 transition-all duration-500 px-4 py-2 rounded-2xl relative mobile-touch-target justify-center",
              isActive ? "text-ayur-teal scale-110" : "text-gray-400 hover:text-gray-900"
            )}
          >
            {({ isActive }) => (
              <>
                <MessageSquare className={cn("w-6 h-6 transition-all", isActive && "fill-ayur-teal/20")} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Zen</span>
                {isActive && <motion.div layoutId="nav-bg" className="absolute -inset-1 bg-ayur-teal/5 rounded-2xl -z-10 shadow-glow-teal" />}
              </>
            )}
          </NavLink>

          <NavLink 
            to="/store" 
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1.5 transition-all duration-500 px-4 py-2 rounded-2xl relative mobile-touch-target justify-center",
              isActive ? "text-ayur-purple scale-110" : "text-gray-400 hover:text-gray-900"
            )}
          >
            {({ isActive }) => (
              <>
                <ShoppingBag className={cn("w-6 h-6 transition-all", isActive && "fill-ayur-purple/20")} />
                <span className="text-[10px] font-black uppercase tracking-widest">Store</span>
                {isActive && <motion.div layoutId="nav-bg" className="absolute -inset-1 bg-ayur-purple/5 rounded-2xl -z-10 shadow-glow-purple" />}
              </>
            )}
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1.5 transition-all duration-500 px-4 py-2 rounded-2xl relative mobile-touch-target justify-center",
              isActive ? "text-ayur-purple scale-110" : "text-gray-400 hover:text-gray-900"
            )}
          >
            {({ isActive }) => (
              <>
                <User className={cn("w-6 h-6 transition-all", isActive && "fill-ayur-purple/20")} />
                <span className="text-[10px] font-black uppercase tracking-widest">Account</span>
                {isActive && <motion.div layoutId="nav-bg" className="absolute -inset-1 bg-ayur-purple/5 rounded-2xl -z-10 shadow-glow-purple" />}
              </>
            )}
          </NavLink>
        </nav>
      )}
    </div>
  );
}
