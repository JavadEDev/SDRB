# Feature Specification: Severinsen Design & Redesign Bedrift Website

**Feature Branch**: `001-severinsen-website`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Build a bilingual (Norwegian and English) website for "Severinsen Design & Redesign Bedrift" that: - Presents the company, its owner (Jorunn), address, and services (søm, redesign, kurs, temakvelder). - Exposes a public course page and a course calendar where visitors can see upcoming sessions. - Allows authenticated users to register for a specific course session. - Provides an admin area where staff can create courses, create course sessions (date/time/seats), manage a gallery of products/artworks, and view all registrations. - Supports two languages via URL-based locales (/no and /en) and a language switcher in the header. - Stores business contact info and course descriptions in a structured way so they can be translated per language. - Uses a simple gallery grid where clicking an item opens a modal with image, title, description, price, and category. The "why": - The business regularly announces sewing, macramé, ceramics, and bunad-shirt courses and needs a place to show current dates. - The business wants to reuse the same site for Norwegian customers and for English-speaking audiences. - The owner needs a non-technical admin UI to add courses and gallery items without changing code."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Business Information and Services (Priority: P1)

A visitor arrives at the website and wants to learn about the business, its owner, and available services.

**Why this priority**: This is the core purpose of the website - presenting the business to potential customers. Without this, visitors cannot understand what the business offers.

**Independent Test**: Can be fully tested by navigating to the homepage and verifying that business information, owner details (Jorunn), address, and services (søm/sewing, redesign, kurs/courses, temakvelder/theme evenings) are clearly displayed. Delivers value by introducing the business to new visitors.

**Acceptance Scenarios**:

1. **Given** a visitor opens the website, **When** they view the homepage, **Then** they see business name, owner name (Jorunn), address, and list of services (søm, redesign, kurs, temakvelder)
2. **Given** a visitor is on the homepage, **When** they scroll through the page, **Then** they can read about each service in detail
3. **Given** a visitor views the website, **When** they toggle dark mode, **Then** all content remains readable and the design is consistent
4. **Given** a visitor views the website in Norwegian, **When** they view the homepage, **Then** all business information and services are displayed in Norwegian
5. **Given** a visitor views the website in English, **When** they view the homepage, **Then** all business information and services are displayed in English

---

### User Story 2 - Browse Upcoming Courses (Priority: P1)

A visitor wants to see what courses are available and when they are scheduled. The business regularly offers courses in sewing, macramé, ceramics, and bunad-shirt making.

**Why this priority**: The primary business need is to show current courses and accept registrations. The business regularly announces courses (sewing, macramé, ceramics, bunad-shirt) and needs a place to show current dates. Visitors must be able to see available courses before they can register.

**Independent Test**: Can be fully tested by navigating to the courses page and course calendar, verifying that upcoming course sessions are displayed with dates, times, seats available, and course details. Delivers value by showing visitors what learning opportunities are available and when they can attend.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the courses page, **When** they view the page, **Then** they see a list of upcoming course sessions with dates, times, seats available, and course information
2. **Given** a visitor views the course calendar, **When** they view the calendar, **Then** they can see upcoming sessions organized by date
3. **Given** a visitor views the courses page, **When** courses have different dates, **Then** they are displayed in chronological order (upcoming first)
4. **Given** a visitor views the courses page, **When** no courses are scheduled, **Then** they see a message indicating no upcoming courses
5. **Given** a visitor views a course session, **When** they check the location, **Then** they see the fixed location (address)
6. **Given** a visitor views course descriptions, **When** they view in Norwegian, **Then** course descriptions are displayed in Norwegian
7. **Given** a visitor views course descriptions, **When** they view in English, **Then** course descriptions are displayed in English

---

### User Story 3 - View Gallery of Products and Artwork (Priority: P2)

A visitor wants to browse the business's products and artworks to see examples of work in a simple gallery grid.

**Why this priority**: The gallery showcases the business's work and helps visitors understand the quality and style of services offered. This is important for building trust and interest.

