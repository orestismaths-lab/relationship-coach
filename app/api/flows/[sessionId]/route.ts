import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getOwned(sessionId: string, userId: string) {
  const s = await prisma.flowSession.findUnique({ where: { id: sessionId } })
  if (!s || s.userId !== userId) return null
  return s
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId } = await params
  const body = await req.json().catch(() => null)
  if (body?.status !== 'ABANDONED') return Response.json({ error: 'Invalid' }, { status: 400 })

  const flowSession = await getOwned(sessionId, session.user.id)
  if (!flowSession) return Response.json({ error: 'Not found' }, { status: 404 })

  await prisma.flowSession.update({ where: { id: sessionId }, data: { status: 'ABANDONED' } })
  return Response.json({ ok: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { sessionId } = await params
  const flowSession = await getOwned(sessionId, session.user.id)
  if (!flowSession) return Response.json({ error: 'Not found' }, { status: 404 })

  await prisma.flowSession.delete({ where: { id: sessionId } })
  return Response.json({ ok: true })
}
