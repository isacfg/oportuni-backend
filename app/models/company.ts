import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import JobPost from './job_post.js'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare logoUrl: string | null

  @column()
  declare facebookUrl: string | null

  @column()
  declare linkedinUrl: string | null

  @column()
  declare twitterUrl: string | null

  @column()
  declare instagramUrl: string | null

  @column()
  declare websiteUrl: string | null

  @column({ serializeAs: null })
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => JobPost)
  declare jobPosts: HasMany<typeof JobPost>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
