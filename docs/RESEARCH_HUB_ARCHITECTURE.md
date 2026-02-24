# Research Hub – Scalable Architecture Notes

## Overview

The Research Hub is a standalone module for discovering and redirecting to **legal open-access research platforms only**. It stores metadata only—no scraping or copyrighted content.

## Folder Structure

```
src/
├── context/
│   └── ResearchContext.jsx          # State, CRUD, search, bookmarks, analytics
├── features/
│   └── researchHub/
│       ├── ResearchPage.jsx          # Main hub: platforms + resources + search
│       ├── ResearchPlatformDetailPage.jsx
│       ├── MyResearchPage.jsx        # User bookmarks
│       ├── ResearchAdminPage.jsx     # Admin CRUD + analytics
│       ├── ResearchPlatformCard.jsx
│       ├── ResearchResourceCard.jsx
│       └── RedirectDisclaimerModal.jsx
├── lib/
│   └── demoData/
│       └── researchHub.js
└── services/
    └── research/
        ├── index.js                  # fetchResearchResults abstraction
        ├── arxivService.js
        ├── pubmedService.js
        ├── coreService.js
        └── citationFormatter.js
```

## Entities

| Entity | Purpose |
|--------|---------|
| ResearchPlatform | Open-access platform (arXiv, PubMed, DOAJ, CORE, Gutenberg) |
| ResearchResource | Metadata: title, authors, abstract, externalUrl, citations |
| ResearchBookmark | User-saved resources |
| ResearchClickLog | Click tracking for analytics |

## API-Ready Structure

- `fetchResearchResults(query, platformId, options)` – abstraction over platform APIs
- Services: `arxivService`, `pubmedService`, `coreService` – placeholders for backend integration
- **No direct external API calls from frontend** – all via backend when integrated

## Security & Compliance

- **Redirect disclaimer modal** – shown before opening external links
- **Metadata-only storage** – no full-text or copyrighted content
- **DMCA safe harbor** – redirect-only, no hosting of third-party content
- **Enterprise-ready** – disclaimer supports client approval workflows

## Multi-Tenant

- All entities use `organizationId`
- `getPlatforms()`, `getResources()`, `searchResources()` filter by `currentOrgId`

## DEMO_MODE

- Demo data in `researchHub.js`: 5 platforms, 20 resources, 10 bookmarks, 30 click logs
- `resetDemo.js` restores Research Hub data on reset
- `demo-data-reset` event syncs context

## Role Access

| Role | Access |
|------|--------|
| Admin | CRUD platforms/resources, analytics, enable/disable |
| Staff | View only |
| Member | View, bookmark, redirect |

## Extensibility

- Add new platforms via `createPlatform()` or demo data
- Add API integration in `services/research/*` and wire to backend
- `trackSearch()` available for search analytics (call on explicit search)
- Citation formatter supports APA/MLA; extend for more formats
