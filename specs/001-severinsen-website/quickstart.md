# Quickstart Guide: Severinsen Design & Redesign Bedrift Website

**Feature**: 001-severinsen-website  
**Date**: 2025-01-27

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon Postgres recommended)
- Git installed
- Code editor (VS Code recommended)

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd Severinsen-Design-Redesign-Bedrift
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Image optimization
NEXT_PUBLIC_IMAGE_DOMAIN=your-domain.com
```

### 4. Database Setup

#### Initialize Database Schema

```bash
# Generate migration files
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push
```

#### Seed Database (Optional)

```bash
# Create seed script in scripts/seed.ts
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the website.

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Localized pages
│   ├── dashboard/          # User dashboard
│   ├── api/                # API routes
│   └── middleware.ts       # Auth and locale middleware
├── components/             # React components
├── lib/
│   ├── queries.ts          # Database queries
│   ├── dictionaries/       # i18n dictionaries
│   └── auth.ts             # NextAuth config
└── drizzle/
    └── schema.ts           # Database schema
```

## Key Files

### Dictionary Files

- `src/lib/dictionaries/no.json` - Norwegian translations
- `src/lib/dictionaries/en.json` - English translations

### Database Schema

- `src/drizzle/schema.ts` - Drizzle schema definitions
- `drizzle.config.ts` - Drizzle configuration

### API Routes

- `src/app/api/courses/route.ts` - Course endpoints
- `src/app/api/gallery/route.ts` - Gallery endpoints
- `src/app/api/registrations/route.ts` - Registration endpoints

## Development Workflow

### 1. Create a New Page

1. Create page file in `src/app/[locale]/your-page/page.tsx`
2. Add translations to dictionary files
3. Add navigation link in header component

### 2. Add a New API Endpoint

1. Create route file in `src/app/api/your-endpoint/route.ts`
2. Add query helper in `src/lib/queries.ts`
3. Add API contract documentation in `specs/001-severinsen-website/contracts/`

### 3. Update Database Schema

1. Update schema in `src/drizzle/schema.ts`
2. Generate migration: `npx drizzle-kit generate`
3. Push to database: `npx drizzle-kit push`

### 4. Add Translations

1. Update dictionary files in `src/lib/dictionaries/{no,en}.json`
2. Use dictionary keys in components
3. Test both languages

## Testing

### Run Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Manual Testing

1. Test authentication flow
2. Test course registration
3. Test gallery modal
4. Test admin functions
5. Test language switching
6. Test dark mode toggle

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Database Migrations

Run migrations in production:

```bash
npx drizzle-kit push
```

## Common Tasks

### Create a New Course

1. Login as admin
2. Navigate to `/dashboard/admin/courses`
3. Click "Create Course"
4. Fill in course details (Norwegian and English)
5. Save course

### Create a Course Session

1. Navigate to course details
2. Click "Create Session"
3. Fill in date, time, and seats
4. Save session

### Add Gallery Item

1. Login as admin
2. Navigate to `/dashboard/admin/gallery`
3. Click "Add Item"
4. Upload image and fill in details
5. Save item

### View Registrations

1. Login as admin
2. Navigate to `/dashboard/admin/registrations`
3. View all registrations
4. Filter by session or user

## Troubleshooting

### Database Connection Issues

- Check `DATABASE_URL` in `.env.local`
- Verify database is running
- Check network connectivity

### Authentication Issues

- Check `NEXTAUTH_SECRET` in `.env.local`
- Verify NextAuth configuration
- Check session cookie settings

### Translation Issues

- Verify dictionary files exist
- Check dictionary keys match
- Verify locale parameter in URL

### Image Loading Issues

- Check `NEXT_PUBLIC_IMAGE_DOMAIN` in `.env.local`
- Verify image URLs are valid
- Check Next.js Image component configuration

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Neon Postgres Documentation](https://neon.tech/docs)

## Support

For issues or questions, contact the development team or refer to the project documentation.

