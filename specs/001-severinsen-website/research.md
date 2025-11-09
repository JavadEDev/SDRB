# Research: Severinsen Design & Redesign Bedrift Website

**Feature**: 001-severinsen-website  
**Date**: 2025-01-27  
**Status**: Complete

## Research Summary

All technical decisions have been specified in the architecture. This document consolidates the research and rationale behind the technology choices.

## Technology Decisions

### Framework & Routing

**Decision**: Next.js App Router with TypeScript, folder-based routing with `[locale]` parameter

**Rationale**: 
- Next.js App Router provides modern React Server Components architecture and improved performance
- Folder-based routing with `[locale]` parameter enables clean URL structure (`/no/kurs`, `/en/courses`)
- TypeScript ensures type safety and reduces runtime errors
- Server components reduce client-side JavaScript and improve SEO

**Alternatives considered**:
- Pages Router: Rejected due to less optimal performance and more complex i18n setup
- Separate language subdomains: Rejected due to complexity and maintenance overhead
- Client-side routing only: Rejected due to SEO and performance concerns

### Internationalization

**Decision**: Next.js built-in i18n with folder-based routing, JSON dictionaries in `/src/lib/dictionaries/`

**Rationale**:
- Folder-based routing (`/[locale]/...`) provides clean URLs and preserves path when switching languages
- JSON dictionaries enable non-technical content editors to update text without code changes
- Next.js middleware handles locale detection and redirection
- Dictionary structure supports nested content (site, nav, home, contact, coursesPage)

**Alternatives considered**:
- Third-party i18n libraries (next-intl, react-i18next): Rejected due to added complexity when Next.js built-in support is sufficient
- Database-driven translations: Rejected due to performance concerns and complexity
- Separate language files per component: Rejected due to maintenance overhead

### Data Persistence

**Decision**: Neon Postgres with Drizzle ORM

**Rationale**:
- Neon Postgres provides serverless PostgreSQL with automatic scaling
- Drizzle ORM provides type-safe database queries and migrations
- Centralized query helpers in `/src/lib/queries.ts` ensure consistency
- Schema migrations via drizzle-kit enable version-controlled database changes

**Alternatives considered**:
- Prisma: Rejected due to larger bundle size and more complex setup
- Direct PostgreSQL client: Rejected due to lack of type safety and migration management
- NoSQL databases (MongoDB, Firebase): Rejected due to relational data requirements (courses, sessions, registrations)

### Authentication

**Decision**: NextAuth/Auth.js with Drizzle adapter, JWT session strategy

**Rationale**:
- NextAuth/Auth.js provides secure, standardized authentication solution
- Drizzle adapter ensures consistent user and session management with database
- JWT session strategy reduces database queries for session validation
- Role-based access control (user.role) enables admin authorization

**Alternatives considered**:
- Custom authentication: Rejected due to security concerns and maintenance overhead
- Third-party auth providers (Auth0, Clerk): Rejected due to cost and complexity for simple use case
- Session-based authentication with database sessions: Rejected due to performance concerns

### UI Framework

**Decision**: Tailwind CSS with next-themes for dark mode

**Rationale**:
- Tailwind CSS provides utility-first styling with consistent design system
- next-themes enables dark mode support with persistence
- Shared components (header, footer) receive `{ locale, dict }` for localization
- Button variants (primary, secondary, danger) ensure consistent UI

**Alternatives considered**:
- CSS Modules: Rejected due to lack of design system consistency
- Styled Components: Rejected due to added bundle size and complexity
- Material UI / Chakra UI: Rejected due to customization constraints and bundle size

### API Design

**Decision**: RESTful API routes in Next.js App Router

**Rationale**:
- Next.js API routes provide serverless functions with automatic scaling
- RESTful design follows standard patterns for CRUD operations
- Route handlers in `/api/` directory provide clear separation of concerns
- Session validation in middleware ensures security

**Alternatives considered**:
- GraphQL: Rejected due to complexity and overkill for simple CRUD operations
- tRPC: Rejected due to added complexity and learning curve
- External API service: Rejected due to cost and latency concerns

### Image Storage

**Decision**: Next.js `<Image>` component with optimized images

**Rationale**:
- Next.js `<Image>` component provides automatic image optimization
- Supports standard web formats (JPEG, PNG, WebP)
- Automatic lazy loading and responsive images
- Integration with Next.js image optimization API

**Alternatives considered**:
- Cloud storage (S3, Cloudinary): May be needed for production, but Next.js Image component handles optimization
- Base64 encoded images: Rejected due to performance and storage concerns
- External CDN: May be added later for production optimization

## Schema Design Decisions

### User ID Type

**Decision**: String user IDs (not integer)

**Rationale**:
- NextAuth/Auth.js uses string IDs by default
- Enables future integration with external auth providers (OAuth)
- Avoids integer overflow concerns
- Consistent with NextAuth adapter requirements

### Course Session Structure

**Decision**: Flat structure (courses and sessions as separate entities)

**Rationale**:
- Matches requirement for no nested structures
- Enables multiple sessions per course
- Simplifies querying and management
- Clear separation of concerns

### Registration Management

**Decision**: Registrations link users to sessions with timestamp

**Rationale**:
- Enables tracking of registration history
- Supports admin view of all registrations
- Allows users to view their own registrations
- Timestamp enables sorting and filtering

## Performance Considerations

### Server Components

**Decision**: Server components for data-fetching pages (kalender, galleri)

**Rationale**:
- Reduces client-side JavaScript bundle size
- Improves initial page load times
- Better SEO with server-rendered content
- Reduces database query latency

### Client Components

**Decision**: Client components only for interactive parts (gallery modal, admin forms)

**Rationale**:
- Gallery modal requires client-side state management
- Admin forms require client-side validation and interactivity
- User registration cancellation requires client-side confirmation
- Minimizes client-side JavaScript while maintaining interactivity

## Security Considerations

### Authentication Middleware

**Decision**: Middleware protects `/dashboard` and `/dashboard/admin` routes

**Rationale**:
- Server-side protection prevents unauthorized access
- Role-based authorization ensures admin-only access to admin routes
- Session validation in middleware reduces code duplication
- Early rejection of unauthorized requests improves performance

### API Route Security

**Decision**: API routes check session before writing to database

**Rationale**:
- Prevents unauthorized data modifications
- Role-based authorization for admin-only operations
- Server-side validation ensures security even if client code is compromised
- Consistent security pattern across all API routes

## Content Management

### Dictionary Structure

**Decision**: JSON dictionaries with nested structure (site, nav, home, contact, coursesPage)

**Rationale**:
- Enables non-technical content editors to update text
- Supports structured content for courses page
- Easy to extend with new sections
- Type-safe with TypeScript interfaces

### Business Contact Info

**Decision**: Stored in dictionary JSON files (not database)

**Rationale**:
- Enables easy translation per language
- No database queries for static content
- Fast page loads for contact page
- Easy to update without code changes

## Migration Strategy

### Database Migrations

**Decision**: Drizzle migrations via drizzle-kit

**Rationale**:
- Version-controlled database schema changes
- Repeatable migrations for development and production
- Type-safe schema definitions
- Easy rollback of schema changes

## Testing Strategy

### Critical Routes

**Decision**: Integration tests or manual test scripts for critical routes

**Rationale**:
- Authentication: Critical for security
- Course registration: Critical for business functionality
- Gallery fetch: Critical for user experience
- Manual test scripts acceptable for MVP, automated tests preferred for production

## Conclusion

All technical decisions align with the project constitution and architecture requirements. The chosen technologies provide a solid foundation for building a bilingual, performant, and maintainable website.

