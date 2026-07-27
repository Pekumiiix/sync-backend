import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
import { dirname, join } from 'node:path/win32'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const dbConfig = defineConfig({
  /**
   * Default connection used for all queries.
   */
  connection: 'pg',

  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ssl: env.get('DB_SSL') ? { rejectUnauthorized: false } : false,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      schemaGeneration: {
        enabled: true,
        rulesPaths: [pathToFileURL(join(__dirname, '../database/schema_rules.ts')).href],
      },
      pool: {
        min: 2,
        max: 20,
        acquireTimeoutMillis: 60000,
      },
      debug: app.inDev,
    },
  },
})

export default dbConfig
