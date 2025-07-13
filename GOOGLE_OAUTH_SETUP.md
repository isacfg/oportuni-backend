# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your AdonisJS application using **API tokens** (not sessions).

## Prerequisites

1. Google Cloud Console account
2. AdonisJS application with Ally package installed

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:3333/auth/google/callback`
     - Production: `https://yourdomain.com/auth/google/callback`
   - Save and copy the Client ID and Client Secret

## Step 2: Environment Variables

Add the following to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## Step 3: Available Routes

The following routes are now available:

- `GET /auth/google/redirect` - Redirects to Google OAuth
- `GET /auth/google/callback` - Handles Google OAuth callback
- `POST /auth/logout` - Logs out the user (requires Bearer token)
- `GET /auth/me` - Returns current user info (requires Bearer token)

## Step 4: Frontend Integration

### Starting the OAuth Flow

Redirect users to `/auth/google/redirect` to start the OAuth flow:

```html
<a href="/auth/google/redirect">Login with Google</a>
```

### Handling the Response

The callback will return a JSON response with user information and an API token:

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": "https://...",
    "emailVerified": true
  },
  "token": {
    "type": "Bearer",
    "value": "oat_1234567890abcdef...",
    "expiresAt": "2024-02-15T10:30:00.000Z"
  }
}
```

### Using the API Token

Store the token in your frontend (localStorage, secure cookie, etc.) and include it in all API requests:

```javascript
// Store token after login
localStorage.setItem('authToken', response.token.value)

// Use token in API requests
fetch('/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
  },
})
```

### Error Handling

Possible error responses:

1. **Access Denied** (400):

   ```json
   {
     "error": "Access denied",
     "message": "You have cancelled the login process"
   }
   ```

2. **State Mismatch** (400):

   ```json
   {
     "error": "State mismatch",
     "message": "We are unable to verify the request. Please try again"
   }
   ```

3. **Email Not Verified** (400):

   ```json
   {
     "error": "Email not verified",
     "message": "Please verify your email with Google before logging in"
   }
   ```

4. **Unauthorized** (401):
   ```json
   {
     "error": "Unauthorized",
     "message": "You are not logged in"
   }
   ```

## Step 5: Token Management

### Token Expiration

Tokens expire after 30 days. Handle token expiration in your frontend:

```javascript
fetch('/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  if (response.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/auth/google/redirect'
  }
  return response.json()
})
```

### Logout

To logout, call the logout endpoint and remove the token from storage:

```javascript
fetch('/auth/logout', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then(() => {
  localStorage.removeItem('authToken')
  // Redirect to login page
})
```

## Security Features

1. **CSRF Protection**: State verification prevents CSRF attacks
2. **Email Verification**: Only users with verified Google emails can log in
3. **Token Expiration**: Tokens expire after 30 days for security
4. **Error Logging**: All authentication attempts are logged
5. **Account Linking**: Existing accounts can be linked with Google OAuth
6. **No Password Storage**: Only social authentication is supported

## Database Schema

The following fields are in the users table:

- `id` - Primary key
- `full_name` - User's full name from Google
- `email` - User's email (unique)
- `google_id` - Google user ID (unique)
- `avatar_url` - User's profile picture URL
- `email_verified` - Boolean indicating if email is verified
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

**Note**: No password field - only social authentication is supported.

## Best Practices

1. **Secure Token Storage**: Store tokens securely in your frontend
2. **Handle Token Expiration**: Implement automatic token refresh or re-authentication
3. **Validate Email Verification**: Only allow verified email users
4. **Error Handling**: Handle all possible error states gracefully
5. **HTTPS in Production**: Always use HTTPS in production
6. **Token Rotation**: Implement token rotation for enhanced security
7. **Logging**: Monitor authentication events for security

## Testing

You can test the OAuth flow by:

1. Starting your AdonisJS server: `npm run dev`
2. Navigating to `http://localhost:3333/auth/google/redirect`
3. Completing the Google OAuth flow
4. Receiving the API token in the response
5. Testing protected routes with the token

## API Testing Examples

### Test Authentication

```bash
# Get user info
curl -H "Authorization: Bearer oat_1234567890abcdef..." \
     http://localhost:3333/auth/me

# Logout
curl -X POST \
     -H "Authorization: Bearer oat_1234567890abcdef..." \
     http://localhost:3333/auth/logout
```

## Troubleshooting

### Common Issues

1. **Invalid Client ID**: Check your Google Cloud Console credentials
2. **Redirect URI Mismatch**: Ensure the callback URL matches exactly
3. **API Not Enabled**: Enable Google+ API in Google Cloud Console
4. **Token Invalid**: Check token format and expiration
5. **CORS Issues**: Configure CORS settings for your frontend domain

### Debug Mode

Enable debug logging in your `.env`:

```env
LOG_LEVEL=debug
```

This will provide detailed OAuth flow information in your logs.
