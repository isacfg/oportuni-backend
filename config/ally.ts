import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  google: services.google({
    clientId: env.get('GOOGLE_CLIENT_ID'),
    clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: `${env.get('APP_URL', 'http://localhost:3333')}/auth/google/callback`,

    // Request specific scopes for user information
    scopes: ['openid', 'profile', 'email'],

    // Always prompt for account selection for better UX
    prompt: 'select_account',

    // Request offline access to get refresh tokens
    accessType: 'offline',
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
