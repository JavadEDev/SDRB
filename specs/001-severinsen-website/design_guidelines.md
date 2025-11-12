# Severinsen Design & Redesign Company - Design Guidelines

## Design Approach

**Reference-Based**: Drawing inspiration from creative portfolios (Behance, Dribbble) and design-forward service sites (Squarespace, Framer), creating a sophisticated aesthetic that showcases craftsmanship and creativity.

## Core Design Principles

- **Visual-first storytelling**: Let imagery and work speak loudest
- **Refined craftsmanship**: Every detail reflects quality and attention
- **Accessible elegance**: Beautiful but intuitive for all users

## Typography System

**Font Families** (Google Fonts):

- Primary: 'Playfair Display' (Serif) - Headings, hero text
- Secondary: 'Inter' (Sans-serif) - Body text, UI elements

**Hierarchy**:

- Hero/H1: text-5xl md:text-7xl font-serif font-normal (Playfair)
- H2: text-3xl md:text-5xl font-serif font-normal
- H3: text-2xl md:text-3xl font-sans font-medium
- Body: text-base md:text-lg font-sans font-normal leading-relaxed
- Small/Meta: text-sm font-sans

## Layout System

**Spacing Units**: Use Tailwind spacing of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

- Section padding: py-16 md:py-24 lg:py-32
- Component spacing: space-y-8 md:space-y-12
- Card padding: p-6 md:p-8

**Container Strategy**:

- Full-width sections with max-w-7xl inner containers
- Gallery grids: max-w-screen-2xl for expansive feel
- Text content: max-w-3xl for readability

## Page-Specific Layouts

### Landing Page Structure

1. **Hero Section** (80vh min-height)

   - Large background image showcasing a beautiful redesign project
   - Centered overlay with company name and tagline
   - Primary CTA button with backdrop-blur-md background
   - Subtle scroll indicator

2. **About/Brand Story** (Single column, centered)

   - max-w-3xl container
   - Large serif heading
   - 2-3 paragraph narrative about craftsmanship philosophy

3. **Gallery Preview** (Multi-column)

   - Masonry grid layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
   - Images with hover overlay showing project type
   - "View Full Gallery" CTA

4. **Services Grid** (4-column responsive)

   - grid-cols-1 md:grid-cols-2 lg:grid-cols-4
   - Card design with icon, title, brief description
   - Each service links to detail page

5. **How We Source & Create** (2-column split)

   - Left: Process narrative text
   - Right: Behind-the-scenes image or collage

6. **Upcoming Courses Teaser** (3-column cards)

   - Featured course cards with date, title, spots available
   - "View All Courses" CTA

7. **Newsletter/CTA Section**
   - Centered, max-w-2xl
   - Email signup form inline with submit button

### Gallery Page

- Filterable masonry grid (All, Sewing, Redesign)
- Lightbox modal on click with project details
- grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4

### Services Detail Pages

- Hero with service-specific image (60vh)
- Service description and benefits
- Related work gallery (3-column grid)
- CTA to book or view courses

### Courses Page

- Calendar view integration at top
- Course cards below: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Each card: Image, title, date/time, duration, spots left, price, register button

### Dashboards

**User Dashboard** (Sidebar + Main Content):

- Left sidebar navigation (240px fixed)
- Main content area: Registered courses cards, profile section
- Clean table for course history

**Admin Dashboard** (Similar layout):

- Metrics cards at top (4-column grid): Total courses, Active registrations, Revenue, Users
- Course management table with actions
- User list with role management

## Component Library

### Navigation

- Transparent header on hero, solid white on scroll
- Logo left, menu items center, login/signup right
- Mobile: Hamburger menu with full-screen overlay

### Cards

- Soft shadow: shadow-sm hover:shadow-lg transition
- Rounded corners: rounded-lg
- White background with subtle border

### Buttons

- Primary: Filled with text contrast, px-6 py-3 rounded-full
- Secondary: Outline style with border-2
- Backdrop blur for hero CTAs: backdrop-blur-md bg-white/20

### Forms

- Inputs: border rounded-lg px-4 py-3, focus:ring-2
- Labels: text-sm font-medium mb-2
- Validation: Inline error messages in red-600

### Calendar Component

- Monthly grid view
- Available dates highlighted
- Click to view course details and register
- Color-coded by course type

## Images

**Hero Image**: Large, high-quality image of a beautifully redesigned garment or sewing workspace (full-width, 80vh)

**Gallery**: 15-20 portfolio images of completed sewing/redesign projects

**Service Icons**: Use Heroicons for service type indicators (Scissors, Sparkles, AcademicCap, Calendar)

**About Section**: 2-3 images showing workspace, materials, craftsmanship details

**Course Cards**: Thumbnail for each course type showing activity

## Animations

- Minimal, purposeful only
- Smooth scroll behavior
- Card hover: subtle scale and shadow increase
- Page transitions: Simple fade

## Accessibility

- Minimum contrast ratio 4.5:1 for text
- Focus indicators on all interactive elements
- ARIA labels for icon-only buttons
- Keyboard navigation throughout
