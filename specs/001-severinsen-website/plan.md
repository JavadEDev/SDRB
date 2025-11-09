# Implementation Plan: Severinsen Design & Redesign Bedrift Website

**Branch**: `001-severinsen-website` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-severinsen-website/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a bilingual (Norwegian/English) website for Severinsen Design & Redesign Bedrift using Next.js App Router with TypeScript. The website will present the business, allow course registration, showcase a gallery, and provide an admin area for staff to manage content. The technical approach uses Next.js App Router for server-side rendering, NextAuth/Auth.js for authentication, Drizzle ORM with Neon Postgres for data persistence, and JSON dictionaries for internationalization.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+  
**Primary Dependencies**: Next.js 14+ (App Router), NextAuth/Auth.js, Drizzle ORM, Neon Postgres, Tailwind CSS, next-themes  
**Storage**: Neon Postgres database via Drizzle ORM  
**Testing**: Jest/Vitest for unit tests, Playwright/Cypress for integration tests  
**Target Platform**: Web (server-rendered with Next.js), mobile-responsive  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 
- Server-side rendering for all public pages (kalender, galleri)
- Page load times under 2 seconds for public pages
- Support 100 concurrent visitors without performance degradation
- Course registration completes in under 30 seconds
**Constraints**: 
- All public-facing text must come from JSON dictionaries
- All database queries must go through `/src/lib/queries.ts`
- Server components for data-fetching pages
- Client components only for interactive parts (gallery modal, admin forms)
- Schema migrations via drizzle-kit
- No hardcoded text strings in components
**Scale/Scope**: 
- 2 languages (Norwegian, English)
- ~10-20 courses with multiple sessions
- ~50-100 gallery items
- 100+ registered users
- Admin area for staff content management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality (Next.js App Router & TypeScript)
- ✅ **Next.js App Router with TypeScript**: Architecture specifies Next.js App Router with TypeScript
- ✅ **Server Components**: Architecture specifies server components for data-fetching pages (kalender, galleri)
- ✅ **Component Structure**: Architecture specifies components in `/src/components`
- ✅ **Drizzle Query Helpers**: Architecture specifies all database queries through Drizzle ORM in `/src/lib/queries.ts`
- ✅ **Dictionary Keys**: Architecture specifies JSON dictionaries under `/src/lib/dictionaries` for all text
- ✅ **Accessibility**: Must be verified during implementation (ARIA labels, focus states, semantic HTML)

### II. Testing & Reliability (Critical Route Testing)
- ✅ **Critical Routes**: Architecture includes API routes for authentication, course registration, gallery fetch
- ⚠️ **Test Coverage**: Test implementation required - critical routes (auth, course registration, gallery) must have integration tests or manual test scripts

### III. User Experience Consistency (Layout & Design System)
- ✅ **Shared Layout**: Architecture specifies shared header and footer components with `max-w-6xl` container
- ✅ **Dark Mode**: Architecture specifies dark mode via next-themes
- ✅ **Focus States**: Must be verified during implementation (visible focus states for interactive elements)
- ✅ **Form Labels**: Must be verified during implementation (all forms must have labels and error text)

### IV. Performance Requirements (Server-Side Rendering & Database)
- ✅ **Server-Side Rendering**: Architecture specifies server components for public pages
- ✅ **Drizzle Query Helpers**: Architecture specifies Drizzle ORM with queries in `/src/lib/queries.ts`
- ✅ **Neon Postgres**: Architecture specifies Neon Postgres as database
- ✅ **Drizzle Migrations**: Architecture specifies schema migrations via drizzle-kit
- ✅ **Image Optimization**: Must use Next.js `<Image>` component for gallery images

### V. Security & Authentication (NextAuth/Auth.js)
- ✅ **NextAuth/Auth.js**: Architecture specifies NextAuth/Auth.js with Drizzle adapter
- ✅ **Dashboard Auth**: Architecture specifies middleware protection for `/dashboard` routes
- ✅ **Admin Role**: Architecture specifies admin role check in middleware for `/dashboard/admin`
- ✅ **API Route Auth**: Architecture specifies API routes check session before writing to database

