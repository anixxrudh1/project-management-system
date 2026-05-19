# Nexus - Team Project Management System

A full-stack MERN application for managing projects and tasks with a premium Dark Mode UI, built with modern DevOps practices.

## Features
- **Authentication**: Secure JWT-based authentication.
- **Projects**: Create and manage team projects.
- **Tasks**: Kanban-style task management (To Do, In Progress, Review, Done) with priority levels.
- **UI/UX**: Premium Dark Mode glassmorphic design.

## Technology Stack
- **Frontend**: React.js (Vite), Context API, CSS Modules (Vanilla CSS)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (Minikube)
- **CI/CD**: GitHub Actions (Docker Hub, Render, Vercel)

## Local Development Setup

### Option 1: Using Docker Compose (Recommended)
1. Clone the repository.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. The frontend will be available at `http://localhost:80` and the backend at `http://localhost:5000`.

### Option 2: Manual Setup
1. **Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on the provided values
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Kubernetes Deployment (Minikube)
1. Start Minikube:
   ```bash
   minikube start
   ```
2. Apply manifests:
   ```bash
   kubectl apply -f ./k8s
   ```
3. Check status:
   ```bash
   kubectl get pods
   kubectl get services
   ```

## CI/CD Pipeline
The project uses GitHub actions to build Docker images and push them to Docker Hub. It then triggers deployments on:
- **Render**: For the backend Node.js API.
- **Vercel**: For the frontend React application.

**Required Secrets in GitHub**:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `RENDER_DEPLOY_HOOK`
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
