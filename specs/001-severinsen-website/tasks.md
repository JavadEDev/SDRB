# Tasks: Severinsen Design & Redesign Bedrift Website

**Input**: Design documents from `/specs/001-severinsen-website/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual testing tasks included in Phase 11 (Polish & Testing)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/` at repository root (Next.js App Router structure)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Next.js project with App Router and TypeScript in repository root
- [ ] T002 [P] Add Tailwind CSS configuration (tailwind.config.js, postcss.config.js)
- [ ] T003 [P] Add next-themes package and configure theme provider
- [ ] T004 Configure next.config.js with i18n settings: locales ["no", "en"], defaultLocale "no"
- [ ] T005 [P] Create .env.local template with DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET placeholders
- [ ] T006 [P] Setup TypeScript configuration (tsconfig.json) with strict mode
- [ ] T007 [P] Setup ESLint and Prettier configuration files

**Checkpoint**: Project initialized with Next.js, TypeScript, Tailwind, and i18n configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### 2.1 Directory Structure & Layouts

- [ ] T008 Create /src/app/[locale]/layout.tsx to load dictionary and render Header/Footer with locale context
- [ ] T009 [P] Create /src/app/[locale]/page.tsx (homepage placeholder)
- [ ] T010 [P] Create /src/app/[locale]/om-oss/page.tsx (about page placeholder)
- [ ] T011 [P] Create /src/app/[locale]/tjenester/page.tsx (services page placeholder)
- [ ] T012 [P] Create /src/app/[locale]/kurs/page.tsx (courses page placeholder)
- [ ] T013 [P] Create /src/app/[locale]/kalender/page.tsx (calendar page placeholder)
- [ ] T014 [P] Create /src/app/[locale]/galleri/page.tsx (gallery page placeholder)
- [ ] T015 [P] Create /src/app/[locale]/kontakt/page.tsx (contact page placeholder)

### 2.2 Dictionaries & Internationalization

- [ ] T016 Create /src/lib/dictionaries.ts with getDictionary(locale) function
- [ ] T017 [P] Create /src/lib/dictionaries/no.json with all Norwegian strings (site, nav, home, contact, coursesPage)
- [ ] T018 [P] Create /src/lib/dictionaries/en.json with English equivalents
- [ ] T019 Ensure coursesPage is defined in both no.json and en.json with sections array

### 2.3 Shared UI Components

- [ ] T020 Create /src/components/header.tsx that accepts { locale, dict } and generates locale-aware links
- [ ] T021 Add language switcher (NO/EN) to header that preserves current path when switching
- [ ] T022 Create /src/components/footer.tsx that uses dict.site.title
- [ ] T023 [P] Create /src/components/ui/button.tsx with variants (primary, secondary, danger)
- [ ] T024 [P] Create /src/components/ui/theme-toggle.tsx (client component) for dark mode toggle

### 2.4 Database & Drizzle

- [ ] T025 Create /src/drizzle/schema.ts with users (string id), courses, course_sessions, registrations, gallery_items tables
- [ ] T026 Create drizzle.config.ts with Neon Postgres connection
- [ ] T027 Create /src/lib/db.ts with Drizzle database connection instance
- [ ] T028 Run `npx drizzle-kit generate` to create initial migration
- [ ] T029 Run `npx drizzle-kit push` to apply schema to Neon database
- [ ] T030 Create /src/lib/queries.ts with placeholder structure for centralized query helpers

### 2.5 Authentication

- [ ] T031 Install NextAuth/Auth.js and Drizzle adapter packages
- [ ] T032 Create /src/lib/auth.ts with NextAuth configuration using Drizzle adapter
- [ ] T033 Add callbacks to auth.ts that attach user.role to JWT and session
- [ ] T034 Create /src/app/middleware.ts to:
  - Redirect to /no or /en if no locale in path (based on Accept-Language header)
  - Protect /dashboard routes (require authentication)
  - Protect /dashboard/admin routes (require admin role)
- [ ] T035 Create /src/app/api/auth/[...nextauth]/route.ts as NextAuth handler

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Business Information and Services (Priority: P1) 🎯 MVP