### VI. Internationalization (Norwegian & English)
- ✅ **Two Languages**: Architecture specifies Norwegian (default, `/no`) and English (`/en`)
- ✅ **JSON Dictionaries**: Architecture specifies dictionaries in `/src/lib/dictionaries/{no,en}.json`
- ✅ **Locale Switcher**: Architecture specifies language switcher in header that preserves current path
- ✅ **URL-based Locales**: Architecture specifies folder-based routing `/src/app/[locale]/...`

### VII. Admin Operability (Content Management)
- ✅ **UI-based Management**: Architecture specifies admin area for creating courses, sessions, gallery items
- ✅ **Registration Management**: Architecture specifies admin area for viewing and deleting registrations
- ✅ **Dictionary Updates**: Architecture specifies business-critical content (courses page) editable via dictionary JSON

**Gate Status**: ✅ **PASS** - All constitution principles are addressed in the architecture. Implementation must verify accessibility, form labels, focus states, and test coverage.

## Project Structure

### Documentation (this feature)

```text
specs/001-severinsen-website/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                    # Homepage
│   │   ├── om-oss/
│   │   │   └── page.tsx               # About page
│   │   ├── tjenester/
│   │   │   └── page.tsx               # Services page
│   │   ├── kurs/
│   │   │   └── page.tsx               # Courses page (content-driven)
│   │   ├── kalender/
│   │   │   └── page.tsx               # Calendar page (data-driven)
│   │   ├── galleri/
│   │   │   └── page.tsx               # Gallery page (data-driven)
│   │   └── kontakt/
│   │       └── page.tsx               # Contact page
│   ├── dashboard/
│   │   ├── page.tsx                   # User dashboard
│   │   ├── registrations/
│   │   │   └── page.tsx               # User registrations
│   │   └── admin/
│   │       ├── page.tsx               # Admin dashboard
│   │       ├── courses/
│   │       │   └── page.tsx           # Admin course management
│   │       ├── gallery/
│   │       │   └── page.tsx           # Admin gallery management
│   │       └── registrations/
│   │           └── page.tsx           # Admin registrations view
│   ├── api/
│   │   ├── courses/
│   │   │   ├── route.ts               # GET: list courses, POST: create course
│   │   │   └── [id]/
│   │   │       ├── sessions/
│   │   │       │   └── route.ts       # POST: create session
│   │   │       └── register/
│   │   │           └── route.ts       # POST: register for session
│   │   ├── gallery/
│   │   │   └── route.ts               # GET: list gallery, POST: create item
│   │   ├── registrations/
│   │   │   ├── route.ts               # GET: list registrations (admin)
│   │   │   └── [id]/
│   │   │       └── route.ts           # DELETE: cancel registration
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts           # NextAuth handler
│   ├── layout.tsx                     # Root layout
│   └── middleware.ts                  # Auth and locale middleware
├── components/
│   ├── header.tsx                     # Shared header with locale switcher
│   ├── footer.tsx                     # Shared footer
│   ├── gallery/
│   │   ├── gallery-grid.tsx           # Gallery grid (server component)
│   │   └── gallery-modal.tsx          # Gallery modal (client component)
│   ├── courses/
│   │   ├── course-list.tsx            # Course list (server component)
│   │   └── course-card.tsx            # Course card (server component)
│   ├── admin/
│   │   ├── course-form.tsx            # Course form (client component)
│   │   ├── session-form.tsx           # Session form (client component)
│   │   └── gallery-form.tsx           # Gallery form (client component)
│   └── ui/
│       ├── button.tsx                 # Button component (primary, secondary, danger)
│       └── theme-toggle.tsx           # Dark mode toggle (client component)
├── lib/
│   ├── queries.ts                     # Drizzle query helpers
│   ├── dictionaries/
│   │   ├── no.json                    # Norwegian dictionary
│   │   └── en.json                    # English dictionary
│   ├── auth.ts                        # NextAuth configuration
│   └── db.ts                          # Drizzle database connection
└── drizzle/
    └── schema.ts                      # Drizzle schema definitions

drizzle.config.ts                      # Drizzle configuration
next.config.js                         # Next.js configuration
tailwind.config.js                     # Tailwind configuration
```

**Structure Decision**: Next.js App Router structure with folder-based routing for locales. All public pages under `/[locale]/` for internationalization. Admin area under `/dashboard/admin` for protected routes. Components colocated in `/src/components` with feature-based organization. Database queries centralized in `/src/lib/queries.ts`. Dictionaries in `/src/lib/dictionaries/` for i18n.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. Architecture aligns with all constitution principles.
