# Relationship Coach — Project State

> Αυτό το αρχείο είναι η "μνήμη" του project. Ενημερώνεται μετά από κάθε σημαντική αλλαγή.
> Τελευταία ενημέρωση: 2026-04-30 (bilingual EN/EL)

---

## Τι είναι

Guided AI reflection and communication tool για personal relationships.
Βοηθά χρήστες να κατανοήσουν δύσκολες καταστάσεις, να προετοιμάσουν συνομιλίες, και να επιλέξουν το επόμενο βήμα τους.

**Δεν είναι**: therapy, crisis support, dating app, chatbot, manipulation tool.

---

## Deployment

| | |
|---|---|
| **Production URL** | https://relationship-coach-red.vercel.app |
| **GitHub** | https://github.com/orestismaths-lab/relationship-coach |
| **Vercel project** | `relationship-coach` · team `orestismaths-labs-projects` |
| **Turso DB** | `libsql://relationship-coach-orestismaths-lab.aws-eu-west-1.turso.io` |
| **AI mode** | `MOCK_AI=true` (canned responses, no API key needed) |

---

## Stack

| Στοιχείο | Τεχνολογία |
|---|---|
| Framework | Next.js 16.2.4 (App Router) — **breaking changes vs παλαιότερες εκδόσεις** |
| DB (local) | SQLite via `@prisma/adapter-libsql` + `@libsql/client` (`file:./dev.db`) |
| DB (production) | Turso (libSQL) — `libsql://` URL + `TURSO_AUTH_TOKEN` |
| Auth | NextAuth v4 (credentials) |
| AI | Mock mode (`MOCK_AI=true`) · Real: Anthropic or OpenAI (`AI_PROVIDER`) |
| Styling | Tailwind CSS v4 (CSS-first config, no `tailwind.config.ts`) |
| Deploy | Vercel — live at `relationship-coach-red.vercel.app` |

> **Prisma 7**: `url` αφαιρέθηκε από `schema.prisma`. Ορίζεται στο `prisma.config.ts`. `PrismaClient` χρειάζεται adapter.
> **Next.js 16**: `params` / `searchParams` είναι Promises → `await params` / `use(params)`.
> **libSQL adapter**: `PrismaLibSql` δέχεται απευθείας `{ url, authToken }` — δεν χρειάζεται `createClient` ξεχωριστά.

---

## Environment Variables