**Goal**: Visitors can view business information, owner details, and services on the homepage in both Norwegian and English

**Independent Test**: Navigate to /no and /en, verify business name, owner (Jorunn), address, and services (søm, redesign, kurs, temakvelder) are displayed correctly in each language

### Implementation for User Story 1

- [ ] T036 [US1] Implement /src/app/[locale]/page.tsx (homepage) to display business info from dictionary
- [ ] T037 [US1] Add business information section to homepage with owner name (Jorunn), address, and services list
- [ ] T038 [US1] Ensure homepage uses dict.home for all text content (no hardcoded strings)
- [ ] T039 [US1] Add generateMetadata to homepage to use dict.site.title and dict.site.description
- [ ] T040 [US1] Test homepage displays correctly in Norwegian (/no)
- [ ] T041 [US1] Test homepage displays correctly in English (/en)
- [ ] T042 [US1] Verify dark mode toggle works on homepage

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Browse Upcoming Courses (Priority: P1) 🎯 MVP

**Goal**: Visitors can view upcoming course sessions on the courses page and calendar in both languages

**Independent Test**: Navigate to /no/kurs and /en/kurs, verify upcoming course sessions are displayed with dates, times, seats, and course details in the selected language

### Implementation for User Story 2

- [ ] T043 [US2] Create /src/lib/queries.ts helper function getCoursesWithSessions() to fetch courses and sessions
- [ ] T044 [US2] Implement /src/app/[locale]/kurs/page.tsx (server component) to display courses from dictionary
- [ ] T045 [US2] Implement /src/app/[locale]/kalender/page.tsx (server component) to display upcoming sessions from database
- [ ] T046 [US2] Create /src/components/courses/course-list.tsx (server component) to render courses
- [ ] T047 [US2] Create /src/components/courses/course-card.tsx (server component) to display course session details
- [ ] T048 [US2] Ensure courses page uses dict.coursesPage for content sections
- [ ] T049 [US2] Ensure course descriptions from database are displayed in selected language (Norwegian/English)
- [ ] T050 [US2] Add generateMetadata to courses and calendar pages
- [ ] T051 [US2] Implement API route /src/app/api/courses/route.ts with GET handler to list courses and sessions
- [ ] T052 [US2] Test courses page displays upcoming sessions in chronological order
- [ ] T053 [US2] Test calendar page displays sessions organized by date
- [ ] T054 [US2] Test empty state when no courses are scheduled

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Gallery of Products and Artwork (Priority: P2)

**Goal**: Visitors can browse gallery items in a grid and view details in a modal

**Independent Test**: Navigate to /no/galleri, click on a gallery item, verify modal opens with image, title, description, price, and category

### Implementation for User Story 3

- [ ] T055 [US3] Create /src/lib/queries.ts helper function getGalleryItems() to fetch gallery items
- [ ] T056 [US3] Implement /src/app/[locale]/galleri/page.tsx (server component) to display gallery items
- [ ] T057 [US3] Create /src/components/gallery/gallery-grid.tsx (server component) to render gallery grid
- [ ] T058 [US3] Create /src/components/gallery/gallery-modal.tsx (client component) to display item details in modal
- [ ] T059 [US3] Implement modal close functionality (click outside, Escape key, close button)
- [ ] T060 [US3] Ensure gallery items display titles and descriptions in selected language
- [ ] T061 [US3] Add category filtering to gallery page (if categories exist)
- [ ] T062 [US3] Implement API route /src/app/api/gallery/route.ts with GET handler to list gallery items
- [ ] T063 [US3] Use Next.js Image component for gallery images with optimization
- [ ] T064 [US3] Add generateMetadata to gallery page
- [ ] T065 [US3] Test gallery grid displays items correctly
- [ ] T066 [US3] Test modal opens and closes correctly
- [ ] T067 [US3] Test gallery displays in both Norwegian and English

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Register for a Course Session (Priority: P2)

**Goal**: Authenticated users can register for course sessions and view their registrations

