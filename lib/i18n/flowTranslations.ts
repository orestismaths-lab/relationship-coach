import type { Lang } from './translations'

export type OptionMap = Record<string, string> // English value → display label

export type StepT = {
  question: string
  hint?: string
  placeholder?: string
  options?: OptionMap
}

export type FlowT = {
  title: string
  tagline: string
  estimatedMinutes: number
  steps: Record<string, StepT>
}

// English — labels equal values (no translation needed)
const understandEn: FlowT = {
  title: 'Understand What Happened',
  tagline: 'For confusing moments, mixed signals, conflict, or emotional uncertainty.',
  estimatedMinutes: 8,
  steps: {
    what_happened: {
      question: 'What happened?',
      hint: "Describe the situation in your own words. You don't need to have it figured out.",
      placeholder: '"We had an argument after dinner and they left without saying anything."',
    },
    who_involved: {
      question: 'Who is involved?',
      hint: "What is this person's relationship to you?",
      options: {
        'Romantic partner': 'Romantic partner',
        'Ex-partner': 'Ex-partner',
        'Friend': 'Friend',
        'Family member': 'Family member',
        'Parent': 'Parent',
        'Sibling': 'Sibling',
        'Colleague': 'Colleague',
        'Manager / boss': 'Manager / boss',
        'Other': 'Other',
      },
    },
    they_said_did: {
      question: 'What did the other person say or do?',
      hint: "Try to stick to what actually happened — their words or actions, not your interpretation.",
      placeholder: '"They said \'you always do this\' and walked out of the room."',
    },
    i_said_did: {
      question: 'What did you say or do?',
      hint: "Be honest with yourself. There's no judgment here.",
      placeholder: '"I raised my voice and said something I didn\'t mean."',
    },
    feelings: {
      question: 'How did it make you feel?',
      hint: 'Select everything that applies, even if some feel contradictory.',
      options: {
        'Hurt': 'Hurt', 'Angry': 'Angry', 'Sad': 'Sad', 'Confused': 'Confused',
        'Scared': 'Scared', 'Disappointed': 'Disappointed', 'Lonely': 'Lonely',
        'Frustrated': 'Frustrated', 'Numb': 'Numb', 'Betrayed': 'Betrayed',
        'Relieved': 'Relieved', 'Hopeful': 'Hopeful', 'Guilty': 'Guilty',
        'Ashamed': 'Ashamed', 'Anxious': 'Anxious',
      },
    },
    fear_meaning: {
      question: 'What are you afraid this means?',
      hint: 'E.g. "That they don\'t respect me," "That I\'m too much," or "That this is the end."',
      placeholder: "What's the story you're telling yourself about it?",
    },
    happened_before: {
      question: 'Has this happened before?',
      options: {
        'No, this is new': 'No, this is new',
        'Once or twice': 'Once or twice',
        'Yes, a few times': 'Yes, a few times',
        "Yes, it's a recurring pattern": "Yes, it's a recurring pattern",
      },
    },
    healthy_outcome: {
      question: 'What outcome would feel healthy or fair to you?',
      hint: "This isn't about what you think is realistic — just what would feel right.",
      placeholder: '"I want them to acknowledge what they said. I want to feel heard."',
    },
    summary: { question: 'Your reflection:' },
  },
}

