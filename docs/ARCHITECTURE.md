# LMS Enterprise Architecture

## 1. Folder Structure

```
src/
├── context/           # React Context providers
│   ├── SubscriptionContext.jsx
│   ├── OrganizationContext.jsx
│   ├── ThemeContext.jsx
│   ├── MicroLearningContext.jsx
│   ├── CodeArenaContext.jsx
│   └── AnalyticsContext.jsx
├── services/
│   └── ai/            # AI abstraction layer
│       └── index.js
├── lib/demoData/      # Centralized demo data
│   ├── plans.js
│   ├── subscriptions.js
│   ├── organizations.js
│   ├── flashcards.js
│   ├── codeArena.js
│   └── analytics.js
├── features/
│   ├── pricing/
│   ├── microLearning/
│   ├── codeArena/
│   └── analytics/
├── components/
│   └── FeatureAccessGuard.jsx
└── shared/utils/
    └── spacedRepetition.js   # SM-2 algorithm
```

## 2. SaaS Feature Gating

- **SubscriptionContext**: `hasFeature(feature, orgId)` - checks plan tier
- **OrganizationContext**: `hasFeatureFlag(flag, orgId)` - org-level toggles
- **FeatureAccessGuard**: Wraps components, shows fallback when blocked
- **Usage limits**: `isWithinLimit(orgId, metric)` - soft warning at 80%, hard block at 100%

## 3. SM-2 Spaced Repetition

```js
calculateNextReviewDate(qualityScore, intervalDays, easinessFactor, repetitionCount)
// qualityScore: 0=Again, 1=Hard, 2=Good, 3=Easy
// Returns: { nextInterval, nextEasiness, nextRepetition, nextReviewDate }
```

## 4. AI Integration Abstraction

- `VITE_AI_PROVIDER=openai | custom`
- All AI calls go through `/api/ai/generate` (backend)
- No API keys in frontend
- Functions: `generateExamQuestions`, `generateAssignmentFeedback`, `generatePerformanceSummary`, `detectWeakTopics`, `generateRecommendations`

## 5. PWA Setup

1. Add `manifest.json` to `public/`
2. Add `offline.html` fallback
3. Install `vite-plugin-pwa` for service worker
4. Configure cache strategies for lessons, flashcards

## 6. Code Arena Architecture

- **Backend judge**: Submit code to `/api/code/run`, returns status/score
- **No execution in frontend** - security
- Test cases stored server-side
- Anti-copy: disable right-click, detect tab switch

## 7. Migration Strategy

1. Run `docs/POSTGRESQL_SCHEMA.sql` on new DB
2. Seed plans, default org
3. Migrate localStorage data via one-time script
4. Switch contexts to use `makeApiRequest` instead of localStorage

## 8. Performance Optimization

- Lazy load routes
- Index `organization_id` on all tenant tables
- Use `deleted_at` for soft deletes (avoid hard deletes)
- Paginate large lists (submissions, analytics)
- Cache analytics snapshots (refresh every 6h)
