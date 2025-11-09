<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 → 1.1.0 (Minor - new principles and expanded guidance)
Modified Principles:
  - I. Code Quality: Added Next.js App Router specification, added dictionary keys requirement
  - III. User Experience Consistency: Expanded to include form labels and error text requirements
  - IV. Performance Requirements: Specified Neon Postgres database and Drizzle migrations
  - V. Security & Authentication: Specified NextAuth/Auth.js with Drizzle adapter
Added Sections:
  - VI. Internationalization (Norwegian/English support, JSON dictionaries, locale switching)
  - VII. Admin Operability (UI-based content management, editable dictionaries)
Removed Sections: N/A
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section references constitution (no changes needed, generic reference)
  ✅ spec-template.md - No constitution-specific references (no changes needed)
  ✅ tasks-template.md - No constitution-specific references (no changes needed)
Follow-up TODOs: None
-->

# Severinsen Design Redesign Bedrift Constitution

## Core Principles

### I. Code Quality (Next.js App Router & TypeScript)

**MUST**: Use Next.js App Router with TypeScript across the entire application. All components, utilities, and API routes must be written in TypeScript with proper type definitions.

**MUST**: Prefer server components for data-fetching pages. Server components should be the default choice for pages that fetch data, with client components only used when interactivity is required.

**MUST**: Keep components small, reusable, and colocated in `/src/components`. Each component must have a clear, single responsibility and be placed in an appropriately named directory structure.

**MUST**: All data access must go through Drizzle query helpers in `/src/lib/queries.ts`. All database queries must use centralized query functions to ensure consistency and maintainability.

**MUST**: No inline "magic strings" for navigation labels. All navigation labels and user-facing text must use dictionary keys from the internationalization system.

**MUST**: All features must be accessible. This includes:
- Proper ARIA labels for interactive elements
- Keyboard navigation support with visible focus states
- Semantic HTML elements
- Sufficient color contrast ratios

**Rationale**: Next.js App Router provides modern React Server Components architecture and improved performance. TypeScript ensures type safety and reduces runtime errors. Server components improve performance by reducing client-side JavaScript. Small, colocated components improve maintainability and reusability. Centralized query helpers ensure consistent database access patterns. Dictionary keys enable internationalization and maintainability. Accessibility ensures the application is usable by all users, including those using assistive technologies.

### II. Testing & Reliability (Critical Route Testing)

**MUST**: Critical routes (authentication, course registration, gallery fetch) must have at least basic integration tests or manual test scripts documented.

**MUST**: No feature is considered "done" without at least one happy-path test or a reproducible manual test note in the PR.

**MUST**: Test documentation must be included in pull requests, either as automated test files or as step-by-step manual test procedures.

**Rationale**: Critical user journeys must be verified to work correctly. Testing ensures reliability and prevents regressions. Documented tests (automated or manual) provide confidence that features work as intended and enable future regression testing.

### III. User Experience Consistency (Layout & Design System)

**MUST**: Use a single layout with header + footer + max-width container (`max-w-6xl`) across all pages. All pages must follow this consistent layout structure.

**MUST**: Reuse the same button styles for all actions. Button variants must be defined in a shared design system (primary, secondary, danger) and consistently applied throughout the application.

**MUST**: Support dark mode using `next-themes`. The application must provide a theme toggle and persist user preference.

**MUST**: All interactive elements must have visible focus states. Keyboard navigation must be clearly indicated with visible focus indicators.

**MUST**: All forms must have labels and clear error text. Form inputs must be properly labeled (using `<label>` elements or `aria-label` attributes) and error messages must be clear and actionable.

**Rationale**: Consistent layout and design patterns create a cohesive user experience and reduce cognitive load. A shared design system ensures visual consistency and makes the application easier to maintain. Dark mode support improves usability in different lighting conditions and meets user expectations. Visible focus states and proper form labels ensure accessibility and usability for all users.

### IV. Performance Requirements (Server-Side Rendering & Database)

**MUST**: Pages must render on the server whenever possible. Server-side rendering should be the default approach unless client-side rendering is explicitly required for interactivity.

**MUST**: Prefer server components for data-fetching pages (kalender, galleri). Data-fetching pages should use server components to improve performance and reduce client-side JavaScript.

**MUST**: Database queries must be done through Drizzle query helpers in `/src/lib/queries.ts`. All database access must go through centralized query functions to ensure consistency and maintainability.

**MUST**: Use a single Neon Postgres database via Drizzle. All database operations must use the Drizzle ORM with Neon Postgres as the database provider.

**MUST**: Schema migrations must be defined in `drizzle.config` and pushed via `drizzle-kit`. All database schema changes must be managed through Drizzle migrations, not manual SQL.