**Independent Test**: Login as user, navigate to /no/kalender, click register on a session, verify registration appears in /dashboard/registrations

### Implementation for User Story 4

- [ ] T068 [US4] Create /src/lib/queries.ts helper function createRegistration() to register user for session
- [ ] T069 [US4] Create /src/lib/queries.ts helper function getUserRegistrations() to fetch user's registrations
- [ ] T070 [US4] Create /src/lib/queries.ts helper function deleteRegistration() to cancel registration
- [ ] T071 [US4] Implement API route /src/app/api/courses/[id]/register/route.ts with POST handler (authenticated users only)
- [ ] T072 [US4] Add validation to registration API: check session exists, has available seats, user not already registered
- [ ] T073 [US4] Create /src/app/dashboard/page.tsx to show user info
- [ ] T074 [US4] Create /src/app/dashboard/registrations/page.tsx to list user's registrations
- [ ] T075 [US4] Add cancel registration functionality to /dashboard/registrations page
- [ ] T076 [US4] Implement API route /src/app/api/registrations/[id]/route.ts with DELETE handler (owner or admin)
- [ ] T077 [US4] Add registration button to course session cards (only show if authenticated and not already registered)
- [ ] T078 [US4] Add confirmation message after successful registration
- [ ] T079 [US4] Add error handling for full sessions and duplicate registrations
- [ ] T080 [US4] Test registration flow: login → view session → register → verify in dashboard
- [ ] T081 [US4] Test unauthenticated user redirected to login when trying to register
- [ ] T082 [US4] Test user can cancel their own registration

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently

---

## Phase 7: User Story 5 - Staff Manage Courses and Sessions (Priority: P3)

**Goal**: Staff can create, edit, and delete courses and course sessions through admin UI

**Independent Test**: Login as admin, navigate to /dashboard/admin/courses, create a course, create a session, verify it appears on public courses page

### Implementation for User Story 5

- [ ] T083 [US5] Create /src/lib/queries.ts helper function createCourse() to create new course
- [ ] T084 [US5] Create /src/lib/queries.ts helper function updateCourse() to update course
- [ ] T085 [US5] Create /src/lib/queries.ts helper function deleteCourse() to delete course
- [ ] T086 [US5] Create /src/lib/queries.ts helper function createCourseSession() to create session
- [ ] T087 [US5] Create /src/lib/queries.ts helper function updateCourseSession() to update session
- [ ] T088 [US5] Create /src/lib/queries.ts helper function deleteCourseSession() to delete session
- [ ] T089 [US5] Implement API route /src/app/api/courses/route.ts with POST handler (admin only)
- [ ] T090 [US5] Implement API route /src/app/api/courses/[id]/sessions/route.ts with POST handler (admin only)
- [ ] T091 [US5] Create /src/app/dashboard/admin/page.tsx (admin overview)
- [ ] T092 [US5] Create /src/app/dashboard/admin/courses/page.tsx to list all courses
- [ ] T093 [US5] Create /src/components/admin/course-form.tsx (client component) for creating/editing courses
- [ ] T094 [US5] Create /src/components/admin/session-form.tsx (client component) for creating/editing sessions
- [ ] T095 [US5] Add form validation and error handling to course and session forms
- [ ] T096 [US5] Ensure course descriptions can be entered in both Norwegian and English
- [ ] T097 [US5] Ensure business address is automatically applied when creating sessions
- [ ] T098 [US5] Add success/error messages to admin forms
- [ ] T099 [US5] Test admin can create course with bilingual descriptions
- [ ] T100 [US5] Test admin can create session with date, time, and seats
- [ ] T101 [US5] Test admin can edit and delete courses and sessions
- [ ] T102 [US5] Test non-admin users cannot access admin routes

**Checkpoint**: At this point, User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Staff Manage Gallery Items and View Registrations (Priority: P3)

**Goal**: Staff can create, edit, delete gallery items and view all course registrations

**Independent Test**: Login as admin, navigate to /dashboard/admin/gallery, create gallery item, verify it appears on public gallery page. View all registrations in /dashboard/admin/registrations

### Implementation for User Story 6