const prepareEn: FlowT = {
  title: 'Prepare a Difficult Conversation',
  tagline: 'For sensitive messages, boundaries, apologies, feedback, or emotional honesty.',
  estimatedMinutes: 10,
  steps: {
    conversation_with: {
      question: 'Who is the conversation with?',
      options: {
        'Romantic partner': 'Romantic partner', 'Ex-partner': 'Ex-partner',
        'Friend': 'Friend', 'Family member': 'Family member', 'Parent': 'Parent',
        'Sibling': 'Sibling', 'Colleague': 'Colleague', 'Manager / boss': 'Manager / boss',
        'Other': 'Other',
      },
    },
    situation: {
      question: 'What is the situation?',
      hint: "Give context. What's been going on, and why does this conversation feel necessary?",
      placeholder: '"My partner dismisses my feelings when I try to bring up something that bothers me."',
    },
    want_them_to_understand: {
      question: 'What do you want them to understand?',
      hint: "What's the core thing you need them to hear — not the argument, but the feeling underneath it?",
      placeholder: '"I need them to understand that I feel invisible when my concerns are brushed off."',
    },
    need_ask_for: {
      question: 'What do you need or want to ask for?',
      hint: 'Be as specific as you can. A behavior, a boundary, an acknowledgment, or something else?',
      placeholder: '"I want to ask them to pause and listen before responding."',
    },
    tone: {
      question: 'What tone do you want to bring?',
      hint: "There's no wrong answer — just what feels right for this moment.",
      options: {
        'Calm and clear': 'Calm and clear',
        'Warm and open': 'Warm and open',
        'Direct but kind': 'Direct but kind',
        'Firm and assertive': 'Firm and assertive',
        'Curious — I want to understand them too': 'Curious — I want to understand them too',
      },
    },
    want_to_avoid: {
      question: 'What do you want to avoid?',
      hint: 'Select anything that feels relevant.',
      options: {
        "Making them defensive": "Making them defensive",
        "Starting an argument": "Starting an argument",
        "Saying something I'll regret": "Saying something I'll regret",
        "Being dismissed or shut down": "Being dismissed or shut down",
        "Losing the relationship": "Losing the relationship",
        "Escalation or conflict": "Escalation or conflict",
        "Crying or losing composure": "Crying or losing composure",
      },
    },
    conversation_safety: {
      question: 'Is there any risk that this conversation could become unsafe?',
      hint: 'This could mean emotionally unsafe, or physically unsafe. Your honesty here matters.',
      options: {
        'No, I feel safe with this person': 'No, I feel safe with this person',
        'Possibly — they can get reactive or dismissive': 'Possibly — they can get reactive or dismissive',
        'Yes, I have safety concerns': 'Yes, I have safety concerns',
      },
    },
    summary: { question: 'Your conversation guide:' },
  },
}

const decideEn: FlowT = {
  title: 'Decide My Next Step',
  tagline: 'For deciding whether to stay engaged, step back, ask for change, or set a boundary.',
  estimatedMinutes: 7,
  steps: {
    relationship: {
      question: 'What relationship are you thinking about?',
      hint: "Describe who this person is to you and how long you've known each other.",
      placeholder: '"My partner of two years" or "A close friend I\'ve known since college."',
    },
    questioning: {
      question: 'What is making you question the situation?',
      hint: "What's been happening that brought you here today?",
      placeholder: '"I keep feeling drained after we spend time together and I\'m not sure why."',
    },
    good_valuable: {
      question: 'What has been good or valuable in this relationship?',
      hint: "Think about what you'd miss, what works, or what you genuinely appreciate.",
      placeholder: '"They\'re the first person I call when something good happens."',
    },
    painful_confusing: {
      question: 'What has been painful, confusing, or unhealthy?',
      hint: "Be honest. You don't have to minimize it or explain it away.",
      placeholder: '"They make plans with me and cancel last minute. I end up feeling like an option."',
    },
    communicated_before: {
      question: 'Have you communicated your needs or boundaries before?',
      options: {
        'Yes, clearly and directly': 'Yes, clearly and directly',
        "I've hinted at it but not said it outright": "I've hinted at it but not said it outright",
        "I've tried but it didn't land the way I meant": "I've tried but it didn't land the way I meant",
        'No, not yet': 'No, not yet',
      },
    },
    their_response: {
      question: 'How did the other person respond?',
      hint: "If you haven't communicated yet, describe how you imagine they might respond.",
      placeholder: '"They apologized in the moment but the same pattern repeated."',
    },
    what_would_change: {
      question: 'What would need to change for this to feel healthier?',
      hint: 'Think about behavior, patterns, communication — not a perfect version of the person.',
      placeholder: '"They\'d need to follow through on what they say, even in small things."',
    },
    safety_concerns: {
      question: 'Are there any safety concerns?',
      hint: 'This includes emotional, psychological, or physical safety.',
      options: {
        'No, I feel safe': 'No, I feel safe',
        "I'm not sure — something feels off": "I'm not sure — something feels off",
        'Yes, I have concerns about my safety': 'Yes, I have concerns about my safety',
      },
    },
    summary: { question: 'Your clarity summary:' },
  },
}

