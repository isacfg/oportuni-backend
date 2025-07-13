import type { HttpContext } from '@adonisjs/core/http'
import Tag from '#models/tag'
import { tagValidator } from '#validators/tag'
import { TagType } from '../enums/index.js'

export default class TagsController {
  /**
   * Return list of all tags
   */
  async index({ request }: HttpContext) {
    const type = request.input('type')

    const query = Tag.query()

    if (type) {
      query.where('type', type)
    }

    const tags = await query.orderBy('name', 'asc')
    return tags
  }

  /**
   * Handle form submission to create a new tag
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(tagValidator)

    const tag = await Tag.create({
      name: data.name,
      type: data.type as TagType,
    })

    if (!tag) {
      return response.badRequest({ message: 'Erro ao criar tag' })
    }

    return response.created({ message: 'Tag criada com sucesso', tag })
  }

  /**
   * Display a single tag by id.
   */
  async show({ params, response }: HttpContext) {
    const tagId = params.id
    const tag = await Tag.findOrFail(tagId)

    return response.ok(tag)
  }

  /**
   * Handle the form submission to update a specific tag by id
   */
  async update({ params, request, response }: HttpContext) {
    const tagId = params.id
    const tag = await Tag.findOrFail(tagId)

    const data = await request.validateUsing(tagValidator)
    tag.merge({
      name: data.name,
      type: data.type as TagType,
    })

    await tag.save()

    return response.ok({ message: 'Tag atualizada com sucesso', tag })
  }

  /**
   * Handle the form submission to delete a specific tag by id.
   */
  async destroy({ params, response }: HttpContext) {
    const tagId = params.id
    const tag = await Tag.findOrFail(tagId)

    await tag.delete()
    return response.ok({ message: 'Tag deletada com sucesso' })
  }
}
