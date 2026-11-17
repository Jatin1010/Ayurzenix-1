import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Home,
  User, 
  Stethoscope, 
  Wallet, 
  ShoppingBag, 
  HelpCircle, 
  BookOpen,
  Info, 
  Settings, 
  LogOut, 
  ShieldCheck,
  X,
  History,
  Gift,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';

interface MainMenuProps {
  userData: any;
}

export default function MainMenu({ userData }: MainMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
    { icon: <User className="w-5 h-5" />, label: 'Account & Wallet', path: '/profile' },
    { icon: <History className="w-5 h-5" />, label: 'Health History', path: '/history' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Vedic Blogs', path: '/blog' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Ayurvedic Store', path: '/store' },
    { icon: <Stethoscope className="w-5 h-5" />, label: 'AI Consultation', path: '/consultation' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Pricing & Plans', path: '/pricing' },
    { icon: <Gift className="w-5 h-5" />, label: 'Refer & Earn', path: '/referral' },
    { icon: <Info className="w-5 h-5" />, label: 'About Ayurzenix', path: '/about' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', path: '/help' },
  ];

  if (userData?.is_admin) {
    menuItems.unshift({ icon: <ShieldCheck className="w-5 h-5" />, label: 'Admin Panel', path: '/admin' });
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigate = (path: string, state?: any) => {
    navigate(path, { state });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-2xl luxury-glass hover:bg-gray-50 transition-all active:scale-95 group"
        aria-label="Menu"
      >
        <div className="flex flex-col gap-1.5 w-6">
          <motion.div 
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-full h-0.5 bg-black rounded-full" 
          />
          <motion.div 
            animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            className="w-3/4 h-0.5 bg-ayur-teal rounded-full" 
          />
          <motion.div 
            animate={isOpen ? { rotate: -45, y: -8, width: "100%" } : { rotate: 0, y: 0, width: "50%" }}
            className="h-0.5 bg-ayur-purple rounded-full" 
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile to prevent blocking UI but allow closing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute left-0 mt-4 w-72 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-premium border border-white py-6 z-[9999] max-h-[85vh] overflow-y-auto scrollbar-hide"
            >
              <div className="px-8 pb-4 mb-4 border-b border-gray-100/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Navigation Hub</p>
              </div>

              <div className="space-y-1.5 px-4">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.path, (item as any).state)}
                    className="w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-black transition-all active:scale-98 group"
                  >
                    <div className="text-gray-400 group-hover:text-ayur-teal transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  </button>
                ))}

                <div className="h-px bg-gray-100/50 my-4 mx-4" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all active:scale-98 group"
                >
                  <div className="text-rose-400 group-hover:text-rose-600 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">Logout</span>
                </button>
              </div>

              {userData && !userData.is_guest && (
                <div className="mt-6 mx-4 p-4 rounded-3xl bg-gray-50 border border-gray-100/50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl luxury-glass flex items-center justify-center border-white shadow-sm overflow-hidden text-ayur-teal">
                    {userData.photoURL ? (
                      <img src={userData.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-black truncate">{userData.displayName}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-widest leading-none mt-1">{userData.is_premium ? 'Elite Member' : 'Member'}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
