import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface RazorpayOrderOptions {
  amount: number;
  currency?: string;
  receipt?: string;
  userId: string;
  bonus?: number;
  notes?: Record<string, any>;
}

export const getRazorpayConfig = (order: any, userData: any, onHandler: (response: any) => void, onDismiss: () => void) => {
  const razorpayKey = (import.meta as any).env.VITE_RAZORPAY_KEY_ID;

  return {
    key: razorpayKey,
    amount: order.amount,
    currency: order.currency || 'INR',
    name: 'Ayurzenix',
    description: order.notes?.description || 'Wellness Recharge',
    image: 'https://ayurzenix.in/logo.png', // Replace with actual logo if available
    order_id: order.id,
    handler: onHandler,
    prefill: {
      name: userData?.displayName || '',
      email: userData?.email || '',
      contact: userData?.phoneNumber || ''
    },
    notes: {
      address: 'Ayurzenix Corporate Office',
      userId: userData?.uid,
      orderId: order.id
    },
    theme: {
      color: '#1ABC9C' // Brand Primary
    },
    modal: {
      ondismiss: onDismiss,
      backdropClose: false,
      escape: false,
      handleback: true,
      confirm_close: true
    },
    // CRITICAL: Configuration for UPI & Mobile Flow
    config: {
      display: {
        blocks: {
          upi: {
            name: 'Pay via UPI',
            instruments: [
              {
                method: 'upi',
                apps: ['google_pay', 'phonepe', 'paytm', 'bhim']
              }
            ]
          }
        },
        sequence: ['block.upi', 'block.card', 'block.netbanking', 'block.wallet'],
        preferences: {
          show_default_blocks: true
        }
      }
    },
    // Additional PWA/Mobile optimizations
    retry: {
      enabled: true,
      max_count: 3
    },
    timeout: 300,
    remember_customer: true,
    send_sms_hash: true,
    external: {
      wallets: ['paytm', 'phonepe']
    }
  };
};

export const createRazorpayOrder = async (options: RazorpayOrderOptions) => {
  try {
    const { data } = await axios.post('/api/razorpay/order', options);
    return data;
  } catch (error: any) {
    console.error('Razorpay Order Error:', error.response?.data || error);
    throw new Error(error.response?.data?.error || 'Failed to create payment order');
  }
};

export const verifyRazorpayPayment = async (verificationData: any) => {
  try {
    const { data } = await axios.post('/api/razorpay/verify', verificationData);
    return data;
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error.response?.data || error);
    throw new Error(error.response?.data?.error || 'Payment verification failed');
  }
};
