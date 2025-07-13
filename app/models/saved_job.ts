import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import JobPost from './job_post.js'

export default class SavedJob extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare jobPostId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => JobPost)
  declare jobPost: BelongsTo<typeof JobPost>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