**Independent Test**: Can be fully tested by navigating to the gallery page, viewing items in a grid layout, and clicking an item to open a modal with details. Delivers value by allowing visitors to see examples of the business's work.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the gallery page, **When** they view the page, **Then** they see a collection of items displayed in a simple gallery grid with images
2. **Given** a visitor views the gallery grid, **When** they click on an item, **Then** a modal opens showing the item's image, title, description, price, and category
3. **Given** a visitor views the gallery modal, **When** they want to close it, **Then** they can close it by clicking outside, pressing Escape, or clicking a close button
4. **Given** a visitor views the gallery, **When** items have categories, **Then** they can filter or view items by category
5. **Given** a visitor views the gallery, **When** items have prices, **Then** prices are displayed in the appropriate currency format
6. **Given** a visitor views gallery items, **When** they view in Norwegian, **Then** item titles and descriptions are displayed in Norwegian
7. **Given** a visitor views gallery items, **When** they view in English, **Then** item titles and descriptions are displayed in English

---

### User Story 4 - Register for a Course Session (Priority: P2)

An authenticated user wants to register for a specific course session.

**Why this priority**: Course registration is a key business function. Users need to be able to sign up for courses after viewing them, which drives business value.

**Independent Test**: Can be fully tested by logging in as an authenticated user, viewing a course session, and successfully registering for it. Delivers value by allowing users to enroll in courses and enabling the business to manage registrations.

**Acceptance Scenarios**:

1. **Given** an authenticated user views a course session, **When** they click the register button, **Then** they are registered for that course session
2. **Given** an unauthenticated user views a course session, **When** they try to register, **Then** they are redirected to login/authentication
3. **Given** an authenticated user registers for a course, **When** the registration is successful, **Then** they see a confirmation message
4. **Given** an authenticated user has already registered for a course, **When** they view that course, **Then** they see that they are already registered
5. **Given** a course session is full, **When** a user tries to register, **Then** they see a message that the course is full and cannot register

---

### User Story 5 - Staff Manage Courses and Sessions (Priority: P3)

Staff members want to create, update, and manage courses and course sessions without changing code. Courses include sewing, macramé, ceramics, and bunad-shirt courses.

**Why this priority**: The business needs a non-technical way to manage course content. The owner needs a non-technical admin UI to add courses and manage course sessions (date/time/seats) without changing code. This enables staff to keep course information up-to-date independently.

**Independent Test**: Can be fully tested by logging in as a staff member with admin access, accessing the admin area, and successfully creating, editing, and deleting courses and course sessions with date, time, and seat capacity. Delivers value by enabling self-service content management.

**Acceptance Scenarios**:

1. **Given** a staff member accesses the admin area, **When** they navigate to course management, **Then** they see a list of all courses
2. **Given** a staff member wants to create a new course, **When** they fill in course details (title, description in both languages, etc.), **Then** they can save the course without modifying code
3. **Given** a staff member wants to create a course session, **When** they select a course and specify date, time, and number of seats, **Then** they can create the session with the address automatically applied
4. **Given** a staff member views a course session, **When** they want to edit it, **Then** they can update date, time, seats, or other details
5. **Given** a staff member wants to delete a course or session, **When** they confirm the deletion, **Then** it is removed from the system
6. **Given** a non-staff user, **When** they try to access admin routes, **Then** they are denied access
7. **Given** a staff member creates course descriptions, **When** they enter text, **Then** the system stores descriptions in a structured way so they can be translated per language

---

### User Story 6 - Staff Manage Gallery Items and View Registrations (Priority: P3)

Staff members want to add, update, and remove gallery items (products/artworks) without changing code, and view all course registrations.

**Why this priority**: The gallery needs to be kept current with new work. The owner needs a non-technical admin UI to add gallery items without changing code. Staff also need to view all registrations to manage course capacity and communicate with participants.

**Independent Test**: Can be fully tested by logging in as a staff member, accessing the admin area, successfully creating, editing, and deleting gallery items, and viewing all course registrations. Delivers value by enabling dynamic gallery content management and registration oversight.

