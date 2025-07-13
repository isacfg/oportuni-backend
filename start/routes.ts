/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// TODO: PROTEGER ROTAS

/*
|--------------------------------------------------------------------------
| Authentication routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    // Google OAuth routes (public)
    router.get('/google/redirect', '#controllers/social_auths_controller.googleRedirect')
    router.get('/google/callback', '#controllers/social_auths_controller.googleCallback')

    // Protected routes (require API token)
    router.post('/logout', '#controllers/social_auths_controller.logout').use(middleware.auth())
    router.get('/me', '#controllers/social_auths_controller.me').use(middleware.auth())
  })
  .prefix('/auth')

/*
|--------------------------------------------------------------------------
| Companies routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/', '#controllers/companies_controller.index')
    router.post('/', '#controllers/companies_controller.store').use(middleware.auth())
    router.get('/:id', '#controllers/companies_controller.show')
    router.put('/:id', '#controllers/companies_controller.update')
    router.delete('/:id', '#controllers/companies_controller.destroy')
  })
  .prefix('/companies')

/*
|--------------------------------------------------------------------------
| Job Posts routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/', '#controllers/job_posts_controller.index')
    router.post('/', '#controllers/job_posts_controller.store')
    router.get('/:id', '#controllers/job_posts_controller.show')
    router.put('/:id', '#controllers/job_posts_controller.update')
    router.delete('/:id', '#controllers/job_posts_controller.destroy')
    // Tag management routes
    router.post('/:id/tags/attach', '#controllers/job_posts_controller.attachTags')
    router.post('/:id/tags/detach', '#controllers/job_posts_controller.detachTags')
    router.post('/:id/tags/sync', '#controllers/job_posts_controller.syncTags')
  })
  .prefix('/job-posts')

/*
|--------------------------------------------------------------------------
| Tags routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/', '#controllers/tags_controller.index')
    router.post('/', '#controllers/tags_controller.store')
    router.get('/:id', '#controllers/tags_controller.show')
    router.put('/:id', '#controllers/tags_controller.update')
    router.delete('/:id', '#controllers/tags_controller.destroy')
  })
  .prefix('/tags')

/*
|--------------------------------------------------------------------------
| Saved Jobs routes
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/', '#controllers/saved_jobs_controller.index')
    router.post('/', '#controllers/saved_jobs_controller.store')
    router.delete('/:id', '#controllers/saved_jobs_controller.destroy')
    router.delete('/job-post/:job_post_id', '#controllers/saved_jobs_controller.destroyByJobPost')
  })
  .prefix('/saved-jobs')
  .use(middleware.auth())
