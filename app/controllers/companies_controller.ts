import type { HttpContext } from '@adonisjs/core/http'
import Company from '#models/company'
import { companyValidator } from '#validators/company'

export default class CompaniesController {
  /**
   * Return list of all posts or paginate through
   * them
   */
  async index({}: HttpContext) {
    const companies = await Company.all()
    return companies
  }

  /**
   * Handle form submission to create a new post
   */
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!

    const data = await request.validateUsing(companyValidator)

    const company = await Company.create({ ...data, userId: user.id })

    if (!company) {
      return response.badRequest({ message: 'Erro ao criar empresa' })
    }

    return response.created({ message: 'Empresa criada com sucesso' })
  }

  /**
   * Display a single post by id.
   */
  async show({ params, response }: HttpContext) {
    const companyId = params.id
    const company = await Company.findOrFail(companyId)
    return response.ok(company)
  }

  /**
   * Handle the form submission to update a specific post by id
   */
  async update({ params, request, response }: HttpContext) {
    const companyId = params.id
    const company = await Company.findOrFail(companyId)

    const data = await request.validateUsing(companyValidator)
    company.merge(data)

    await company.save()

    return response.ok({ message: 'Empresa atualizada com sucesso' })
  }

  /**
   * Handle the form submission to delete a specific post by id.
   */
  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const companyId = params.id
    const company = await Company.findOrFail(companyId)

    if (company.userId !== user.id) {
      return response.unauthorized({ message: 'Você não tem permissão para deletar esta empresa' })
    }

    await company.delete()
    return response.ok({ message: 'Empresa deletada com sucesso' })
  }
}