**Acceptance Scenarios**:

1. **Given** a staff member accesses the gallery management section, **When** they view the page, **Then** they see a list of all gallery items
2. **Given** a staff member wants to add a new gallery item, **When** they upload an image and enter details (title, description, price, category), **Then** they can save the item without modifying code
3. **Given** a staff member views a gallery item, **When** they want to edit it, **Then** they can update any field including replacing the image
4. **Given** a staff member wants to delete a gallery item, **When** they confirm the deletion, **Then** it is removed from the gallery
5. **Given** a staff member creates gallery items, **When** they assign categories, **Then** items are organized by category in the public gallery view
6. **Given** a staff member accesses the admin area, **When** they navigate to registrations, **Then** they see a list of all course registrations
7. **Given** a staff member views registrations, **When** they need to manage capacity, **Then** they can see which sessions are full and which have available seats
8. **Given** a staff member views registrations, **When** necessary, **Then** they can delete registrations if needed

---

### User Story 7 - View Contact Information (Priority: P1)

A visitor wants to find the business contact information (address, phone, email).

**Why this priority**: Contact information is essential for visitors who want to reach out to the business. This is a fundamental requirement for any business website.

**Independent Test**: Can be fully tested by navigating to the contact page and verifying that address, phone number, and email are displayed. Delivers value by providing visitors with ways to contact the business.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the contact page, **When** they view the page, **Then** they see the business address, phone number, and email address
2. **Given** a visitor views the contact page, **When** they want to call the business, **Then** they can click the phone number to initiate a call (on mobile devices)
3. **Given** a visitor views the contact page, **When** they want to email the business, **Then** they can click the email address to open their email client

---

### User Story 8 - Bilingual Support (Norwegian/English) (Priority: P1)

A visitor wants to view the website in either Norwegian or English, with the ability to switch languages. The business wants to reuse the same site for Norwegian customers and for English-speaking audiences.

**Why this priority**: Bilingual support is a core requirement. The business wants to serve both Norwegian and English-speaking audiences with the same website. All content must be available in both languages with URL-based locales (/no and /en).

**Independent Test**: Can be fully tested by viewing the website in Norwegian (/no), switching to English (/en) using the header language switcher, and verifying that all public pages, business contact info, and course descriptions display in the selected language. Delivers value by making the website accessible to both Norwegian and English-speaking audiences.

**Acceptance Scenarios**:

1. **Given** a visitor opens the website, **When** they access it without specifying a language, **Then** it defaults to Norwegian (/no)
2. **Given** a visitor views the website, **When** they click the language switcher in the header, **Then** they can switch between Norwegian (/no) and English (/en)
3. **Given** a visitor switches languages, **When** they navigate to a different page, **Then** the selected language is preserved via URL-based locales and they remain on the same page
4. **Given** a visitor views the website in English (/en), **When** they view all public pages, **Then** all text content, business contact info, and course descriptions are displayed in English
5. **Given** a visitor views the website in Norwegian (/no), **When** they view all public pages, **Then** all text content, business contact info, and course descriptions are displayed in Norwegian
6. **Given** business contact info and course descriptions are stored, **When** content is structured, **Then** they can be translated per language
7. **Given** a content editor wants to update text, **When** they modify structured content storage, **Then** the changes appear on the website without modifying component code
8. **Given** a visitor shares a URL with a locale (/no or /en), **When** another visitor opens it, **Then** the language is determined by the URL locale parameter

---

### Edge Cases

