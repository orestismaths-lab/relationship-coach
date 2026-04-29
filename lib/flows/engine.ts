import type { FlowDefinition, SessionAnswers, SessionAIOutputs, FlowAIOutput } from '@/types'
import { getFlow } from './definitions'

export type FlowState = {
  flowId: string
  currentStep: number
  answers: SessionAnswers
  aiOutputs: SessionAIOutputs
  totalSteps: number
  isComplete: boolean
}

export function initFlowState(flowId: string): FlowState | null {
  const flow = getFlow(flowId)
  if (!flow) return null
  return {
    flowId,
    currentStep: 0,
    answers: {},
    aiOutputs: {},
    totalSteps: flow.steps.length,
    isComplete: false,
  }
}

export function getCurrentStep(flow: FlowDefinition, currentStep: number) {
  return flow.steps[currentStep] ?? null
}

export function advanceStep(
  state: FlowState,
  stepId: string,
  answer: SessionAnswers[string]
): FlowState {
  const newAnswers = answer !== '' && answer !== undefined
    ? { ...state.answers, [stepId]: answer }
    : state.answers
  const nextStep = state.currentStep + 1
  const isComplete = nextStep >= state.totalSteps
  return { ...state, answers: newAnswers, currentStep: nextStep, isComplete }
}

export function recordAIOutput(
  state: FlowState,
  stepId: string,
  output: FlowAIOutput
): FlowState {
  return { ...state, aiOutputs: { ...state.aiOutputs, [stepId]: output } }
}

export function serializeState(state: FlowState) {
  return {
    currentStep: state.currentStep,
    answers: JSON.stringify(state.answers),
    aiOutputs: JSON.stringify(state.aiOutputs),
  }
}

export function deserializeState(
  flowId: string,
  currentStep: number,
  answersJson: string,
  aiOutputsJson: string
): FlowState | null {
  const flow = getFlow(flowId)
  if (!flow) return null
  return {
    flowId,
    currentStep,
    answers: JSON.parse(answersJson),
    aiOutputs: JSON.parse(aiOutputsJson),
    totalSteps: flow.steps.length,
    isComplete: currentStep >= flow.steps.length,
  }
}
