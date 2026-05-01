# Relationship Coach — Project State

> Αυτό το αρχείο είναι η "μνήμη" του project. Ενημερώνεται μετά από κάθε σημαντική αλλαγή.
> Τελευταία ενημέρωση: 2026-05-02

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
| `lib/history.ts` | localStorage/sessionStorage helpers: local sessions, save preference |
| `lib/flows/definitions.ts` | Static definitions για τα 3 flows + βήματα |
| `lib/flows/engine.ts` | Flow state machine (init, advance, serialize, deserialize) |
| `lib/ai/safety.ts` | Per-step keyword safety check (3 categories, crisis resources) |
| `lib/ai/classifier.ts` | Pre-generation safety classifier (4 classes, 18 signal rules) |
| `lib/ai/prompts.ts` | Global system prompt + 3 per-flow prompt builders |
| `lib/ai/providers.ts` | Anthropic + OpenAI provider call logic |
| `lib/ai/validate.ts` | Runtime schema validation για όλα τα AI output types |
| `lib/ai/mock.ts` | Mock responses για όλα τα flows |
| `lib/ai/client.ts` | AI orchestrator (classify → mock/real → validate) — accepts lang param |

### Pages
| Route | Αρχείο | Περιγραφή |
|---|---|---|
| `/` | `app/page.tsx` | Landing page (unauthenticated) |
| `/login` | `app/(auth)/login/page.tsx` | Login |
| `/register` | `app/(auth)/register/page.tsx` | Register |
| `/dashboard` | `app/(app)/dashboard/page.tsx` | Flow selection + recent sessions |
| `/flows/[flowId]` | `app/(app)/flows/[flowId]/page.tsx` | Chat flow runner (με resume) |
| `/flows/[flowId]/complete` | `app/(app)/flows/[flowId]/complete/page.tsx` | Result + HistoryManager |
| `/history` | `app/(app)/history/page.tsx` | Past sessions (COMPLETED + IN_PROGRESS) |
| `/history/local` | `app/(app)/history/local/page.tsx` | View a browser-only local session |
| `/settings` | `app/(app)/settings/page.tsx` | Settings (account, privacy, about) |

