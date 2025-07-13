import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'

export default class SocialAuthsController {
  /**
   * Redirect user to Google OAuth
   */
  async googleRedirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  /**
   * Handle Google OAuth callback
   */
  async googleCallback({ ally, response }: HttpContext) {
    const google = ally.use('google')

    try {
      // Check for access denied
      if (google.accessDenied()) {
        logger.warn('User denied Google OAuth access')
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        return response.redirect(`${frontendUrl}/auth/callback?error=access_denied`)
      }

      // Check for state mismatch (CSRF protection)
      if (google.stateMisMatch()) {
        logger.warn('Google OAuth state mismatch - possible CSRF attack')
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        return response.redirect(`${frontendUrl}/auth/callback?error=state_mismatch`)
      }

      // Check for any other errors
      if (google.hasError()) {
        const error = google.getError()
        logger.error('Google OAuth error:', error)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        return response.redirect(`${frontendUrl}/auth/callback?error=oauth_error`)
      }

      // Get user information from Google
      const googleUser = await google.user()

      // Validate email verification
      if (googleUser.emailVerificationState !== 'verified') {
        logger.warn(`Unverified email attempted login: ${googleUser.email}`)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        return response.redirect(`${frontendUrl}/auth/callback?error=email_not_verified`)
      }

      // Create or find user
      const user = await User.createOrFindFromGoogle(googleUser)

      // Create API token for the user
      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '30 days',
      })

      logger.info(`User ${user.email} logged in via Google OAuth`)

      // Redirect to frontend with success data
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      const userData = encodeURIComponent(
        JSON.stringify({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          emailVerified: user.emailVerified,
        })
      )
      const tokenData = encodeURIComponent(
        JSON.stringify({
          type: 'Bearer',
          value: token.value!.release(),
          expiresAt: token.expiresAt,
        })
      )

      return response.redirect(
        `${frontendUrl}/auth/callback?success=true&user=${userData}&token=${tokenData}`
      )
    } catch (error) {
      logger.error('Google OAuth callback error:', error)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      return response.redirect(`${frontendUrl}/auth/callback?error=auth_failed`)
    }
  }

  /**
   * Handle logout (frontend should remove token)
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user!

      logger.info(`User ${user.email} logged out`)

      return response.ok({
        message: 'Logged out successfully',
      })
    } catch (error) {
      logger.error('Logout error:', error)
      return response.internalServerError({
        error: 'Logout failed',
        message: 'An error occurred during logout. Please try again.',
      })
    }
  }

  /**
   * Get current authenticated user
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user

      if (!user) {
        return response.unauthorized({
          error: 'Unauthorized',
          message: 'You are not logged in',
        })
      }

      return response.ok({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          emailVerified: user.emailVerified,
        },
      })
    } catch (error) {
      logger.error('Get user error:', error)
      return response.internalServerError({
        error: 'Failed to get user',
        message: 'An error occurred while fetching user information.',
      })
    }
  }
}
