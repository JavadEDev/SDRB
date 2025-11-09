# API Contract: Courses

**Endpoint**: `/api/courses`  
**Methods**: GET, POST

## GET /api/courses

List all courses with their sessions.

### Request

**Headers**:
- `Accept: application/json`
- `Cookie: next-auth.session-token=<token>` (optional, for authenticated requests)

**Query Parameters**:
- `active` (optional, boolean): Filter by active status
- `category` (optional, string): Filter by category (sewing, macramé, ceramics, bunad-shirt)

### Response

**Status**: 200 OK

**Body**:
```json
{
  "courses": [
    {
      "id": "string",
      "title": {
        "no": "string",
        "en": "string"
      },
      "slug": "string",
      "description": {
        "no": "string",
        "en": "string"
      },
      "price": "number",
      "location": "string",
      "category": "string",
      "active": "boolean",
      "sessions": [
        {
          "id": "string",
          "start_at": "ISO 8601 datetime",
          "end_at": "ISO 8601 datetime",
          "seats": "number",
          "available_seats": "number",
          "registrations_count": "number"
        }
      ]
    }
  ]
}
```

### Error Responses

- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

## POST /api/courses

Create a new course (admin only).

### Request

**Headers**:
- `Content-Type: application/json`
- `Cookie: next-auth.session-token=<token>` (required)

**Body**:
```json
{
  "title": {
    "no": "string",
    "en": "string"
  },
  "slug": "string",
  "description": {
    "no": "string",
    "en": "string"
  },
  "price": "number",
  "location": "string",
  "category": "string",
  "active": "boolean"
}
```

### Response

**Status**: 201 Created

**Body**:
```json
{
  "id": "string",
  "title": {
    "no": "string",
    "en": "string"
  },
  "slug": "string",
  "description": {
    "no": "string",
    "en": "string"
  },
  "price": "number",
  "location": "string",
  "category": "string",
  "active": "boolean",
  "created_at": "ISO 8601 datetime"
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

- **400 Bad Request**: Validation error
  ```json
  {
    "error": "Validation error",
    "details": {
      "field": "error message"
    }
  }
  ```

- **409 Conflict**: Slug already exists
  ```json
  {
    "error": "Course with this slug already exists"
  }
  ```

- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

