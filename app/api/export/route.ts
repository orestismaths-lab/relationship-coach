import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const [user, sessions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true, createdAt: true },
    }),
    prisma.flowSession.findMany({
      where: { userId: session.user.id, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, flowId: true, title: true, status: true,
        answers: true, aiOutputs: true, createdAt: true, completedAt: true,
      },
    }),
  ])

  const payload = {
    exportedAt: new Date().toISOString(),
    account: user,
    sessions: sessions.map((s) => ({
      ...s,
      answers: JSON.parse(s.answers),
      aiOutputs: JSON.parse(s.aiOutputs),
    })),
  }

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="relationship-coach-export.json"',
    },
  })
}
