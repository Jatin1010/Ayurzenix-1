import { getHistoryLocally, saveProfileLocally } from '../lib/localHistory';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, getDocs, Timestamp } from 'firebase/firestore';
import { History, ChevronRight, Calendar, Activity, Sparkles, Stethoscope, Camera, Zap, Clock, Target, Moon, Brain } from 'lucide-react';
import { motion } from 'motion/react';
import { BannerAd } from '../components/AdManager';

interface HistoryScreenProps {
  userData: any;
  appConfig?: any;
}

export default function HistoryScreen({ userData, appConfig }: HistoryScreenProps) {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.uid) return;

        const loadHistory = async () => {
      setLoading(true);
      try {
        // 1. Get Local History
        const localProfiles = await getHistoryLocally(userData.uid);
        
        // 2. Fetch from Firestore if not guest
        let firestoreProfiles: any[] = [];
        if (!userData.is_guest) {
          try {
            const q = query(
              collection(db, 'health_profiles'),
              where('uid', '==', userData.uid),
              orderBy('createdAt', 'desc')
            );
            
            const snapshot = await getDocs(q);
            firestoreProfiles = snapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            }));

            // Sync missing Firestore profiles to local history
            for (const fProfile of firestoreProfiles) {
              const existsLocally = localProfiles.some(p => p.id === fProfile.id);
              if (!existsLocally) {
                // Ensure we have a valid timestamp number for local DB
                let timestamp = Date.now();
                const fCreatedAt = fProfile.createdAt as any;
                if (fCreatedAt instanceof Timestamp) {
                  timestamp = fCreatedAt.toMillis();
                } else if (typeof fCreatedAt === 'number') {
                  timestamp = fCreatedAt;
                }
                
                await saveProfileLocally(fProfile.id, {
                  ...fProfile,
                  createdAt: timestamp
                });
                localProfiles.push({ ...fProfile, createdAt: timestamp });
              }
            }
          } catch (error) {
            console.error("Firestore history fetch error:", error);
          }
        }

        // 3. Normalize and Sort
        const allProfiles = [...localProfiles];
        const normalizedProfiles = allProfiles.map(p => {
          let date: Date;
          const createdAt = p.createdAt as any;
          if (createdAt instanceof Timestamp) {
            date = createdAt.toDate();
          } else if (typeof createdAt === 'number') {
            date = new Date(createdAt);
          } else if (createdAt && typeof createdAt === 'object' && 'seconds' in createdAt) {
             date = new Date(createdAt.seconds * 1000);
          } else {
            date = new Date();
          }

          return {
            ...p,
            _date: date,
            createdAt: { toDate: () => date }
          };
        });

        // Unique by ID and sort
        const profileMap = new Map();
        normalizedProfiles.forEach(p => {
          if (!profileMap.has(p.id)) {
            profileMap.set(p.id, p);
          }
        });
        const uniqueProfiles = Array.from(profileMap.values());
        uniqueProfiles.sort((a, b) => b._date.getTime() - a._date.getTime());

        setProfiles(uniqueProfiles);
      } catch (error) {
        console.error("History loading error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();

    
  }, [userData?.uid, userData?.is_guest]);

  return (
    <div className="px-6 py-10 space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-ayur-green/10 rounded-2xl flex items-center justify-center text-ayur-green shadow-sm">
          <History className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">History</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Your Wellness Journey</p>
        </div>
      </div>

      <div className="py-2">
        <BannerAd size="small" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Activity className="w-10 h-10 text-ayur-green animate-shiny-pulse drop-shadow-[0_0_15px_rgba(0,191,166,0.6)]" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading History...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-24 premium-card border-dashed border-gray-200 space-y-6">
          <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto">
            <History className="w-8 h-8 text-gray-200" />
          </div>
          <div className="space-y-2">
            <p className="text-gray-400 font-bold">No analyses found yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="text-ayur-green font-black text-xs uppercase tracking-widest hover:underline"
            >
              Start your first analysis →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile, index) => (
            <motion.button
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: "spring", damping: 20, stiffness: 100 }}
              onClick={() => {
                if (profile.type === 'sleep_intelligence') {
                  navigate(`/sleep-intelligence/result/${profile.id}`);
                } else if (profile.type === 'smart_mental_scan') {
                   navigate(`/smart-mental-scan/result/${profile.id}`);
                } else if (profile.type === 'face_glow') {
                  navigate(`/face-glow/result/${profile.id}`);
                } else if (profile.type === 'heart_health') {
                  navigate(`/heart-health-result/${profile.id}`);
                } else if (profile.type === 'agni_engine') {
                  navigate(`/agni-engine/result/${profile.id}`);
                } else if (profile.type === 'stress_relief') {
                  navigate(`/stress-relief/result/${profile.id}`);
                } else {
                  navigate(`/result/${profile.id}`);
                }
              }}
              className="w-full premium-card p-6 border-slate-100 hover:border-ayur-green/30 transition-all flex items-center justify-between group active:scale-[0.98]"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-ayur-green/5 rounded-2xl flex flex-col items-center justify-center text-ayur-green border border-ayur-green/10 group-hover:bg-ayur-green group-hover:text-white transition-colors">
                  {profile.type === 'future_prediction' ? <Clock className="w-6 h-6" /> :
                   profile.type === 'body_scan' ? <Camera className="w-6 h-6" /> :
                   profile.type === 'face_glow' ? <Sparkles className="w-6 h-6" /> :
                   profile.type === 'goal_wellness' ? <Target className="w-6 h-6" /> :
                   profile.type === 'sleep_intelligence' ? <Moon className="w-6 h-6" /> :
                   profile.type === 'smart_mental_scan' ? <Brain className="w-6 h-6" /> :
                   profile.type === 'heart_health' ? <Activity className="w-6 h-6" /> :
                   profile.type === 'agni_engine' ? <Zap className="w-6 h-6" /> :
                   profile.type === 'stress_relief' ? <Sparkles className="w-6 h-6" /> :
                   <Stethoscope className="w-6 h-6" />}
                </div>
                <div className="text-left space-y-1">
                  <p className="font-black text-gray-900 tracking-tight text-lg leading-none uppercase">
                    {profile.type === 'future_prediction' ? 'Future Prediction' :
                     profile.type === 'body_scan' ? 'Body Scan' :
                      profile.type === 'face_glow' ? 'Face Glow' :
                      profile.type === 'goal_wellness' ? profile.goalTitle :
                      profile.type === 'sleep_intelligence' ? 'Sleep Intelligence' :
                      profile.type === 'smart_mental_scan' ? 'Deep Mental Scan' :
                      profile.type === 'heart_health' ? 'Heart Health' :
                      profile.type === 'agni_engine' ? 'Agni Engine' :
                      profile.type === 'stress_relief' ? 'Stress Relief' :
                      (profile.analysis?.doshaHeader?.dominant || profile.analysis?.doshaAnalysis?.dominantDosha || 'Health Scan')}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    <span>{profile.createdAt?.toDate().toLocaleDateString()} • {profile.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-ayur-green/10 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-ayur-green group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
