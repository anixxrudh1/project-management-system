# Deployment Checklist

Follow this checklist to deploy your application to Vercel and Render.

## Phase 1: Preparation

- [ ] GitHub account with repository pushed
- [ ] Vercel account created
- [ ] Render account created
- [ ] Backend `server.js` uses `process.env.PORT`
- [ ] Frontend configured with `VITE_API_URL`

## Phase 2: Backend Deployment (Render)

### Database Setup
- [ ] Log in to Render dashboard
- [ ] Create MongoDB database
- [ ] Note database connection string
- [ ] Add to environment variables

### Backend Service
- [ ] Create Web Service on Render
- [ ] Select GitHub repository
- [ ] Set build command: `npm install`
- [ ] Set start command: `node server.js`
- [ ] Add environment variables:
  - [ ] `MONGO_URI` = MongoDB connection string
  - [ ] `JWT_SECRET` = Secure random string
  - [ ] `NODE_ENV` = `production`
- [ ] Wait for deployment to complete
- [ ] Copy Live URL: `https://your-backend-url.onrender.com`
- [ ] Test backend with: `curl https://your-backend-url.onrender.com`
- [ ] Verify API endpoints respond

### Deployment Webhook
- [ ] Go to Settings → Deploy Hook
- [ ] Copy webhook URL
- [ ] Add to GitHub secrets as `RENDER_DEPLOY_HOOK`

## Phase 3: Frontend Deployment (Vercel)

### Initial Setup
- [ ] Log in to Vercel dashboard
- [ ] Connect GitHub repository
- [ ] Select `project-management-system` repo

### Project Configuration
- [ ] Click "Import"
- [ ] Set Framework: `Vite`
- [ ] Set Root Directory: `./frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Environment Variables
- [ ] Add `VITE_API_URL` = Your Render backend URL
- [ ] Set for: Production, Preview, Development

### Deployment
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy Production URL: `https://your-frontend-url.vercel.app`
- [ ] Test frontend loads in browser

### GitHub Integration
- [ ] Copy Vercel Project ID
- [ ] Copy Vercel Org ID
- [ ] Generate Vercel Token from https://vercel.com/account/tokens
- [ ] Add to GitHub secrets:
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`

## Phase 4: Integration & Testing

### Connect Services
- [ ] Update frontend environment with backend URL
- [ ] Redeploy frontend from Vercel
- [ ] Test API calls from frontend to backend

### End-to-End Testing
- [ ] Load frontend in browser
- [ ] Test login functionality
- [ ] Create a project
- [ ] Create a task
- [ ] Update task status
- [ ] Delete project/task
- [ ] Verify all CRUD operations work

### Monitor Logs
- [ ] Check Render backend logs for errors
- [ ] Check Vercel frontend logs for errors
- [ ] Check MongoDB for data persistence

## Phase 5: GitHub Actions Setup

- [ ] All secrets configured in GitHub
- [ ] Push new commit to main branch
- [ ] Watch GitHub Actions workflow execute
- [ ] Verify Docker images build successfully
- [ ] Verify Render deployment triggered
- [ ] Verify Vercel deployment triggered
- [ ] Test updated application

## Environment Variables Summary

### Render Backend (.env or Environment Variables)
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### Vercel Frontend
```
VITE_API_URL=https://your-backend.onrender.com
```

### GitHub Secrets
```
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=docker-access-token
RENDER_DEPLOY_HOOK=your-render-webhook-url
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

## Common Issues

### Backend Won't Start
- [ ] Check PORT environment variable is set
- [ ] Check MongoDB connection string is correct
- [ ] View Render logs for error details
- [ ] Ensure all npm dependencies installed

### Frontend Can't Connect to Backend
- [ ] Check `VITE_API_URL` environment variable
- [ ] Verify backend service is running
- [ ] Check browser console for CORS errors
- [ ] Verify API endpoints are correct

### GitHub Actions Fail
- [ ] Check all secrets are configured
- [ ] Verify secret values are correct
- [ ] Check Docker Hub credentials
- [ ] Review action logs for specific errors

## Deployment URLs

After completion, you'll have:
- **Frontend:** https://project-management-frontend-xxx.vercel.app
- **Backend:** https://project-management-backend-xxx.onrender.com
- **Database:** MongoDB on Render
- **GitHub Repository:** https://github.com/anixxrudh1/project-management-system

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Status:** Start with Phase 1 and work through each phase systematically.
