import { useState, useEffect, useRef } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface Transaction {
  id: string;
  type: 'recharge' | 'payment' | 'deduction' | 'subscription' | 'reward' | 'credit' | 'debit';
  title?: string;
  description?: string;
  amount: number;
  status: 'completed' | 'pending' | 'success';
  createdAt: any;
  dateStr?: string;
}

export function useRealtimeWallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdateType, setLastUpdateType] = useState<'none' | 'increase' | 'decrease'>('none');
  const [lastAmount, setLastAmount] = useState(0);
  
  const prevBalanceRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // 1. Listen to User Balance
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const newBalance = snap.data().wallet_balance || 0;
            
            if (prevBalanceRef.current !== null && newBalance !== prevBalanceRef.current) {
              const diff = newBalance - prevBalanceRef.current;
              setLastAmount(Math.abs(diff));
              setLastUpdateType(diff > 0 ? 'increase' : 'decrease');
              
              // Reset update type after some time to allow re-triggering of animations
              setTimeout(() => setLastUpdateType('none'), 5000);
            }
            
            prevBalanceRef.current = newBalance;
            setBalance(newBalance);
          }
          setLoading(false);
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
          setLoading(false);
        });

        // 2. Listen to Transactions
        const txQuery = query(
          collection(db, 'transactions'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(15)
        );

        const unsubscribeTx = onSnapshot(txQuery, (snap) => {
          const txs = snap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              dateStr: data.createdAt?.toDate() 
                ? data.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                : 'Pending...'
            } as Transaction;
          });
          setTransactions(txs);
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'transactions');
        });

        return () => {
          unsubscribeUser();
          unsubscribeTx();
        };
      } else {
        setBalance(null);
        setTransactions([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return {
    balance,
    transactions,
    loading,
    lastUpdateType,
    lastAmount
  };
}
