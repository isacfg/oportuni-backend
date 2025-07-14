import vine from '@vinejs/vine'
import { CONTRACT_TYPE_VALUES } from '../enums/index.js'

export const jobPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(2).maxLength(200),
    description: vine.string().trim().minLength(10),
    company_id: vine.number().positive(),
    contract_type: vine.enum(CONTRACT_TYPE_VALUES),
    location: vine.string().trim().minLength(2).maxLength(100),
    remote: vine.boolean().optional(),
    // application_url: vine.string().url().optional(),
    simplified_application: vine.boolean().optional(),
    reduced_hours: vine.boolean().optional(),
    // external_url: vine.string().url().optional(),
  })
)
