# MathMate API Documentation

> **Base URL (Node.js Backend):** `http://localhost:5000/api`  
> **AI Service (FastAPI):** `http://localhost:8000` *(called internally by Node.js — not directly from frontend)*

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are automatically attached by the Axios interceptor in [`axios.js`](Frontend/src/api/axios.js).

---

## Authentication

> **Prefix:** `/api/auth`  
> **File:** `Frontend/src/api/authApi.js`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register` | ❌ | — | Register a new user |
| POST | `/auth/login` | ❌ | — | Login and receive JWT token |
| POST | `/auth/logout` | ✅ | Any | Logout (invalidates session) |
| GET | `/auth/me` | ✅ | Any | Get currently logged-in user |
| POST | `/auth/forgot-password` | ❌ | — | Send password reset email |
| POST | `/auth/reset-password/:token` | ❌ | — | Reset password with token |
| POST | `/auth/verify-email` | ❌ | — | Verify email with OTP code |
| POST | `/auth/resend-verification` | ❌ | — | Resend email verification code |

### Register
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "John Doe", "role": "student" }
}
```

### Forgot Password
```
POST /api/auth/forgot-password
```
**Body:**
```json
{ "email": "john@example.com" }
```

### Reset Password
```
POST /api/auth/reset-password/:token
```
**Body:**
```json
{ "password": "newpassword" }
```

### Verify Email
```
POST /api/auth/verify-email
```
**Body:**
```json
{ "email": "john@example.com", "code": "123456" }
```

---

## Users

> **Prefix:** `/api/users`  
> **File:** `Frontend/src/api/userApi.js`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users/me` | ✅ | Any | Get own profile |
| PUT | `/users/me` | ✅ | Any | Update own profile |
| PUT | `/users/me/password` | ✅ | Any | Change own password |
| PUT | `/users/me/avatar` | ✅ | Any | Upload profile avatar (multipart) |
| DELETE | `/users/me` | ✅ | Any | Delete own account |
| GET | `/users` | ✅ | Admin | Get all users |
| GET | `/users/:id` | ✅ | Admin | Get user by ID |
| PUT | `/users/:id` | ✅ | Admin | Update user by admin |
| DELETE | `/users/:id` | ✅ | Admin | Delete user by admin |

### Update Profile
```
PUT /api/users/me
```
**Body:**
```json
{
  "name": "New Name",
  "email": "new@example.com"
}
```

### Change Password
```
PUT /api/users/me/password
```
**Body:**
```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass"
}
```

### Upload Avatar
```
PUT /api/users/me/avatar
Content-Type: multipart/form-data
```
**Body:** `FormData` with field `avatar`

### Delete Account
```
DELETE /api/users/me
```
**Body:**
```json
{ "password": "yourpassword" }
```

---

## Courses

> **Prefix:** `/api/courses`  
> **File:** `Frontend/src/api/courseApi.js`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/courses` | ✅ | Any | Get all courses |
| GET | `/courses/:courseId` | ✅ | Any | Get course by ID |
| GET | `/courses/slug/:slug` | ✅ | Any | Get course by slug |
| GET | `/courses/my-courses` | ✅ | Student | Get enrolled courses |
| GET | `/courses/progress/me` | ✅ | Student | Get all course progress |
| GET | `/courses/:courseId/progress` | ✅ | Student | Get progress for one course |
| POST | `/courses/:courseId/enroll` | ✅ | Student | Enroll in a course |
| POST | `/courses` | ✅ | Admin | Create a new course |
| PUT | `/courses/:courseId` | ✅ | Admin | Update a course |
| DELETE | `/courses/:courseId` | ✅ | Admin | Delete a course |

### Lessons

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/courses/:courseId/lessons` | ✅ | Any | Get lessons for a course |
| GET | `/courses/lessons/:lessonId` | ✅ | Any | Get lesson by ID |
| GET | `/courses/:courseId/lessons/:lessonId/status` | ✅ | Student | Get lesson completion status |
| POST | `/courses/lessons/:lessonId/complete` | ✅ | Student | Mark lesson as complete |
| POST | `/courses/:courseId/lessons` | ✅ | Admin | Create a lesson |
| PUT | `/courses/lessons/:lessonId` | ✅ | Admin | Update a lesson |
| DELETE | `/courses/lessons/:lessonId` | ✅ | Admin | Delete a lesson |

### Create Course (Admin)
```
POST /api/courses
```
**Body:**
```json
{
  "title": "Calculus I",
  "slug": "calculus-1",
  "description": "Introduction to differential calculus",
  "thumbnail": "https://..."
}
```

---

## Quizzes

> **Prefix:** `/api/quizzes`  
> **File:** `Frontend/src/api/quizApi.js`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/quizzes` | ✅ | Any | Get all quizzes |
| GET | `/quizzes/:id` | ✅ | Any | Get quiz by ID |
| GET | `/quizzes/history/me` | ✅ | Student | Get own quiz submission history |
| GET | `/quizzes/:id/submissions/me` | ✅ | Student | Get own submission for a quiz |
| POST | `/quizzes/:id/submit` | ✅ | Student | Submit quiz answers |
| POST | `/quizzes/:id/retake` | ✅ | Student | Retake a quiz |
| GET | `/quizzes/history` | ✅ | Admin | Get all quiz history |
| GET | `/quizzes/history/:studentId` | ✅ | Admin | Get quiz history for a student |
| GET | `/quizzes/:id/submissions` | ✅ | Admin | Get all submissions for a quiz |
| POST | `/quizzes` | ✅ | Admin | Create a quiz |
| PUT | `/quizzes/:id` | ✅ | Admin | Update a quiz |
| DELETE | `/quizzes/:id` | ✅ | Admin | Delete a quiz |

