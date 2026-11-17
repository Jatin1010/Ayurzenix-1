# Ayurzenix - Production Deployment & AI Validation

This document outlines the steps to ensure the Ayurzenix Engine is production-ready across various cloud environments.

## 🚀 Deployment Checklist

### 1. Environment Configuration
- [ ] **Secrets Loaded**: Ensure `GEMINI_API_KEY` is set in the production environment (not just `.env`).
- [ ] **Service Account**: `FIREBASE_SERVICE_ACCOUNT` must be the raw JSON string from your Firebase Console.
- [ ] **Public Vars**: `VITE_GEMINI_API_KEY` is NOT required on the frontend since we use the secure proxy.
- [ ] **Model Selection**: Default is `gemini-1.5-flash`. Use the Ayurzenix Admin Panel to switch to `pro` for complex analysis.

### 2. Infrastructure Health
- [ ] **Node.js Runtime**: Ensure Node 20+ is used.
- [ ] **Dependencies**: All packages in `package.json` are installed correctly.
- [ ] **Build Check**: `npm run build` succeeds without TypeScript errors.

### 3. AI Safety & Compliance
- [ ] **Safety Filters**: Verify the AI responds gracefully to prohibited prompts (medical claims).
- [ ] **Disclaimer**: Every AI output must include the Ayurzenix legal disclaimer.

## 🛠 Platform Setup

### Firebase Hosting + Cloud Run (Recommended)
1. Initialize Firebase: `firebase init`
2. Configure rewriting: Point all `/api` traffic to your Cloud Run service.
3. Deploy: `firebase deploy`

### Vercel
1. Link your repository.
2. Add Environment Variables in the project settings.
3. Vercel will automatically use `vercel.json` for routing.

### Netlify
1. Link your repository.
2. Set build command to `npm run build` and directory to `dist`.
3. Add environment variables.

## 🩺 Diagnostics
To verify the engine after deployment, navigate to the **Ayurzenix Admin Dashboard** (Admin access required) or call the diagnostic endpoint directly:

`POST /api/admin/ai-diagnostic`

Expected success payload:
```json
{
  "success": true,
  "responseText": "Ayurzenix Engine Operational",
  "latency": 450,
  "modelUsed": "gemini-1.5-flash"
}
```

## ⚠️ Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | API Key invalid | Check GEMINI_API_KEY secret |
| 429 Too Many Requests | Quota exceeded | Switch to a Pay-as-you-go Google Cloud project |
| 503 Service Unavailable | Maintenance Mode | Check Firestore `system_config/ai` flags |
| Empty Prompt Error | Frontend Bug | Check component state before calling AI service |
