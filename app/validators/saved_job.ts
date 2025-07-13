import vine from '@vinejs/vine'

export const savedJobValidator = vine.compile(
  vine.object({
    job_post_id: vine.number().positive(),
  })
)