- What happens when a course session reaches maximum capacity? System should prevent additional registrations and display a "full" status.
- How does the system handle expired or past course sessions? Past sessions should not appear in the upcoming courses list, or be clearly marked as past events.
- What happens when a gallery item has missing image or invalid image format? System should display a placeholder image or handle the error gracefully.
- How does the system handle concurrent registrations? System should prevent double-booking and handle race conditions when multiple users register for the same course simultaneously.
- What happens when an admin tries to delete a course that has active registrations? System should either prevent deletion, require confirmation, or handle existing registrations appropriately.
- How does the system handle missing or incomplete contact information? All contact fields should be optional but validated when provided.
- What happens when a user switches languages mid-session? Language preference should be preserved and applied consistently across all pages.
- How does the system handle invalid or malformed JSON in dictionary files? System should fall back to default language or display error messages without breaking the page.
- What happens when dark mode is toggled? All pages should transition smoothly between light and dark themes without content loss.
- How does the system handle very long course descriptions or gallery item descriptions? Content should be displayed appropriately with proper text wrapping and potentially truncation with "read more" functionality.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display business information including business name, owner name (Jorunn), address, and services (søm/sewing, redesign, kurs/courses, temakvelder/theme evenings) on the homepage
- **FR-002**: System MUST display a public course page and course calendar showing upcoming course sessions with dates, times, seats available, and course details
- **FR-003**: System MUST display courses in chronological order (upcoming first)
- **FR-004**: System MUST show the business address for all course sessions
- **FR-005**: System MUST allow authenticated users to register for specific course sessions
- **FR-006**: System MUST redirect unauthenticated users to login when they attempt to register for a course
- **FR-007**: System MUST display a confirmation message when a user successfully registers for a course
- **FR-008**: System MUST prevent registration for courses that are full
- **FR-009**: System MUST display existing registration status when an authenticated user views a course they are registered for
- **FR-010**: System MUST require authentication and admin role for all admin area routes
- **FR-011**: System MUST allow staff with admin access to create, edit, and delete courses without modifying code
- **FR-012**: System MUST allow staff with admin access to create, edit, and delete course sessions (with date, time, and seats) without modifying code
- **FR-013**: System MUST automatically apply the business address when staff create course sessions
- **FR-014**: System MUST allow staff with admin access to create, edit, and delete gallery items (products/artworks) without modifying code
- **FR-035**: System MUST allow staff with admin access to view all course registrations in the admin area
- **FR-036**: System MUST allow staff with admin access to delete course registrations if necessary
- **FR-015**: System MUST display gallery items in a simple gallery grid with images, titles, descriptions, prices, and categories
- **FR-016**: System MUST open gallery items in a modal when clicked from the grid, showing the item's image, title, description, price, and category
- **FR-017**: System MUST allow visitors to close the gallery modal by clicking outside, pressing Escape, or clicking a close button
- **FR-018**: System MUST organize gallery items by category
- **FR-019**: System MUST display contact information (address, phone, email) on the contact page
- **FR-020**: System MUST make phone numbers clickable on mobile devices to initiate calls
- **FR-021**: System MUST make email addresses clickable to open email client
- **FR-022**: System MUST support dark mode with a theme toggle that persists user preference
- **FR-023**: System MUST use a single consistent layout with header, footer, and max-width container (max-w-6xl) across all pages
- **FR-024**: System MUST support bilingual content (Norwegian/English) for all public pages using URL-based locales (/no and /en)
- **FR-025**: System MUST default to Norwegian language (/no) when no locale is specified
- **FR-026**: System MUST provide a language switcher in the header for switching between Norwegian (/no) and English (/en) that preserves the current path
- **FR-027**: System MUST use URL-based locales (/no and /en) to determine and preserve language selection across all pages
- **FR-028**: System MUST store business contact info and course descriptions in a structured way so they can be translated per language
- **FR-037**: System MUST allow content editors to update text content by modifying structured content storage without touching component code
- **FR-038**: System MUST display business contact info and course descriptions in the selected language (Norwegian or English)
- **FR-039**: System MUST support course types including sewing, macramé, ceramics, and bunad-shirt courses
- **FR-029**: System MUST use a flat data structure (no nested albums, no nested courses)
- **FR-030**: System MUST prevent non-staff users from accessing admin area routes
- **FR-031**: System MUST handle course session capacity limits and prevent over-registration
- **FR-032**: System MUST not display past course sessions in the upcoming courses list, or clearly mark them as past events
- **FR-033**: System MUST handle missing or invalid gallery images gracefully with placeholder images or error handling
- **FR-034**: System MUST prevent concurrent registration conflicts when multiple users register for the same course simultaneously

