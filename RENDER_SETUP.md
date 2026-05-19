# Render Deployment Guide

## Prerequisites
- Render account (free at https://render.com)
- GitHub repository connected to Render
- Backend code in repository
- MongoDB database (Render provides free tier)

## Step 1: Create Render Account & Connect GitHub

1. Go to https://render.com
2. Click **"Sign up"** → Select **"GitHub"**
3. Authorize Render to access your GitHub account
4. Your account is ready!

## Step 2: Deploy MongoDB Database

Render provides a free tier MongoDB database. Here's how to set it up:

1. Log in to https://dashboard.render.com
2. Click **"New+"** → **"MongoDB"**
3. Configure:
   - **Name:** `project-management-db`
   - **Region:** Choose closest to you
   - **Plan:** Free (for development)
4. Click **"Create Database"**
5. Wait for database to be created (2-5 minutes)
6. Copy the **Internal Database URL** when ready

Example format:
```
mongodb://localhost:27017/project-management
```

On Render, it looks like:
```
mongodb+srv://username:password@cluster.mongodb.net/project-management
```

## Step 3: Deploy Backend Service

### Using Render Dashboard

1. Log in to https://dashboard.render.com
2. Click **"New+"** → **"Web Service"**
3. Select your GitHub repository: `project-management-system`
4. Configure:
   - **Name:** `project-management-backend`
   - **Region:** Select your region
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free (for testing)
5. Click **"Advanced"** and add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management
   JWT_SECRET=your-secret-key-here
   NODE_ENV=production
   ```
6. Click **"Create Web Service"**
7. Wait for deployment (3-5 minutes)

### Using Render CLI (Alternative)

```bash
# Install Render CLI
npm install -g @render-web-cli/cli

# Or use curl to trigger deployment via webhook (see below)
```

## Step 4: Configure Environment Variables

After service is created:

1. Go to your service on Render dashboard
2. Click **"Settings"** → **"Environment"**
3. Update each variable:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`
4. Click **"Save Changes"**
5. Render will automatically redeploy with new variables

## Step 5: Get Deployment URL

After successful deployment, you'll see:
```
✓ Live URL: https://project-management-backend-xxx.onrender.com
```

This is your backend URL! Use this in your frontend environment variables.

## Step 6: Update Render Deploy Webhook (for GitHub Actions)

1. Go to your Render service → **Settings**
2. Scroll to **"Deploy Hook"**
3. Copy the webhook URL
4. Add to your GitHub repository:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Create new secret: `RENDER_DEPLOY_HOOK`
   - Paste the webhook URL
5. Now GitHub Actions will auto-deploy on push!

## Render Project Info (Save for later)

After deployment, save this info:
- **Service Name:** `project-management-backend`
- **Service ID:** (from Render dashboard URL)
- **Live URL:** https://project-management-backend-xxx.onrender.com
- **MongoDB URL:** (from database setup)
- **Deploy Webhook:** (from settings)

## Testing Your Backend

```bash
# Test if backend is running
curl https://project-management-backend-xxx.onrender.com/health

# Or test with auth endpoint
curl -X POST https://project-management-backend-xxx.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"password123"}'
```

## Connecting Frontend to Backend

Update your frontend environment:

1. **In frontend/.env.production:**
   ```
   VITE_API_URL=https://project-management-backend-xxx.onrender.com
   ```

2. **In Vercel environment variables:**
   - Add `VITE_API_URL` with your Render backend URL

3. Redeploy frontend from Vercel dashboard

## Database Management

### Access MongoDB on Render

1. Go to your database on Render dashboard
2. Click **"Connect"** → **"MongoDB Shell"**
3. Or use MongoDB Compass:
   - Connect URL: `mongodb+srv://username:password@cluster.mongodb.net/project-management`

### Seed Initial Data

```bash
# Set environment variable and run seed
set MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management
node backend/seed.js
```

## Monitoring & Logs

1. Go to Render dashboard → Your service
2. Click **"Logs"** to view application logs
3. Check for errors or issues

## Free Tier Limits

- **Web Service:** 750 hours/month (enough for 24/7 on free tier)
- **Database:** 512 MB storage
- **Memory:** 512 MB RAM
- **Auto-sleep:** Services sleep after 15 minutes of inactivity (then wake on request)

## Upgrading to Paid Tier

When you need:
- Always-on instances (no auto-sleep)
- More storage/memory
- Custom domains

1. Click **"Plan"** on your service
2. Select appropriate tier
3. Billing updates immediately

## Troubleshooting Render

### Service Fails to Start
- Check Logs for error messages
- Verify `Start Command` is correct
- Ensure all environment variables are set

### Cannot Connect to Database
- Verify `MONGO_URI` is correct
- Check MongoDB is deployed and running
- Test connection locally first

### Deployment Fails
- Check build logs for errors
- Ensure `package.json` has all dependencies
- Verify `Build Command` is correct

### Port Issues
- Render assigns port dynamically
- Ensure backend uses `process.env.PORT`
- Should be already configured in your code

## Next Steps

1. Deploy MongoDB database
2. Deploy backend service
3. Get backend URL
4. Update frontend with backend URL
5. Deploy frontend to Vercel
6. Test both services together
