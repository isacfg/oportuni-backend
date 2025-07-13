import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import SavedJob from './saved_job.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare googleId: string | null

  @column()
  declare avatarUrl: string | null

  @column()
  declare emailVerified: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Company)
  declare companies: HasMany<typeof Company>

  @hasMany(() => SavedJob)
  declare savedJobs: HasMany<typeof SavedJob>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  /**
   * Create or find a user from Google OAuth data
   */
  static async createOrFindFromGoogle(googleUser: any) {
    // First, try to find user by Google ID
    let user = await User.findBy('googleId', googleUser.id)

    if (user) {
      // Update user info in case it changed
      user.fullName = googleUser.name
      user.avatarUrl = googleUser.avatarUrl
      user.emailVerified = googleUser.emailVerificationState === 'verified'
      await user.save()
      return user
    }

    // If not found by Google ID, try to find by email
    user = await User.findBy('email', googleUser.email)

    if (user) {
      // Link existing account with Google
      user.googleId = googleUser.id
      user.avatarUrl = googleUser.avatarUrl
      user.emailVerified = googleUser.emailVerificationState === 'verified'
      await user.save()
      return user
    }

    // Create new user
    user = await User.create({
      fullName: googleUser.name,
      email: googleUser.email,
      googleId: googleUser.id,
      avatarUrl: googleUser.avatarUrl,
      emailVerified: googleUser.emailVerificationState === 'verified',
    })

    return user
  }
}
