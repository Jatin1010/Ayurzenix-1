/**
 * Ayurzenix Engine - Standalone Firebase Functions Proxy
 * This is a reference implementation for serverless scaling.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

admin.initializeApp();

export const generateAiIntelligence = functions
  .runWith({ secrets: ['GEMINI_API_KEY'] })
  .https.onCall(async (data, context) => {
    // 1. Authentication Check
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'The Ayurzenix Engine requires an active session.');
    }

    const { model, contents, config } = data;

    // 2. Secret Retrieval
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Engine intelligence key not configured.');
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelInstance = genAI.getGenerativeModel({ 
        model: model || 'gemini-1.5-flash',
        generationConfig: config
      });

      const result = await modelInstance.generateContent({ contents });
      const response = await result.response;
      
      return { 
        text: response.text(),
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Gemini Logic Failure:', error);
      throw new functions.https.HttpsError('internal', error.message || 'AI generation failed');
    }
  });
