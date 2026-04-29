import { PrismaClient } from '@/app/generated/prisma/client'

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db'

  // Production: Turso / libSQL
  if (url.startsWith('libsql://') || url.startsWith('file:') === false) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSQL } = require('@prisma/adapter-libsql')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('@libsql/client')
    const authToken = process.env.TURSO_AUTH_TOKEN
    const client = createClient({ url, authToken })
    const adapter = new PrismaLibSQL({ client })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (PrismaClient as any)({ adapter })
  }

  // Local: SQLite via better-sqlite3
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
  const path = require('path') as typeof import('path')
  const dbUrl = url.replace('file:', '')
  const absoluteDbPath = path.isAbsolute(dbUrl)
    ? dbUrl
    : path.join(process.cwd(), dbUrl.replace('./', ''))
  const adapter = new PrismaBetterSqlite3({ url: absoluteDbPath })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (PrismaClient as any)({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> }

export const prisma: InstanceType<typeof PrismaClient> =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