// Greek — labels are Greek, values remain English for DB storage
const understandEl: FlowT = {
  title: 'Κατανόηση της κατάστασης',
  tagline: 'Για μπερδεμένες στιγμές, μεικτά σήματα, σύγκρουση ή συναισθηματική αβεβαιότητα.',
  estimatedMinutes: 8,
  steps: {
    what_happened: {
      question: 'Τι συνέβη;',
      hint: 'Περίγραψε την κατάσταση με δικά σου λόγια. Δεν χρειάζεται να έχεις καταλάβει τα πάντα.',
      placeholder: '"Τσακωθήκαμε μετά το δείπνο και έφυγαν χωρίς να πουν τίποτα."',
    },
    who_involved: {
      question: 'Ποιος εμπλέκεται;',
      hint: 'Ποια είναι η σχέση σου με αυτό το άτομο;',
      options: {
        'Romantic partner': 'Ρομαντικός σύντροφος',
        'Ex-partner': 'Πρώην σύντροφος',
        'Friend': 'Φίλος/η',
        'Family member': 'Μέλος οικογένειας',
        'Parent': 'Γονέας',
        'Sibling': 'Αδερφός/ή',
        'Colleague': 'Συνάδελφος/η',
        'Manager / boss': 'Προϊστάμενος/η',
        'Other': 'Άλλο',
      },
    },
    they_said_did: {
      question: 'Τι είπε ή έκανε το άλλο άτομο;',
      hint: 'Προσπάθησε να μείνεις στα γεγονότα — τα λόγια ή τις πράξεις τους, όχι την ερμηνεία σου.',
      placeholder: '"Είπε «πάντα έτσι κάνεις» και βγήκε από το δωμάτιο."',
    },
    i_said_did: {
      question: 'Τι είπες ή έκανες εσύ;',
      hint: 'Να είσαι ειλικρινής με τον εαυτό σου. Δεν υπάρχει κρίση εδώ.',
      placeholder: '"Ύψωσα τη φωνή μου και είπα κάτι που δεν εννοούσα."',
    },
    feelings: {
      question: 'Πώς σε έκανε να νιώσεις;',
      hint: 'Επίλεξε ό,τι ισχύει, ακόμα κι αν κάποια φαίνονται αντιφατικά.',
      options: {
        'Hurt': 'Πληγωμένος/η',
        'Angry': 'Θυμωμένος/η',
        'Sad': 'Λυπημένος/η',
        'Confused': 'Μπερδεμένος/η',
        'Scared': 'Φοβισμένος/η',
        'Disappointed': 'Απογοητευμένος/η',
        'Lonely': 'Μοναξιά',
        'Frustrated': 'Απογοήτευση',
        'Numb': 'Μούδιασμα',
        'Betrayed': 'Προδομένος/η',
        'Relieved': 'Ανακούφιση',
        'Hopeful': 'Ελπίδα',
        'Guilty': 'Ενοχή',
        'Ashamed': 'Ντροπή',
        'Anxious': 'Άγχος',
      },
    },
    fear_meaning: {
      question: 'Από τι φοβάσαι ότι αυτό είναι σημάδι;',
      hint: 'Π.χ. «Ότι δεν με σέβονται», «Ότι είμαι υπερβολικός/ή», ή «Ότι αυτό είναι το τέλος».',
      placeholder: 'Ποια ιστορία λες στον εαυτό σου γι\' αυτό;',
    },
    happened_before: {
      question: 'Έχει ξαναγίνει αυτό;',
      options: {
        'No, this is new': 'Όχι, είναι κάτι νέο',
        'Once or twice': 'Μία-δύο φορές',
        'Yes, a few times': 'Ναι, μερικές φορές',
        "Yes, it's a recurring pattern": 'Ναι, επαναλαμβάνεται συστηματικά',
      },
    },
    healthy_outcome: {
      question: 'Ποιο αποτέλεσμα θα ένιωθες υγιές ή δίκαιο;',
      hint: 'Αυτό δεν αφορά το τι πιστεύεις ότι είναι ρεαλιστικό — απλά τι θα ένιωθε σωστό.',
      placeholder: '"Θέλω να αναγνωρίσουν αυτό που είπαν. Θέλω να νιώσω ότι με ακούνε."',
    },
    summary: { question: 'Ο αναστοχασμός σου:' },
  },
}