### Submit Quiz
```
POST /api/quizzes/:id/submit
```
**Body:**
```json
{
  "answers": [
    { "questionId": "abc123", "selectedOption": "B" }
  ]
}
```
**Response:**
```json
{
  "score": 85,
  "passed": true,
  "totalQuestions": 10,
  "correctAnswers": 8
}
```

### Create Quiz (Admin)
```
POST /api/quizzes
```
**Body:**
```json
{
  "title": "Limits Quiz",
  "courseId": "...",
  "questions": [
    {
      "text": "What is the limit of 1/x as x → ∞?",
      "options": ["0", "1", "∞", "undefined"],
      "correctAnswer": "0"
    }
  ]
}
```

---

## Dashboard

> **Prefix:** `/api/dashboard`  
> **File:** `Frontend/src/api/dashboardApi.js`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/dashboard/student` | ✅ | Student | Student dashboard stats |
| GET | `/dashboard/admin` | ✅ | Admin | Admin dashboard stats |

### Student Dashboard Response
```json
{
  "enrolledCourses": 3,
  "completedLessons": 12,
  "quizzesTaken": 5,
  "averageScore": 78
}
```

### Admin Dashboard Response
```json
{
  "totalUsers": 120,
  "totalCourses": 8,
  "totalQuizzes": 24,
  "recentSubmissions": [...]
}
```

---

## AI Chat (Chatbot)

> **Prefix:** `/api/chat`  
> **File:** `Frontend/src/api/chatbotApi.js`  
> **Flow:** `Frontend → Node.js /api/chat → FastAPI /chat → Claude AI`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/chat` | ✅ | Any | Send a question to the AI tutor |

### Send Message
```
POST /api/chat
```
**Body:**
```json
{
  "message": "What is the derivative of sin(x)?",
  "topic": "1"
}
```

**Topic values:**

| Value | Subject |
|-------|---------|
| `"1"` | Calculus 1 |
| `"2"` | Statistics |
| `"3"` | Algebra |
| `"4"` | Calculus 2 |

**Response:**
```json
{
  "answer": "The derivative of sin(x) is cos(x)...",
  "subject": "Calculus 1",
  "num_chunks": 4
}
```

> **Note:** The Node.js backend maps `{ message, topic }` → `{ question, subject_choice }` before forwarding to FastAPI.

---

## File Uploads

> **Prefix:** `/api/uploads`  
> **File:** `Frontend/src/api/courseApi.js` (`uploadImage`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/uploads/image` | ✅ | Admin | Upload an image file |

### Upload Image
```
POST /api/uploads/image
Content-Type: multipart/form-data
```
**Body:** `FormData` with field `image`  
**Response:**
```json
{
  "data": { "url": "http://localhost:5000/uploads/filename.jpg" }
}
```

---

## Import (Admin)

> **Prefix:** `/api/import`  
> **File:** `Frontend/src/api/courseApi.js` (`importFromOpenstax`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/import/openstax` | ✅ | Admin | Import course content from OpenStax URL |

### Import from OpenStax
```
POST /api/import/openstax
```
**Body:**
```json
{ "url": "https://openstax.org/books/calculus-volume-1/pages/..." }
```

---

## Error Response Format

All error responses follow this structure:

```json
{
  "message": "Unauthorized",
  "status": 401
}
```

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/expired token) |
| 403 | Forbidden (wrong role) |
| 404 | Not Found |
| 500 | Internal Server Error |

> **Auto-redirect:** When the API returns `401`, the Axios interceptor in `axios.js` automatically removes the token from `localStorage` and redirects to `/login`.

---

## Architecture Overview

```
Frontend (React + Vite)
  :5173
     │
     │  HTTP via Axios
     ▼
Node.js + Express Backend
  :5000/api
     │
     ├── /auth       → authController.js
     ├── /users      → userController.js
     ├── /courses    → courseController.js
     ├── /quizzes    → quizController.js
     ├── /dashboard  → dashboardController.js
     ├── /uploads    → uploadController.js
     ├── /import     → importController.js
     └── /chat       → chatbotController.js
                           │
                           │  HTTP relay (axios)
                           ▼
                    FastAPI (Python)
                      :8000
                         │
                    POST /chat
                         │
                    ┌────┴──────────┐
                    │               │
               FAISS search   Anthropic Claude
               (retreival.py)  (query.py)
```