### API Routes
| Route | Method | Λειτουργία |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/register` | POST | Δημιουργία account |
| `/api/auth/change-password` | POST | Αλλαγή κωδικού (απαιτεί τρέχοντα) |
| `/api/auth/delete-account` | DELETE | Διαγραφή λογαριασμού (απαιτεί κωδικό) |
| `/api/flows` | POST | Start new flow session |
| `/api/flows` | GET | List sessions (`?flowId=&status=` για φιλτράρισμα) |
| `/api/flows` | DELETE | Διαγραφή ΟΛΩΝ των sessions του χρήστη |
| `/api/flows/[sessionId]` | PATCH | Abandon session (`{ status: 'ABANDONED' }`) |
| `/api/flows/[sessionId]` | DELETE | Διαγραφή συγκεκριμένης session |
| `/api/flows/[sessionId]/step` | POST | Submit step → classify → safety → AI if needed |
| `/api/flows/[sessionId]/complete` | GET | Fetch completed session data |
| `/api/export` | GET | Download all sessions as JSON |

### UI Components
| Αρχείο | Ρόλος |
|---|---|
| `components/ui/Button.tsx` | Button variants |
| `components/ui/Card.tsx` | White card με border/shadow |
| `components/ui/Alert.tsx` | Error/success/info/warning messages |
| `components/ui/ProgressBar.tsx` | Step progress indicator |
| `components/ui/LangToggle.tsx` | Language switcher (flag + label) — landing/login/register/navbar |
| `components/layout/Navbar.tsx` | Top nav (Home / History / Settings / Sign out / LangToggle) |
| `components/flows/FlowCard.tsx` | Dashboard card για κάθε flow |
| `components/flows/ChatRunner.tsx` | Conversational chat UI |
| `components/flows/results/ResultCard.tsx` | Shared card + list primitives |
| `components/flows/results/UnderstandResult.tsx` | Renderer για UnderstandOutput |
| `components/flows/results/PrepareResult.tsx` | Renderer για PrepareOutput |
| `components/flows/results/DecideResult.tsx` | Renderer για DecideOutput |
| `components/history/HistoryManager.tsx` | Complete page island: save/delete based on preference |
| `components/history/DeleteButton.tsx` | Two-tap delete button για history sessions |
| `components/history/LocalSessionsList.tsx` | Browser-only sessions στο history page |
| `components/history/LocalSessionView.tsx` | Renders a local session client-side |
| `components/settings/SaveHistoryToggle.tsx` | Toggle αποθήκευσης ιστορικού (localStorage) |
| `components/settings/DeleteAllSessionsButton.tsx` | Διαγραφή όλων με 2-phase confirm |
| `components/settings/ChangePasswordForm.tsx` | Inline form αλλαγής κωδικού |
| `components/settings/DeleteAccountButton.tsx` | Διαγραφή λογαριασμού με password confirm |
| `components/settings/ExportButton.tsx` | Download JSON export |
| `components/SafetyBanner.tsx` | Crisis/safety message with resources |
| `components/SessionProvider.tsx` | NextAuth session wrapper |
| `contexts/LanguageContext.tsx` | Client-side lang state (en/el) |
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
   - `HIGH_RISK` → return `translations[lang].safety.highRisk`, no AI call
   - `BLOCKED` → return `translations[lang].safety.blocked`, no AI call
4. **Usage limit** — checked before AI call (default 10/day, env: `AI_MAX_CALLS_PER_DAY`)
5. **Response validation** (`lib/ai/validate.ts`) — schema check before returning to frontend

---

## Session History System

### Storage tiers
| Tier | Πότε | Πού |
|---|---|---|
| DB (`FlowSession`) | Save history ON (default) | Turso/SQLite — ορατό σε όλες τις συσκευές |
| sessionStorage | Save history OFF | Browser tab — χάνεται στο κλείσιμο tab |

### Save preference
- Key: `rc_save_history` στο `localStorage` (default `true`)
- Toggle: Settings → Privacy → "Save reflection history"
- Αλλαγή preference δεν επηρεάζει ήδη αποθηκευμένες sessions

### Complete page flow
- `HistoryManager` client island: διαβάζει preference on mount
- Save ON: session μένει στο DB, εμφανίζεται badge "Saved to history"
- Save OFF: αποθηκεύει στο sessionStorage, διαγράφει από DB, εμφανίζεται amber banner

### Session resume
- Πριν ξεκινήσει flow, το flow page ελέγχει για IN_PROGRESS sessions ίδιου flowId
- Αν βρεθεί: εμφανίζεται prompt "Continue / Start fresh"
- "Start fresh" → κάνει PATCH (abandon) την παλιά, δημιουργεί νέα
- History page εμφανίζει IN_PROGRESS sessions με "Continue" link

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
FlowSession  { id, userId, flowId, status, currentStep, answers (JSON), aiOutputs (JSON),
               summary?, title?, createdAt, completedAt? }
UserUsage    { userId (PK), dailyAICalls, dailyReset, totalSessions }
```

`answers` και `aiOutputs` αποθηκεύονται ως JSON strings.
`title` — auto-generated από το πρώτο text answer (≤50 chars) κατά την ολοκλήρωση.
Indexes: `FlowSession(userId)`, `FlowSession(userId, status)`.

**⚠️ Turso production migration**: για νέα column `title`:
```sql
ALTER TABLE FlowSession ADD COLUMN title TEXT;
```

---

## i18n Architecture

- Cookie `lang` (en/el) — διαβάζεται από server components μέσω `getServerLang()` + από client μέσω `LanguageContext`
- `lib/i18n/translations.ts` — όλα τα UI strings (nav, auth, dashboard, chat, history, settings, complete, safety, landing, results labels)
- `lib/i18n/flowTranslations.ts` — flow questions/hints/placeholders/options per language. **Βασική αρχή**: option VALUES = English (stored στη DB + safety checks), option LABELS = translated (display only)
- `lib/i18n/server.ts` — `getServerLang()`, `getServerT()` για server components
- `contexts/LanguageContext.tsx` — client-side lang state, initialized από cookie + localStorage sync
- Language switch → `setLang()` → cookie + localStorage + `router.refresh()` για re-render server components
- LangToggle component → landing page header, login/register top-right, navbar

---

## Ολοκληρωμένα Features

