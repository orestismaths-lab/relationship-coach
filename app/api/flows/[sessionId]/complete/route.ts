import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sessionId } = await params
  const flowSession = await prisma.flowSession.findUnique({ where: { id: sessionId } })

  if (!flowSession || flowSession.userId !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json({
    flowId: flowSession.flowId,
    answers: JSON.parse(flowSession.answers),
    aiOutputs: JSON.parse(flowSession.aiOutputs),
    completedAt: flowSession.completedAt,
  })
}
