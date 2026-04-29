import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFlow } from '@/lib/flows/definitions'
import { incrementTotalSessions } from '@/lib/usage'

const schema = z.object({
  flowId: z.enum(['understand', 'prepare', 'decide']),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid flow' }, { status: 400 })
  }

  const flow = getFlow(parsed.data.flowId)
  if (!flow) return Response.json({ error: 'Flow not found' }, { status: 404 })

  const flowSession = await prisma.flowSession.create({
    data: {
      userId: session.user.id,
      flowId: parsed.data.flowId,
      status: 'IN_PROGRESS',
      currentStep: 0,
    },
  })

  await incrementTotalSessions(session.user.id)

  return Response.json({ sessionId: flowSession.id, currentStep: 0, totalSteps: flow.steps.length })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessions = await prisma.flowSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return Response.json({ sessions })
}