**MUST**: Images in gallery must use optimized Next.js `<Image>` component or explicit width/height attributes. All images must be properly optimized for performance.

**Rationale**: Server-side rendering improves initial page load times and SEO. Server components for data-fetching reduce client-side JavaScript and improve performance. Centralized query helpers ensure consistent database access patterns and make it easier to optimize queries. Neon Postgres provides a scalable, serverless PostgreSQL database. Drizzle migrations ensure version-controlled, repeatable database schema changes. Optimized images reduce page load times and bandwidth usage.

### V. Security & Authentication (NextAuth/Auth.js)

**MUST**: Use NextAuth/Auth.js with Drizzle adapter for authentication. All authentication must be implemented using NextAuth (Auth.js) with the Drizzle adapter for session and user management.

**MUST**: All `/dashboard` routes require authentication. Unauthenticated users must be redirected to the login page.

**MUST**: All `/dashboard/admin` routes require admin role. Server-side checks must verify the user's role (`role = "admin"`) - never trust client-side flags or UI state for authorization decisions.

**MUST**: API routes must check session before writing to the database. All API routes that modify data must verify the user's session and authorization before proceeding.

**Rationale**: NextAuth/Auth.js provides a secure, standardized authentication solution. The Drizzle adapter ensures consistent user and session management with the database. Authentication and authorization are critical for protecting user data and ensuring only authorized users can access sensitive functionality. Server-side verification prevents client-side manipulation and ensures security even if client code is compromised.

### VI. Internationalization (Norwegian & English)

**MUST**: The site must support two languages: Norwegian (default, `/no`) and English (`/en`). All public-facing pages must support both languages with Norwegian as the default.

**MUST**: All public-facing text must come from JSON dictionaries under `/src/lib/dictionaries`. No hardcoded text strings are allowed in components - all text must be loaded from dictionary files.

**MUST**: Header must include a locale switch that preserves the current path. When users switch languages, they must remain on the same page with only the language changing.

**MUST**: Business-critical content (courses page) should be editable via dictionary JSON, not hardcoded in components. Content that needs frequent updates should be stored in dictionary files for easy editing without code changes.

**Rationale**: Bilingual support makes the website accessible to both Norwegian and English-speaking visitors, expanding the potential customer base. JSON dictionaries enable non-technical content editors to update text without modifying code. Preserving the current path when switching languages provides a smooth user experience. Editable dictionaries for business-critical content enable rapid content updates without requiring code deployments.

### VII. Admin Operability (Content Management)

**MUST**: Admin must be able to create courses, course sessions, and gallery items from the UI. All content management must be possible through the admin interface without requiring code changes.

**MUST**: Admin must be able to list all course registrations and delete them if necessary. Administrators must have full visibility and control over course registrations through the admin interface.

**MUST**: Business-critical content (courses page) should be editable via dictionary JSON, not hardcoded in components. Content that needs frequent updates should be stored in dictionary files for easy editing without code changes.

**Rationale**: Non-technical administrators need the ability to manage content independently. UI-based content management reduces dependency on developers and enables rapid content updates. Editable dictionaries for business-critical content enable content editors to update text without technical knowledge. Full visibility and control over registrations enables administrators to manage course capacity and handle edge cases.

## Development Workflow

### Code Review Requirements

All pull requests must:
- Pass automated linting and type checking
- Include tests or manual test documentation for new features
- Verify compliance with all constitution principles
- Include accessibility checks for UI changes
- Verify authentication/authorization for protected routes
- Verify all text uses dictionary keys (no hardcoded strings)
- Verify database queries use centralized query helpers
- Verify schema changes use Drizzle migrations

### Quality Gates

Before merging:
- TypeScript compilation must pass without errors
- All critical routes must have test coverage (automated or documented manual tests)
- Accessibility standards must be met (labels, focus states, semantic HTML)
- Server-side rendering must be used where applicable
- Database queries must use centralized query helpers
- Authentication/authorization must be verified server-side
- All user-facing text must use dictionary keys
- Schema migrations must be defined in `drizzle.config`

## Governance

This constitution supersedes all other development practices and guidelines. All code must comply with these principles.

### Amendment Procedure

- Amendments require documentation of the rationale
- Amendments must be approved before implementation
- Version numbers follow semantic versioning:
  - **MAJOR**: Backward incompatible principle removals or redefinitions
  - **MINOR**: New principles added or materially expanded guidance
  - **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements
- All amendments must be reflected in the Sync Impact Report at the top of this file

### Compliance Review

- All PRs must verify compliance with constitution principles
- Complexity must be justified if it appears to violate simplicity principles
- Violations must be documented and addressed before merge

**Version**: 1.1.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
