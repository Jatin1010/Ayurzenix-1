import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Share2, 
  Users, 
  Gift, 
  Wallet, 
  ChevronRight, 
  Copy, 
  CheckCircle2,
  Trophy,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ReferralScreenProps {
  userData: any;
  appConfig?: any;
}

export default function ReferralScreen({ userData, appConfig }: ReferralScreenProps) {
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState({ count: 0, earnings: 0 });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.uid) {
      fetchReferralInfo();
    }
  }, [userData]);

  const fetchReferralInfo = async () => {
    try {
      const userRef = doc(db, 'users', userData.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        let code = data.referralCode;

        // Generate code if missing
        if (!code) {
          code = (userData.displayName?.substring(0, 4) || 'AYUR').toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
          await updateDoc(userRef, { referralCode: code });
        }
        setReferralCode(code);

        // Fetch stats
        const referralsQuery = query(
          collection(db, 'users'),
          where('referredBy', '==', userData.uid),
          limit(50)
        );
        const referralsSnap = await getDocs(referralsQuery);
        const count = referralsSnap.size;
        
        // Sum earnings from transactions
        const transQuery = query(
          collection(db, 'transactions'),
          where('uid', '==', userData.uid),
          where('type', '==', 'referral_reward')
        );
        const transSnap = await getDocs(transQuery);
        let earnings = 0;
        transSnap.forEach(doc => {
          earnings += doc.data().amount || 0;
        });

        setStats({ count, earnings });
      }
    } catch (err) {
      console.error("Error fetching referral info:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const inviteLink = `https://ayurzenix.in/join?ref=${referralCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = `🌿 Hey! I'm using Ayurzenix to track my health with AI. Join using my link and get a FREE basic report! 🎁\n\nDownload now: https://ayurzenix.in/join?ref=${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-ayur-bg pb-32">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 uppercase">Invite & Earn</h1>
            <p className="text-[10px] font-black text-ayur-neon uppercase tracking-widest">Rewards Program</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-lg mx-auto space-y-8">
        {/* Banner Section */}
        <section className="bg-gradient-to-br from-gray-900 to-black text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ayur-green/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-ayur-green rounded-2xl flex items-center justify-center text-white shadow-glow-green">
              <Gift className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight leading-tight">
              Get <span className="text-ayur-green">₹20</span> For Every <br /> Friend You Refer
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
              Friend gets a <span className="text-ayur-gold font-black">Free Pro Report</span> instantly!
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="premium-card p-6 space-y-2">
            <Users className="w-5 h-5 text-ayur-green" />
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Friends Joined</p>
            <p className="text-2xl font-black text-gray-900">{stats.count}</p>
          </div>
          <div className="premium-card p-6 space-y-2">
            <Wallet className="w-5 h-5 text-ayur-gold" />
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total Earned</p>
            <p className="text-2xl font-black text-gray-900">₹{stats.earnings}</p>
          </div>
        </div>

        {/* Share Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Your Invite Code</h3>
          <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-dashed border-ayur-green/30 flex items-center justify-between group hover:border-ayur-green transition-all">
            <span className="text-2xl font-black text-gray-900 tracking-tighter ml-4 font-mono">{referralCode || '...'}</span>
            <button 
              onClick={copyToClipboard}
              className="px-6 py-3 bg-black text-white rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-ayur-green" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <button 
            onClick={handleShareWhatsApp}
            className="w-full py-5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-green-500/20"
          >
            <Share2 className="w-5 h-5" />
            Invite Friends via WhatsApp
          </button>
        </section>

        {/* How it works */}
        <section className="space-y-6 pt-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">How it works</h3>
          <div className="space-y-4">
            {[
              { icon: Share2, title: 'Send Invite', desc: 'Share your link with friends.' },
              { icon: Zap, title: 'Friend Joins', desc: 'They join and get a free basic report.' },
              { icon: Trophy, title: 'Earn Reward', desc: 'When they complete first purchase, you get ₹20.' }
            ].map((step, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white rounded-3xl border border-black/5">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 shrink-0">
                  <step.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase">{step.title}</h4>
                  <p className="text-[10px] text-gray-500 font-bold">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Disclaimer */}
        <div className="text-center pt-8">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-relaxed">
            * Wallet credit can be used for any Pro analysis. <br />
            Terms & Conditions apply.
          </p>
        </div>
      </div>
    </div>
  );
}
