# API Contract: Course Registration

**Endpoint**: `/api/courses/[id]/register`  
**Methods**: POST

## POST /api/courses/[id]/register

Register for a course session (authenticated users only).

### Request

**Headers**:
- `Content-Type: application/json`
- `Cookie: next-auth.session-token=<token>` (required)

**Path Parameters**:
- `id` (string, required): Course session ID

**Body**:
```json
{
  "session_id": "string"
}
```

### Response

**Status**: 201 Created

**Body**:
```json
{
  "id": "string",
  "user_id": "string",
  "session_id": "string",
  "created_at": "ISO 8601 datetime",
  "session": {
    "id": "string",
    "course_id": "string",
    "start_at": "ISO 8601 datetime",
    "end_at": "ISO 8601 datetime",
    "seats": "number",
    "available_seats": "number"
  }
}
```

### Error Responses

- **401 Unauthorized**: Not authenticated
  ```json
  {
    "error": "Unauthorized"
  }
  ```

- **404 Not Found**: Session not found
  ```json
  {
    "error": "Session not found"
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

- **409 Conflict**: Already registered or session full
  ```json
  {
    "error": "Already registered for this session"
  }
  ```
  or
  ```json
  {
    "error": "Session is full"
  }
  ```

- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

### Validation Rules

- User must be authenticated
- Session must exist
- Session must have available seats
- User must not already be registered for this session
- Session must not be in the past

### Business Rules

- Registration creates a new registration record
- Available seats are decremented
- Concurrent registrations are handled with database constraints
- User receives confirmation of registration

