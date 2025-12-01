# Product Brief

Build a candidate review dashboard that helps hiring managers efficiently browse and manage ~50,000 test responses.

---

## The Two Tasks

### Task 1: General Response Browsing

A baseline dashboard for browsing all candidate responses:

- **View all responses** — display responses in a browsable format
- **Search and filter** — help users find specific candidates
- **Update review status** — change a response's review status
- **Archive responses** — archive/unarchive individual responses
- **Bulk archive** — archive multiple responses at once

### Task 2: Role-Aware Candidate Ranking

When a role context is selected, surface candidates most relevant to that position.

For this task, you're building for a hiring manager at **Meridian Financial** who is hiring a Senior Frontend Engineer. Your dashboard should help them identify the best candidates for this specific role.

**How you implement this is up to you.** Some ideas:
- Compute a "fit score" based on available data points
- Create smart filters (e.g., "Strong candidates", "Quick completers")
- Add visual indicators for promising candidates
- Build comparison or shortlisting tools
- Sort or rank by relevance to the role

---

## The Role: Senior Frontend Engineer

Use this job description to inform your role-aware features.

**Senior Frontend Engineer — Meridian Financial**

We're looking for a Senior Frontend Engineer to join our growing team. You'll be building the next generation of our consumer-facing financial products, working closely with design and backend teams.

**What you'll do:**
- Build and maintain complex React applications handling sensitive financial data
- Architect frontend systems that scale with our growing user base
- Mentor junior engineers and establish frontend best practices
- Collaborate with product and design to deliver polished user experiences

**What we're looking for:**
- 5+ years of frontend experience, with deep React expertise
- Strong problem-solving skills and attention to detail
- Experience with complex state management and data-heavy UIs
- Track record of shipping quality code quickly
- Excellent communication skills

**Nice to have:**
- Experience in fintech or regulated industries
- Familiarity with TypeScript and modern build tools
- Experience with testing (unit, integration, e2e)

### Signals to Consider

Think about what data points might indicate a good fit:
- `aiScore` — automated quality score (0-100)
- `timeTakenSeconds` — how quickly they completed
- Location data — if hybrid/onsite matters
- Review status progression — pipeline velocity

---

## Available Data

Each response includes:

| Field | Description |
|-------|-------------|
| `id` | Unique response identifier |
| `user.name` | Candidate's full name |
| `user.email` | Candidate's email |
| `user.city`, `user.state`, `user.country` | Location |
| `test.name` | Which test they took |
| `candidateTest.state` | pending, in_progress, completed |
| `candidateTest.startedAt` | When they started |
| `candidateTest.completedAt` | When they finished |
| `candidateTest.timeTakenSeconds` | How long it took |
| `candidateTest.archivedAt` | Archive timestamp (null if active) |
| `aiScore` | Automated score 0-100 (null if not completed) |
| `reviewStatus` | Current review status (or null) |
| `notesPreview` | Preview of internal notes |
| `notesCount` | Number of notes |

See `docs/api-reference.md` for full API documentation.

---

## Evaluation

1. **Product Thinking** — Does it actually help find good candidates?
2. **Technical Quality** — Clean, well-typed, well-architected code
3. **Performance** — Fast load, responsive interactions, efficient data fetching
4. **Polish** — Loading states, error handling, responsive design
5. **Creativity** — Did you do something interesting?

---

## Where to Build

```
app/responses/
├── page.tsx                  # Main page component
└── responses-dashboard.tsx   # Dashboard component
```

Types are in `lib/types.ts`. Create additional files as needed.

---

## Tips

- Focus on usefulness over completeness
- A few well-executed features beat many half-baked ones
- Think about what a hiring manager actually needs
