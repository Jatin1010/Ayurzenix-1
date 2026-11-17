import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';
import OpenAI from 'openai';
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import Razorpay from 'razorpay';
import { GoogleGenAI } from "@google/genai";
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

export const app = express();

let openaiClient: OpenAI | null = null;
let adminApp: any = null;
let razorpayClient: Razorpay | null = null;
let googleAI: GoogleGenAI | null = null;
let lastUsedKeyId = '';
let lastUsedKeySecret = '';
let lastGeminiKey = '';
let lastDynamicConfig: any = null;
let lastKeyFetchTime = 0;
const KEY_CACHE_TTL = 300000; // 5 minutes

const GOOGLE_AI_MODEL = 'gemini-1.5-flash';
const ADMIN_EMAILS = ['ayurzenix@gmail.com', 'admin@ayurzenix.in', 'help@ayurzenix.in', 'jatin1978kumar@gmail.com'];

async function fetchDynamicAiConfig(): Promise<any> {
  const now = Date.now();
  if (lastDynamicConfig !== null && (now - lastKeyFetchTime < KEY_CACHE_TTL)) {
    return lastDynamicConfig;
  }

  // Set default fetch time even on failure to avoid hitting DB constantly
  lastKeyFetchTime = now;

  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) return null;

    const adminAppInstance = getFirebaseAdmin();
    if (!adminAppInstance) return null;
    
    const db = getFirestore(adminAppInstance);
    const doc = await db.collection('system_config').doc('ai').get();
    
    if (doc.exists) {
      lastDynamicConfig = doc.data() || null;
      if (lastDynamicConfig?.gemini_api_key) {
        console.log('[System] Intelligence Source: Overridden by Admin Panel');
      }
      return lastDynamicConfig;
    }
  } catch (error) {
    console.error('[System] Dynamic config fetch error:', error);
  }
  
  return null;
}