### Key Entities *(include if feature involves data)*

- **Course**: Represents a course offering with title, description (stored in structured way for translation), and other course details. Courses include types such as sewing, macramé, ceramics, and bunad-shirt courses. Courses have multiple sessions but are stored as separate entities (flat structure).
- **Course Session**: Represents a specific instance of a course with date, time, address (automatically applied), seats (capacity), and registration list. Linked to a Course but stored independently.
- **Gallery Item**: Represents a product or artwork with image, title, description, price, and category. Stored as a flat list without nested album structures.
- **User**: Represents an authenticated user who can register for courses. Has authentication credentials and registration history.
- **Staff**: Represents a user with admin role who can manage courses, sessions, gallery items, and view registrations. Extends User with additional permissions.
- **Registration**: Represents a user's registration for a specific course session. Links User to Course Session and includes registration timestamp. Can be viewed and deleted by staff in the admin area.
- **Contact Information**: Represents business contact details including address, phone number, and email address. Stored in a structured way so it can be translated per language.
- **Structured Content**: Represents bilingual content (business contact info, course descriptions, gallery item descriptions) stored in a structured way for translation. Contains content in both Norwegian and English that can be updated without modifying component code.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can view business information, services, and contact details within 10 seconds of landing on the homepage
- **SC-002**: Visitors can browse and view all upcoming courses on the courses page within 5 seconds
- **SC-003**: Authenticated users can complete course registration in under 30 seconds from viewing a course session
- **SC-004**: Visitors can view gallery items and open item details in a modal within 2 seconds of clicking an item
- **SC-005**: Staff can create a new course or course session without technical assistance in under 2 minutes
- **SC-006**: Staff can add a new gallery item with image and details without technical assistance in under 3 minutes
- **SC-007**: Visitors can switch between Norwegian (/no) and English (/en) languages using the header language switcher and have all public pages, business contact info, and course descriptions display in the selected language within 1 second
- **SC-008**: Content editors can update text content (business contact info, course descriptions) by modifying structured content storage and see changes reflected on the website without requiring code deployment
- **SC-015**: Staff can view all course registrations in the admin area and see which sessions are full and which have available seats
- **SC-016**: Staff can create course sessions with date, time, and seat capacity in under 2 minutes without technical assistance
- **SC-009**: The website maintains consistent layout and design (header, footer, max-width container) across all pages
- **SC-010**: Dark mode preference is persisted and applied consistently across all pages when toggled
- **SC-011**: The website handles 100 concurrent visitors browsing courses and gallery without performance degradation
- **SC-012**: Course registration prevents over-registration when a session reaches capacity, with 100% accuracy in capacity enforcement
- **SC-013**: All public pages are accessible with proper ARIA labels, keyboard navigation, and visible focus states
- **SC-014**: The website displays correctly on mobile, tablet, and desktop devices with responsive design

## Assumptions

- Users will have standard web browsers with JavaScript enabled
- Staff members will have basic computer literacy to use the admin interface
- Course sessions will have a defined maximum capacity (seats)
- Courses include types such as sewing, macramé, ceramics, and bunad-shirt courses
- Gallery items (products/artworks) will have images in standard web formats (JPEG, PNG, WebP)
- Contact information (address, phone, email) will be provided by the business owner and stored in a structured way for translation
- Norwegian is the primary language (/no), with English (/en) as secondary language for English-speaking audiences
- The business address will be automatically applied to all course sessions
- Business contact info and course descriptions will be stored in a structured way so they can be translated per language
- Content editors will have access to modify structured content storage through the admin interface
- Dark mode preference will be stored in browser localStorage or cookies
- Authentication system will be implemented separately (not part of this feature specification)
- Database will support the required entities and relationships
- Image storage will be handled by the hosting platform or cloud storage service
- The business wants to reuse the same site for both Norwegian customers and English-speaking audiences

