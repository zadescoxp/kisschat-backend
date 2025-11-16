# KissChat Backend API

A robust Node.js/Express backend API for KissChat.ai with authentication, session management, and OAuth integrations.

## 🚀 Features

- **Authentication System** with Email/Password and OAuth providers
- **JWT Token Management** with automatic refresh mechanism
- **Supabase Integration** for auth and database
- **TypeScript** for type safety
- **Multiple OAuth Providers**: Google, Discord (Apple & X coming soon)
- **Secure Cookie Management** with httpOnly flags
- **Protected Routes** with middleware authentication

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)

## 🔧 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Setup

1. Clone the repository:
```bash
git clone https://github.com/zadescoxp/kisschat-backend.git
cd kisschat-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure your environment variables (see below)

5. Run the development server:
```bash
npm run dev
```

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# OAuth Redirect URLs (optional)
REDIRECT_URL=http://localhost:30000
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a project
2. Navigate to Project Settings > API
3. Copy the `Project URL` and `anon/public` key
4. Enable authentication providers in Authentication > Providers

## 📡 API Endpoints

### Base URL
```
http://localhost:8000
```

### Health Check

#### `GET /`
Check server health status.

**Response:**
```json
{
  "response": "Server health is ok !"
}
```

---

### Authentication Endpoints

All auth endpoints are prefixed with `/auth`

#### `POST /auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "method": "email"
}
```

**Response (Success - 200):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2025-11-16T..."
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_in": 3600
    }
  }
}
```

**Cookies Set:**
- `sb-access-token` (httpOnly, expires in 1 hour)
- `sb-refresh-token` (httpOnly, expires in 7 days)

**Error Response (400):**
```json
{
  "error": "Invalid signup method"
}
```

---

