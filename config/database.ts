import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

// Function to ensure directory exists
async function ensureDbDirectory(filePath: string) {
  try {
    await mkdir(dirname(filePath), { recursive: true })
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

// Determine database path based on environment
const getDatabasePath = () => {
  // Check for DATABASE_URL environment variable first
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  
  if (process.env.NODE_ENV === 'production') {
    // For production (Render), use a persistent directory
    return '/tmp/db.sqlite3'
  } else {
    // For development, use the tmp directory
    return app.tmpPath('db.sqlite3')
  }
}

const dbPath = getDatabasePath()

// Ensure the database directory exists
await ensureDbDirectory(dbPath)

const dbConfig = defineConfig({
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

export default dbConfig
