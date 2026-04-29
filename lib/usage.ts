import { prisma } from './prisma'

const MAX_DAILY = parseInt(process.env.AI_MAX_CALLS_PER_DAY ?? '10', 10)

export async function checkAndIncrementUsage(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  let usage = await prisma.userUsage.findUnique({ where: { userId } })

  if (!usage) {
    usage = await prisma.userUsage.create({
      data: { userId, dailyAICalls: 0, dailyReset: startOfDay },
    })
  }

  const needsReset = usage.dailyReset < startOfDay
  if (needsReset) {
    usage = await prisma.userUsage.update({
      where: { userId },
      data: { dailyAICalls: 0, dailyReset: startOfDay },
    })
  }

  if (usage.dailyAICalls >= MAX_DAILY) {
    return { allowed: false, remaining: 0 }
  }

  await prisma.userUsage.update({
    where: { userId },
    data: { dailyAICalls: { increment: 1 } },
  })

  return { allowed: true, remaining: MAX_DAILY - usage.dailyAICalls - 1 }
}

export async function incrementTotalSessions(userId: string) {
  await prisma.userUsage.upsert({
    where: { userId },
    update: { totalSessions: { increment: 1 } },
    create: { userId, totalSessions: 1, dailyAICalls: 0, dailyReset: new Date() },
  })
}
