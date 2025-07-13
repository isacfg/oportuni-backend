import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

// Function to ensure directory exists (for SQLite only)
async function ensureDbDirectory(filePath: string) {
  try {
    await mkdir(dirname(filePath), { recursive: true })
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

// Parse DATABASE_URL for PostgreSQL connection
function parsePostgresUrl(url: string) {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: Number.parseInt(parsed.port) || 5432,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1), // Remove leading slash
  }
}

let dbConfig

// Configure database based on environment
if (process.env.DATABASE_URL) {
  // Production: Use PostgreSQL
  const connectionDetails = parsePostgresUrl(process.env.DATABASE_URL)

  dbConfig = defineConfig({
    connection: 'pg',
    connections: {
      pg: {
        client: 'pg',
        connection: {
          host: connectionDetails.host,
          port: connectionDetails.port,
          user: connectionDetails.user,
          password: connectionDetails.password,
          database: connectionDetails.database,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        },
        migrations: {
          naturalSort: true,
          paths: ['database/migrations'],
        },
      },
    },
  })
} else {
  // Development: Use SQLite
  const dbPath = app.tmpPath('db.sqlite3')
  await ensureDbDirectory(dbPath)
  
  dbConfig = defineConfig({
    connection: 'sqlite',
    connections: {
      sqlite: {
        client: 'better-sqlite3',
        connection: {
          filename: dbPath,
        },
        useNullAsDefault: true,
        migrations: {
          naturalSort: true,
          paths: ['database/migrations'],
        },
      },
    },
  })
}

export default dbConfig
