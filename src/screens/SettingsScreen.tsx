import { 
  ArrowLeft, 
  User, 
  LogOut, 
  Bell, 
  Leaf, 
  Activity, 
  Wallet, 
  Plus, 
  History, 
  Globe, 
  Moon, 
  Sun, 
  Shield, 
  FileText, 
  Database, 
  Trash2, 
  HelpCircle, 
  Mail, 
  Info, 
  ShieldCheck,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { clearLocalHistory } from '../lib/localHistory';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface SettingsScreenProps {
  userData: any;
}

export default function SettingsScreen({ userData }: SettingsScreenProps) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async (field: string, currentValue: boolean) => {
    if (!userData?.uid || userData.is_guest) return;
    try {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, { [field]: !currentValue });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    if (!userData?.uid || userData.is_guest) return;
    try {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, { language: lang });
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteData = async () => {
    if (!userData?.uid || userData.is_guest) return;
    setIsDeleting(true);
    try {
      const batch = writeBatch(db);
      
      // Delete local health profiles
      await clearLocalHistory();

      // Delete transactions
      const transQ = query(collection(db, 'transactions'), where('uid', '==', userData.uid));
      const transSnap = await getDocs(transQ);
      transSnap.forEach(doc => batch.delete(doc.ref));

      // Reset user data (except core auth info)
      const userRef = doc(db, 'users', userData.uid);
      batch.update(userRef, {
        free_results_count: 2,
        wallet_balance: 0,
        is_premium: false,
        // Keep displayName, email, etc.
      });

      await batch.commit();
      setShowDeleteModal(false);
      alert("Your health data and history have been cleared.");
    } catch (error) {
      console.error('Error deleting data:', error);
      alert("Failed to delete data. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const SettingItem = ({ icon, title, desc, onClick, children, danger }: any) => (
    <div
      onClick={onClick}
      className={cn(
        "w-full bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm flex items-center gap-5 active:scale-[0.98] transition-all text-left cursor-pointer",
        danger && "border-rose-100 bg-rose-50/30"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center",
        danger ? "bg-rose-100 text-rose-600" : "bg-blue-50 text-blue-600"
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className={cn("text-sm font-black uppercase tracking-tight", danger ? "text-rose-900" : "text-gray-900")}>{title}</h3>
        {desc && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{desc}</p>}
      </div>
      {children || <ChevronRight className="w-5 h-5 text-gray-300" />}
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-3 mt-8 first:mt-0">{title}</h2>
  );

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={cn(
        "w-12 h-6 rounded-full transition-all relative",
        active ? "bg-ayur-green" : "bg-gray-200"
      )}
    >
      <motion.div 
        animate={{ x: active ? 24 : 4 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-ayur-bg pb-32">
      {/* Header */}
      <div className="px-6 pt-14 pb-8 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 active:scale-90 transition-all border border-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Settings</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Control</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Admin Section */}
        {userData?.is_admin && (
          <div className="space-y-3">
            <SectionHeader title="Administration" />
            <SettingItem 
              icon={<ShieldCheck />} 
              title="Admin Panel" 
              desc="Manage users and system data"
              onClick={() => navigate('/admin')}
            />
          </div>
        )}

        {/* Account Section */}
        <div className="space-y-3">
          <SectionHeader title="Account" />
          <SettingItem 
            icon={<User />} 
            title="Edit Profile" 
            desc="Update your personal information & health data"
            onClick={() => navigate('/profile')}
          />
          <SettingItem 
            icon={<Globe />} 
            title="Language" 
            desc={userData?.language === 'hi' ? 'Hindi / हिंदी' : 'English'}
            onClick={() => handleLanguageChange(userData?.language === 'hi' ? 'en' : 'hi')}
          />
          <SettingItem 
            icon={<Wallet />} 
            title="Wallet & Payments" 
            desc="Manage balances and transactions"
            onClick={() => navigate('/wallet')}
          />
        </div>

        {/* General Section */}
        <div className="space-y-3">
          <SectionHeader title="Preferences" />
          <SettingItem 
            icon={<Bell />} 
            title="Notifications" 
            desc="Daily tips and reminders"
            onClick={() => handleToggle('notifications_tips', userData?.notifications_tips ?? true)}
          >
            <Toggle 
              active={userData?.notifications_tips ?? true} 
              onToggle={() => handleToggle('notifications_tips', userData?.notifications_tips ?? true)} 
            />
          </SettingItem>
        </div>

        {/* Resources Section */}
        <div className="space-y-3">
          <SectionHeader title="Resources & Support" />
          <SettingItem 
            icon={<HelpCircle />} 
            title="Help & Support" 
            desc="Contact us for assistance"
            onClick={() => navigate('/help')}
          />
          <SettingItem 
            icon={<Shield />} 
            title="Privacy Policy" 
            onClick={() => navigate('/privacy')}
          />
          <SettingItem 
            icon={<FileText />} 
            title="Terms of Service" 
            onClick={() => navigate('/terms')}
          />
        </div>

        {/* Danger Zone */}
        <div className="space-y-3 pt-4">
          <SettingItem 
            icon={<Trash2 />} 
            title="Clear My Data" 
            desc="Delete all health history permanently"
            onClick={() => setShowDeleteModal(true)}
            danger
          />
          <SettingItem 
            icon={<LogOut />} 
            title="Logout" 
            desc="Sign out of your account"
            onClick={handleLogout}
            danger
          />
        </div>

        {/* Version Info */}
        <div className="mt-12 text-center space-y-1 opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Ayurzenix v1.0.5</p>
          <p className="text-[8px] font-bold uppercase tracking-widest text-[#3A5331]">© 2026 IQ AI LABS</p>
        </div>
      </div>

      {/* Delete Data Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Delete All Data?</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  This will permanently clear your health scans, transaction history, and reset your wallet. This action cannot be undone.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteData}
                  className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-200 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
                </button>
                <button
                  disabled={isDeleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 text-gray-400 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