### Local (`.env.local`)
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
MOCK_AI=true
AI_PROVIDER=anthropic
MAX_OUTPUT_TOKENS=1200
AI_MAX_CALLS_PER_DAY=10
```

### Production (Vercel — encrypted)
```
DATABASE_URL=libsql://relationship-coach-orestismaths-lab.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://relationship-coach-red.vercel.app
MOCK_AI=true
AI_PROVIDER=anthropic
MAX_OUTPUT_TOKENS=1200
AI_MAX_CALLS_PER_DAY=10
```

**Για να πας live με real AI**: αλλαγή `MOCK_AI=false` + `ANTHROPIC_API_KEY=sk-ant-...` στο Vercel dashboard.

---

## Αρχεία — Χάρτης

### Configuration
| Αρχείο | Ρόλος |
|---|---|
| `prisma/schema.prisma` | DB schema (User, FlowSession, UserUsage) |
| `prisma.config.ts` | Prisma 7 config — datasource URL + migrations path |
| `.env.local` | Local secrets (gitignored) |
| `next.config.ts` | `serverExternalPackages: ['better-sqlite3', '@libsql/client']` |
| `app/globals.css` | Design tokens, animations (Tailwind v4 CSS-first) |

### Core lib
| Αρχείο | Ρόλος |
|---|---|
| `lib/prisma.ts` | Prisma singleton με `PrismaLibSql` adapter (handles file: + libsql:) |
| `lib/auth.ts` | NextAuth config (credentials, JWT, session callbacks) |
| `lib/usage.ts` | Daily AI call limiter (default 10/day, resets at midnight) |
| `lib/flows/definitions.ts` | Static definitions για τα 3 flows + βήματα |
| `lib/flows/engine.ts` | Flow state machine (init, advance, serialize, deserialize) |
| `lib/ai/safety.ts` | Per-step keyword safety check (crisis / manipulation / abuse) |
| `lib/ai/classifier.ts` | Pre-generation safety classifier (SAFE/SENSITIVE/HIGH_RISK/BLOCKED) |
| `lib/ai/prompts.ts` | Global system prompt + 3 per-flow prompt builders |
| `lib/ai/providers.ts` | Anthropic + OpenAI provider call logic |
| `lib/ai/validate.ts` | Runtime schema validation για όλα τα AI output types |
| `lib/ai/mock.ts` | Mock responses για όλα τα flows |
| `lib/ai/client.ts` | AI orchestrator (classify → mock/real → validate) |

### Pages
| Route | Αρχείο | Περιγραφή |
|---|---|---|
| `/` | `app/page.tsx` | Landing page (unauthenticated) |
| `/login` | `app/(auth)/login/page.tsx` | Login |
| `/register` | `app/(auth)/register/page.tsx` | Register |
| `/dashboard` | `app/(app)/dashboard/page.tsx` | Flow selection + safety note |
| `/flows/[flowId]` | `app/(app)/flows/[flowId]/page.tsx` | Chat flow runner |
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
| `/api/flows/[sessionId]/step` | POST | Submit step → classify → safety → AI if needed |
| `/api/flows/[sessionId]/complete` | GET | Fetch completed session data |

### UI Components
| Αρχείο | Ρόλος |
|---|---|
| `components/ui/Button.tsx` | Button variants |
| `components/ui/Card.tsx` | White card με border/shadow |
| `components/ui/Alert.tsx` | Error/success/info/warning messages |
| `components/ui/ProgressBar.tsx` | Step progress indicator |
| `components/layout/Navbar.tsx` | Top nav (Home / History / Settings / Sign out) |
| `components/flows/FlowCard.tsx` | Dashboard card για κάθε flow |
| `components/flows/ChatRunner.tsx` | Conversational chat UI (replaces form-based FlowRunner) |
| `components/flows/results/ResultCard.tsx` | Shared card + list primitives για result renderers |
| `components/flows/results/UnderstandResult.tsx` | Renderer για UnderstandOutput |
| `components/flows/results/PrepareResult.tsx` | Renderer για PrepareOutput (4 message versions) |
| `components/flows/results/DecideResult.tsx` | Renderer για DecideOutput (trade-offs, options) |
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

### Safety pipeline (in order)
1. **Per-step keyword filter** (`lib/ai/safety.ts`) — runs on every text input before saving
2. **`safetyTriggerValues`** on select steps — specific answers (e.g. DV concern) → banner immediately
3. **Pre-generation classifier** (`lib/ai/classifier.ts`) — classifies full answer set before AI call:
   - `SAFE` → proceed
   - `SENSITIVE` → proceed with caution
   - `HIGH_RISK` → return crisis fallback, no AI call
   - `BLOCKED` → return blocked fallback, no AI call
4. **Usage limit** — checked before AI call (default 10/day, env: `AI_MAX_CALLS_PER_DAY`)
5. **Response validation** (`lib/ai/validate.ts`) — schema check before returning to frontend

### Classifier signals (18 rules)
| Class | Signals |
|---|---|
| BLOCKED | manipulation_tactics, surveillance, threats_coercion, physical_harm_intent, sexual_coercion, illegal_activity |
| HIGH_RISK | self_harm_suicidal, immediate_danger, domestic_violence, coercive_control, sexual_abuse, fear_of_partner, child_safety |
| SENSITIVE | anger_intense, hopelessness, harassment_received, infidelity, substance_abuse |

---

## Design System

**Palette**: stone-50 background · white cards · indigo-600 primary · stone text
**Typography**: Geist (variable font `--font-geist`)
**Accents per flow**: understand=indigo · prepare=violet · decide=teal
**Emotions**: rose accent
**Chat UI**: AI bubbles left (stone-100) · User bubbles right (indigo-600) · animated typing dots
**Animations**: `animate-slide-up` (page transitions) · `animate-fade-in` (toasts) · bounce dots (chat typing)

---

## DB Schema

```prisma
User         { id, email (unique), name?, password, createdAt, sessions[], usage? }
FlowSession  { id, userId, flowId, status, currentStep, answers (JSON), aiOutputs (JSON), summary?, createdAt, completedAt? }
UserUsage    { userId (PK), dailyAICalls, dailyReset, totalSessions }
```

`answers` και `aiOutputs` αποθηκεύονται ως JSON strings.
Indexes: `FlowSession(userId)`, `FlowSession(userId, status)`.

---

## Business Rules

- Κάθε flow ξεκινά νέα `FlowSession` (δεν γίνεται resume ακόμα)
- AI generation μετράει ως 1 call στο daily limit
- Safety classifier τρέχει πάντα πριν το AI call — HIGH_RISK/BLOCKED επιστρέφουν fallback χωρίς generation
- Mock mode: `MOCK_AI=true` → instant canned responses, χωρίς API key
- `lib/prisma.ts` χρησιμοποιεί `PrismaLibSql` για όλα τα environments (file: locally, libsql:// production)

---

## Ολοκληρωμένα Features

- [x] Next.js 16 project setup (Prisma 7, NextAuth, Tailwind v4)
- [x] Auth: register, login, session guard, JWT callbacks
- [x] DB schema + migration + indexes
- [x] 3 flows fully defined με typed steps και placeholders
- [x] Flow engine (state machine, serialize/deserialize)
- [x] Conversational chat UI (ChatRunner) — AI + user bubbles, typing indicator
- [x] Per-step keyword safety check (3 categories, crisis resources)
- [x] Pre-generation safety classifier (4 classes, 18 signal rules, 27 tests — `npm run test:classifier`)
- [x] Global system prompt + per-flow prompt builders
- [x] Provider layer: Anthropic + OpenAI placeholder (`AI_PROVIDER` env var)
- [x] Mock AI mode (`MOCK_AI=true`, 3 realistic per-schema responses)
- [x] Strict per-flow AI output schemas: `UnderstandOutput`, `PrepareOutput`, `DecideOutput`
- [x] Runtime response validation before returning to frontend
- [x] Result renderer components (section-based, scannable — trade-offs, message versions, etc.)
- [x] Complete page: picks correct renderer per flowId with type guard validation
- [x] History page (session list, status badges)
- [x] Settings page (shows AI mode + provider)
- [x] Daily usage limiter (configurable via `AI_MAX_CALLS_PER_DAY`)
- [x] Toast notifications
- [x] Safety banner (crisis + DV resources)
- [x] Turso production DB (libSQL) — `@prisma/adapter-libsql`, static imports, Vercel-compatible
- [x] GitHub repo: https://github.com/orestismaths-lab/relationship-coach
- [x] Vercel deploy: https://relationship-coach-red.vercel.app
- [x] Build: 0 TypeScript errors, 14 routes, `prisma generate && next build`
- [x] Bilingual EN/EL — language switcher στο Navbar, cookie-based persistence, server + client components translated, flow questions/options/safety messages σε δύο γλώσσες
- [x] Bug fix: generate step error handling (network error, non-OK, safety → σωστή αντίδραση αντί silent failure)
- [x] Bug fix: complete page reads summary key δυναμικά από flow definition

---

## i18n Architecture

- Cookie `lang` (en/el) — διαβάζεται από server components μέσω `getServerLang()` + από client μέσω `LanguageContext`
- `lib/i18n/translations.ts` — όλα τα UI strings (nav, auth, dashboard, chat, history, settings, complete, safety, landing, results labels)
- `lib/i18n/flowTranslations.ts` — flow questions/hints/placeholders/options per language. **Βασική αρχή**: option VALUES = English (stored στη DB + safety checks), option LABELS = translated (display only)
- `lib/i18n/server.ts` — `getServerLang()`, `getServerT()` για server components
- `contexts/LanguageContext.tsx` — client-side lang state, initialized από cookie + localStorage sync
- Language switch → `setLang()` → cookie + localStorage + `router.refresh()` για re-render server components

---

## Ανοιχτά / Εκκρεμή

- [ ] Real AI API key (`MOCK_AI=false` + `ANTHROPIC_API_KEY` στο Vercel dashboard)
- [ ] Custom domain (αν χρειαστεί)
- [ ] Session resume (αν ο χρήστης φύγει και επιστρέψει)
- [ ] Change password (settings)
- [ ] Delete account / delete sessions (settings)
- [ ] Export data (settings)
- [ ] Email verification (register)
- [ ] Payments / premium tier
- [ ] Mobile app
- [ ] Landing page: language switcher (τώρα μόνο στο Navbar — η landing page δεν έχει Navbar)
