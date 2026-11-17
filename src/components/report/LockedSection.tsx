import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Crown, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LockedSectionProps {
  children: React.ReactNode;
  isLocked: boolean;
  tier: 'pro' | 'premium';
  title?: string;
  onUpgrade: () => void;
}

export default function LockedSection({ 
  children, 
  isLocked, 
  tier, 
  title,
  onUpgrade 
}: LockedSectionProps) {
  // Always return children to remove the lock UI
  return <>{children}</>;
}
