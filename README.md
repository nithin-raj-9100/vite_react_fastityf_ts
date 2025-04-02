# Turborepo React + Fastify Starter

This is a fullstack application built with:
- **Frontend**: React + Vite (TypeScript)
- **Backend**: Fastify (TypeScript)
- **Monorepo**: Turborepo with pnpm workspaces

## Features

- **React Frontend**: Modern UI built with React and TypeScript
- **Fastify Backend**: Fast and low overhead API server
- **Turborepo**: Optimized build system with caching
- **Vercel Deployment**: Ready for deployment on Vercel

## Project Structure

```
apps/
  ├── web/         # React + Vite frontend
  └── backend/     # Fastify backend API server
packages/
  ├── ui/          # Shared UI components
  └── ...          # Other shared packages
api/                # Vercel serverless function entry point
```

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

This will start both the React frontend and Fastify backend in development mode.

## Building for Production

To build all applications and packages:

```bash
pnpm build
```

## Deploying to Vercel

### Method 1: Direct Deployment

1. Connect your repository to Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Import your Git repository
   - Select "Turborepo" as the framework preset

2. Configure the project:
   - **Build Command**: `pnpm build`
   - **Output Directory**: `apps/web/dist`
   - **Install Command**: `pnpm install`

3. Add environment variables if needed:
   - `VITE_API_URL=/api`

4. Deploy!

### Method 2: Using Vercel CLI

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy the project:

```bash
vercel
```

## Using the Deployed App

Once deployed, the application will be available at the Vercel-provided URL with:

- Frontend: Main URL (e.g., `https://your-project.vercel.app`)
- Backend API: `/api` endpoint (e.g., `https://your-project.vercel.app/api`)

---

Made with ♥ using React, Fastify, TypeScript, and Turborepo
