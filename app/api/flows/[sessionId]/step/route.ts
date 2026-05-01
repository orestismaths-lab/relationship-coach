import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFlow } from '@/lib/flows/definitions'
import { deserializeState, serializeState, advanceStep, recordAIOutput } from '@/lib/flows/engine'
import { safetyCheck, getSafetyMessage, getConversationSafetyMessage } from '@/lib/ai/safety'
import { generateAI } from '@/lib/ai/client'
import { checkAndIncrementUsage } from '@/lib/usage'
import type { PromptKey } from '@/lib/ai/prompts'
import type { SessionAnswers } from '@/types'
import type { Lang } from '@/lib/i18n/translations'

function generateTitle(answers: Record<string, unknown>, fallback: string): string {
  for (const v of Object.values(answers)) {
    if (typeof v === 'string' && v.trim().length > 5) {
      const trimmed = v.trim()
      return trimmed.length > 50 ? trimmed.slice(0, 50) + '…' : trimmed
    }
  }
  return fallback
}

const schema = z.object({
  stepId: z.string(),
  answer: z.union([z.string(), z.array(z.string()), z.number()]),
})

function getLang(req: NextRequest): Lang {
  const h = req.headers.get('x-lang')
  return h === 'el' ? 'el' : 'en'
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lang = getLang(req)
  const { sessionId } = await params
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }

  const flowSession = await prisma.flowSession.findUnique({ where: { id: sessionId } })
  if (!flowSession || flowSession.userId !== session.user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  if (flowSession.status !== 'IN_PROGRESS') {
    return Response.json({ error: 'Session already completed' }, { status: 400 })
  }

  const flow = getFlow(flowSession.flowId)
  if (!flow) return Response.json({ error: 'Flow not found' }, { status: 404 })

  const state = deserializeState(
    flowSession.flowId,
    flowSession.currentStep,
    flowSession.answers,
    flowSession.aiOutputs
  )
  if (!state) return Response.json({ error: 'State error' }, { status: 500 })

  const { stepId, answer } = parsed.data
  const stepDef = flow.steps[state.currentStep]
  if (!stepDef || stepDef.id !== stepId) {
    return Response.json({ error: 'Step mismatch' }, { status: 400 })
  }

  // Safety check on text input
  if (typeof answer === 'string' && answer.trim().length > 0) {
    const safety = safetyCheck(answer)
    if (!safety.safe) {
      return Response.json({ type: 'safety', message: getSafetyMessage(safety.reason, lang) })
    }
  }

  // Safety trigger values on select steps
  if (typeof answer === 'string' && stepDef.safetyTriggerValues?.includes(answer)) {
    return Response.json({ type: 'safety', message: getConversationSafetyMessage(lang) })
  }

  // AI step: generate summary
  if (stepDef.triggersAI && stepDef.aiPromptKey) {
    const usage = await checkAndIncrementUsage(session.user.id)
    if (!usage.allowed) {
      return Response.json(
        { error: `Daily limit reached (${process.env.AI_MAX_CALLS_PER_DAY ?? 10} reflections/day). Come back tomorrow.` },
        { status: 429 }
      )
    }

    const allAnswers: SessionAnswers = { ...state.answers }
    if (answer !== '') allAnswers[stepId] = answer

    let result
    try {
      result = await generateAI(stepDef.aiPromptKey as PromptKey, allAnswers)
    } catch {
      return Response.json({ error: 'Could not generate reflection. Please try again.' }, { status: 500 })
    }

    if (result.blocked) {
      return Response.json({ type: 'safety', message: result.message })
    }

    let newState = recordAIOutput(state, stepId, result.data)
    newState = advanceStep(newState, stepId, answer)

    const serialized = serializeState(newState)
    const title = generateTitle(allAnswers as Record<string, unknown>, flow.title)
    await prisma.flowSession.update({
      where: { id: sessionId },
      data: {
        currentStep: serialized.currentStep,
        answers: serialized.answers,
        aiOutputs: serialized.aiOutputs,
        status: 'COMPLETED',
        completedAt: new Date(),
        title,
      },
    })

    return Response.json({ type: 'complete', sessionId })
  }

  // Regular step: save answer and advance
  const newState = advanceStep(state, stepId, answer)
  const serialized = serializeState(newState)

  await prisma.flowSession.update({
    where: { id: sessionId },
    data: {
      currentStep: serialized.currentStep,
      answers: serialized.answers,
    },
  })

  return Response.json({
    type: 'next',
    currentStep: newState.currentStep,
    total: newState.totalSteps,
  })
}
