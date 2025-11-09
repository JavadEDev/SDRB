# API Contract: Course Sessions

**Endpoint**: `/api/courses/[id]/sessions`  
**Methods**: POST

## POST /api/courses/[id]/sessions

Create a new course session (admin only).

### Request

**Headers**:
- `Content-Type: application/json`
- `Cookie: next-auth.session-token=<token>` (required)

**Path Parameters**:
- `id` (string, required): Course ID

**Body**:
```json
{
  "start_at": "ISO 8601 datetime",
  "end_at": "ISO 8601 datetime",
  "seats": "number"
}
```

### Response

**Status**: 201 Created

**Body**:
```json
{
  "id": "string",
  "course_id": "string",
  "start_at": "ISO 8601 datetime",
  "end_at": "ISO 8601 datetime",
  "seats": "number",
  "available_seats": "number",
  "registrations_count": "number"
}
```

### Error Responses

- **401 Unauthorized**: Not authenticated
  ```json
  {
    "error": "Unauthorized"
  }
  ```

- **403 Forbidden**: Not admin
  ```json
  {
    "error": "Forbidden: Admin access required"
  }
  ```

- **404 Not Found**: Course not found
  ```json
  {
    "error": "Course not found"
  }
  ```

- **400 Bad Request**: Validation error
  ```json
  {
    "error": "Validation error",
    "details": {
      "field": "error message"
    }
  }
  ```

- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

### Validation Rules

- `start_at` must be before `end_at`
- `seats` must be a positive integer
- `start_at` and `end_at` must be valid ISO 8601 datetime strings
- Course must exist

