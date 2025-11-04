# API Documentation for AI Job Applier

## Base URL
All API endpoints are accessible through the API Gateway at `http://localhost:8080` in development, or your deployed domain in production.

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Common Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "error": null
}
```

When an error occurs:

```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "error": "Error code"
}
```

## Endpoints

### User Service

#### Register a new user
- **POST** `/api/users/register`
- **Description**: Creates a new user account
- **Request Body**:
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)",
  "location": "string (optional)",
  "experience": "number (optional)",
  "skills": ["string"] (optional)",
  "preferences": {
    "location": "string (optional)",
    "remote": "boolean (optional)",
    "jobTypes": ["string"] (optional)",
    "salary": "number (optional)"
  }
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "location": "string",
      "experience": "number",
      "skills": ["string"],
      "preferences": {}
    }
  },
  "message": "User created successfully"
}
```
- **Status Codes**:
  - `201`: User created successfully
  - `400`: Validation error
  - `409`: Email already exists

#### Get user by ID
- **GET** `/api/users/:id`
- **Description**: Retrieves user information by ID
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "location": "string",
    "experience": "number",
    "skills": ["string"],
    "preferences": {}
  },
  "message": "User retrieved successfully"
}
```
- **Status Codes**:
  - `200`: User found
  - `404`: User not found

#### Get user by email
- **GET** `/api/users/email/:email`
- **Description**: Retrieves user information by email
- **Response**: Same as Get user by ID
- **Status Codes**:
  - `200`: User found
  - `404`: User not found

---

### Auth Service

#### Register
- **POST** `/api/auth/register`
- **Description**: Registers a new user and returns JWT token
- **Request Body**: Same as User Service Register
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "string"
  },
  "message": "User registered successfully"
}
```
- **Status Codes**:
  - `201`: User registered successfully
  - `400`: Validation error
  - `409`: Email already exists

#### Login
- **POST** `/api/auth/login`
- **Description**: Authenticates user and returns JWT token
- **Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": { /* user object without password */ },
    "token": "string"
  },
  "message": "Login successful"
}
```
- **Status Codes**:
  - `200`: Login successful
  - `400`: Validation error
  - `401`: Invalid credentials
  - `404`: User not found

#### Verify token
- **GET** `/api/auth/verify`
- **Description**: Verifies JWT token validity
- **Authentication Required**: Bearer token
- **Response**:
```json
{
  "success": true,
  "data": {
    "valid": true
  },
  "message": "Token is valid"
}
```
- **Status Codes**:
  - `200`: Token is valid
  - `401`: Token is invalid or expired

---

### Job Discovery Service

#### Get all jobs
- **GET** `/api/jobs`
- **Description**: Retrieves all available jobs
- **Authentication Required**: Bearer token
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "company": "string",
      "location": "string",
      "postedDate": "date",
      "url": "string",
      "source": "string",
      "remote": "boolean",
      "salary": "string",
      "jobType": "string",
      "experienceLevel": "string",
      "skills": ["string"],
      "benefits": ["string"]
    }
  ],
  "message": "Jobs retrieved successfully"
}
```
- **Status Codes**:
  - `200`: Jobs retrieved successfully

#### Start job scraping
- **POST** `/api/jobs/scrape`
- **Description**: Initiates job scraping from specified source
- **Authentication Required**: Bearer token
- **Request Body**:
```json
{
  "source": "string (required, one of: linkedin, indeed, glassdoor, ziprecruiter, other)",
  "keywords": ["string"] (required, min 1)",
  "location": "string (required)",
  "maxResults": "number (optional, default 20, max 100)"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "message": "string",
    "jobCount": "number",
    "jobs": [/* array of job objects */]
  },
  "message": "Scraping started successfully"
}
```
- **Status Codes**:
  - `200`: Scraping initiated successfully
  - `400`: Validation error

#### Get user's jobs
- **GET** `/api/jobs/user`
- **Description**: Retrieves jobs filtered for the authenticated user
- **Authentication Required**: Bearer token
- **Response**: Same as Get all jobs

---

## Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Input validation failed |
| USER_NOT_FOUND | User does not exist |
| INVALID_CREDENTIALS | Email/password combination is incorrect |
| EMAIL_EXISTS | User with this email already exists |
| UNAUTHORIZED | Missing or invalid JWT token |
| INTERNAL_ERROR | Server error occurred |

## Rate Limiting

All endpoints are subject to rate limiting to prevent abuse. The limits are:
- 100 requests per minute per IP for unauthenticated endpoints
- 1000 requests per minute per user for authenticated endpoints

## CORS Policy

The API allows requests from any origin during development. In production, only specified domains will be allowed.

## Versioning

This API follows semantic versioning (v1, v2, etc.). Breaking changes will result in a major version increment. Version is not currently included in the URL but may be added in the future.

## Support

For API support or questions, please create an issue in the GitHub repository or check the documentation in the `docs/` directory.