- [ ] T103 [US6] Create /src/lib/queries.ts helper function createGalleryItem() to create gallery item
- [ ] T104 [US6] Create /src/lib/queries.ts helper function updateGalleryItem() to update gallery item
- [ ] T105 [US6] Create /src/lib/queries.ts helper function deleteGalleryItem() to delete gallery item
- [ ] T106 [US6] Create /src/lib/queries.ts helper function getAllRegistrations() to fetch all registrations (admin)
- [ ] T107 [US6] Implement API route /src/app/api/gallery/route.ts with POST handler (admin only)
- [ ] T108 [US6] Implement API route /src/app/api/registrations/route.ts with GET handler (admin only)
- [ ] T109 [US6] Create /src/app/dashboard/admin/gallery/page.tsx to list all gallery items
- [ ] T110 [US6] Create /src/components/admin/gallery-form.tsx (client component) for creating/editing gallery items
- [ ] T111 [US6] Add image upload handling to gallery form (or image URL input)
- [ ] T112 [US6] Ensure gallery item titles and descriptions can be entered in both languages
- [ ] T113 [US6] Create /src/app/dashboard/admin/registrations/page.tsx to list all registrations
- [ ] T114 [US6] Add filtering to registrations page (by session, by user)
- [ ] T115 [US6] Add delete registration functionality to admin registrations page
- [ ] T116 [US6] Display session capacity and available seats in registrations list
- [ ] T117 [US6] Add success/error messages to gallery and registrations admin forms
- [ ] T118 [US6] Test admin can create gallery item with bilingual content
- [ ] T119 [US6] Test admin can view all registrations and see which sessions are full
- [ ] T120 [US6] Test admin can delete registrations

**Checkpoint**: At this point, User Stories 1-6 should all work independently

---

## Phase 9: User Story 7 - View Contact Information (Priority: P1) 🎯 MVP

**Goal**: Visitors can view business contact information (address, phone, email) on contact page

**Independent Test**: Navigate to /no/kontakt and /en/kontakt, verify contact information is displayed correctly in each language

### Implementation for User Story 7

- [ ] T121 [US7] Implement /src/app/[locale]/kontakt/page.tsx to display contact information from dictionary
- [ ] T122 [US7] Ensure contact page uses dict.contact for address, phone, and email
- [ ] T123 [US7] Make phone numbers clickable (tel: link) for mobile devices
- [ ] T124 [US7] Make email addresses clickable (mailto: link)
- [ ] T125 [US7] Add generateMetadata to contact page
- [ ] T126 [US7] Test contact page displays correctly in Norwegian
- [ ] T127 [US7] Test contact page displays correctly in English
- [ ] T128 [US7] Test phone and email links work correctly

**Checkpoint**: At this point, User Stories 1, 2, 7 should all work independently (P1 stories complete)

---

## Phase 10: User Story 8 - Bilingual Support (Norwegian/English) (Priority: P1) 🎯 MVP

**Goal**: All public pages support both Norwegian and English with URL-based locales and language switcher

**Independent Test**: Navigate to any page, switch language using header switcher, verify all content changes language and path is preserved

### Implementation for User Story 8

- [ ] T129 [US8] Verify all public pages use dictionary keys (no hardcoded strings)
- [ ] T130 [US8] Test language switcher preserves current path when switching between /no and /en
- [ ] T131 [US8] Test default locale redirect works (no locale → /no or /en based on Accept-Language)
- [ ] T132 [US8] Test all pages display correctly in Norwegian (/no)
- [ ] T133 [US8] Test all pages display correctly in English (/en)
- [ ] T134 [US8] Verify business contact info and course descriptions are translated per language
- [ ] T135 [US8] Test shared URLs with locale parameter work correctly

**Checkpoint**: At this point, all P1 user stories (1, 2, 7, 8) should be complete

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### UX & SEO

