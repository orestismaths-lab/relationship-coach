import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { email, password, name } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) {
    return Response.json({ error: 'Email already registered' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: { email: email.toLowerCase(), password: hash, name },
  })

  return Response.json({ ok: true }, { status: 201 })
}
