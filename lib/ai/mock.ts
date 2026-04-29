import type { PromptKey } from './prompts'
import type { UnderstandOutput, PrepareOutput, DecideOutput, FlowAIOutput } from '@/types'

const MOCK_UNDERSTAND: UnderstandOutput = {
  situationSummary:
    'There was a conflict involving you and another person that left you hurt and unclear about what it means. You responded in the moment, and you\'re now sitting with both the facts of what happened and what it stirred up inside you.',
  factsVsInterpretations: {
    facts: [
      'The other person said or did something specific that you observed.',
      'You responded with words or actions of your own.',
      'This situation has come up before.',
    ],
    interpretations: [
      'You\'re reading this as a sign of how they feel about you.',
      'You may be assuming intent behind their actions that you can\'t fully know.',
    ],
  },
  feelingsAndNeeds: {
    feelings: ['Hurt', 'Confused', 'Anxious'],
    needs: ['To feel seen and valued', 'To understand what actually happened', 'To feel safe in this relationship'],
  },
  possibleOtherPerspective:
    'It\'s possible the other person was reacting from their own fear or stress, rather than making a statement about you. Their behaviour may say more about what\'s going on inside them than about how they see you.',
  patternsToNotice: [
    'This situation has happened before — it may point to an unresolved dynamic rather than a one-off event.',
    'Notice whether you tend to blame yourself first or look for external causes.',
  ],
  redFlagsOrSafetyConcerns: [],
  whatIsUnclear: [
    'What the other person\'s intention actually was.',
    'Whether the pattern will repeat or if something has shifted.',
  ],
  healthierReframe:
    'This conflict doesn\'t have to define the relationship. It\'s information — about both of you. The healthy outcome you named is worth pursuing, and it\'s specific enough to actually talk about.',
  suggestedNextStep:
    'Give yourself 24 hours before deciding what to do. Write down the one thing you most want the other person to understand.',
  actionPlan: [
    'Let the initial emotional charge settle before acting.',
    'Identify one concrete thing you want to express or ask for.',
    'Choose a calm, private moment to have that conversation.',
  ],
}

const MOCK_PREPARE: PrepareOutput = {
  conversationGoal:
    'To help the other person understand your experience and to make a specific, reasonable ask — without escalating or shutting down.',
  recommendedMessage:
    '"There\'s something I\'ve been wanting to share with you, and I\'d love it if we could find a quiet moment. I\'ve been feeling [your feeling] about [the situation], and it would mean a lot if we could talk it through."',
  softerVersion:
    '"I\'ve had something on my mind and I wasn\'t sure how to bring it up. Would you be open to talking when you have a moment? No pressure — I just want us to understand each other better."',
  directVersion:
    '"I need to talk about something that\'s been affecting me. [The situation] has made me feel [your feeling], and I\'m asking for [your specific need]. Can we set time aside for this?"',
  boundaryFocusedVersion:
    '"I care about this relationship, and I\'ve realised I need [your need] in order to feel okay. I wanted to be honest with you rather than let it sit."',
  whatToAvoid: [
    'Starting with "you always" or "you never" — it puts the other person on the defensive immediately.',
    'Bringing it up when either of you is tired, stressed, or in the middle of something else.',
    'Listing everything at once — keep the focus on the one core issue.',
  ],
  ifTheyReactBadly: [
    'If they get defensive, try: "I\'m not here to attack you — I just want us to understand each other."',
    'If they shut down, it\'s okay to pause: "Let\'s take a break and come back to this."',
  ],
  followUpSuggestion:
    'After the conversation — regardless of how it goes — give yourself space to process. You don\'t need to resolve everything in one sitting.',
}

const MOCK_DECIDE: DecideOutput = {
  situationSummary:
    'You\'re in a relationship that holds real value for you, but you\'re also experiencing something that\'s made you question whether it\'s working. You\'ve tried to address it, and you\'re now at a point where you\'re weighing your options.',
  whatSeemsHealthy: [
    'You can identify what has been meaningful and valuable — which means you\'re thinking clearly, not just reacting.',
    'You\'ve communicated your needs before, which shows self-awareness and willingness to work on things.',
  ],
  whatSeemsConcerning: [
    'The patterns you described haven\'t shifted despite your efforts.',
    'The gap between what you need and what you\'re receiving seems consistent.',
  ],
  boundariesToConsider: [
    'What am I willing to continue accepting, and for how long?',
    'What would need to happen for me to feel genuinely respected here?',
  ],
  availableOptions: [
    'Stay and continue the conversation — ask for specific changes with a clear timeframe',
    'Take a deliberate step back to get more clarity before deciding anything',
    'Seek outside support (therapy, trusted friend) to process this more fully',
    'Begin preparing to exit the relationship, when and if it feels right',
  ],
  tradeOffs: [
    {
      option: 'Stay and continue the conversation',
      benefits: ['Keeps the relationship open', 'Gives them a clear chance to respond'],
      risks: ['May prolong the uncertainty if nothing changes', 'Can be emotionally costly if the pattern repeats'],
    },
    {
      option: 'Take a deliberate step back',
      benefits: ['Gives you space to think without pressure', 'May reveal what you actually want'],
      risks: ['Might feel ambiguous to the other person', 'Doesn\'t resolve the situation on its own'],
    },
    {
      option: 'Begin preparing to exit',
      benefits: ['Protects your wellbeing if the situation is genuinely unhealthy', 'Clarifies your own limits'],
      risks: ['Hard to undo once started', 'May feel premature if things could still shift'],
    },
  ],
  questionsBeforeDeciding: [
    'Am I making this decision from a calm place, or from an acute emotional state?',
    'What would I tell a close friend who was in exactly this situation?',
    'Is what I\'m asking for reasonable — and have I said it clearly?',
  ],
  safetyNote: '',
  recommendedLowRiskNextStep:
    'Before any bigger decision, have one honest conversation where you name what you need and observe — not just what they say, but what they do next.',
  actionPlan: [
    'Write down what you need from this relationship in plain, specific terms.',
    'Decide on one clear, time-bound ask to make.',
    'Notice over the following weeks whether anything actually shifts.',
  ],
}

const MOCK_OUTPUTS: Record<PromptKey, FlowAIOutput> = {
  understand_summary: MOCK_UNDERSTAND,
  prepare_summary: MOCK_PREPARE,
  decide_summary: MOCK_DECIDE,
}

export async function mockGenerate(key: PromptKey): Promise<FlowAIOutput> {
  await new Promise((r) => setTimeout(r, 1200))
  return MOCK_OUTPUTS[key]
}
