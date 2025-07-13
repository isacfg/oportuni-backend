# Deploying AdonisJS Application to Render

This guide walks you through deploying your AdonisJS application to Render.

## Prerequisites

1. A Render account
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Google OAuth credentials configured

## Environment Variables

Set these environment variables in your Render dashboard:

### Required Variables

| Variable | Description | Value for Render |
|----------|-------------|------------------|
| `HOST` | Host to bind to | `0.0.0.0` |
| `APP_KEY` | Your application encryption key | Generate with `node ace generate:key` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-google-client-secret` |
| `APP_URL` | Your application URL | `https://your-app.onrender.com` |
| `NODE_ENV` | Environment type | `production` |
| `LOG_LEVEL` | Logging level | `info` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to bind to | Set by Render (usually 10000) |
| `DATABASE_URL` | Custom database file path | `/tmp/db.sqlite3` (auto-configured) |
| `RUN_SEEDERS` | Run database seeders on deployment | `false` |

## Deployment Steps

### 1. Create Web Service

1. Go to your Render dashboard
2. Click "New" → "Web Service"
3. Connect your Git repository
4. Configure the service:

   - **Name**: `oportuni-backend`
   - **Language**: `Node`
   - **Build Command**: `npm install && npm run deploy`
   - **Start Command**: `cd build && node bin/server.js`

### 2. Set Environment Variables

In the "Environment" section of your service settings, add all the required environment variables listed above.

⚠️ **Important**: Make sure to set `HOST=0.0.0.0` - this is required for Render to detect your application.

### 3. Update Google OAuth Settings

Since your callback URL is now dynamic, update your Google OAuth application:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 client
3. Add your Render URL to authorized redirect URIs:
   - `https://your-app.onrender.com/auth/google/callback`

### 4. Deploy

Click "Create Web Service" and Render will deploy your application.

## Database Setup

The application is configured to use SQLite with automatic database setup:

### Automatic Configuration

- **Development**: Uses app temp directory (`tmp/db.sqlite3`)
- **Production**: Uses persistent directory (`/tmp/db.sqlite3`)
- **Custom Path**: Override with `DATABASE_URL` environment variable

### Database Tables

The deployment script automatically:
1. Creates the database file and directories
2. Runs all migrations to create tables:
   - `users`
   - `access_tokens`
   - `companies`
   - `job_posts`
   - `tags`
   - `job_post_tags`
   - `saved_jobs`

### Seeders (Optional)

To populate the database with sample data:
1. Set `RUN_SEEDERS=true` in environment variables
2. Redeploy your application

## Deployment Script

The `npm run deploy` command runs:
1. `node ace build` - Build the application
2. `node ace migration:run --force` - Run database migrations
3. `node ace db:seed` - Run seeders (if `RUN_SEEDERS=true`)

## Alternative Build Commands

If you prefer separate commands:

| Command | Description |
|---------|-------------|
| `npm run build:production` | Build + run migrations |
| `npm run migrate:production` | Run migrations only |
| `npm run deploy` | Full deployment script |

## Port Binding Fix

The application has been configured to:
- Use the `HOST` environment variable (set to `0.0.0.0` for Render)
- Use the `PORT` environment variable (provided by Render)
- Use dynamic callback URLs based on `APP_URL`

## Troubleshooting

### Common Issues

1. **Port binding errors**: Make sure `HOST=0.0.0.0` is set in environment variables
2. **OAuth callback errors**: Ensure `APP_URL` is set and matches your Google OAuth settings
3. **Build failures**: Check that all dependencies are in `package.json`
4. **Database table errors**: Ensure migrations run successfully during deployment
5. **Directory errors**: The deployment script automatically creates required directories

### Database Issues

If you encounter database-related errors:
1. Check deployment logs for migration errors
2. Verify `DATABASE_URL` is properly set (if using custom path)
3. Ensure write permissions exist for the database directory

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

This will use `localhost` for local development while `0.0.0.0` for production. 