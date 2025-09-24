# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A production-ready Next.js ROI Calculator application for analyzing automation return on investment. Built with TypeScript, Tailwind CSS, and shadcn/ui components. Features comprehensive scenario analysis, interactive charts, PDF/CSV export, and URL sharing.

## Development Commands

```bash
# Install dependencies
npm install
# or
pnpm install

# Development server
npm run dev
pnpm dev

# Build for production
npm run build
pnpm build

# Run tests
npm test
npm run test:watch

# Linting and type checking
npm run lint
npm run type-check

# Start production server
npm start
pnpm start
```

## Architecture

### Key Directories
- `app/` - Next.js 14 App Router pages and API routes
- `components/` - Reusable React components
- `components/ui/` - shadcn/ui base components
- `components/charts/` - Chart components using Recharts
- `lib/` - Utility functions, calculations, constants, and schemas
- `__tests__/` - Jest unit tests

### Core Components
- `FormCard` - Main input form with tabs for inputs, assumptions, and costs
- `KpiStrip` - Key performance indicators display
- Charts: `ChartSummaryBars`, `ChartWaterfall`, `ChartTornado`, `ChartGauge`
- `ScenarioTable` - Detailed comparison of pessimistic/realistic/optimistic scenarios
- `AssumptionsCard`, `RisksCard`, `RecommendationsCard` - Report sections

### Data Flow
1. Form data managed via React Hook Form with Zod validation (`lib/schemas.ts`)
2. Real-time calculations triggered on form changes (`lib/calcs.ts`)
3. Results displayed in charts and tables with 150ms debounce
4. Auto-save to localStorage with URL sharing capability
5. Export functionality for PDF reports and CSV data

### Key Libraries
- Next.js 14 with App Router and TypeScript
- Tailwind CSS + shadcn/ui for styling and components
- React Hook Form + Zod for form handling and validation
- Recharts for interactive charts
- jsPDF for PDF export
- date-fns for date formatting

## Testing

- Unit tests for calculation functions in `__tests__/calcs.test.ts`
- Jest configured with jsdom for React component testing
- Run tests with `npm test` or `npm run test:watch`

## Configuration Files

- `tailwind.config.ts` - Tailwind CSS configuration with custom theme
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with path aliases
- `jest.config.js` - Jest testing configuration