- [ ] T136 [P] Add generateMetadata to all localized pages (om-oss, tjenester, kurs, kalender, galleri, kontakt) using dict.site.title and dict.site.description
- [ ] T137 [P] Add basic error messages to admin forms (course, session, gallery)
- [ ] T138 [P] Add basic success messages to admin forms
- [ ] T139 [P] Ensure all forms have proper labels and error text (accessibility)
- [ ] T140 [P] Ensure all interactive elements have visible focus states
- [ ] T141 [P] Verify consistent layout (header, footer, max-w-6xl container) across all pages

### Manual Testing

- [ ] T142 Test NO and EN navigation: Navigate through all pages in both languages, verify all links work
- [ ] T143 Test registration flow: Login as user → navigate to /no/kalender → register for session → verify registration appears in /dashboard/registrations
- [ ] T144 Test admin gallery CRUD: Login as admin → create gallery item → edit item → delete item → verify changes on public gallery
- [ ] T145 Test admin courses CRUD: Login as admin → create course → create session → edit both → delete both → verify changes on public pages
- [ ] T146 Test locale switcher on nested route: Navigate to /no/kurs → switch to EN → verify URL changes to /en/kurs and content updates
- [ ] T147 Test dark mode: Toggle dark mode on all pages, verify consistent appearance
- [ ] T148 Test responsive design: Verify all pages display correctly on mobile, tablet, and desktop
- [ ] T149 Test accessibility: Verify keyboard navigation, focus states, and ARIA labels work correctly

### Code Quality

- [ ] T150 [P] Run TypeScript compilation check (no errors)
- [ ] T151 [P] Run ESLint and fix any issues
- [ ] T152 [P] Verify all database queries go through /src/lib/queries.ts
- [ ] T153 [P] Verify no hardcoded text strings in components (all use dictionary keys)
- [ ] T154 [P] Verify all server components are used for data-fetching pages
- [ ] T155 [P] Verify client components only used for interactive parts (modals, forms)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-10)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3)
  - Some stories can be worked on in parallel after foundational phase
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on database and API setup
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on database and API setup
- **User Story 4 (P2)**: Depends on User Story 2 (needs courses/sessions) and authentication
- **User Story 5 (P3)**: Depends on User Story 2 (needs courses/sessions structure) and authentication
- **User Story 6 (P3)**: Depends on User Story 3 (needs gallery structure) and User Story 4 (needs registrations)
- **User Story 7 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 8 (P1)**: Depends on all other stories (needs all pages to support i18n)

### Within Each User Story

- Database queries (queries.ts) before API routes
- API routes before pages/components
- Server components before client components
- Core implementation before testing

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Dictionary files (no.json, en.json) can be created in parallel
- Public page placeholders can be created in parallel
- UI components (button, theme-toggle) can be created in parallel
- Query helpers for different entities can be created in parallel
- Admin pages can be worked on in parallel after foundational phase

---

## Implementation Strategy

### MVP First (P1 User Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Homepage)
4. Complete Phase 4: User Story 2 (Courses/Calendar)
5. Complete Phase 9: User Story 7 (Contact)
6. Complete Phase 10: User Story 8 (Bilingual Support)
7. **STOP and VALIDATE**: Test all P1 stories independently
8. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add P1 User Stories (1, 2, 7, 8) → Test independently → Deploy/Demo (MVP!)
3. Add P2 User Stories (3, 4) → Test independently → Deploy/Demo
4. Add P3 User Stories (5, 6) → Test independently → Deploy/Demo
5. Add Polish & Testing → Final validation → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Homepage)
   - Developer B: User Story 2 (Courses/Calendar) + API routes
   - Developer C: User Story 7 (Contact) + User Story 8 (i18n)
3. After P1 stories:
   - Developer A: User Story 3 (Gallery)
   - Developer B: User Story 4 (Registration)
   - Developer C: User Story 5 (Admin Courses)
4. Final phase:
   - Developer A: User Story 6 (Admin Gallery/Registrations)
   - Developer B: Polish & UX improvements
   - Developer C: Testing & documentation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All database queries must go through /src/lib/queries.ts
- All text must use dictionary keys (no hardcoded strings)
- Server components for data-fetching, client components for interactivity
- Verify accessibility (labels, focus states, ARIA) throughout implementation

