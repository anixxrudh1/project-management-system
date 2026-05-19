# GitHub Actions CI/CD Deployment Setup Guide

This document explains how to configure the GitHub Actions workflow for automated deployment.

## Workflow Overview

The workflow (`deploy.yml`) performs the following steps on every push to the `main` branch:

1. **Build Docker Images** - Builds and tags both backend and frontend Docker images
2. **Push to Docker Hub** - Pushes images to your Docker Hub repository
3. **Deploy to Render** - Triggers backend deployment on Render
4. **Deploy to Vercel** - Deploys frontend to Vercel with production environment

## Required Secrets Configuration

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** and add the following secrets:

### Docker Hub Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKER_USERNAME` | Your Docker Hub username | `anixxrudh1` |
| `DOCKER_PASSWORD` | Your Docker Hub password or access token | (generate from Docker Hub settings) |

**How to get Docker credentials:**
1. Go to https://hub.docker.com/settings/security
2. Create a new access token
3. Use your username and the token as `DOCKER_PASSWORD`

### Render Deployment

| Secret Name | Description | How to get |
|-------------|-------------|-----------|
| `RENDER_DEPLOY_HOOK` | Render deployment webhook URL | See below |

**How to get Render Webhook:**
1. Go to your Render dashboard
2. Select your backend service
3. Go to **Settings** → **Deploy Hook**
4. Copy the webhook URL and add it as the `RENDER_DEPLOY_HOOK` secret

### Vercel Deployment

| Secret Name | Description | How to get |
|-------------|-------------|-----------|
| `VERCEL_TOKEN` | Vercel authentication token | See below |
| `VERCEL_ORG_ID` | Your Vercel organization ID | See below |
| `VERCEL_PROJECT_ID` | Your Vercel project ID for frontend | See below |

**How to get Vercel credentials:**

1. **Vercel Token:**
   - Go to https://vercel.com/account/tokens
   - Create a new token with full scope
   - Copy and add as `VERCEL_TOKEN` secret

2. **Organization ID:**
   - Go to https://vercel.com/account/settings
   - Find your Team/Organization ID
   - Add as `VERCEL_ORG_ID` secret

3. **Project ID:**
   - Go to your Vercel project settings
   - Copy the Project ID
   - Add as `VERCEL_PROJECT_ID` secret

## Docker Image Naming

Images will be pushed with the following tags:
- `docker.io/{DOCKER_USERNAME}/project-management-backend:latest`
- `docker.io/{DOCKER_USERNAME}/project-management-backend:{branch}-{sha}`
- `docker.io/{DOCKER_USERNAME}/project-management-frontend:latest`
- `docker.io/{DOCKER_USERNAME}/project-management-frontend:{branch}-{sha}`

## Workflow Triggers

The workflow triggers on:
- **Push to main branch** - Full deployment pipeline
- **Pull requests to main** - Only builds images (no deployment)

## Monitoring Deployments

1. **GitHub Actions:** Check workflow status in your repo → **Actions** tab
2. **Docker Hub:** View pushed images at https://hub.docker.com/repositories
3. **Render:** Check deployment logs in your Render dashboard
4. **Vercel:** Check deployment logs in your Vercel dashboard

## Troubleshooting

### Docker Hub Push Fails
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` are correct
- Ensure the Docker password is an access token, not your account password
- Check that your Docker Hub account has push permissions

### Render Deployment Doesn't Trigger
- Verify `RENDER_DEPLOY_HOOK` URL is correctly copied
- Ensure the webhook URL hasn't expired
- Check Render service logs for any errors

### Vercel Deployment Fails
- Verify `VERCEL_TOKEN` has necessary permissions
- Ensure `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct
- Check that the `frontend` directory structure matches Vercel's expectations

## Optional: Environment Variables

If your applications need environment variables during deployment:

1. **For Render:** Add environment variables in Render dashboard
2. **For Vercel:** Add environment variables in Vercel project settings

## Next Steps

1. Add all required secrets to your GitHub repository
2. Make a test commit to the main branch
3. Watch the GitHub Actions workflow execute
4. Verify deployments in Render and Vercel dashboards
5. Check the live applications at their respective URLs
