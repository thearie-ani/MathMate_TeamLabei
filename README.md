# MathMate - AI-Powered Math Learning Platform

A full-stack web application that combines interactive lessons, quizzes, and AI tutoring to help students master mathematics.

## 🎯 Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Interactive Lessons** - Structured math lessons with formulas and practice questions
- **Quiz System** - Assessments with progress tracking
- **AI Tutor** - Chat-based AI assistance for math problems
- **Dashboard** - Performance charts and activity tracking
- **User Profiles** - Achievement badges and XP progress
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **React Router** - Navigation
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **Nodemailer** - Email support

## 📁 Project Structure

```
SalaAI_TeamLabei/
├── Backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utilities (JWT, email, etc.)
│   ├── server.js        # Express server entry point
│   ├── package.json
│   └── .env             # Environment variables
│
└── Frontend/
    ├── src/
    │   ├── api/         # API client functions
    │   ├── components/  # React components
    │   ├── context/     # React Context (Auth)
    │   ├── features/    # Feature modules
    │   ├── hooks/       # Custom React hooks
    │   ├── pages/       # Page components
    │   ├── routes/      # Route configuration
    │   ├── utils/       # Utility functions
    │   ├── App.jsx
    │   └── main.jsx
    ├── design-refs/     # Design references
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB account (Atlas or local instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thearie-ani/MathMate_TeamLabei.git
   cd SalaAI_TeamLabei
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```

### Configuration

#### Backend (.env)
Create a `.env` file in the `Backend` folder:

```env
PORT=5000
DB_URL=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=YourApp

JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FROM=noreply@yourdomain.com
```

#### Frontend
The frontend is configured to connect to `http://localhost:5000/api` by default. Update [Frontend/src/api/axios.js](Frontend/src/api/axios.js) if using a different backend URL.

## 📦 Running the Application

### Start Backend Server
```bash
cd Backend
npm run dev
```
Server will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd Frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🔗 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Future Endpoints
- User routes - Profile management
- Lesson routes - Fetch and track lessons
- Quiz routes - Create and submit quizzes
- Tutor routes - AI chat interactions

## 🧪 Testing

### Test with Postman
1. Import the API endpoints
2. Set `Authorization: Bearer <access_token>` header for protected routes
3. Test each endpoint with sample data

### Browser DevTools
1. Open DevTools (`F12`)
2. Check **Network** tab to see API requests
3. Check **Application** tab to view stored tokens

## 🔐 Authentication Flow

1. User submits registration/login form
2. Frontend sends credentials to backend API
3. Backend validates and creates JWT tokens
4. Frontend stores access token in memory, refresh token in cookie
5. Frontend sends access token in Authorization header for protected requests
6. Backend verifies token and returns data

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

## 📝 Notes for Development

### Frontend-Backend Communication
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- CORS is enabled for localhost:5173
- Credentials (cookies) are included in requests

### Common Issues

**"Illegal arguments: undefined, number"** - Password not passed to bcrypt
- Check that registration service receives password from controller

**"JWT_REFRESH_SECRET must have a value"** - Missing environment variable
- Add JWT_REFRESH_SECRET to .env file

**CORS Error** - Frontend can't reach backend
- Verify backend is running on port 5000
- Check CORS config in server.js includes your frontend URL

## 📚 Documentation

- [MongoDB Setup Guide](https://docs.mongodb.com/manual/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## 👥 Team

- Development Team: Team Lab-ei (CADT Year 3 Term 3)

## 📄 License

This project is part of an educational program at CADT.

---

**Last Updated:** June 21, 2026
