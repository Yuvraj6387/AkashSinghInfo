# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## Authentication
- Admin routes require JWT token in header
- Format: `Authorization: Bearer <token>`
- Token expires in 24 hours

---

## Public Endpoints (No Authentication Required)

### 1. Get All Jobs
**Endpoint:** `GET /jobs`

**Description:** Retrieve all job notifications (sorted by latest first)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Software Engineer",
      "department": "IT",
      "description": "Seeking experienced software engineers...",
      "lastDateToApply": "2024-02-28T00:00:00.000Z",
      "uploadDate": "2024-01-15T10:30:00.000Z",
      "numberOfPositions": 10,
      "salary": "50000-70000",
      "eligibility": "Bachelor's in CS",
      "pdfFileName": "job-123456.pdf",
      "status": "Active"
    }
  ]
}
```

---

### 2. Get Single Job
**Endpoint:** `GET /jobs/:id`

**Parameters:**
- `id` (string, required) - Job ID

**Example:** `GET /jobs/507f1f77bcf86cd799439011`

**Response:**
```json
{
  "success": true,
  "data": { /* job object */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### 3. Search Jobs
**Endpoint:** `GET /jobs/search`

**Query Parameters:**
- `query` (string, optional) - Search term (searches title, description, department)
- `department` (string, optional) - Filter by department

**Examples:**
- `GET /jobs/search?query=engineer`
- `GET /jobs/search?department=IT`
- `GET /jobs/search?query=engineer&department=IT`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [ /* matching jobs */ ]
}
```

---

### 4. Download PDF
**Endpoint:** `GET /jobs/:id/download`

**Parameters:**
- `id` (string, required) - Job ID

**Example:** `GET /jobs/507f1f77bcf86cd799439011/download`

**Response:** Binary PDF file download

**Error Response:**
```json
{
  "success": false,
  "message": "File not found"
}
```

---

## Admin Endpoints (Requires Authentication)

### 1. Admin Login
**Endpoint:** `POST /admin/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "admin",
  "password": "admin@123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "username": "admin"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. Verify Token
**Endpoint:** `GET /admin/verify`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "success": true,
  "admin": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Token is not valid"
}
```

---

### 3. Admin Logout
**Endpoint:** `POST /admin/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Create Job Notification
**Endpoint:** `POST /jobs`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
- title (string, required)
- department (string, required)
- description (string, required)
- lastDateToApply (date, required) - format: YYYY-MM-DD
- numberOfPositions (number, optional)
- eligibility (string, optional)
- salary (string, optional)
- applicationLink (string, optional)
- status (string, optional) - values: "Active", "Closed", "Expired"
- pdf (file, required) - PDF file only, max 10MB
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Job notification created successfully",
  "data": { /* created job object */ }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "All required fields must be filled"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer <token>" \
  -F "title=Software Engineer" \
  -F "department=IT" \
  -F "description=Job description" \
  -F "lastDateToApply=2024-02-28" \
  -F "pdf=@path/to/file.pdf"
```

---

### 5. Update Job Notification
**Endpoint:** `PUT /jobs/:id`

**Parameters:**
- `id` (string, required) - Job ID

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
Same as Create Job (all fields optional except at least one field must be updated)

**Example:** `PUT /jobs/507f1f77bcf86cd799439011`

**Response (Success):**
```json
{
  "success": true,
  "message": "Job notification updated successfully",
  "data": { /* updated job object */ }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### 6. Delete Job Notification
**Endpoint:** `DELETE /jobs/:id`

**Parameters:**
- `id` (string, required) - Job ID

**Headers:**
```
Authorization: Bearer <token>
```

**Example:** `DELETE /jobs/507f1f77bcf86cd799439011`

**Response (Success):**
```json
{
  "success": true,
  "message": "Job notification deleted successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

## Error Responses

### 401 Unauthorized
Returned when:
- No token provided
- Invalid token
- Token expired

```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

### 400 Bad Request
Returned when:
- Required fields missing
- Invalid data format

```json
{
  "success": false,
  "message": "All required fields must be filled"
}
```

### 404 Not Found
Returned when:
- Resource not found

```json
{
  "success": false,
  "message": "Job not found"
}
```

### 500 Server Error
Returned when:
- Server error occurs

```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## Rate Limiting
Currently no rate limiting implemented. Consider adding for production.

---

## CORS Headers
Allowed Origins:
- `http://localhost:3000`
- `http://localhost:5173`

Allowed Methods: GET, POST, PUT, DELETE, OPTIONS

---

## Pagination
Not implemented. All jobs are returned. Consider adding for large datasets.

---

## Testing with Postman

### Collection Setup

1. **Create Environment Variables:**
   ```
   base_url: http://localhost:5000/api
   token: <your_jwt_token>
   job_id: <job_id_to_test>
   ```

2. **Sample Requests:**

   **Login:**
   - Method: POST
   - URL: `{{base_url}}/admin/login`
   - Body (JSON):
     ```json
     {
       "username": "admin",
       "password": "admin@123"
     }
     ```

   **Create Job:**
   - Method: POST
   - URL: `{{base_url}}/jobs`
   - Headers: `Authorization: Bearer {{token}}`
   - Body: form-data with fields

   **Get All Jobs:**
   - Method: GET
   - URL: `{{base_url}}/jobs`

---

## Notes

- All timestamps are in UTC (ISO 8601 format)
- IDs are MongoDB ObjectIds
- File size limit: 10MB for PDF uploads
- Token expires in 24 hours
- Passwords are hashed with bcryptjs

---

For more information, see README.md
