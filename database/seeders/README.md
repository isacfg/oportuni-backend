# Seeders

## Sobre

Os seeders são responsáveis por popular o banco de dados com dados iniciais necessários para o funcionamento da aplicação.

## Seeders disponíveis

### TagSeeder

Cria todas as tags baseadas no enum `TagType`:

- **Skills**: JavaScript, TypeScript, Python, Java, etc.
- **Frameworks**: React, Vue.js, Angular, Node.js, etc.
- **Languages**: Português, Inglês, Espanhol, etc.
- **Benefits**: Plano de Saúde, Home Office, Flexibilidade de Horário, etc.
- **Contract Types**: CLT, PJ, Freelancer, Estágio, etc.
- **Locations**: São Paulo, Rio de Janeiro, Remoto, etc.

### MainSeeder

Seeder principal que executa todos os outros seeders em sequência.

## Como usar

### Executar seeder específico

```bash
node ace db:seed --files=database/seeders/tag_seeder.ts
```

### Executar todos os seeders

```bash
node ace db:seed --files=database/seeders/main_seeder.ts
```

### Executar todos os seeders (padrão)

```bash
node ace db:seed
```

## Comandos úteis

### Criar um novo seeder

```bash
node ace make:seeder nome_do_seeder
```

### Resetar e recriar banco com seeders

```bash
node ace migration:fresh --seed
```

### Executar apenas as migrações e seeders

```bash
node ace migration:run
node ace db:seed
```

## Estrutura dos seeders

Cada seeder deve estender `BaseSeeder` e implementar o método `run()`:

```typescript
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class ExampleSeeder extends BaseSeeder {
  async run() {
    // Código para popular o banco
  }
}
```

## Observações importantes

- Os seeders devem ser idempotentes (podem ser executados múltiplas vezes)
- Use `updateOrCreate` ou `firstOrCreate` para evitar duplicatas
- Sempre trate erros adequadamente
- Use transações para operações críticas 
