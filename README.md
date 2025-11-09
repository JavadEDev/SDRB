# Severinsen Design & Redesign Bedrift Website

A bilingual (Norwegian/English) website for Severinsen Design & Redesign Bedrift built with Next.js App Router, TypeScript, and Drizzle ORM.

## Features

- 🌍 **Bilingual Support**: Norwegian (default) and English with URL-based locales (`/no`, `/en`)
- 📅 **Course Calendar**: View upcoming course sessions with registration functionality
- 🖼️ **Gallery**: Browse products and artworks with modal view
- 👤 **User Dashboard**: View and manage course registrations
- 🔐 **Admin Panel**: Manage courses, sessions, gallery items, and view all registrations
- 🌙 **Dark Mode**: Theme toggle with persistent preference
- ♿ **Accessible**: ARIA labels, keyboard navigation, and visible focus states

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon Postgres via Drizzle ORM
- **Authentication**: NextAuth/Auth.js
- **Theme**: next-themes

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon Postgres database (or local PostgreSQL)

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Severinsen-Design-Redesign-Bedrift
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the project root:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```
   
   Generate a secret with:
   ```bash
   openssl rand -base64 32
   ```

4. **Database Setup**:
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Apply migrations
   npm run db:push
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based pages (no, en)
│   │   ├── page.tsx       # Homepage
│   │   ├── om-oss/        # About page
│   │   ├── tjenester/     # Services page
│   │   ├── kurs/          # Courses page
│   │   ├── kalender/      # Calendar page
│   │   ├── galleri/       # Gallery page
│   │   └── kontakt/       # Contact page
│   ├── dashboard/         # User dashboard
│   │   └── admin/         # Admin panel
│   ├── api/               # API routes
│   └── middleware.ts      # Auth and locale middleware
├── components/            # Reusable components
├── lib/
│   ├── dictionaries/      # i18n JSON files
│   ├── queries.ts         # Database query helpers
│   ├── db.ts              # Database connection
│   └── auth.ts            # NextAuth configuration
└── drizzle/
    └── schema.ts          # Database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Apply migrations to database
- `npm run db:studio` - Open Drizzle Studio

## Internationalization

All public-facing text is stored in JSON dictionaries:
- `src/lib/dictionaries/no.json` - Norwegian translations
- `src/lib/dictionaries/en.json` - English translations

To add new translatable content, update both dictionary files.

## Database Schema

- **users**: User accounts with roles (user/admin)
- **courses**: Course definitions with bilingual titles/descriptions
- **course_sessions**: Specific course instances with dates and seats
- **registrations**: User registrations for course sessions
- **gallery_items**: Gallery items with bilingual titles/descriptions

## Authentication

The app uses NextAuth/Auth.js with:
- JWT session strategy
- Role-based access control (user/admin)
- Protected routes via middleware

## Deployment

This application is designed for deployment on Vercel with Neon Postgres:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

Private - All rights reserved

