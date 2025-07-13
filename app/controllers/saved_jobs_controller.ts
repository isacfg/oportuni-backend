import type { HttpContext } from '@adonisjs/core/http'
import SavedJob from '#models/saved_job'
import { savedJobValidator } from '#validators/saved_job'

export default class SavedJobsController {
  /**
   * Return list of all saved jobs for the authenticated user
   */
  async index({ auth, request }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const savedJobs = await SavedJob.query()
      .where('user_id', user.id)
      .preload('jobPost', (query) => {
        query.preload('company')
        query.preload('tags')
      })
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return savedJobs
  }

  /**
   * Handle form submission to save a job
   */
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(savedJobValidator)

    // Check if job is already saved
    const existingSavedJob = await SavedJob.query()
      .where('user_id', user.id)
      .where('job_post_id', data.job_post_id)
      .first()

    if (existingSavedJob) {
      return response.badRequest({ message: 'Job já foi salvo' })
    }

    const savedJob = await SavedJob.create({
      userId: user.id,
      jobPostId: data.job_post_id,
    })

    return response.created({ message: 'Job salvo com sucesso', savedJob })
  }

  /**
   * Handle the form submission to delete a specific saved job by id.
   */
  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const savedJobId = params.id

    const savedJob = await SavedJob.query()
      .where('id', savedJobId)
      .where('user_id', user.id)
      .firstOrFail()

    await savedJob.delete()
    return response.ok({ message: 'Job removido dos salvos' })
  }

  /**
   * Remove saved job by job post id
   */
  async destroyByJobPost({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const jobPostId = params.job_post_id

    const savedJob = await SavedJob.query()
      .where('job_post_id', jobPostId)
      .where('user_id', user.id)
      .firstOrFail()

    await savedJob.delete()
    return response.ok({ message: 'Job removido dos salvos' })
  }
}
