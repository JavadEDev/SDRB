# API Contract: Gallery

**Endpoint**: `/api/gallery`  
**Methods**: GET, POST

## GET /api/gallery

List all gallery items.

### Request

**Headers**:
- `Accept: application/json`

**Query Parameters**:
- `category` (optional, string): Filter by category
- `limit` (optional, number): Limit number of results (default: 100)
- `offset` (optional, number): Offset for pagination (default: 0)

### Response

**Status**: 200 OK

**Body**:
```json
{
  "items": [
    {
      "id": "string",
      "title": {
        "no": "string",
        "en": "string"
      },
      "image_url": "string",
      "description": {
        "no": "string",
        "en": "string"
      },
      "price": "number",
      "category": "string",
      "created_at": "ISO 8601 datetime"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

### Error Responses

- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

## POST /api/gallery

Create a new gallery item (admin only).

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
  "image_url": "string",
  "description": {
    "no": "string",
    "en": "string"
  },
  "price": "number",
  "category": "string"
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
  "image_url": "string",
  "description": {
    "no": "string",
    "en": "string"
  },
  "price": "number",
  "category": "string",
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

- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Internal server error"
  }
  ```

### Validation Rules

- `title` must be a valid JSON object with `no` and `en` keys
- `image_url` must be a valid URL
- `description` must be a valid JSON object with `no` and `en` keys (if provided)
- `price` must be a positive number (if provided)
- `category` is optional