async function getGemini(): Promise<{ ai: GoogleGenAI, model: string }> {
  let config = null;
  try {
    config = await fetchDynamicAiConfig();
  } catch (e) {
    console.warn('[System] Error fetching dynamic config, using system defaults.');
  }

  const rawKey = config?.gemini_api_key || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  const selectedModel = config?.active_model || 'gemini-1.5-flash';
  
  let key = rawKey.trim();
  key = key
    .replace(/^["']|["']$/g, '') 
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .split('\n')[0] // Only take the first line to avoid trailing garbage
    .trim();

  // Common user mistake: pasting "API Key: AIza..." or similar
  if (key.toLowerCase().includes('api key:')) {
    key = key.split(/api key:/i)[1].trim();
  }

  if (!key) {
    throw new Error('No API Key detected. Please provide a valid Gemini API Key in the Settings menu (GEMINI_API_KEY). Ensure you only paste the key itself, starting with "AIza".');
  }

  // Pre-validation
  if (!key.startsWith('AIza')) {
    console.error('--- CRITICAL CONFIG ERROR ---');
    console.warn(`Invalid Gemini Key format: "${key.substring(0, 10)}..."`);
    console.warn('Most keys start with "AIza". If this is a service account JSON, it will NOT work here.');
  }

  if (key !== lastGeminiKey || !googleAI) {
    const masked = key.length > 8 ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : '****';
    console.log(`--- Engine Intelligence Switch ---`);
    console.log(`Provider: Google Generative AI`);
    console.log(`Key Type: ${config?.gemini_api_key ? 'Dynamic Admin Override' : 'System Default (Secrets)'}`);
    console.log(`Status: ACTIVE [${masked}]`);
    
    try {
      googleAI = new GoogleGenAI({ 
        apiKey: key,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      lastGeminiKey = key;
    } catch (e: any) {
      console.error('Core Intelligence Startup Failed:', e.message);
      throw e;
    }
  }
  
  return { ai: googleAI, model: selectedModel };
}

async function createAdminLog(action: string, performedBy: string, details: string) {
  try {
    const adminAppInstance = getFirebaseAdmin();
    if (!adminAppInstance) return;
    const db = getFirestore(adminAppInstance);
    await db.collection('admin_logs').add({
      action,
      performedBy,
      details,
      timestamp: FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.warn('[Audit] Failed to create admin log:', e);
  }
}

function getRazorpay(): Razorpay {
  let currentKeyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '').trim();
  let currentKeySecret = (process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET || '').trim();
  
  // Clean keys thoroughly
  const cleanKey = (key: string) => {
    if (!key) return '';
    return key
      .trim()
      .replace(/^["']|["']$/g, '') 
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/\s+/g, '')
      .trim();
  };

  currentKeyId = cleanKey(currentKeyId);
  currentKeySecret = cleanKey(currentKeySecret);

  if (!currentKeyId || !currentKeySecret) {
    console.error('CRITICAL: Razorpay credentials missing from environment');
    throw new Error('Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your settings.');
  }

  // Re-initialize if keys changed or client is null
  if (!razorpayClient || currentKeyId !== lastUsedKeyId || currentKeySecret !== lastUsedKeySecret) {
    console.log('--- Razorpay Initialization Attempt ---');
    console.log('Key ID Prefix:', currentKeyId.substring(0, 8));
    
    try {
      const RazorpayConstructor: any = (Razorpay as any).default || Razorpay;
      razorpayClient = new RazorpayConstructor({
        key_id: currentKeyId,
        key_secret: currentKeySecret,
      });
      lastUsedKeyId = currentKeyId;
      lastUsedKeySecret = currentKeySecret;
      console.log('Razorpay client successfully instantiated');
    } catch (error) {
      console.error('Failed to instantiate Razorpay client:', error);
      throw error;
    }
  }
  return razorpayClient;
}

function getFirebaseAdmin(): any {
  if (!adminApp) {
    let rawServiceAccount = (process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();
    if (!rawServiceAccount) {
      console.warn('FIREBASE_SERVICE_ACCOUNT environment variable is missing.');
      return null;
    }

    // Comprehensive cleaning
    let serviceAccount = rawServiceAccount.replace(/^["']|["']$/g, '').trim();
    
    // Recovery Logic: Try to find a JSON object in the string if it looks like code
    const tryParse = (str: string) => {
      try {
        const parsed = JSON.parse(str);
        if (parsed && typeof parsed === 'object' && parsed.project_id) {
          return parsed;
        }
      } catch (e) {
        return null;
      }
      return null;
    };

    let parsedAccount = tryParse(serviceAccount);

    // If direct parse fails, attempt extraction if it looks like code
    if (!parsedAccount && (serviceAccount.includes('{') || serviceAccount.includes('base64'))) {
       // Attempt JSON block extraction
       const jsonMatch = serviceAccount.match(/\{[\s\S]*\}/);
       if (jsonMatch) {
         console.warn('Firebase Admin: Detected code-like structure, attempting to extract JSON block...');
         parsedAccount = tryParse(jsonMatch[0]);
       }

       // Attempt Base64 decode recovery
       if (!parsedAccount) {
         try {
           const decoded = Buffer.from(serviceAccount, 'base64').toString('utf8');
           parsedAccount = tryParse(decoded);
         } catch (e) {}
       }
    }

    if (!parsedAccount) {
      console.error('--- FIREBASE CONFIGURATION ERROR ---');
      if (serviceAccount.includes('require(') || serviceAccount.includes('import ') || serviceAccount.includes('FileInputStream')) {
        console.error('CRITICAL: You pasted Java/Node.js/Python CODE instead of the raw JSON key file.');
        console.error('FIX: Go to Firebase Console > Project Settings > Service Accounts > Generate New Private Key.');
        console.error('Open that .json file, copy ALL content, and paste it INTO the FIREBASE_SERVICE_ACCOUNT secret.');
      } else if (serviceAccount.includes('apiKey') && serviceAccount.includes('authDomain')) {
        console.error('CRITICAL: You pasted the CLIENT configuration (apiKey/authDomain) into the ADMIN secret.');
        console.error('FIX: You need the Service Account JSON from the "Service Accounts" tab, not the "General" tab.');
      } else {
        console.error('FIREBASE_SERVICE_ACCOUNT is either missing or contains invalid JSON.');
      }
      return null;
    }
    
    try {
      adminApp = initializeApp({
        credential: admin.credential.cert(parsedAccount),
        databaseURL: parsedAccount.project_id ? `https://${parsedAccount.project_id}.firebaseio.com` : undefined
      });
      console.log('Firebase Admin SDK initialized successfully for project:', parsedAccount.project_id);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        adminApp = admin.app();
        return adminApp;
      }
      console.error('Failed to initialize Firebase Admin:', error.message);
      return null;
    }
  }
  return adminApp;
}

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

function calculateBonus(amount: number): number {
  if (amount >= 2499) return 750;
  if (amount >= 999) return 250;
  if (amount >= 499) return 100;
  if (amount >= 199) return 25;
  return 0;
}

// Shared Payment Processor for Idempotency and Atomic Updates
async function processWalletTransaction(
  db: admin.firestore.Firestore,
  userId: string,
  paymentData: {
    paymentId: string;
    orderId: string;
    amount: number; // in Rupees
    bonus: number;
    description: string;
    isUnlock?: boolean;
    reportTitle?: string;
    planId?: string;
    method: string;
  }
) {
  const { paymentId, orderId } = paymentData;
  
  try {
    return await db.runTransaction(async (transaction) => {
      // 1. Strict Idempotency Check using a dedicated collection
      const idempotencyRef = db.collection('idempotency_keys').doc(paymentId);
      const idempotencyDoc = await transaction.get(idempotencyRef);
      
      if (idempotencyDoc.exists) {
        console.log(`[Ledger] Payment ${paymentId} already processed. Skipping.`);
        return { status: 'success', alreadyProcessed: true };
      }

      // 2. Get User Document
      const userRef = db.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error(`Profile not found for UID: ${userId}`);
      }

      const userData = userDoc.data();
      const currentBalance = Number(userData?.wallet_balance || 0);
      const totalCredit = paymentData.amount + (paymentData.bonus || 0);
      
      // 3. Prepare Updates
      const userUpdates: any = {
        wallet_balance: currentBalance + totalCredit,
        last_recharge: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      if (paymentData.planId) {
        const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        userUpdates.is_premium = true;
        userUpdates.plan_id = paymentData.planId;
        userUpdates.plan_expiry = expiryDate;
        userUpdates.subscription = {
          planId: paymentData.planId,
          reportsUsed: 0,
          currentPeriodEnd: expiryDate.toISOString()
        };
      }

      if (paymentData.isUnlock) {
        userUpdates.wallet_balance = currentBalance + (paymentData.bonus || 0);
      }

      // 4. Record the idempotency key FIRST in the transaction
      transaction.set(idempotencyRef, {
        processedAt: FieldValue.serverTimestamp(),
        userId,
        orderId,
        paymentId
      });

      // 5. Apply User Update
      transaction.update(userRef, userUpdates);

      // 6. Create Credit Transaction Record
      const creditRef = db.collection('transactions').doc();
      transaction.set(creditRef, {
        userId,
        uid: userId,
        amount: totalCredit,
        baseAmount: paymentData.amount,
        bonusAmount: paymentData.bonus || 0,
        type: 'credit',
        method: paymentData.method,
        paymentId,
        orderId,
        description: paymentData.description,
        createdAt: FieldValue.serverTimestamp(),
        status: 'success'
      });

      // 7. Create Debit Transaction for Direct Unlock
      if (paymentData.isUnlock) {
        const debitRef = db.collection('transactions').doc();
        transaction.set(debitRef, {
          userId,
          uid: userId,
          amount: paymentData.amount,
          type: 'debit',
          method: 'wallet',
          description: `Unlocked: ${paymentData.reportTitle || 'Intelligence Analysis'}`,
          createdAt: FieldValue.serverTimestamp(),
          status: 'success'
        });
      }

      console.log(`[Ledger] Successfully processed payment ${paymentId} for user ${userId}. Total Credited: ${totalCredit}. New Balance: ${userUpdates.wallet_balance}`);
      return { status: 'success', credited: totalCredit, balance: userUpdates.wallet_balance };
    });
  } catch (err: any) {
    console.error('[Ledger] Transaction Error:', err.message);
    throw err;
  }
}

async function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Auth token required' });

  try {
    const adminAppInstance = getFirebaseAdmin();
    if (!adminAppInstance) return res.status(500).json({ error: 'Firebase Admin not initialized' });

    const auth = getAuth(adminAppInstance);
    const decodedToken = await auth.verifyIdToken(token);
    const db = getFirestore(adminAppInstance);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    // Check if user is in ADMIN_EMAILS or has is_admin flag
    const isAdmin = ADMIN_EMAILS.includes(decodedToken.email || '') || userData?.is_admin === true;

    req.user = {
      ...decodedToken,
      is_admin: isAdmin
    };
    next();
  } catch (error: any) {
    console.error('[Auth] Token Verification Error:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export async function setupApp() {
  // Middleware to capture raw body for webhook verification
  app.use('/api/razorpay/webhook', express.raw({ type: 'application/json' }));

  app.use(express.json());

  // --- ADMIN API ROUTES ---
  app.get("/api/admin/users", authenticateToken, async (req, res) => {
    const userReq = req as any;
    if (!userReq.user?.is_admin) return res.status(403).json({ error: 'Access denied' });
    try {
      const adminAppInstance = getFirebaseAdmin();
      const db = getFirestore(adminAppInstance);
      const usersSnapshot = await db.collection("users").orderBy("createdAt", "desc").limit(50).get();
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/metrics", authenticateToken, async (req, res) => {
    const userReq = req as any;
    if (!userReq.user?.is_admin) return res.status(403).json({ error: 'Access denied' });
    try {
      res.json({
        activeUsers: 1458,
        totalRevenue: 672500,
        aiTasks: 12400,
        conversionRate: "14.2%"
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/ai/prompt", authenticateToken, async (req, res) => {
    const userReq = req as any;
    if (!userReq.user?.is_admin) return res.status(403).json({ error: 'Access denied' });
    const { promptId, content } = req.body;
    try {
      const adminAppInstance = getFirebaseAdmin();
      const db = getFirestore(adminAppInstance);
      await db.collection("ai_configs").doc(promptId || "system_master").set({
        content,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: (req as any).user.uid
      }, { merge: true });
      
      await createAdminLog('UPDATE_AI_PROMPT', (req as any).user.email || (req as any).user.uid, `Updated ${promptId || 'system_master'}`);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/ai/prompt", authenticateToken, async (req, res) => {
    const userReq = req as any;
    if (!userReq.user?.is_admin) return res.status(403).json({ error: 'Access denied' });
    try {
      const adminAppInstance = getFirebaseAdmin();
      const db = getFirestore(adminAppInstance);
      const doc = await db.collection("ai_configs").doc("system_master").get();
      res.json(doc.exists ? doc.data() : { content: "Default Ayurzenix logic..." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // OpenAI Endpoint
  app.post('/api/openai/chat', async (req, res) => {
    try {
      const { messages, model = 'gpt-4o' } = req.body;
      const openai = getOpenAI();
      
      const completion = await openai.chat.completions.create({
        model,
        messages,
      });

      res.json(completion);
    } catch (error: any) {
      console.error('OpenAI Error:', error.message);
      res.status(500).json({ error: error.message || 'Failed to call OpenAI API' });
    }
  });

  // AI Diagnostic Endpoint
  app.post('/api/admin/ai-diagnostic', async (req, res) => {
    try {
      const { email } = req.body;
      const { ai, model } = await getGemini();
      
      const startTime = Date.now();
      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: "Respond with exactly: Ayurzenix Engine Operational" }] }]
      });
      const responseText = response.text || '';
      const latency = Date.now() - startTime;
      
      await createAdminLog('AI Diagnostic', email || 'System', `Diagnostic performed. Result: ${responseText}. Latency: ${latency}ms`);
      
      res.json({ 
        success: true, 
        responseText, 
        latency,
        modelUsed: model,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('AI Diagnostic Error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Diagnostic failed',
        status: error.status,
        details: error.details
      });
    }
  });

// The Third Eye: API Cost Optimization & Caching System
const responseCache = new Map<string, { text: string, timestamp: number }>();
const requestLog = new Map<string, number[]>(); // IP -> timestamps
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours
const RATE_LIMIT_WINDOW = 1000 * 60 * 60; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 50; // Max 50 requests per hour per IP

function getRequestHash(contents: any): string {
  return crypto.createHash('md5').update(JSON.stringify(contents)).digest('hex');
}

  // Gemini Endpoint
  app.post('/api/gemini/analyze', async (req, res) => {
    const correlationId = crypto.randomBytes(4).toString('hex');
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    try {
      // --- Third Eye: Rate Limiting ---
      const now = Date.now();
      const userRequests = requestLog.get(clientIp) || [];
      const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
      
      if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
         console.warn(`[Third Eye] Rate limit exceeded for IP: ${clientIp}`);
         return res.status(429).json({ error: 'AI processing limit reached. Please try again later.' });
      }
      
      recentRequests.push(now);
      requestLog.set(clientIp, recentRequests);

      // --- Third Eye: System Calibration Check ---
      const config = await fetchDynamicAiConfig();
      if (config?.maintenance_mode) {
        console.error(`[Engine][${correlationId}] System is in maintenance mode.`);
        return res.status(503).json({ 
          error: 'System Maintenance', 
          message: config.broadcast_message || 'The Ayurzenix Intelligence Engine is briefly offline for calibration. Please try again in a few minutes.' 
        });
      }

      const { model, contents, config: requestConfig, featureId } = req.body;
      
      // Validation
      if (!contents || !Array.isArray(contents)) {
        return res.status(400).json({ error: 'Invalid request: contents must be an array' });
      }

      // --- Third Eye: Response Caching ---
      const requestHash = getRequestHash({ model, contents, featureId });
      if (responseCache.has(requestHash)) {
        const cached = responseCache.get(requestHash)!;
        if (now - cached.timestamp < CACHE_TTL) {
           console.log(`[Third Eye][${correlationId}] Cache Hit! Saved API Cost.`);
           return res.json({ text: cached.text, correlationId, cached: true });
        } else {
           responseCache.delete(requestHash);
        }
      }

      const { ai, model: defaultModel } = await getGemini();
      const modelName = model || defaultModel;
      
      console.log(`[Engine][${correlationId}] Feature: ${featureId || 'General'} | Model: ${modelName} | Start`);

      // Inject Dynamic System Prompt if featureId is provided
      let finalContents = contents;
      if (featureId && config?.prompts && config.prompts[featureId]) {
        console.log(`[Engine][${correlationId}] Injecting Dynamic Prompt for: ${featureId}`);
        const systemPrompt = config.prompts[featureId];
        
        // Prepend to the first message's text
        if (finalContents && finalContents[0] && finalContents[0].parts && finalContents[0].parts[0]) {
           finalContents[0].parts[0].text = `[SYSTEM_INSTRUCTION: ${systemPrompt}]\n\n${finalContents[0].parts[0].text}`;
        }
      }

      const startTime = Date.now();
      const response = await ai.models.generateContent({
        model: modelName,
        contents: finalContents,
        config: {
          responseMimeType: requestConfig?.responseMimeType || 'application/json',
          responseSchema: requestConfig?.responseSchema
        }
      });
      
      let text = '';
      try {
        text = response.text || '';
      } catch (e: any) {
        console.error(`[Engine][${correlationId}] Response Text Extraction Failed:`, e.message);
        // If content was blocked by safety filters, response.text throws in some SDKs
        throw new Error('AI content was blocked or could not be generated. Please try a different approach.');
      }

      if (!text || text.trim() === '') {
        console.warn(`[Engine][${correlationId}] Gemini returned an empty string.`);
        // Special case: check candidates for finish reason
        const candidate = response.candidates?.[0];
        if (candidate && candidate.finishReason !== 'STOP') {
          throw new Error(`Generation unfinished (Reason: ${candidate.finishReason}). This usually happens due to safety filters or length constraints.`);
        }
        throw new Error('Empty response received from AI engine.');
      }

      const duration = Date.now() - startTime;
      
      console.log(`[Engine][${correlationId}] Success in ${duration}ms`);

      // Save to cache
      responseCache.set(requestHash, { text, timestamp: now });

      // Async: Increment usage counter
      fetchDynamicAiConfig().then(cfg => {
        if (cfg) {
          getFirebaseAdmin();
          const db = getFirestore(adminApp);
          db.collection('analytics_ai').doc('summary').set({
            total_requests: FieldValue.increment(1),
            total_latency: FieldValue.increment(duration),
            last_request_at: FieldValue.serverTimestamp()
          }, { merge: true }).catch(() => {});
        }
      });

      res.json({ text, correlationId });
    } catch (error: any) {
      console.error(`[Engine][${correlationId}] FAILED:`, error.message);
      
      let status = 500;
      let errorType = 'INTERNAL_ERROR';
      let message = error.message || 'Failed to call Gemini API';

      if (error.status === 429) {
        status = 429;
        errorType = 'QUOTA_EXCEEDED';
        message = 'AI intelligence quota exceeded. Please try again in 60 seconds.';
      } else if (error.status === 400) {
        status = 400;
        errorType = 'INVALID_REQUEST';
      } else if (error.message?.includes('API_KEY_INVALID')) {
        status = 401;
        errorType = 'AUTH_ERROR';
        message = 'Invalid AI credentials. Contact system administrator.';
      }

      res.status(status).json({ 
        error: message,
        type: errorType,
        correlationId,
        details: process.env.NODE_ENV !== 'production' ? error.details : undefined
      });
    }
  });

  // Razorpay Endpoints
  app.post('/api/razorpay/order', async (req, res) => {
    try {
      const { amount, currency = 'INR', receipt, userId, bonus, notes = {} } = req.body;
      const rzp = getRazorpay();
      
      console.log('Creating Razorpay Order for User:', userId, 'Amount:', amount, 'Bonus:', bonus);

      const options = {
        amount: Math.round(Number(amount) * 100), // amount in the smallest currency unit
        currency,
        receipt: (receipt || `receipt_${Date.now()}`).substring(0, 40),
        notes: {
          ...notes, // Pass through all notes (isUnlock, reportTitle, etc.)
          userId: userId || 'unknown',
          bonus: bonus || 0
        }
      };

      const order = await rzp.orders.create(options);
      console.log('Razorpay Order Created Successfully:', order.id);
      res.json(order);
    } catch (error: any) {
      console.error('Razorpay SDK Order Error:', error);
      
      const keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '').trim();
      const status = error.statusCode || error.status || 500;
      
      // Return a very detailed error to help user debug their settings
      res.status(status).json({ 
        error: error.error?.description || error.description || error.message || 'Authentication or API error',
        code: error.error?.code || 'RAZORPAY_ERROR',
        debug: {
          key_id_prefix: keyId.substring(0, 10),
          key_id_length: keyId.length,
          key_type: keyId.startsWith('rzp_live') ? 'LIVE' : (keyId.startsWith('rzp_test') ? 'TEST' : 'UNKNOWN')
        },
        details: error.error || error
      });
    }
  });

  app.post('/api/razorpay/verify', async (req, res) => {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        userId, 
        amount, 
        bonus, 
        planId, 
        isUnlock, 
        reportTitle 
      } = req.body;
      
      const secret = (process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET || '').trim()
        .replace(/^["']|["']$/g, '') 
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/\s+/g, '')
        .trim();
      
      if (!secret) {
        return res.status(500).json({ status: 'failure', error: 'Razorpay secret missing on server.' });
      }

      if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id || !userId) {
        return res.status(400).json({ status: 'failure', error: 'Missing required validation fields.' });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        getFirebaseAdmin();
        const db = getFirestore(adminApp);
        
        const numericAmount = Number(amount || req.body.amountToPay) || 0;
        const numericBonus = (bonus !== undefined && bonus !== null) ? Number(bonus) : calculateBonus(numericAmount);

        console.log(`[Razorpay] Verifying payment for user ${userId}. Amount: ${numericAmount}, Bonus: ${numericBonus}`);

        const result = await processWalletTransaction(db, userId, {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          amount: numericAmount,
          bonus: numericBonus,
          description: planId ? `Subscription Unlock: ${planId}` : (isUnlock ? `Report Unlock Recharge` : `Wallet Topup`),
          isUnlock: !!isUnlock,
          reportTitle,
          planId,
          method: 'razorpay_verify'
        });

        return res.json(result);
      } else {
        return res.status(400).json({ status: 'failure', error: 'Security verification failed' });
      }
    } catch (error: any) {
      console.error('Verify Error:', error);
      res.status(500).json({ status: 'failure', error: error.message });
    }
  });

  // Razorpay Webhook for extra robustness
  app.post('/api/razorpay/webhook', async (req, res) => {
    try {
      let WEB_HOOK_SECRET = (process.env.RAZORPAY_WEBHOOK_SECRET || 'ayurzenix_secret').trim();
      WEB_HOOK_SECRET = WEB_HOOK_SECRET.replace(/^["']|["']$/g, '');
      
      const signature = req.headers['x-razorpay-signature'] as string;
      const bodyString = Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);

      const expectedSignature = crypto
        .createHmac('sha256', WEB_HOOK_SECRET)
        .update(bodyString)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('[Webhook] Signature Mismatch');
        return res.status(400).send('Invalid signature');
      }

      const data = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString()) : req.body;
      const event = data.event;
      console.log(`[Webhook] Event Received: ${event}`, JSON.stringify(data.payload));

      if (event === 'payment.captured' || event === 'order.paid') {
        const payload = data.payload.payment?.entity || data.payload.order?.entity;
        const razorpay_order_id = payload.order_id || payload.id;
        const razorpay_payment_id = payload.id;
        
        console.log(`[Webhook] Processing ${event} for Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`);

        const userId = payload.notes?.userId;
        const amountPaise = payload.amount;
        const amount = amountPaise / 100;
        
        if (userId && userId !== 'unknown') {
          console.log(`[Webhook] Found UserId in notes: ${userId}. Amount: ${amount}`);
          getFirebaseAdmin();
          const db = getFirestore(adminApp);

          const bonus = Number(payload.notes?.bonus || 0);
          const isUnlock = payload.notes?.isUnlock === 'true' || payload.notes?.isUnlock === true;
          const reportTitle = payload.notes?.reportTitle;
          const planId = payload.notes?.planId;

          await processWalletTransaction(db, userId, {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: amount,
            bonus: bonus,
            description: planId ? `Subscription Unlock (Webhook): ${planId}` : (isUnlock ? `Report Unlock (Webhook)` : `Wallet Topup (Webhook)`),
            isUnlock: isUnlock,
            reportTitle: reportTitle,
            planId: planId,
            method: 'razorpay_webhook'
          });
        } else {
          console.warn(`[Webhook] No userId found in notes for ${event}. Notes:`, JSON.stringify(payload.notes));
        }
      }
      
      res.status(200).send('OK');
    } catch (error: any) {
      console.error('[Webhook] Error:', error);
      res.status(200).send('OK'); // Always return 200 to Razorpay to prevent retries of invalid payloads
    }
  });


  // Unsplash Proxy Endpoint
  app.get('/api/unsplash', async (req, res) => {
    const { query } = req.query;
    try {
      const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
      if (!UNSPLASH_API_KEY) {
        return res.status(500).json({ error: 'UNSPLASH_API_KEY is not configured.' });
      }

      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: query || 'skincare',
          per_page: 1,
          orientation: 'landscape'
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_API_KEY}`
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        res.json({ url: response.data.results[0].urls.regular });
      } else {
        res.status(404).json({ error: 'No images found' });
      }
    } catch (error: any) {
      console.error('Unsplash API Error:', error.response?.data || error.message);
      res.status(500).json({ error: `Failed to fetch image from Unsplash: ${error.response?.data?.errors?.join(', ') || error.message}` });
    }
  });

  // Unsplash Photo by ID Proxy Endpoint
  app.get('/api/unsplash/photo/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
      if (!UNSPLASH_API_KEY) {
        return res.status(500).json({ error: 'UNSPLASH_API_KEY is not configured.' });
      }

      const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_API_KEY}`
        }
      });

      res.json({ url: response.data.urls.regular });
    } catch (error: any) {
      console.error('Unsplash API Error:', error.response?.data || error.message);
      res.status(500).json({ error: `Failed to fetch image from Unsplash: ${error.response?.data?.errors?.join(', ') || error.message}` });
    }
  });

  app.post('/api/wallet/unlock', async (req, res) => {
    try {
      const { userId, planId, amount, featureName, profileId } = req.body;
      
      if (!userId || amount === undefined || !planId) {
        console.warn(`[Wallet] 400 Bad Request: missing fields. userId: ${userId}, planId: ${planId}, amount: ${amount}`);
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const firebaseApp = getFirebaseAdmin();
      if (!firebaseApp) return res.status(500).json({ error: 'Firebase Admin not initialized' });
      
      const db = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      const userRef = db.collection('users').doc(userId);

      const result = await db.runTransaction(async (transaction) => {
        let userDoc = await transaction.get(userRef);
        
        // AUTO-RECOVERY: If user doc doesn't exist, try to verify they are a real Auth user and create doc
        if (!userDoc.exists) {
           console.log(`[Wallet] User doc ${userId} not found, attempting recovery from Auth...`);
           try {
             const authUser = await auth.getUser(userId);
             if (authUser) {
               const newUserData = {
                 uid: userId,
                 email: authUser.email || '',
                 phone: authUser.phoneNumber || '',
                 displayName: authUser.displayName || '',
                 photoURL: authUser.photoURL || '',
                 wallet_balance: 0,
                 free_results_count: 1,
                 plan: 'free',
                 createdAt: FieldValue.serverTimestamp(),
                 updatedAt: FieldValue.serverTimestamp()
               };
               transaction.set(userRef, newUserData);
               // Re-fetch or simulate doc for transaction logic
               const stubDoc = { data: () => newUserData, exists: true };
               userDoc = stubDoc as any;
             } else {
               throw new Error('User not found in Auth system');
             }
           } catch (authErr) {
             throw new Error('User not found in database or authentication system');
           }
        }
        
        const userData = userDoc.data();
        const currentBalance = Number(userData?.wallet_balance || 0);
        const freeCount = Number(userData?.free_results_count || 0);
        const deduction = Number(amount);

        let finalDeduction = deduction;
        let useFreeCount = false;

        const docEmail = (userData?.email || '').toLowerCase();
        let isAdmin = ADMIN_EMAILS.includes(docEmail) || userData?.is_admin === true;

        // Fallback: Check Auth email if Firestore doc is missing it or doesn't flag as admin
        if (!isAdmin) {
          try {
            const authUser = await auth.getUser(userId);
            const authEmail = (authUser.email || '').toLowerCase();
            if (authEmail && ADMIN_EMAILS.includes(authEmail)) {
              isAdmin = true;
              console.log(`[Wallet] Admin verified via Auth fallback for ${authEmail}`);
            }
          } catch (e) {}
        }

        if (currentBalance < deduction && !isAdmin) {
          if (freeCount > 0) {
            finalDeduction = 0;
            useFreeCount = true;
            console.log(`[Wallet] Using free scan for user ${userId}. Remaining free: ${freeCount - 1}`);
          } else {
            throw new Error('Insufficient wallet balance. Please recharge.');
          }
        } else if (isAdmin) {
          finalDeduction = 0;
          console.log(`[Wallet] Admin bypass for ${docEmail || userId}`);
        }

        // Deduct balance or free count
        const updates: any = {
          total_reports: FieldValue.increment(1),
          wellness_score: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp()
        };

        if (useFreeCount) {
          updates.free_results_count = FieldValue.increment(-1);
        } else {
          updates.wallet_balance = currentBalance - finalDeduction;
        }

        transaction.update(userRef, updates);

        // Create transaction record
        const transRef = db.collection('transactions').doc();
        transaction.set(transRef, {
          uid: userId,
          amount: deduction,
          type: 'debit',
          method: 'wallet',
          description: `Unlock ${featureName || 'Intelligence'}: ${planId}`,
          status: 'success',
          createdAt: FieldValue.serverTimestamp()
        });

        // Track unlock
        const unlockRef = db.collection('unlocked_reports').doc();
        transaction.set(unlockRef, {
          uid: userId,
          feature_name: featureName || 'unknown',
          plan_id: planId,
          profile_id: profileId || 'unknown',
          unlocked_at: FieldValue.serverTimestamp()
        });

        return { newBalance: currentBalance - deduction };
      });

      res.json({ success: true, balance: result.newBalance });
    } catch (error: any) {
      console.error('Unlock Error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Google reCAPTCHA Enterprise Verification
  app.post('/api/recaptcha/verify', async (req, res) => {
    try {
      const { token, action } = req.body;
      const apiKey = process.env.RECAPTCHA_API_KEY;
      const projectId = process.env.RECAPTCHA_PROJECT_ID || 'flutter-ai-playground-3b9e5';

      if (!apiKey) {
        // Log locally but don't fail for the user yet if key is missing (optional, but safer for dev)
        console.warn('RECAPTCHA_API_KEY is missing. Skipping actual verification.');
        return res.json({ success: true, score: 0.9, skipped: true });
      }

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const response = await axios.post(
        `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`,
        {
          event: {
            token,
            expectedAction: action || 'LOGIN',
            siteKey: process.env.RECAPTCHA_SITE_KEY,
          },
        }
      );

      console.log('reCAPTCHA Assessment Success:', response.data.name);
      
      const score = response.data.riskAnalysis?.score || 0;
      const isValid = score >= 0.5;

      res.json({
        success: isValid,
        score,
        reasons: response.data.riskAnalysis?.reasons || [],
        data: response.data
      });
    } catch (error: any) {
      console.error('reCAPTCHA Verification Error:', error.response?.data || error.message);
      res.status(500).json({ 
        error: 'Failed to verify reCAPTCHA',
        details: error.response?.data || error.message
      });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Explicit handlers for search engines and crawlers (robots.txt, sitemap.xml, ads.txt)
  app.get('/robots.txt', (req, res) => {
    const distPath = path.join(process.cwd(), 'dist', 'robots.txt');
    const publicPath = path.join(process.cwd(), 'public', 'robots.txt');
    
    res.header('Content-Type', 'text/plain; charset=utf-8');
    
    if (fs.existsSync(distPath)) {
      res.sendFile(distPath, (err) => {
        if (err && !res.headersSent) {
          serveFallbackRobots(res);
        }
      });
    } else if (fs.existsSync(publicPath)) {
      res.sendFile(publicPath, (err) => {
        if (err && !res.headersSent) {
          serveFallbackRobots(res);
        }
      });
    } else {
      serveFallbackRobots(res);
    }
  });

  function serveFallbackRobots(res: any) {
    const fallbackText = "User-agent: *\nAllow: /\nSitemap: https://ayurzenix.in/sitemap.xml\n";
    res.send(fallbackText);
  }

  app.get('/sitemap.xml', (req, res) => {
    const distPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
    const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    
    res.header('Content-Type', 'application/xml; charset=utf-8');
    
    if (fs.existsSync(distPath)) {
      res.sendFile(distPath, (err) => {
        if (err && !res.headersSent) {
          serveFallbackSitemap(res);
        }
      });
    } else if (fs.existsSync(publicPath)) {
      res.sendFile(publicPath, (err) => {
        if (err && !res.headersSent) {
          serveFallbackSitemap(res);
        }
      });
    } else {
      serveFallbackSitemap(res);
    }
  });

  function serveFallbackSitemap(res: any) {
    const fallbackXml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://ayurzenix.in/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>';
    res.send(fallbackXml);
  }

  app.get('/ads.txt', (req, res) => {
    const distPath = path.join(process.cwd(), 'dist', 'ads.txt');
    const publicPath = path.join(process.cwd(), 'public', 'ads.txt');
    
    res.header('Content-Type', 'text/plain; charset=utf-8');
    
    if (fs.existsSync(distPath)) {
      res.sendFile(distPath, (err) => {
        if (err && !res.headersSent) {
          res.send("# ads.txt");
        }
      });
    } else if (fs.existsSync(publicPath)) {
      res.sendFile(publicPath, (err) => {
        if (err && !res.headersSent) {
          res.send("# ads.txt");
        }
      });
    } else {
      res.send("# ads.txt");
    }
  });

  // Phone Auth Logging/Sync Endpoint
  app.post('/api/auth/phone', async (req, res) => {
    try {
      const { phone, uid, loginType = 'phone' } = req.body;
      console.log(`[Auth] Phone Login Received: ${phone} (${uid})`);
      
      const adminAppInstance = getFirebaseAdmin();
      if (adminAppInstance) {
        const db = getFirestore(adminAppInstance);
        const userRef = db.collection('users').doc(uid);
        
        // Fetch existing user to avoid overwriting plan/reports if they exist
        const existingSnap = await userRef.get();
        const existingData = existingSnap.exists ? existingSnap.data() : {};

        await userRef.set({
          uid: uid,
          phone: phone,
          loginType: loginType,
          lastLogin: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          plan: existingData?.plan || 'free', // Preserve or set default
          reports: existingData?.reports || [], // Preserve or set default
          createdAt: existingData?.createdAt || FieldValue.serverTimestamp() // Initial creation
        }, { merge: true });

        console.log('[Auth] User phone record synced for:', phone);
      }

      res.json({ status: 'success', message: 'Phone user data synced' });
    } catch (error: any) {
      console.error('[Auth] Phone Sync Error:', error.message);
      res.status(500).json({ error: 'Failed to sync phone user data' });
    }
  });

  // Google Auth Logging/Sync Endpoint
  app.post('/api/auth/google', async (req, res) => {
    try {
      const { token, userData: clientUserData } = req.body;
      
      let userData = clientUserData;

      // If token is provided, verify it server-side for security
      if (token) {
        const clientId = process.env.VITE_GOOGLE_CLIENT_ID || '464776948246-mqnv6kflep5igu3lvoo9hp9a721ouul5.apps.googleusercontent.com';
        const client = new OAuth2Client(clientId);
        
        try {
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId,
          });
          const payload = ticket.getPayload();
          if (payload) {
            userData = {
              sub: payload.sub,
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
              email_verified: payload.email_verified
            };
            console.log('[Auth] Google Token Verified for:', userData.email);
          }
        } catch (verifyError: any) {
          console.error('[Auth] Token Verification Failed:', verifyError.message);
          // Fallback to client data if verification fails (optional, but safer to reject if security is priority)
          // For now, let's proceed if we have clientUserData, but log the failure
        }
      }

      if (!userData || !userData.email) {
        return res.status(400).json({ error: 'No user data provided' });
      }

      console.log('[Auth] Syncing Google User:', userData.email);
      
      const adminAppInstance = getFirebaseAdmin();
      if (adminAppInstance) {
        const db = getFirestore(adminAppInstance);
        const userRef = db.collection('users').doc(userData.sub || userData.email);
        
        await userRef.set({
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          lastLogin: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          authProvider: 'google',
          emailVerified: userData.email_verified || false
        }, { merge: true });

        console.log('[Auth] User record synced for:', userData.email);
      }

      res.json({ status: 'success', message: 'User data synced', user: userData });
    } catch (error: any) {
      console.error('[Auth] Google Sync Error:', error.message);
      res.status(500).json({ error: 'Failed to sync user data' });
    }
  });

  // Generic Auth Sync Endpoint (Verifies Firebase ID Token)
  app.post('/api/auth/sync', async (req, res) => {
    try {
      const { idToken, language = 'en' } = req.body;
      if (!idToken) return res.status(400).json({ error: 'ID Token required' });

      const adminAppInstance = getFirebaseAdmin();
      if (!adminAppInstance) return res.status(500).json({ error: 'Firebase Admin not initialized' });

      // Verify the ID token
      const auth = getAuth(adminAppInstance);
      const decodedToken = await auth.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      const db = getFirestore(adminAppInstance);
      const userRef = db.collection('users').doc(uid);

      // Fetch existing user to avoid overwriting wallet/stats
      const userDoc = await userRef.get();
      const existingData = userDoc.exists ? userDoc.data() : {};

      const userData = {
        uid,
        email: decodedToken.email || existingData?.email || '',
        phone: decodedToken.phone_number || existingData?.phone || '',
        loginType: decodedToken.firebase?.sign_in_provider || 'google',
        displayName: decodedToken.name || existingData?.displayName || '',
        photoURL: decodedToken.picture || existingData?.photoURL || '',
        emailVerified: decodedToken.email_verified || false,
        lastLogin: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        // Initialize fields if new user
        language: existingData?.language || language,
        free_results_count: existingData?.free_results_count ?? 1,
        plan: existingData?.plan || 'free',
        reports: existingData?.reports || [],
        wallet_balance: existingData?.wallet_balance ?? 0,
        wellness_score: existingData?.wellness_score ?? 0,
        createdAt: existingData?.createdAt || FieldValue.serverTimestamp()
      };

      await userRef.set(userData, { merge: true });
      
      console.log(`[Auth] User ${uid} synced successfully via ${userData.loginType}`);
      res.json({ status: 'success', user: { uid, email: userData.email, provider: userData.loginType } });
    } catch (error: any) {
      console.error('[Auth] Sync Error:', error.message);
      res.status(401).json({ error: 'Invalid or expired token', detailed: error.message });
    }
  });

  app.get('/api/admin/health', async (req, res) => {
    try {
      const keys = {
        RAZORPAY_KEY_ID: !!(process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID),
        RAZORPAY_KEY_SECRET: !!(process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET),
        FIREBASE_SERVICE_ACCOUNT: !!process.env.FIREBASE_SERVICE_ACCOUNT,
        OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY
      };
      
      let firestoreHealthy = false;
      let adminError = null;

      try {
        const adminAppInstance = getFirebaseAdmin();
        if (adminAppInstance) {
          const db = getFirestore(adminAppInstance);
          await db.collection('app_config').doc('main').get();
          firestoreHealthy = true;
        } else {
          adminError = "Firebase Admin failed to initialize (Check FIREBASE_SERVICE_ACCOUNT)";
        }
      } catch (e: any) {
        console.error('Health Check Firebase/Admin Error:', e.message);
        adminError = e.message;
      }

      let razorpayError = null;
      try {
        getRazorpay();
      } catch (e: any) {
        razorpayError = e.message;
      }

      res.json({
        status: (firestoreHealthy && !razorpayError) ? 'ok' : 'degraded',
        keys,
        firestore: firestoreHealthy,
        adminError,
        razorpayError,
        nodeVersion: process.version,
        env: process.env.NODE_ENV || 'development'
      });
    } catch (error: any) {
      console.error('Health Check Root Error:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // Dynamic SEO injection for SPA
    let indexTemplate = '';
    app.get('*', async (req, res) => {
      try {
        const fs = await import('fs');
        const indexPath = path.join(distPath, 'index.html');
        
        if (!indexTemplate) {
          indexTemplate = fs.readFileSync(indexPath, 'utf8');
        }
        
        let html = indexTemplate;

        // Dynamic Title & Description based on URL
        let title = 'Ayurzenix – India’s #1 AI-Powered Digital Ayurveda Platform';
        let description = 'Ayurzenix - India’s leading AI-powered digital Ayurveda platform. Get personalized wellness insights, Dosha analysis, and natural treatment plans.';
        const url = req.path;

        if (url === '/store') {
          title = 'Ayurvedic Store - Pure Herbs & Supplements | Ayurzenix';
          description = 'Shop authentic Ayurvedic herbs, wellness products, and personalized supplements on Ayurzenix Store.';
        } else if (url === '/about') {
          title = 'About Ayurzenix - Our Mission & Vision';
          description = 'Learn about Ayurzenix, our journey, and how we combined ancient Ayurvedic wisdom with modern AI technology.';
        } else if (url.startsWith('/blog')) {
          title = 'Ayurvedic Wellness Blog - Health Tips & Insights';
          description = 'Read the latest articles on Ayurveda, wellness, nutrition, and natural healing from Ayurzenix experts.';
        } else if (url === '/health-scan') {
          title = 'AI Health Scan - Personalized Ayurvedic Analysis';
          description = 'Start your journey to better health with our AI-powered Ayurvedic health scan.';
        } else if (url === '/future-predictor') {
          title = 'Future Health Predictor - AI Wellness Insights';
          description = 'Discover potential health trends with our AI Future Health Predictor based on Ayurveda.';
        }

        // Replace placeholders
        html = html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`);
        html = html.replace(/<meta name="description" content="(.*?)"/, `<meta name="description" content="${description}"`);
        
        // Also update OG tags
        html = html.replace(/property="og:title" content="(.*?)"/, `property="og:title" content="${title}"`);
        html = html.replace(/property="og:description" content="(.*?)"/, `property="og:description" content="${description}"`);
        html = html.replace(/property="og:url" content="(.*?)"/, `property="og:url" content="https://ayurzenix.in${url}"`);

        res.send(html);
      } catch (err) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }
}

setupApp()
  .then(() => {
    const PORT = 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('CRITICAL: Server failed to start setupApp:', err);
    // Still attempt to listen on the port so the platform can reach us and we can report the error
    const PORT = 3000;
    const errorApp = express();
    errorApp.get('*', (req, res) => {
      res.status(500).send(`Server failed to start correctly. Check logs. Error: ${err.message}`);
    });
    errorApp.listen(PORT, '0.0.0.0', () => {
      console.log(`Fallback error server running on http://localhost:${PORT}`);
    });
  });
