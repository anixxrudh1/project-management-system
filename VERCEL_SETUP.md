# Vercel Deployment Guide

## Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub repository connected to Vercel
- Vercel CLI (optional, but useful)

## Step 1: Create Vercel Account & Connect GitHub

1. Go to https://vercel.com/signup
2. Sign up with GitHub (recommended for easier integration)
3. Authorize Vercel to access your GitHub account
4. Your account is ready!

## Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Log in to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository: `project-management-system`
4. Click **"Import"**
5. Configure settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variables (if needed):
   - `VITE_API_URL`: `https://your-render-backend-url.com` (add after Render deployment)
7. Click **"Deploy"**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project
cd "d:\CODES\project management AG"

# Deploy frontend
vercel --cwd frontend --prod
```

**During deployment, Vercel will ask:**
- Set up and deploy? → Yes
- Which scope? → Your account
- Link to existing project? → No
- Project name? → project-management-frontend
- Directory? → ./frontend
- Override settings? → No
- Then wait for deployment to complete

## Step 3: Get Your Vercel Deployment URL

After deployment, you'll see:
```
✓ Production: https://project-management-frontend-xxx.vercel.app
```

This is your frontend URL! Share this with your backend team.

## Step 4: Configure Environment Variables

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add your backend API URL:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-render-backend-url.com` (update after Render deployment)
   - **Environments:** Production, Preview, Development
3. Click **"Add"**
4. Redeploy: Click **"Deployments"** → Latest → **"Redeploy"**

## Vercel Project Info (Save for later)

After deployment, save this info:
- **Project Name:** 
- **Project ID:** 
- **Deployment URL:** https://project-management-frontend-xxx.vercel.app
- **Org ID:** (from Vercel settings)

## Useful Vercel Commands

```bash
# View project info
vercel projects ls

# Check deployments
vercel deployments --cwd frontend

# View environment variables
vercel env ls --cwd frontend

# View logs
vercel logs project-management-frontend
```

## Troubleshooting Vercel

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure `package.json` scripts are correct
- Verify all dependencies are listed

### "Cannot find module" Error
```bash
cd frontend
npm install
vercel --prod
```

### Port/Environment Issues
- Add `VITE_API_URL` environment variable
- Update `frontend/vite.config.js` if needed

## Next: Deploy Backend to Render

Once your frontend is deployed, proceed with Render deployment for the backend.
