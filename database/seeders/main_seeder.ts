import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TagSeeder from './tag_seeder.js'
import JobPostSeeder from './job_post_seeder.js'

export default class MainSeeder extends BaseSeeder {
  private async runSeeder(seederClass: typeof BaseSeeder) {
    try {
      await new seederClass(this.client).run()
      console.log(`✅ ${seederClass.name} executado com sucesso`)
    } catch (error) {
      console.error(`❌ Erro ao executar ${seederClass.name}:`, error)
    }
  }

  async run() {
    console.log('🌱 Iniciando seeders...')

    await this.runSeeder(TagSeeder)
    await this.runSeeder(JobPostSeeder)

    console.log('🎉 Todos os seeders foram executados!')
  }
}