- [x] Next.js 16 project setup (Prisma 7, NextAuth, Tailwind v4)
- [x] Auth: register, login, session guard, JWT callbacks
- [x] DB schema + migration + indexes
- [x] 3 flows fully defined με typed steps και placeholders
- [x] Flow engine (state machine, serialize/deserialize)
- [x] Conversational chat UI (ChatRunner) — AI + user bubbles, typing indicator
- [x] Per-step keyword safety check (3 categories, crisis resources)
- [x] Pre-generation safety classifier (4 classes, 18 signal rules, 27 tests)
- [x] Global system prompt + per-flow prompt builders
- [x] Provider layer: Anthropic + OpenAI placeholder (`AI_PROVIDER` env var)
- [x] Mock AI mode (`MOCK_AI=true`, 3 realistic per-schema responses)
- [x] Strict per-flow AI output schemas με type guards
- [x] Runtime response validation before returning to frontend
- [x] Result renderer components (section-based, scannable)
- [x] Complete page: picks correct renderer per flowId με type guard validation
- [x] Daily usage limiter (configurable via `AI_MAX_CALLS_PER_DAY`)
- [x] Toast notifications
- [x] Safety banner (crisis + DV resources)
- [x] Turso production DB (libSQL)
- [x] Vercel deploy: https://relationship-coach-red.vercel.app
- [x] Build: 0 TypeScript errors
- [x] **Bilingual EN/EL** — LangToggle παντού (landing/login/register/navbar), cookie-based persistence, server + client components translated, flow questions/options/safety messages σε δύο γλώσσες
- [x] **Session History** — save history toggle, delete ανά session, delete all, browser-only (sessionStorage) mode, local session viewer, privacy note
- [x] **Dashboard** — recent 3 completed sessions με view link
- [x] **Session resume** — flow page ελέγχει για IN_PROGRESS πριν ξεκινήσει νέα
- [x] **History page** — εμφανίζει COMPLETED + IN_PROGRESS, delete button, local sessions section
- [x] **Change password** — inline form στο Settings (requires current password)
- [x] **Delete account** — password-confirmed deletion με cascade, redirect to `/`
- [x] **Export data** — `GET /api/export` → JSON download με όλες τις sessions
- [x] **Classifier safety messages translated** — `highRisk` + `blocked` σε EN/EL, `generateAI` δέχεται `lang` parameter
- [x] **LangToggle** — styled με flag emoji + border, ορατό σε landing/login/register/navbar
- [x] **UI Polish pass** — color consistency (stone-* παντού, αφαίρεση gray-*), responsive result grids (`grid-cols-1 sm:grid-cols-2`), warmer safety labels (αφαίρεση uppercase/tracking-widest), backdrop-blur Navbar, `::selection` color, input transition, progress bar χωρίς `%`, sticky input separator, stone-based Alert info
- [x] **AC #8 — Copy buttons** — `CopyButton` component (clipboard API + checkmark feedback), copy icon στο `ResultCard` header (optional `copyText` prop), wired σε nextStep/reframe cards (Understand + Decide)
- [x] **AC #9 — Editable message drafts** — `PrepareResult` πλέον 'use client', όλα τα message cards (recommended, softer, direct, boundary) είναι editable textarea + copy button
- [x] **AC #10 — Usage limit banner** — 429 ανιχνεύεται ξεχωριστά στο ChatRunner, εμφανίζεται dedicated banner αντί για generic error. Translation keys: `limitTitle` + `limitBody` (EN + EL)

---

## Ανοιχτά / Εκκρεμή

### Acceptance Criteria — Εκκρεμή (minor)
- [ ] **AC #8 partial** — Copy για list items (BulletList/ArrowList) — δεν υλοποιήθηκε, χαμηλή προτεραιότητα

### Υποδομή
- [ ] **Real AI**: `MOCK_AI=false` + `ANTHROPIC_API_KEY` στο Vercel dashboard — μόνο env config, χωρίς code changes
- [ ] **Turso migration**: `ALTER TABLE FlowSession ADD COLUMN title TEXT;` — εφαρμογή πριν deploy
- [ ] **Email verification** on register (απαιτεί Resend setup)
- [ ] **Custom domain** (αν χρειαστεί)
- [ ] **Premium tier / payments** (μελλοντικό)
- [ ] **Mobile app** (μελλοντικό)
