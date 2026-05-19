# CI/CD Workflow Documentation

## Overview

This project uses GitHub Actions for continuous integration and continuous deployment (CI/CD). The workflow automates building, testing, and deploying the application to multiple platforms.

## Workflow File Location

`.github/workflows/deploy.yml`

## Workflow Jobs

### 1. Build and Push (`build-and-push`)

**Triggers:** On every push (including PRs)

**What it does:**
- Checks out the code
- Sets up Docker Buildx for multi-platform builds
- Logs into Docker Hub
- Builds backend Docker image with tags:
  - `latest`
  - Branch name
  - Git SHA (commit hash)
- Builds frontend Docker image with same tagging scheme
- Pushes both images to Docker Hub

**Docker Images Created:**
```
docker.io/{DOCKER_USERNAME}/project-management-backend:latest
docker.io/{DOCKER_USERNAME}/project-management-backend:main-{sha}
docker.io/{DOCKER_USERNAME}/project-management-frontend:latest
docker.io/{DOCKER_USERNAME}/project-management-frontend:main-{sha}
```

**Performance:** Uses GitHub Actions cache to speed up subsequent builds

### 2. Deploy Backend to Render (`deploy-backend-render`)

**Triggers:** Only on push to main branch (not on PRs)

**What it does:**
- Triggers Render's deploy webhook
- Notifies Render to pull and deploy the latest backend image
- Includes commit information for tracking

**Requirements:**
- `RENDER_DEPLOY_HOOK` secret configured

**Status Checks:**
- If `RENDER_DEPLOY_HOOK` is not configured, the job will warn but not fail

### 3. Deploy Frontend to Vercel (`deploy-frontend-vercel`)

**Triggers:** Only on push to main branch (not on PRs)

**What it does:**
- Uses Vercel CLI to deploy the frontend
- Deploys to production environment
- Includes all necessary credentials and configuration

**Requirements:**
- `VERCEL_TOKEN` secret configured
- `VERCEL_ORG_ID` secret configured
- `VERCEL_PROJECT_ID` secret configured

**Status Checks:**
- If Vercel secrets are not configured, the job will warn but not fail

## GitHub Secrets Configuration

Required secrets in GitHub repository settings:

### Docker Hub
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token (not password)

### Render
- `RENDER_DEPLOY_HOOK` - Webhook URL from Render

### Vercel
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization/team ID
- `VERCEL_PROJECT_ID` - Vercel project ID

## How to Add Secrets

1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

## Workflow Execution

### On Each Push to Main
```
Push to main
    ↓
Build & Push Docker Images
    ↓
    ├─ Deploy to Render (Backend)
    │
    └─ Deploy to Vercel (Frontend)
```

### On Pull Request
```
Push to PR branch
    ↓
Build & Push Docker Images (for testing)
    ↓
No deployment occurs
```

## Monitoring the Workflow

1. **GitHub Actions Dashboard:**
   - Go to repository → **Actions** tab
   - View running and completed workflows
   - Click on a workflow run for detailed logs

2. **Docker Hub:**
   - Verify images are pushed: https://hub.docker.com/repositories
   - Check image tags and layer sizes

3. **Render Dashboard:**
   - View deployment logs
   - Check service health and uptime

4. **Vercel Dashboard:**
   - View deployment history
   - Check analytics and performance

## Workflow Environment Variables

The following environment variables are used:

| Variable | Value | Purpose |
|----------|-------|---------|
| `REGISTRY` | `docker.io` | Docker Hub registry |
| `DOCKER_USERNAME` | From secrets | Docker Hub authentication |
| `DOCKER_PASSWORD` | From secrets | Docker Hub authentication |

## Build Cache Strategy

The workflow uses GitHub Actions cache to optimize build times:

**Cache Layers:**
- Docker layer cache is stored in GitHub Actions
- Subsequent builds reuse cached layers
- Cache is automatically managed by GitHub

**Benefits:**
- Faster builds for repeated deployments
- Reduced Docker Hub bandwidth usage
- Quicker CI/CD pipeline execution

## Troubleshooting

### Workflow Failed
1. Click on the failed workflow run
2. Check the **Logs** for error details
3. Common issues:
   - Missing secrets
   - Incorrect secret values
   - Docker Hub authentication failure
   - Render/Vercel API errors

### Docker Push Fails
- Verify Docker credentials are correct
- Ensure `DOCKER_PASSWORD` is an access token
- Check Docker Hub account permissions

### Deployment Doesn't Trigger
- Verify webhooks are correctly configured
- Check that secrets are set up properly
- Review deployment logs on Render/Vercel

### Build Takes Too Long
- First build is slower (no cache)
- Subsequent builds should be faster
- Check Docker image size (consider using multi-stage builds)

## Advanced Configuration

### Custom Docker Tags
Modify the metadata extraction in `deploy.yml` to customize image tags:

```yaml
tags: |
  type=ref,event=branch
  type=semver,pattern={{version}}
  type=sha,prefix={{branch}}-
  type=raw,value=latest,enable={{is_default_branch}}
```

### Matrix Builds
To build for multiple platforms:

```yaml
strategy:
  matrix:
    platform:
      - linux/amd64
      - linux/arm64
```

### Conditional Deployments
Use workflow conditionals to control deployments:

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

## Security Best Practices

1. **Use Access Tokens, Not Passwords**
   - Generate tokens with minimal required permissions
   - Rotate tokens regularly

2. **Secret Rotation**
   - Update secrets periodically
   - Use short-lived tokens when possible

3. **Audit Logs**
   - Monitor workflow executions
   - Review deployment logs for security issues

4. **Branch Protection**
   - Require status checks to pass before merge
   - Use required reviewers for critical branches

## Performance Tips

1. **Optimize Docker Images**
   - Use multi-stage builds
   - Minimize layer count
   - Remove unnecessary dependencies

2. **Cache Strategy**
   - Ensure Dockerfile uses best practices
   - Layer frequently-changing code at the end
   - Use `.dockerignore` to exclude unnecessary files

3. **Parallel Jobs**
   - Backend and frontend deploy in parallel
   - Reduces overall pipeline duration

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [Render API Documentation](https://render.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
