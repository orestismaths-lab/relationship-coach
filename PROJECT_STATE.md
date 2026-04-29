# Relationship Coach — Project State

> Αυτό το αρχείο είναι η "μνήμη" του project. Ενημερώνεται μετά από κάθε σημαντική αλλαγή.
> Τελευταία ενημέρωση: 2026-04-29 (strict per-flow AI schemas + result renderers)

---

## Τι είναι

Guided AI reflection and communication tool για personal relationships.
Βοηθά χρήστες να κατανοήσουν δύσκολες καταστάσεις, να προετοιμάσουν συνομιλίες, και να επιλέξουν το επόμενο βήμα τους.

**Δεν είναι**: therapy, crisis support, dating app, chatbot, manipulation tool.

---

## Stack

| Στοιχείο | Τεχνολογία |
|---|---|
| Framework | Next.js 16.2.4 (App Router) — **breaking changes vs παλαιότερες εκδόσεις** |
| DB | SQLite (local) μέσω Prisma 7 + `@prisma/adapter-better-sqlite3` |
| Auth | NextAuth v4 (credentials) |
| AI | Mock mode (`AI_MOCK=true`) · Real: Anthropic Claude API |
| Styling | Tailwind CSS v4 (CSS-first config, no `tailwind.config.ts`) |
| Deploy | Vercel (προγραμματισμένο) |

> **Prisma 7 breaking change**: το `url` στο datasource αφαιρέθηκε από το `schema.prisma`. Το connection URL ορίζεται στο `prisma.config.ts`. Ο `PrismaClient` χρειάζεται adapter.

> **Next.js 16 breaking change**: `params` και `searchParams` είναι Promises → πρέπει `await params` / `use(params)`.

---

## Αρχεία — Χάρτης

### Configuration
| Αρχείο | Ρόλος |
|---|---|
| `prisma/schema.prisma` | DB schema (User, FlowSession, UserUsage) |
| `prisma.config.ts` | Prisma 7 config — datasource URL + migrations path |
| `.env.local` | Secrets (DATABASE_URL, NEXTAUTH_SECRET, AI_MOCK, AI_API_KEY) |
| `next.config.ts` | `serverExternalPackages: ['better-sqlite3']` |
| `app/globals.css` | Design tokens, animations (Tailwind v4 CSS-first) |

### Core lib
| Αρχείο | Ρόλος |
|---|---|
| `lib/prisma.ts` | Prisma singleton με PrismaBetterSqlite3 adapter |
| `lib/auth.ts` | NextAuth config (credentials, JWT, session callbacks) |
| `lib/usage.ts` | Daily AI call limiter (default 10/day, resets at midnight) |
| `lib/flows/definitions.ts` | Static definitions για τα 3 flows + βήματα |
| `lib/flows/engine.ts` | Flow state machine (init, advance, serialize, deserialize) |
| `lib/ai/safety.ts` | Keyword safety check (crisis / manipulation / abuse) |
| `lib/ai/prompts.ts` | 6 AI prompts (structured JSON output) |
| `lib/ai/mock.ts` | Mock responses για όλα τα prompt keys |
| `lib/ai/client.ts` | AI dispatcher (mock ή real ανάλογα με AI_MOCK) |

### Pages
| Route | Αρχείο | Περιγραφή |
|---|---|---|
| `/` | `app/page.tsx` | Landing page (unauthenticated) |
| `/login` | `app/(auth)/login/page.tsx` | Login |
| `/register` | `app/(auth)/register/page.tsx` | Register |
| `/dashboard` | `app/(app)/dashboard/page.tsx` | Flow selection + safety note |
| `/flows/[flowId]` | `app/(app)/flows/[flowId]/page.tsx` | Flow runner |
| `/flows/[flowId]/complete` | `app/(app)/flows/[flowId]/complete/page.tsx` | Result/summary |
| `/history` | `app/(app)/history/page.tsx` | Past sessions |
| `/settings` | `app/(app)/settings/page.tsx` | Settings placeholder |