const prepareEl: FlowT = {
  title: 'Προετοιμασία δύσκολης συνομιλίας',
  tagline: 'Για ευαίσθητα μηνύματα, όρια, συγγνώμες, feedback ή συναισθηματική ειλικρίνεια.',
  estimatedMinutes: 10,
  steps: {
    conversation_with: {
      question: 'Με ποιον θα είναι η συζήτηση;',
      options: {
        'Romantic partner': 'Ρομαντικός σύντροφος',
        'Ex-partner': 'Πρώην σύντροφος',
        'Friend': 'Φίλος/η',
        'Family member': 'Μέλος οικογένειας',
        'Parent': 'Γονέας',
        'Sibling': 'Αδερφός/ή',
        'Colleague': 'Συνάδελφος/η',
        'Manager / boss': 'Προϊστάμενος/η',
        'Other': 'Άλλο',
      },
    },
    situation: {
      question: 'Ποια είναι η κατάσταση;',
      hint: 'Δώσε πλαίσιο. Τι γίνεται και γιατί αυτή η συζήτηση φαίνεται απαραίτητη;',
      placeholder: '"Ο σύντροφός μου απορρίπτει τα συναισθήματά μου όταν του μιλάω για κάτι που με ενοχλεί."',
    },
    want_them_to_understand: {
      question: 'Τι θέλεις να καταλάβουν;',
      hint: 'Ποιο είναι το βασικό πράγμα που χρειάζεσαι να ακούσουν — όχι το επιχείρημα, αλλά το συναίσθημα;',
      placeholder: '"Χρειάζομαι να καταλάβουν ότι νιώθω αόρατος/η όταν οι ανησυχίες μου αγνοούνται."',
    },
    need_ask_for: {
      question: 'Τι χρειάζεσαι ή τι θέλεις να ζητήσεις;',
      hint: 'Να είσαι όσο πιο συγκεκριμένος/η μπορείς. Μια συμπεριφορά, ένα όριο, μια αναγνώριση;',
      placeholder: '"Θέλω να ζητήσω να κάνουν παύση και να ακούσουν πριν απαντήσουν."',
    },
    tone: {
      question: 'Τι τόνο θέλεις να φέρεις;',
      hint: 'Δεν υπάρχει λάθος απάντηση — απλά αυτό που νιώθεις σωστό για αυτή τη στιγμή.',
      options: {
        'Calm and clear': 'Ήρεμος/η και σαφής',
        'Warm and open': 'Ζεστός/ή και ανοιχτός/ή',
        'Direct but kind': 'Άμεσος/η αλλά ευγενικός/ή',
        'Firm and assertive': 'Σταθερός/ή και αποφασιστικός/ή',
        'Curious — I want to understand them too': 'Περίεργος/η — θέλω να τους καταλάβω κι εγώ',
      },
    },
    want_to_avoid: {
      question: 'Τι θέλεις να αποφύγεις;',
      hint: 'Επίλεξε ό,τι σου φαίνεται σχετικό.',
      options: {
        'Making them defensive': 'Να γίνουν αμυντικοί',
        'Starting an argument': 'Να ξεκινήσει καβγάς',
        "Saying something I'll regret": 'Να πω κάτι που θα μετανιώσω',
        'Being dismissed or shut down': 'Να με αγνοήσουν ή να κλείσουν',
        'Losing the relationship': 'Να χάσω τη σχέση',
        'Escalation or conflict': 'Κλιμάκωση ή σύγκρουση',
        'Crying or losing composure': 'Να σπάσω ή να χάσω την ψυχραιμία μου',
      },
    },
    conversation_safety: {
      question: 'Υπάρχει κίνδυνος αυτή η συζήτηση να γίνει επικίνδυνη;',
      hint: 'Αυτό μπορεί να σημαίνει συναισθηματικά ή σωματικά επικίνδυνο. Η ειλικρίνειά σου εδώ έχει σημασία.',
      options: {
        'No, I feel safe with this person': 'Όχι, νιώθω ασφαλής μαζί τους',
        'Possibly — they can get reactive or dismissive': 'Πιθανώς — μπορεί να γίνουν αντιδραστικοί',
        'Yes, I have safety concerns': 'Ναι, έχω ανησυχίες ασφάλειας',
      },
    },
    summary: { question: 'Ο οδηγός συνομιλίας σου:' },
  },
}

