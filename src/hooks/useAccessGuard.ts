import { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getPlanPrice } from '../lib/pricing';
import { useNavigate } from 'react-router-dom';

export interface AccessStatus {
  hasAccess: boolean;
  requiredAmount: number;
  currentBalance: number;
  hasSubscription: boolean;
}

export function useAccessGuard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAccess = (featureId: string, planId: string): AccessStatus => {
    if (!profile) return { hasAccess: false, requiredAmount: 0, currentBalance: 0, hasSubscription: false };

    // Support both old and new field names
    const balance = profile.wallet_balance ?? (profile.wallet?.balance || 0);
    const hasActiveSubscription = profile.subscription?.status === 'active';
    const requiredAmount = getPlanPrice(featureId, planId);

    // Free results count for basic analysis
    const hasFreeResults = planId === 'basic' && (profile.free_results_count || 0) > 0;
    const isDeveloper = profile.email?.toLowerCase() === 'help@ayurzenix.in';

    const hasAccess = hasActiveSubscription || balance >= requiredAmount || hasFreeResults || isDeveloper;

    return {
      hasAccess,
      requiredAmount: hasFreeResults || isDeveloper ? 0 : requiredAmount,
      currentBalance: balance,
      hasSubscription: hasActiveSubscription
    };
  };

  const startAnalysis = (featureId: string, planId: string, returnRoute: string, onAuthorized: () => void) => {
    // We now allow all users to start analysis regardless of balance
    // Payment is handled in ResultScreen.tsx load
    onAuthorized();
  };

  return {
    loading,
    profile,
    checkAccess,
    startAnalysis
  };
}
