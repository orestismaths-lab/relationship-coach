import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db'
  const authToken = process.env.TURSO_AUTH_TOKEN

  const adapter = new PrismaLibSql({ url, authToken })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (PrismaClient as any)({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> }

export const prisma: InstanceType<typeof PrismaClient> =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