const decideEl: FlowT = {
  title: 'Απόφαση για το επόμενο βήμα',
  tagline: 'Για το αν θα μείνεις, θα αποστασιοποιηθείς, θα ζητήσεις αλλαγή ή θα θέσεις όριο.',
  estimatedMinutes: 7,
  steps: {
    relationship: {
      question: 'Για ποια σχέση σκέφτεσαι;',
      hint: 'Περίγραψε ποιος/α είναι αυτό το άτομο για σένα και πόσο καιρό το/την ξέρεις.',
      placeholder: '"Ο σύντροφός μου δύο χρόνια" ή "Μια στενή φίλη από το πανεπιστήμιο".',
    },
    questioning: {
      question: 'Τι σε κάνει να αμφιβάλλεις για αυτή την κατάσταση;',
      hint: 'Τι συμβαίνει που σε έφερε εδώ σήμερα;',
      placeholder: '"Αισθάνομαι εξαντλημένος/η μετά από κάθε επαφή μαζί τους και δεν ξέρω γιατί."',
    },
    good_valuable: {
      question: 'Τι έχει ήταν καλό ή αξιόλογο σε αυτή τη σχέση;',
      hint: 'Σκέψου τι θα σου έλειπε, τι λειτουργεί ή τι εκτιμάς πραγματικά.',
      placeholder: '"Είναι το πρώτο άτομο που καλώ όταν συμβεί κάτι καλό."',
    },
    painful_confusing: {
      question: 'Τι έχει ήταν επώδυνο, μπερδεμένο ή αγχωτικό;',
      hint: 'Να είσαι ειλικρινής. Δεν χρειάζεται να το υποβαθμίσεις ή να το δικαιολογήσεις.',
      placeholder: '"Κάνουν σχέδια μαζί μου και τα ακυρώνουν. Καταλήγω να νιώθω σαν εναλλακτική επιλογή."',
    },
    communicated_before: {
      question: 'Έχεις επικοινωνήσει τις ανάγκες ή τα όριά σου πριν;',
      options: {
        'Yes, clearly and directly': 'Ναι, ξεκάθαρα και άμεσα',
        "I've hinted at it but not said it outright": 'Το υπαινίχθηκα αλλά δεν το είπα απευθείας',
        "I've tried but it didn't land the way I meant": 'Το προσπάθησα αλλά δεν έγινε κατανοητό',
        'No, not yet': 'Όχι, ακόμα',
      },
    },
    their_response: {
      question: 'Πώς αντέδρασε το άλλο άτομο;',
      hint: 'Αν δεν έχεις επικοινωνήσει ακόμα, περίγραψε πώς φαντάζεσαι ότι θα αντιδρούσαν.',
      placeholder: '"Ζήτησαν συγγνώμη εκείνη τη στιγμή αλλά το ίδιο μοτίβο επαναλήφθηκε."',
    },
    what_would_change: {
      question: 'Τι θα έπρεπε να αλλάξει για να νιώθεις ότι αυτή η σχέση είναι πιο υγιής;',
      hint: 'Σκέψου συμπεριφορές, μοτίβα, επικοινωνία — όχι μια τέλεια εκδοχή του ατόμου.',
      placeholder: '"Θα έπρεπε να τηρούν αυτό που λένε, ακόμα και σε μικρά πράγματα."',
    },
    safety_concerns: {
      question: 'Υπάρχουν ανησυχίες ασφάλειας;',
      hint: 'Αυτό περιλαμβάνει συναισθηματική, ψυχολογική ή σωματική ασφάλεια.',
      options: {
        'No, I feel safe': 'Όχι, νιώθω ασφαλής',
        "I'm not sure — something feels off": 'Δεν είμαι σίγουρος/η — κάτι δεν πάει καλά',
        'Yes, I have concerns about my safety': 'Ναι, ανησυχώ για την ασφάλειά μου',
      },
    },
    summary: { question: 'Η σύνοψη διαύγειάς σου:' },
  },
}

const flowData: Record<Lang, Record<string, FlowT>> = {
  en: { understand: understandEn, prepare: prepareEn, decide: decideEn },
  el: { understand: understandEl, prepare: prepareEl, decide: decideEl },
}

export function getFlowT(flowId: string, lang: Lang): FlowT | null {
  return flowData[lang]?.[flowId] ?? null
}

export function getStepT(flowId: string, stepId: string, lang: Lang): StepT | null {
  return flowData[lang]?.[flowId]?.steps[stepId] ?? null
}

/** Returns [{value, label}] for a step's options in the given language. */
export function getStepOptions(
  flowId: string,
  stepId: string,
  lang: Lang,
  fallbackOptions: string[]
): { value: string; label: string }[] {
  const stepT = getStepT(flowId, stepId, lang)
  if (stepT?.options) {
    return Object.entries(stepT.options).map(([value, label]) => ({ value, label }))
  }
  return fallbackOptions.map((o) => ({ value: o, label: o }))
}
