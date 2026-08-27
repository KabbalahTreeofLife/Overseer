<div align="center">

<img src="public/overseer-logo-light.svg" alt="Overseer" width="200" />

# Overseer

**A niche academic search engine for research papers.**

Search 250M+ papers across OpenAlex, Semantic Scholar, and arXiv with interactive citation graph visualization.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## Features

- **Multi-source search** — aggregates results from OpenAlex, Semantic Scholar, and arXiv
- **Citation graph** — interactive D3.js force-directed visualization of paper citations
- **Filters & sorting** — by year, open access, relevance, citations, or date
- **Dark mode** — persists across sessions via localStorage
- **Responsive** — works on desktop and mobile

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `OPENALEX_EMAILS` | Comma-separated emails for OpenAlex polite pool rotation |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Visualization:** D3.js
- **Data Fetching:** SWR
- **APIs:** OpenAlex, Semantic Scholar, arXiv

## License

MIT
