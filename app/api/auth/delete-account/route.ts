import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const schema = z.object({ password: z.string().min(1) })

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  const valid = await bcrypt.compare(parsed.data.password, user.password)
  if (!valid) return Response.json({ error: 'wrong_password' }, { status: 400 })

  // Cascade deletes FlowSession and UserUsage via Prisma onDelete: Cascade
  await prisma.user.delete({ where: { id: session.user.id } })

  return Response.json({ ok: true })
}
