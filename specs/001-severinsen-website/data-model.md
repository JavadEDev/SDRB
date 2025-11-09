# Data Model: Severinsen Design & Redesign Bedrift Website

**Feature**: 001-severinsen-website  
**Date**: 2025-01-27  
**Status**: Complete

## Database Schema

### Users Table

**Entity**: User  
**Table**: `users`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | User identifier |
| name | string | NOT NULL | User's full name |
| email | string | UNIQUE, NOT NULL | User's email address |
| role | string | NOT NULL, DEFAULT 'user' | User role: 'user' or 'admin' |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | Account creation timestamp |

**Relationships**:
- One-to-many with `registrations` (user can have multiple registrations)

**Validation Rules**:
- Email must be valid email format
- Role must be either 'user' or 'admin'
- Name must be non-empty string

**State Transitions**:
- User created → active
- User role updated → admin or user
- User deleted → cascades to registrations

### Courses Table

**Entity**: Course  
**Table**: `courses`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Course identifier |
| title | string | NOT NULL | Course title (localized) |
| slug | string | UNIQUE, NOT NULL | URL-friendly course identifier |
| description | text | NOT NULL | Course description (localized, stored as JSON) |
| price | decimal(10,2) | | Course price (optional) |
| location | string | NOT NULL | Course location (defaults to business address) |
| category | string | | Course category (sewing, macramé, ceramics, bunad-shirt) |
| active | boolean | NOT NULL, DEFAULT true | Whether course is active |

**Relationships**:
- One-to-many with `course_sessions` (course can have multiple sessions)

**Validation Rules**:
- Title must be non-empty string
- Slug must be unique and URL-friendly (lowercase, hyphens)
- Description must be valid JSON with Norwegian and English translations
- Price must be positive if provided
- Category must be one of: sewing, macramé, ceramics, bunad-shirt (if provided)
- Location must be non-empty string

**State Transitions**:
- Course created → active
- Course deactivated → active = false (sessions remain but not displayed)
- Course deleted → cascades to course_sessions

### Course Sessions Table

**Entity**: Course Session  
**Table**: `course_sessions`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Session identifier |
| course_id | string (UUID) | FOREIGN KEY → courses.id | Reference to course |
| start_at | timestamp | NOT NULL | Session start date and time |
| end_at | timestamp | NOT NULL | Session end date and time |
| seats | integer | NOT NULL, DEFAULT 0 | Maximum number of seats |

**Relationships**:
- Many-to-one with `courses` (session belongs to one course)
- One-to-many with `registrations` (session can have multiple registrations)

**Validation Rules**:
- course_id must reference existing course
- start_at must be before end_at
- seats must be non-negative integer
- start_at and end_at must be in the future when creating (or allow past for historical data)

**State Transitions**:
- Session created → upcoming
- Session start time passed → past (filtered from upcoming list)
- Session full (registrations >= seats) → full (registration disabled)
- Session deleted → cascades to registrations

### Registrations Table

**Entity**: Registration  
**Table**: `registrations`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Registration identifier |
| user_id | string (UUID) | FOREIGN KEY → users.id | Reference to user |
| session_id | string (UUID) | FOREIGN KEY → course_sessions.id | Reference to course session |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | Registration timestamp |

**Relationships**:
- Many-to-one with `users` (registration belongs to one user)
- Many-to-one with `course_sessions` (registration belongs to one session)

**Validation Rules**:
- user_id must reference existing user
- session_id must reference existing course session
- User cannot register for same session twice (UNIQUE constraint on user_id + session_id)
- Session must have available seats (enforced at application level)
- Session must not be in the past (enforced at application level)

**State Transitions**:
- Registration created → active
- Registration cancelled → deleted (soft delete or hard delete)
- Session cancelled → registrations remain (for notification purposes)

### Gallery Items Table

**Entity**: Gallery Item  
**Table**: `gallery_items`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | PRIMARY KEY | Gallery item identifier |
| title | string | NOT NULL | Item title (localized, stored as JSON) |
| image_url | string | NOT NULL | URL to item image |
| description | text | | Item description (localized, stored as JSON) |
| price | decimal(10,2) | | Item price (optional) |
| category | string | | Item category |
| created_at | timestamp | NOT NULL, DEFAULT NOW() | Item creation timestamp |

**Relationships**:
- None (flat structure, no nested albums)

**Validation Rules**:
- Title must be non-empty string or valid JSON with translations
- image_url must be valid URL
- Description must be valid JSON with translations if provided
- Price must be positive if provided
- Category is optional but recommended for filtering

