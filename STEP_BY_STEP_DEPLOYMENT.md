# Complete Step-by-Step Deployment Guide

## Overview
You'll deploy your application in 3 main steps:
1. **Backend to Render** (with MongoDB database)
2. **Frontend to Vercel**
3. **Connect them together**

---

## STEP 1: Deploy Backend to Render

### 1.1 Create a Render Account
1. Go to https://render.com
2. Click **Sign up**
3. Choose **GitHub** option
4. Click **Authorize render-io** to connect your GitHub account
5. GitHub will ask permission → Click **Authorize**
6. You're now logged into Render!

### 1.2 Deploy MongoDB Database (First!)
1. In Render dashboard, click **New +** button (top right)
2. Select **MongoDB**
3. Fill in the details:
   - **Name:** `project-management-db`
   - **Region:** Select the one closest to you (e.g., Frankfurt, Singapore, Virginia)
   - **Plan:** Choose **Free** (for testing)
4. Click **Create Database**
5. **Wait 2-5 minutes** for database to be created
6. Once ready, you'll see a green checkmark ✓
7. Click on your database
8. Copy the **Internal Database URL** (it looks like: `mongodb://...`)
   - **Important:** Copy the INTERNAL URL, not the External one
   - Save this somewhere safe - you'll need it!

### 1.3 Deploy Backend Service
1. In Render dashboard, click **New +** button again
2. Select **Web Service**
3. Connect your GitHub:
   - Look for `project-management-system` repository
   - Click **Connect** next to it
   - If you don't see it, click **Search** and search for it
4. Fill in the service details:
   - **Name:** `project-management-backend`
   - **Region:** Same as your database
   - **Branch:** `main`
   - **Runtime:** `Node` (should be auto-selected)
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Choose **Free**
5. Scroll down to **Advanced** section
6. Click **Add Environment Variable** and add these:

   | Key | Value |
   |-----|-------|
   | `PORT` | `5000` |
   | `MONGO_URI` | Paste the Internal Database URL you copied |
   | `JWT_SECRET` | `your-super-secret-jwt-key-12345` (any random string) |
   | `NODE_ENV` | `production` |

7. Click **Create Web Service**
8. **Wait 3-5 minutes** for deployment
9. You'll see a **Live URL** at the top, like: `https://project-management-backend-xxx.onrender.com`
   - **Copy this URL** - you'll need it for the frontend!
10. To verify it's working, click the URL to open it
    - You should see: `API is running...`

### 1.4 Get Your Deploy Webhook (For GitHub Actions)
1. In your Render service dashboard
2. Go to **Settings** (scroll down)
3. Find **Deploy Hook** section
4. Copy the URL next to it
5. Go to GitHub: https://github.com/anixxrudh1/project-management-system/settings/secrets/actions
6. Click **New repository secret**
7. **Name:** `RENDER_DEPLOY_HOOK`
8. **Value:** Paste the deploy hook URL
9. Click **Add secret**

---

## STEP 2: Deploy Frontend to Vercel

### 2.1 Create a Vercel Account
1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **GitHub**
4. Click **Authorize Vercel**
5. GitHub will ask permission → Click **Authorize**
6. You're now logged into Vercel!

### 2.2 Deploy Frontend
1. In Vercel dashboard, click **Add New...** button
2. Select **Project**
3. Find your repository:
   - Search for `project-management-system`
   - Click **Import**
4. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./frontend`
   - **Build Command:** `npm run build` (should be auto-filled)
   - **Output Directory:** `dist` (should be auto-filled)
5. Click **Environment Variables**
6. Add new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Render backend URL (e.g., `https://project-management-backend-xxx.onrender.com`)
   - **Set it for:** All environments (Production, Preview, Development)
7. Click **Deploy**
8. **Wait 3-5 minutes** for deployment
9. Once done, you'll see a **Production** URL, like: `https://project-management-frontend-xxx.vercel.app`
   - **Copy this URL** - this is where users will go!
10. Click the URL to verify frontend loads correctly

### 2.3 Get Your Vercel Credentials (For GitHub Actions)
1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Name it: `GitHub-CI-CD`
4. Click **Create**
5. Copy the token
6. Go to GitHub secrets: https://github.com/anixxrudh1/project-management-system/settings/secrets/actions
7. Click **New repository secret**
8. **Name:** `VERCEL_TOKEN`
9. **Value:** Paste the token
10. Click **Add secret**

