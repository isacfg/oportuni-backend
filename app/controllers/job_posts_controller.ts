import type { HttpContext } from '@adonisjs/core/http'
import JobPost from '#models/job_post'
import { jobPostValidator } from '#validators/job_post'
import db from '@adonisjs/lucid/services/db'

export default class JobPostsController {
  /**
   * Return list of all job posts or paginate through
   * them
   */
  async index({ request, auth }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    // Build the main query using raw database query builder
    const query = db
      .from('job_posts')
      .select([
        'job_posts.id',
        'job_posts.title',
        'job_posts.description',
        'job_posts.company_id',
        'job_posts.contract_type',
        'job_posts.location',
        'job_posts.remote',
        'job_posts.application_url',
        'job_posts.simplified_application',
        'job_posts.reduced_hours',
        'job_posts.external_url',
        'job_posts.created_at',
        'job_posts.updated_at',
        'companies.id as company_id',
        'companies.name as company_name',
        'companies.description as company_description',
        'companies.logo_url as company_logo_url',
        'companies.facebook_url as company_facebook_url',
        'companies.linkedin_url as company_linkedin_url',
        'companies.twitter_url as company_twitter_url',
        'companies.instagram_url as company_instagram_url',
        'companies.website_url as company_website_url',
        'companies.created_at as company_created_at',
        'companies.updated_at as company_updated_at',
      ])
      .innerJoin('companies', 'job_posts.company_id', 'companies.id')
      .orderBy('job_posts.created_at', 'desc')

    if (auth.user) {
      console.log('USERRRR')
      query.select([
        db.raw(
          `CASE WHEN EXISTS (
          SELECT 1 FROM saved_jobs
          WHERE saved_jobs.job_post_id = job_posts.id
          AND saved_jobs.user_id = ?
        ) THEN 1 ELSE 0 END as is_saved`,
          [auth.user.id]
        ),
      ])
    } else {
      query.select([db.raw('0 as is_saved')])
    }

    const paginatedResults = await query.paginate(page, limit)

    // buscar tags para cada vaga da página
    const jobPostIds = paginatedResults.all().map((job: any) => job.id)

    const tags = await db
      .from('job_post_tags')
      .select([
        'job_post_tags.job_post_id',
        'tags.id as tag_id',
        'tags.name as tag_name',
        'tags.type as tag_type',
        'tags.created_at as tag_created_at',
        'tags.updated_at as tag_updated_at',
      ])
      .leftJoin('tags', 'job_post_tags.tag_id', 'tags.id')
      .whereIn('job_post_tags.job_post_id', jobPostIds)

    // agrupar tags por vaga
    const tagsByJobPost = tags.reduce((acc: any, tag: any) => {
      if (!acc[tag.job_post_id]) {
        acc[tag.job_post_id] = []
      }
      if (tag.tag_id) {
        acc[tag.job_post_id].push({
          id: tag.tag_id,
          name: tag.tag_name,
          type: tag.tag_type,
          createdAt: tag.tag_created_at,
          updatedAt: tag.tag_updated_at,
        })
      }
      return acc
    }, {})

    // transformar os resultados para corresponder à estrutura esperada
    const transformedData = paginatedResults.all().map((job: any) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      companyId: job.company_id,
      contractType: job.contract_type,
      location: job.location,
      remote: Boolean(job.remote),
      applicationUrl: job.application_url,
      simplifiedApplication: Boolean(job.simplified_application),
      reducedHours: Boolean(job.reduced_hours),
      externalUrl: job.external_url,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      // Fix: Convert the database result to boolean properly
      isSaved: Boolean(Number(job.is_saved)),
      company: {
        id: job.company_id,
        name: job.company_name,
        description: job.company_description,
        logoUrl: job.company_logo_url,
        facebookUrl: job.company_facebook_url,
        linkedinUrl: job.company_linkedin_url,
        twitterUrl: job.company_twitter_url,
        instagramUrl: job.company_instagram_url,
        websiteUrl: job.company_website_url,
        createdAt: job.company_created_at,
        updatedAt: job.company_updated_at,
      },
      tags: tagsByJobPost[job.id] || [],
    }))

    // Debug: Log a sample job to check is_saved value
    if (transformedData.length > 0) {
      console.log('Sample job is_saved value:', {
        raw: transformedData[0].isSaved,
        jobId: transformedData[0].id,
        userId: auth.user?.id
      })
    }

    // retornar a estrutura de paginação com os dados transformados
    return {
      meta: paginatedResults.getMeta(),
      data: transformedData,
    }
  }

  /**
   * Handle form submission to create a new job post
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(jobPostValidator)

    const jobPost = await JobPost.create(data)

    if (!jobPost) {
      return response.badRequest({ message: 'Erro ao criar vaga' })
    }

    return response.created({ message: 'Vaga criada com sucesso', jobPost })
  }

  /**
   * Display a single job post by id.
   */
  async show({ params, response, auth }: HttpContext) {
    const jobPostId = params.id

    // Build the main query using raw database query builder
    const query = db
      .from('job_posts')
      .select([
        'job_posts.id',
        'job_posts.title',
        'job_posts.description',
        'job_posts.company_id',
        'job_posts.contract_type',
        'job_posts.location',
        'job_posts.remote',
        'job_posts.application_url',
        'job_posts.simplified_application',
        'job_posts.reduced_hours',
        'job_posts.external_url',
        'job_posts.created_at',
        'job_posts.updated_at',
        'companies.id as company_id',
        'companies.name as company_name',
        'companies.description as company_description',
        'companies.logo_url as company_logo_url',
        'companies.facebook_url as company_facebook_url',
        'companies.linkedin_url as company_linkedin_url',
        'companies.twitter_url as company_twitter_url',
        'companies.instagram_url as company_instagram_url',
        'companies.website_url as company_website_url',
        'companies.created_at as company_created_at',
        'companies.updated_at as company_updated_at',
      ])
      .leftJoin('companies', 'job_posts.company_id', 'companies.id')
      .where('job_posts.id', jobPostId)

    // Add isSaved field based on authentication
    if (auth.user) {
      query.select([
        db.raw(
          `CASE WHEN EXISTS (
            SELECT 1 FROM saved_jobs
            WHERE saved_jobs.job_post_id = job_posts.id
            AND saved_jobs.user_id = ?
          ) THEN 1 ELSE 0 END as is_saved`,
          [auth.user.id]
        ),
      ])
    } else {
      query.select([db.raw('0 as is_saved')])
    }

    const job = await query.firstOrFail()

    // Get tags for this job post
    const tags = await db
      .from('job_post_tags')
      .select([
        'tags.id as tag_id',
        'tags.name as tag_name',
        'tags.type as tag_type',
        'tags.created_at as tag_created_at',
        'tags.updated_at as tag_updated_at',
      ])
      .leftJoin('tags', 'job_post_tags.tag_id', 'tags.id')
      .where('job_post_tags.job_post_id', jobPostId)

    // Transform the result to match the expected structure
    const transformedJob = {
      id: job.id,
      title: job.title,
      description: job.description,
      companyId: job.company_id,
      contractType: job.contract_type,
      location: job.location,
      remote: Boolean(job.remote),
      applicationUrl: job.application_url,
      simplifiedApplication: Boolean(job.simplified_application),
      reducedHours: Boolean(job.reduced_hours),
      externalUrl: job.external_url,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      isSaved: Boolean(job.is_saved),
      company: {
        id: job.company_id,
        name: job.company_name,
        description: job.company_description,
        logoUrl: job.company_logo_url,
        facebookUrl: job.company_facebook_url,
        linkedinUrl: job.company_linkedin_url,
        twitterUrl: job.company_twitter_url,
        instagramUrl: job.company_instagram_url,
        websiteUrl: job.company_website_url,
        createdAt: job.company_created_at,
        updatedAt: job.company_updated_at,
      },
      tags: tags
        .map((tag: any) => ({
          id: tag.tag_id,
          name: tag.tag_name,
          type: tag.tag_type,
          createdAt: tag.tag_created_at,
          updatedAt: tag.tag_updated_at,
        }))
        .filter((tag: any) => tag.id !== null),
    }

    return response.ok(transformedJob)
  }

  /**
   * Handle the form submission to update a specific job post by id
   */
  async update({ params, request, response }: HttpContext) {
    const jobPostId = params.id
    const jobPost = await JobPost.findOrFail(jobPostId)

    const data = await request.validateUsing(jobPostValidator)
    jobPost.merge(data)

    await jobPost.save()

    return response.ok({ message: 'Vaga atualizada com sucesso', jobPost })
  }

  /**
   * Handle the form submission to delete a specific job post by id.
   */
  async destroy({ params, response }: HttpContext) {
    const jobPostId = params.id
    const jobPost = await JobPost.findOrFail(jobPostId)

    await jobPost.delete()
    return response.ok({ message: 'Vaga deletada com sucesso' })
  }

  /**
   * Attach tags to a job post
   */
  async attachTags({ params, request, response }: HttpContext) {
    const jobPostId = params.id
    const { tag_ids: tagIds } = request.only(['tag_ids'])

    const jobPost = await JobPost.findOrFail(jobPostId)

    await jobPost.related('tags').attach(tagIds)

    return response.ok({ message: 'Tags adicionadas com sucesso' })
  }

  /**
   * Detach tags from a job post
   */
  async detachTags({ params, request, response }: HttpContext) {
    const jobPostId = params.id
    const { tag_ids: tagIds } = request.only(['tag_ids'])

    const jobPost = await JobPost.findOrFail(jobPostId)

    await jobPost.related('tags').detach(tagIds)

    return response.ok({ message: 'Tags removidas com sucesso' })
  }

  /**
   * Sync tags with a job post (replace all existing tags)
   */
  async syncTags({ params, request, response }: HttpContext) {
    const jobPostId = params.id
    const { tag_ids: tagIds } = request.only(['tag_ids'])

    const jobPost = await JobPost.findOrFail(jobPostId)

    await jobPost.related('tags').sync(tagIds)

    return response.ok({ message: 'Tags sincronizadas com sucesso' })
  }
}
