import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import { ContractType } from '../enums/index.js'
import Tag from './tag.js'
import SavedJob from './saved_job.js'

export default class JobPost extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare companyId: number

  @column()
  declare contractType: ContractType

  @column()
  declare location: string

  @column()
  declare remote: boolean

  @column()
  declare applicationUrl: string | null

  @column()
  declare simplifiedApplication: boolean

  @column()
  declare reducedHours: boolean

  @column()
  declare externalUrl: string | null

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  @manyToMany(() => Tag, {
    pivotTable: 'job_post_tags',
    pivotTimestamps: true,
  })
  declare tags: ManyToMany<typeof Tag>

  @hasMany(() => SavedJob)
  declare savedJobs: HasMany<typeof SavedJob>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