#### `POST /auth/login`
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "method": "email"
}
```

**Supported Methods:**
- `email` - Email/Password authentication
- `google` - Google OAuth (redirects to OAuth flow)
- `discord` - Discord OAuth (redirects to OAuth flow)

**Response (Success - 200):**
```json
{
  "emailData": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token"
    }
  }
}
```

**Cookies Set:**
- `sb-access-token` (httpOnly, expires in 1 hour)
- `sb-refresh-token` (httpOnly, expires in 7 days)

**Error Response (400):**
```json
{
  "error": "Invalid login method"
}
```

---

#### `POST /auth/logout`
Log out the current user and clear session.

**Headers:**
- `Cookie: sb-access-token=...` (required)

**Response (Success - 200):**
```json
{
  "message": "Logged out successfully"
}
```

**Cookies Cleared:**
- `sb-access-token`
- `sb-refresh-token`

---

### Protected Routes

#### `GET /protected`
Example protected route requiring authentication.

**Headers:**
- `Cookie: sb-access-token=...` (required)
- OR `Authorization: Bearer <access_token>`

**Response (Success - 200):**
```json
{
  "message": "This is a protected route",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "error": "No access token provided"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

```json
{
  "error": "Session expired. Please login again."
}
```

---

## 🔄 Authentication Flow

### Email/Password Flow

1. **Signup**
   ```
   POST /auth/signup → Creates user → Returns session + sets cookies
   ```

2. **Login**
   ```
   POST /auth/login → Validates credentials → Returns session + sets cookies
   ```

3. **Access Protected Routes**
   ```
   GET /protected → Middleware validates token → Returns user data
   ```

4. **Token Refresh (Automatic)**
   ```
   If access token expired → Middleware uses refresh token → 
   Gets new tokens → Updates cookies → Continues request
   ```

5. **Logout**
   ```
   POST /auth/logout → Invalidates session → Clears cookies
   ```

### OAuth Flow

1. **Initiate OAuth**
   ```
   POST /auth/login with method: "google" or "discord"
   ```

2. **Redirect to Provider**
   ```
   User authenticates with OAuth provider
   ```

3. **Callback**
   ```
   Provider redirects to REDIRECT_URL with tokens
   ```

4. **Session Created**
   ```
   Backend sets cookies and returns user data
   ```

---

## 🏗️ Project Structure

```
Backend/
├── api/
│   └── index.ts              # Vercel serverless entry point
├── src/
│   ├── app.ts                # Express app configuration
│   ├── server.ts             # Server initialization
│   ├── config/
│   │   └── supabase.config.ts    # Supabase client setup
│   ├── controllers/
│   │   └── auth.controllers.ts   # Auth route handlers
│   ├── middlewares/
│   │   └── verifyAuth.middlewares.ts  # JWT verification
│   ├── routes/
│   │   └── auth.routes.ts        # Auth route definitions
│   ├── services/
│   │   └── auth/
│   │       ├── email.services.ts    # Email auth logic
│   │       ├── google.services.ts   # Google OAuth
│   │       ├── discord.services.ts  # Discord OAuth
│   │       ├── apple.services.ts    # Apple OAuth (WIP)
│   │       └── x.services.ts        # X OAuth (WIP)
│   └── utils/                # Utility functions
├── .env                      # Environment variables
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── nodemon.json              # Nodemon config
└── vercel.json               # Vercel deployment config
```

---

## 🛡️ Middleware

### `verifyAuthMiddleware`

Protects routes by validating JWT tokens and automatically refreshing expired tokens.

**Features:**
- Validates access token from cookies or Authorization header
- Automatically refreshes expired tokens using refresh token
- Updates cookies with new tokens
- Attaches user object to `req.user`
- Handles all error cases with appropriate responses

**Usage:**
```typescript
import { verifyAuthMiddleware } from './middlewares/verifyAuth.middlewares';

// Protect a route
app.get('/my-route', verifyAuthMiddleware, myController);

// Access user in controller
function myController(req: Request, res: Response) {
  const userId = req.user?.id;
  const userEmail = req.user?.email;
  // Your logic here
}
```

---

## 💻 Development

### Available Scripts

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

### Adding a New Protected Route

1. Create your controller:
```typescript
// src/controllers/myController.ts
export function myController(req: Request, res: Response) {
  // req.user is available here
  res.json({ user: req.user });
}
```

2. Add the route:
```typescript
// src/server.ts
import { verifyAuthMiddleware } from './middlewares/verifyAuth.middlewares';
import { myController } from './controllers/myController';

app.get('/my-route', verifyAuthMiddleware, myController);
```

---

## 🚀 Deployment

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard

### Other Platforms

Build the project and deploy the `dist` folder:
```bash
npm run build
node dist/server.js
```

---

## 🔒 Security Features

- **httpOnly Cookies** - Prevents XSS attacks
- **Secure Cookies** - HTTPS only in production
- **SameSite Strict** - CSRF protection
- **Token Expiration** - Access tokens expire in 1 hour
- **Refresh Token Rotation** - Automatic token refresh
- **Password Hashing** - Handled by Supabase
- **Rate Limiting** - (Coming soon)

---

## 📝 Cookie Details

### Access Token Cookie
- **Name:** `sb-access-token`
- **httpOnly:** `true`
- **Secure:** `true` (production only)
- **SameSite:** `strict`
- **Max Age:** 1 hour (3600000ms)

### Refresh Token Cookie
- **Name:** `sb-refresh-token`
- **httpOnly:** `true`
- **Secure:** `true` (production only)
- **SameSite:** `strict`
- **Max Age:** 7 days (604800000ms)

---

## 🐛 Troubleshooting

### "No access token provided"
- Ensure cookies are being sent with requests
- Check that cookie-parser middleware is configured
- Verify CORS settings allow credentials

### "Session expired. Please login again."
- Refresh token has expired or is invalid
- User needs to re-authenticate

### OAuth redirect not working
- Check `redirectTo` URL in OAuth service files
- Ensure OAuth provider is configured in Supabase dashboard
- Verify callback URLs in OAuth provider settings

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

ISC License - see LICENSE file for details

---

## 👥 Authors

- **Zade** - [@zadescoxp](https://github.com/zadescoxp)

---

## 🔗 Links

- [Repository](https://github.com/zadescoxp/kisschat-backend)
- [Issues](https://github.com/kisschat100/Backend/issues)
- [Supabase Docs](https://supabase.com/docs)

---

## 📞 Support

For support, email support@kisschat.ai or open an issue on GitHub.