### API Routes
| Route | Method | Λειτουργία |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/register` | POST | Δημιουργία account |
| `/api/flows` | POST | Start new flow session |
| `/api/flows` | GET | List user sessions |
| `/api/flows/[sessionId]/step` | POST | Submit step answer → safety check → AI if needed |
| `/api/flows/[sessionId]/complete` | GET | Fetch completed session data |

### UI Components
| Αρχείο | Ρόλος |
|---|---|
| `components/ui/Button.tsx` | Button (primary/secondary/ghost/danger, sm/md/lg) |
| `components/ui/Card.tsx` | White card με border/shadow |
| `components/ui/Alert.tsx` | Error/success/info/warning messages |
| `components/ui/ProgressBar.tsx` | Step progress indicator |
| `components/layout/Navbar.tsx` | Top nav (Home / History / Settings / Sign out) |
| `components/flows/FlowCard.tsx` | Dashboard card για κάθε flow |
| `components/flows/FlowRunner.tsx` | Orchestrates step rendering + API calls (auto-submits summary step) |
| `components/flows/steps/TextInputStep.tsx` | Textarea — uses `step.placeholder`, disabled if empty |
| `components/flows/steps/SingleSelectStep.tsx` | Vertical button list — ⚠ styling for safetyTriggerValues |
| `components/flows/steps/MultiSelectStep.tsx` | Pill multi-select — "Skip" button if `!step.required` |
| `components/flows/steps/EmotionPickerStep.tsx` | Emotion pills (rose accent) |
| `components/SafetyBanner.tsx` | Crisis/safety message with resources |
| `components/SessionProvider.tsx` | NextAuth session wrapper |
| `contexts/ToastContext.tsx` | Toast notifications |

---

## Flows & Steps

### Understand What Happened (9 steps, ~8 min)
| # | Field id | Type | Question |
|---|---|---|---|
| 1 | `what_happened` | text_input | What happened? |
| 2 | `who_involved` | single_select | Who is involved? |
| 3 | `they_said_did` | text_input | What did the other person say or do? |
| 4 | `i_said_did` | text_input | What did you say or do? |
| 5 | `feelings` | emotion_picker | How did it make you feel? |
| 6 | `fear_meaning` | text_input | What are you afraid this means? |
| 7 | `happened_before` | single_select | Has this happened before? |
| 8 | `healthy_outcome` | text_input | What outcome would feel healthy or fair? |
| 9 | `summary` | summary (AI) | → triggers `understand_summary` prompt |

### Prepare a Difficult Conversation (8 steps, ~10 min)
| # | Field id | Type | Question |
|---|---|---|---|
| 1 | `conversation_with` | single_select | Who is the conversation with? |
| 2 | `situation` | text_input | What is the situation? |
| 3 | `want_them_to_understand` | text_input | What do you want them to understand? |
| 4 | `need_ask_for` | text_input | What do you need or want to ask for? |
| 5 | `tone` | single_select | What tone do you want to bring? |
| 6 | `want_to_avoid` | multi_select (optional) | What do you want to avoid? |
| 7 | `conversation_safety` | single_select ⚠ | Is there any risk this could become unsafe? |
| 8 | `summary` | summary (AI) | → triggers `prepare_summary` prompt |

`conversation_safety = "Yes, I have safety concerns"` → safety banner (domestic violence resources).

### Decide My Next Step (9 steps, ~7 min)
| # | Field id | Type | Question |
|---|---|---|---|
| 1 | `relationship` | text_input | What relationship are you thinking about? |
| 2 | `questioning` | text_input | What is making you question the situation? |
| 3 | `good_valuable` | text_input | What has been good or valuable? |
| 4 | `painful_confusing` | text_input | What has been painful, confusing, or unhealthy? |
| 5 | `communicated_before` | single_select | Have you communicated your needs/boundaries before? |
| 6 | `their_response` | text_input | How did the other person respond? |
| 7 | `what_would_change` | text_input | What would need to change for this to feel healthier? |
| 8 | `safety_concerns` | single_select ⚠ | Are there any safety concerns? |
| 9 | `summary` | summary (AI) | → triggers `decide_summary` prompt |

`safety_concerns = "Yes, I have concerns about my safety"` → safety banner.

---

## AI System

### Prompt keys (3 total — one per flow)
| Key | Χρήση |
|---|---|
| `understand_summary` | End of "Understand" flow |
| `prepare_summary` | End of "Prepare" flow |
| `decide_summary` | End of "Decide" flow |

### Output types (per-flow strict schemas)
```typescript
UnderstandOutput = {
  situationSummary, factsVsInterpretations{facts[], interpretations[]},
  feelingsAndNeeds{feelings[], needs[]}, possibleOtherPerspective,
  patternsToNotice[], redFlagsOrSafetyConcerns[], whatIsUnclear[],
  healthierReframe, suggestedNextStep, actionPlan[]
}
PrepareOutput = {
  conversationGoal, recommendedMessage, softerVersion, directVersion,
  boundaryFocusedVersion, whatToAvoid[], ifTheyReactBadly[], followUpSuggestion
}
DecideOutput = {
  situationSummary, whatSeemsHealthy[], whatSeemsConcerning[],
  boundariesToConsider[], availableOptions[],
  tradeOffs[{option, benefits[], risks[]}],
  questionsBeforeDeciding[], safetyNote, recommendedLowRiskNextStep, actionPlan[]
}
```
Type guards: `isUnderstandOutput`, `isPrepareOutput`, `isDecideOutput` in `types/index.ts`.

### Safety pipeline
1. **Text input**: keyword filter (crisis / manipulation / abuse) before AI call
2. **Select input**: `safetyTriggerValues` on step definition — specific answer values trigger ban
3. **Usage limit**: checked before AI call (default: 10 AI steps/day, env: `AI_MAX_CALLS_PER_DAY`)
4. **Conversation safety banner** uses domestic violence resources (different from crisis banner)

---

## Design System

**Palette**: stone-50 background · white cards · indigo-600 primary · stone text
**Typography**: Geist (variable font `--font-geist`)
**Accents per flow**: understand=indigo · prepare=violet · decide=teal
**Emotions**: rose accent · Needs: teal accent
**Animations**: `animate-slide-up` (page/step transitions) · `animate-fade-in` (toasts)

---

## DB Schema

```prisma
User         { id, email (unique), name?, password, createdAt, sessions[], usage? }
FlowSession  { id, userId, flowId, status, currentStep, answers (JSON), aiOutputs (JSON), summary?, createdAt, completedAt? }
UserUsage    { userId (PK), dailyAICalls, dailyReset, totalSessions }
```

`answers` και `aiOutputs` αποθηκεύονται ως JSON strings (SQLite limitation).

---

## Business Rules

- Κάθε flow ξεκινά νέα `FlowSession` (δεν γίνεται resume ακόμα)
- AI steps μετρούν ως 1 call στο daily limit
- Safety check πάντα πριν το AI call — αν fail, επιστρέφει `{ type: 'safety' }` χωρίς AI call
- Mock mode: `AI_MOCK=true` → instant canned responses, χωρίς API key
- Prisma 7: `status` field ως string (όχι enum) λόγω SQLite

---

## Ολοκληρωμένα Features (MVP)

- [x] Next.js 16 project setup (Prisma 7, NextAuth, Tailwind v4)
- [x] Auth: register, login, session guard, JWT callbacks
- [x] DB schema + migration (SQLite via better-sqlite3 adapter)
- [x] 3 flows fully defined με typed steps
- [x] Flow engine (state machine, serialize/deserialize)
- [x] Safety system (keyword filter, 3 categories, crisis resources)
- [x] Mock AI mode (6 realistic canned responses)
- [x] Real AI client (Anthropic API, structured JSON parsing)
- [x] Daily usage limiter (configurable via `AI_MAX_CALLS_PER_DAY`)
- [x] API routes (register, start flow, submit step, get complete)
- [x] All 8 step component types
- [x] FlowRunner orchestrator
- [x] Landing page (exact spec copy, calm hero, safety note)
- [x] Dashboard (flow selection, greeting, safety disclaimer)
- [x] Flow runner page (breadcrumb, accent dot, loading state)
- [x] Result/complete page (structured cards, sections, next steps)
- [x] History page (session list, status badges, accent dots)
- [x] Settings placeholder (account, privacy, about, safety note)
- [x] Navbar (Home/History/Settings/Sign out, active state)
- [x] Toast notifications
- [x] Safety banner (crisis resources display)
- [x] Build verified: 0 TypeScript errors, 14 routes
- [x] Guided forms: 3 flows fully implemented with spec-exact fields
- [x] Validation: all required fields disable Continue until filled
- [x] Placeholders: every text field has a specific, helpful example
- [x] Safety-flagged selects: ⚠ styling + banner on trigger value selection
- [x] Optional multi-select (want_to_avoid): Skip button when nothing selected
- [x] Summary auto-submit: FlowRunner auto-submits the final step, shows spinner during AI generation
- [x] Mock responses: realistic, field-specific summaries for all 3 flows
- [x] Strict per-flow AI output schemas: `UnderstandOutput`, `PrepareOutput`, `DecideOutput` with TypeScript types + type guards
- [x] Prompts updated to return structured JSON matching schemas exactly
- [x] Result renderer components: `UnderstandResult`, `PrepareResult`, `DecideResult` (section-based, scannable UI)
- [x] Complete page: picks correct renderer per flowId with runtime validation via type guards
- [x] Removed generic `AISummaryOutput` — replaced with `FlowAIOutput` union type

## Ανοιχτά / Εκκρεμή

- [ ] Real AI API key integration (set `AI_MOCK=false` + `AI_API_KEY`)
- [ ] Session resume (αν ο χρήστης φύγει και επιστρέψει)
- [ ] Turso production DB migration (αντί SQLite)
- [ ] Vercel deployment setup
- [ ] Change password (settings)
- [ ] Delete account / delete sessions (settings)
- [ ] Export data (settings)
- [ ] Email verification (register)
- [ ] Payments / premium tier
- [ ] Mobile app
