import vine from '@vinejs/vine'
import { TAG_TYPE_VALUES } from '../enums/index.js'

export const tagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(50),
    type: vine.enum(TAG_TYPE_VALUES),
  })
)
