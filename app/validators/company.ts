import vine from '@vinejs/vine'

export const companyValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    description: vine.string().optional(),
    logo_url: vine.string().url().optional(),
    facebook_url: vine.string().url().optional(),
    linkedin_url: vine.string().url().optional(),
    twitter_url: vine.string().url().optional(),
    instagram_url: vine.string().url().optional(),
  })
)
