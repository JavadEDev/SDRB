# API Contract: Registrations

**Endpoint**: `/api/registrations`  
**Methods**: GET

**Endpoint**: `/api/registrations/[id]`  
**Methods**: DELETE

## GET /api/registrations

List all registrations (admin only).

### Request

**Headers**:
- `Accept: application/json`
- `Cookie: next-auth.session-token=<token>` (required)

**Query Parameters**:
- `session_id` (optional, string): Filter by session ID
- `user_id` (optional, string): Filter by user ID
- `limit` (optional, number): Limit number of results (default: 100)
- `offset` (optional, number): Offset for pagination (default: 0)

### Response

**Status**: 200 OK

**Body**:
```json
{
  "registrations": [
    {
      "id": "string",
      "user_id": "string",
      "session_id": "string",
      "created_at": "ISO 8601 datetime",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      },
      "session": {
        "id": "string",
        "course_id": "string",
        "start_at": "ISO 8601 datetime",
        "end_at": "ISO 8601 datetime",
        "seats": "number",
        "available_seats": "number",
        "course": {
          "id": "string",
          "title": {
            "no": "string",
            "en": "string"
          },
          "slug": "string"
        }
      }
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
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

- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

## DELETE /api/registrations/[id]

Delete a registration (owner or admin).

### Request

**Headers**:
- `Cookie: next-auth.session-token=<token>` (required)

**Path Parameters**:
- `id` (string, required): Registration ID

### Response

**Status**: 200 OK

**Body**:
```json
{
  "message": "Registration deleted successfully"
}
```

### Error Responses

- **401 Unauthorized**: Not authenticated
  ```json
  {
    "error": "Unauthorized"
  }
  ```

- **403 Forbidden**: Not owner or admin
  ```json
  {
    "error": "Forbidden: You can only delete your own registrations"
  }
  ```

- **404 Not Found**: Registration not found
  ```json
  {
    "error": "Registration not found"
  }
  ```

- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

### Business Rules

- Users can delete their own registrations
- Admins can delete any registration
- Deleting a registration frees up a seat in the session
- Deletion is permanent (hard delete)