**Get Organization ID:**
1. Go to https://vercel.com/account/settings
2. Look for **Team ID** or **User ID** (your personal org)
3. Copy it
4. Go to GitHub secrets
5. Click **New repository secret**
6. **Name:** `VERCEL_ORG_ID`
7. **Value:** Paste the ID
8. Click **Add secret**

**Get Project ID:**
1. In Vercel dashboard, click on your project
2. Go to **Settings**
3. Look for **Project ID** section
4. Copy the ID
5. Go to GitHub secrets
6. Click **New repository secret**
7. **Name:** `VERCEL_PROJECT_ID`
8. **Value:** Paste the ID
9. Click **Add secret**

---

## STEP 3: Add Docker Hub Secrets (For GitHub Actions)

1. Go to https://hub.docker.com/settings/security
2. Click **New Access Token**
3. Name it: `GitHub-Actions`
4. Click **Create**
5. Copy the token
6. Go to GitHub secrets: https://github.com/anixxrudh1/project-management-system/settings/secrets/actions
7. **First secret:**
   - **Name:** `DOCKER_USERNAME`
   - **Value:** Your Docker Hub username
   - Click **Add secret**
8. **Second secret:**
   - **Name:** `DOCKER_PASSWORD`
   - **Value:** The token you just created
   - Click **Add secret**

---

## STEP 4: Test Everything Works

### Test Backend
1. Open your Render backend URL in browser
2. Should see: `API is running...`
3. To test login endpoint, you can use curl or Postman:
   ```
   POST https://your-backend-url.onrender.com/api/auth/login
   Headers: Content-Type: application/json
   Body: {
     "email": "user1@example.com",
     "password": "password123"
   }
   ```

### Test Frontend
1. Open your Vercel frontend URL in browser
2. Should see the login page
3. Try logging in with:
   - Email: `user1@example.com`
   - Password: `password123`
4. Should login successfully and see the dashboard
5. Try creating a new project
6. Try creating tasks
7. All should work!

---

## STEP 5: Enable Automatic Deployments

Now every time you push code to GitHub, it will automatically:
1. Build Docker images
2. Push to Docker Hub
3. Deploy backend to Render
4. Deploy frontend to Vercel

**To test this:**
1. Make a small change to your code (e.g., edit a file)
2. Commit and push to main: `git push`
3. Go to GitHub: https://github.com/anixxrudh1/project-management-system/actions
4. You should see a workflow running
5. Wait for it to complete (green checkmark ✓)
6. Check Render and Vercel dashboards to see new deployments

---

## Summary of All GitHub Secrets You Need

Go to: https://github.com/anixxrudh1/project-management-system/settings/secrets/actions

Add these 7 secrets:

| Name | Where to Get It |
|------|-----------------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token (Settings → Security) |
| `RENDER_DEPLOY_HOOK` | Render service → Settings → Deploy Hook |
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | vercel.com/account/settings |
| `VERCEL_PROJECT_ID` | Vercel project → Settings |
| `RENDER_DEPLOY_HOOK` | Render service settings |

---

## Your Final URLs

After everything is done, you'll have:

- **Frontend:** https://project-management-frontend-xxx.vercel.app
- **Backend API:** https://project-management-backend-xxx.onrender.com
- **GitHub Repo:** https://github.com/anixxrudh1/project-management-system
- **GitHub Actions:** https://github.com/anixxrudh1/project-management-system/actions

---

## Troubleshooting Quick Fixes

### Backend won't start on Render
- Check Render logs (click "Logs" button)
- Make sure `MONGO_URI` is correctly set
- Make sure `PORT` is set to 5000

### Frontend can't connect to backend
- Check browser console for errors
- Make sure `VITE_API_URL` is set correctly
- Make sure it starts with `https://`

### GitHub Actions failing
- Check all 7 secrets are added
- Make sure secret values are correct
- Check GitHub Actions logs for specific errors

### Database connection fails
- Use the **INTERNAL** MongoDB URL, not external
- Check database is running in Render

---

**You're ready to deploy! Start with Step 1 and follow each step carefully. 🚀**
