# Deploying AdonisJS Application to Render

This guide walks you through deploying your AdonisJS application to Render.

## Prerequisites

1. A Render account
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Google OAuth credentials configured

## Environment Variables

Set these environment variables in your Render dashboard:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_KEY` | Your application encryption key | Generate with `node ace generate:key` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-google-client-secret` |
| `APP_URL` | Your application URL | `https://your-app.onrender.com` |
| `NODE_ENV` | Environment type | `production` |
| `LOG_LEVEL` | Logging level | `info` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `HOST` | Host to bind to | `0.0.0.0` |
| `PORT` | Port to bind to | Set by Render (usually 10000) |

## Deployment Steps

### 1. Create Web Service

1. Go to your Render dashboard
2. Click "New" → "Web Service"
3. Connect your Git repository
4. Configure the service:

   - **Name**: `oportuni-backend`
   - **Language**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `cd build && node bin/server.js`

### 2. Set Environment Variables

In the "Environment" section of your service settings, add all the required environment variables listed above.

### 3. Update Google OAuth Settings

Since your callback URL is now dynamic, update your Google OAuth application:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 client
3. Add your Render URL to authorized redirect URIs:
   - `https://your-app.onrender.com/auth/google/callback`

### 4. Deploy

Click "Create Web Service" and Render will deploy your application.

## Port Binding Fix

The application has been configured to:
- Bind to `0.0.0.0` by default (required by Render)
- Use the `PORT` environment variable (provided by Render)
- Use dynamic callback URLs based on `APP_URL`

## Database Setup

If you need a database:

1. Create a PostgreSQL database in Render
2. Add the `DATABASE_URL` environment variable to your web service
3. Update your `start/env.ts` to include database configuration

## Troubleshooting

### Common Issues

1. **Port binding errors**: Make sure `HOST` defaults to `0.0.0.0`
2. **OAuth callback errors**: Ensure `APP_URL` is set and matches your Google OAuth settings
3. **Build failures**: Check that all dependencies are in `package.json`

### Logs

Check your service logs in the Render dashboard for deployment and runtime errors.

## Local Development

For local development, you can create a `.env` file:

```env
NODE_ENV=development
PORT=3333
HOST=localhost
APP_KEY=your-local-app-key
APP_URL=http://localhost:3333
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LOG_LEVEL=debug
```

This will override the default `HOST=0.0.0.0` for local development. 