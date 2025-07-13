import { BaseSeeder } from '@adonisjs/lucid/seeders'
import JobPost from '../../app/models/job_post.js'
import Company from '../../app/models/company.js'
import Tag from '../../app/models/tag.js'
import User from '../../app/models/user.js' // Importando o model User
import { ContractType } from '../../app/enums/index.js'

export default class JobPostSeeder extends BaseSeeder {
  public async run() {
    // 0. Criar um usuário para ser o "dono" das empresas do seeder
    // Usamos firstOrCreate para evitar duplicatas se o seeder rodar mais de uma vez
    const seederUser = await User.firstOrCreate(
      {
        email: 'seeder.user@example.com',
      },
      {
        fullName: 'Usuário Seeder',
      }
    )

    // 1. Criar empresas fictícias e criativas, associando ao usuário criado
    const companies = await Company.createMany([
      {
        name: '🌌 StellarX Explorations',
        description:
          'Liderando a nova era da exploração espacial privada, tornando Marte o próximo destino de férias.',
        websiteUrl: 'https://stellarx.com',
        userId: seederUser.id, // Usando o ID do usuário criado
      },
      {
        name: '🌿 EcoSynth Solutions',
        description: 'Construindo um futuro sustentável com tecnologia e biologia sintética.',
        websiteUrl: 'https://ecosynth.com',
        userId: seederUser.id, // Usando o ID do usuário criado
      },
      {
        name: '🎮 DreamWeave Studios',
        description:
          'Criamos mundos e sonhos em realidade virtual que desafiam os limites da imaginação.',
        websiteUrl: 'https://dreamweave.com',
        userId: seederUser.id, // Usando o ID do usuário criado
      },
      {
        name: '🍲 Gourmet-AI',
        description: 'Revolucionando a arte da culinária com inteligência artificial e robótica.',
        websiteUrl: 'https://gourmet-ai.com',
        userId: seederUser.id, // Usando o ID do usuário criado
      },
    ])

    // 2. Buscar tags específicas para dar mais vida às vagas
    const tags = await Tag.query().whereIn('name', [
      '🐍 Python',
      '🦀 Rust',
      '🎮 Game Development',
      '🤖 Machine Learning',
      '⚛️ React',
      '🇺 Unreal Engine',
      '🧠 TensorFlow',
      '📈 Análise de Dados',
      '🛡️ Cybersecurity',
      '⛓️ Blockchain',
      '🏠 Home Office',
      '🌍 Trabalho Internacional',
      '📈💰 Stock Options',
      '🏆 Bônus por Performance',
      '✈️ Viagem a Trabalho',
      '📝 CLT',
      '💼 PJ',
      '🧑‍🎓 Estágio',
      '🏠 Remoto',
      '🌍 Internacional',
      '🏙️ São Paulo',
    ])

    // Mapear tags por nome para fácil acesso
    const tagMap = tags.reduce(
      (acc, tag) => {
        acc[tag.name] = tag.id
        return acc
      },
      {} as Record<string, number>
    )

    // 3. Criar vagas de emprego criativas
    const job1 = await JobPost.create({
      title: 'Engenheiro(a) de Propulsão de Antimatéria',
      description:
        'Junte-se à nossa equipe pioneira na StellarX para projetar e testar motores que nos levarão a outras galáxias. Experiência com contenção de plasma é um diferencial.',
      companyId: companies[0].id,
      contractType: ContractType.CLT,
      location: 'Internacional',
      remote: false,
      applicationUrl: 'https://stellarx.com/carreiras/antimateria',
      simplifiedApplication: true,
      reducedHours: false,
    })

    const job2 = await JobPost.create({
      title: 'Arquiteto(a) de Ecossistemas Verticais Autossustentáveis',
      description:
        'Na EcoSynth, você irá desenhar e implementar fazendas verticais em centros urbanos, utilizando IA para otimizar o cultivo e a distribuição de alimentos. Seja a mudança que o mundo precisa.',
      companyId: companies[1].id,
      contractType: ContractType.PJ,
      location: 'São Paulo',
      remote: true,
      applicationUrl: 'https://ecosynth.com/carreiras/arquitetura-eco',
      simplifiedApplication: true,
      reducedHours: false,
    })

    const job3 = await JobPost.create({
      title: 'Domador(a) de Dragões Digitais (Artista de Efeitos Visuais Sênior)',
      description:
        'Você tem a magia para dar vida a criaturas fantásticas? Na DreamWeave Studios, você será responsável por modelar, texturizar e animar os seres que habitam nossos mundos de VR.',
      companyId: companies[2].id,
      contractType: ContractType.FREELANCER,
      location: 'Remoto',
      remote: true,
      applicationUrl: 'https://dreamweave.com/carreiras/domador-dragoes',
      simplifiedApplication: false,
      reducedHours: true,
    })

    const job4 = await JobPost.create({
      title: 'Chef de Cozinha Algorítmico',
      description:
        'Combine sua paixão por gastronomia com o poder do Machine Learning. Na Gourmet-AI, você irá treinar nossos robôs-chefs para criar pratos inovadores e personalizados, analisando dados de sabor e preferência.',
      companyId: companies[3].id,
      contractType: ContractType.CLT,
      location: 'Curitiba',
      remote: false,
      applicationUrl: 'https://gourmet-ai.com/carreiras/chef-ai',
      simplifiedApplication: true,
      reducedHours: false,
    })

    // 4. Associar as tags às vagas
    await job1
      .related('tags')
      .attach(
        [
          tagMap['🦀 Rust'],
          tagMap['🐍 Python'],
          tagMap['🌍 Trabalho Internacional'],
          tagMap['📈💰 Stock Options'],
          tagMap['✈️ Viagem a Trabalho'],
        ].filter(Boolean)
      )

    await job2
      .related('tags')
      .attach(
        [
          tagMap['🤖 Machine Learning'],
          tagMap['📈 Análise de Dados'],
          tagMap['🏠 Remoto'],
          tagMap['🏙️ São Paulo'],
          tagMap['🏆 Bônus por Performance'],
        ].filter(Boolean)
      )

    await job3
      .related('tags')
      .attach(
        [
          tagMap['🎮 Game Development'],
          tagMap['🇺 Unreal Engine'],
          tagMap['🏠 Remoto'],
          tagMap['💼 PJ'],
        ].filter(Boolean)
      )

    await job4
      .related('tags')
      .attach(
        [
          tagMap['🧠 TensorFlow'],
          tagMap['🤖 Machine Learning'],
          tagMap['🐍 Python'],
          tagMap['📝 CLT'],
        ].filter(Boolean)
      )

    console.log('✅ Vagas de emprego criativas e suas associações foram criadas com sucesso!')
  }
}