**State Transitions**:
- Gallery item created → active (displayed in gallery)
- Gallery item updated → updated fields reflected
- Gallery item deleted → removed from gallery

## Data Relationships

```
users
  ├── registrations (one-to-many)
  └── role: 'user' or 'admin'

courses
  ├── course_sessions (one-to-many)
  └── description: JSON with { no: string, en: string }

course_sessions
  ├── course (many-to-one)
  ├── registrations (one-to-many)
  └── seats: integer (capacity)

registrations
  ├── user (many-to-one)
  └── session (many-to-one)

gallery_items
  └── (no relationships, flat structure)
```

## Localized Content Storage

### Course Descriptions

**Storage**: JSON field in `courses.description`

**Structure**:
```json
{
  "no": "Norwegian course description",
  "en": "English course description"
}
```

### Gallery Item Titles and Descriptions

**Storage**: JSON fields in `gallery_items.title` and `gallery_items.description`

**Structure**:
```json
{
  "no": "Norwegian title/description",
  "en": "English title/description"
}
```

### Business Contact Information

**Storage**: JSON dictionary files in `/src/lib/dictionaries/{no,en}.json`

**Structure**:
```json
{
  "contact": {
    "address": "Business address",
    "phone": "Phone number",
    "email": "Email address"
  }
}
```

## Indexes

### Performance Indexes

- `users.email`: UNIQUE index for email lookup
- `courses.slug`: UNIQUE index for URL-friendly lookup
- `course_sessions.course_id`: Index for filtering sessions by course
- `course_sessions.start_at`: Index for sorting and filtering by date
- `registrations.user_id`: Index for user's registrations
- `registrations.session_id`: Index for session's registrations
- `registrations.user_id_session_id`: UNIQUE composite index to prevent duplicate registrations
- `gallery_items.category`: Index for filtering by category
- `gallery_items.created_at`: Index for sorting by creation date

## Constraints

### Unique Constraints

- `users.email`: One email per user
- `courses.slug`: One slug per course
- `registrations.user_id + session_id`: One registration per user per session

### Foreign Key Constraints

- `course_sessions.course_id` → `courses.id` (CASCADE on delete)
- `registrations.user_id` → `users.id` (CASCADE on delete)
- `registrations.session_id` → `course_sessions.id` (CASCADE on delete)

### Check Constraints

- `course_sessions.start_at < end_at`: Session must end after it starts
- `course_sessions.seats >= 0`: Seats cannot be negative
- `users.role IN ('user', 'admin')`: Role must be valid
- `gallery_items.price >= 0`: Price cannot be negative (if provided)

## Query Patterns

### Common Queries

1. **List upcoming course sessions**:
   - Filter: `start_at > NOW()`
   - Sort: `start_at ASC`
   - Join: `courses` for course details

2. **List user's registrations**:
   - Filter: `user_id = ?`
   - Join: `course_sessions` and `courses` for session and course details

3. **List gallery items**:
   - Filter: Optional category filter
   - Sort: `created_at DESC` (newest first)

4. **Check session capacity**:
   - Count: `registrations` for `session_id`
   - Compare: Count < `seats`

5. **List all registrations (admin)**:
   - Join: `users`, `course_sessions`, `courses`
   - Sort: `created_at DESC`

## Migration Strategy

### Initial Migration

1. Create `users` table
2. Create `courses` table
3. Create `course_sessions` table
4. Create `registrations` table
5. Create `gallery_items` table
6. Create indexes
7. Create foreign key constraints
8. Create check constraints

### Future Migrations

- Add new fields to existing tables
- Add new indexes for performance
- Modify constraints as needed
- All migrations via drizzle-kit

## Data Validation

### Application-Level Validation

- Email format validation
- URL format validation for image_url
- JSON structure validation for localized content
- Session capacity validation (registrations < seats)
- Date validation (start_at < end_at, future dates)

### Database-Level Validation

- NOT NULL constraints
- UNIQUE constraints
- FOREIGN KEY constraints
- CHECK constraints
- Data type constraints

## Security Considerations

### Data Access

- Users can only view their own registrations
- Admins can view all registrations
- Public can view courses, sessions, and gallery items
- Only admins can create/update/delete courses, sessions, and gallery items

### Data Integrity

- Foreign key constraints ensure referential integrity
- UNIQUE constraints prevent duplicate data
- CHECK constraints ensure data validity
- Cascading deletes maintain data consistency

