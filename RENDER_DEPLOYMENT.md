# Deploying AdonisJS Application to Render

This guide walks you through deploying your AdonisJS application to Render with a managed PostgreSQL database.

## Prerequisites

1. A Render account
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Google OAuth credentials configured
4. **A managed PostgreSQL database** (recommended for production)

## Database Setup (Recommended)

### 1. Create a Managed PostgreSQL Database

1. Go to your Render dashboard
2. Click "New" → "PostgreSQL"
3. Configure your database:
   - **Name**: `oportuni-db`
   - **Database**: `oportuni_db`
   - **User**: `oportuni_db_user`
   - **Region**: Choose same as your web service
4. Click "Create Database"
5. **Copy the External Database URL** from the database dashboard

### 2. Database Configuration

The application automatically detects the database type:
- **Production (with DATABASE_URL)**: Uses PostgreSQL
- **Development (no DATABASE_URL)**: Uses SQLite

**Your Database URL Format:**
```
postgresql://username:password@host:port/database
```

**Example (your actual URL):**
```
postgresql://oportuni_db_user:Q71eRiVicNMszUZrI0jG62bHc6N4EvP3@dpg-d1q0hbbuibrs73e7tiag-a.oregon-postgres.render.com/oportuni_db
```

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
| `DATABASE_URL` | **PostgreSQL connection string** | **Your database URL from Step 1** |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to bind to | Set by Render (usually 10000) |
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

⚠️ **Important**: 
- Set `HOST=0.0.0.0` - required for Render to detect your application
- Set `DATABASE_URL` to your PostgreSQL connection string

### 3. Update Google OAuth Settings

Since your callback URL is now dynamic, update your Google OAuth application:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 client
3. Add your Render URL to authorized redirect URIs:
   - `https://your-app.onrender.com/auth/google/callback`

### 4. Deploy

Click "Create Web Service" and Render will deploy your application.

## Database Migration

The deployment script automatically:
1. Creates the database tables in PostgreSQL
2. Runs all migrations:
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

## Database Types

| Environment | Database Type | Connection |
|-------------|---------------|------------|
| **Production** | PostgreSQL | Via `DATABASE_URL` |
| **Development** | SQLite | Local file |

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
4. **Database connection errors**: Verify `DATABASE_URL` is correctly set
5. **Migration errors**: Check that the PostgreSQL database is accessible

### Database Issues

If you encounter database-related errors:
1. Check deployment logs for migration errors
2. Verify `DATABASE_URL` is properly set and accessible
3. Ensure your PostgreSQL database is running
4. Check that the database user has proper permissions

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
# DATABASE_URL=your-local-postgres-url (optional, will use SQLite if not set)
```

This will use SQLite for local development and PostgreSQL for production. 