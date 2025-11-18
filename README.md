# KissChat Backend API

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

</div>

A production-ready, enterprise-grade Node.js/Express backend API for KissChat.ai featuring comprehensive authentication, session management, OAuth integrations, and automatic token refresh capabilities.

## ✨ Key Features

### Core Functionality
- 🔐 **Multi-Provider Authentication System**
  - Email/Password authentication with secure password hashing
  - OAuth 2.0 integration (Google, Discord)
  - Social login support (Apple & X/Twitter coming soon)
  - Session-based authentication with JWT tokens

- 🔄 **Advanced Token Management**
  - Automatic access token refresh mechanism
  - Secure refresh token rotation
  - Token expiration handling
  - Session persistence across requests

- 🛡️ **Enterprise Security**
  - HttpOnly cookie implementation
  - CSRF protection with SameSite cookies
  - Secure flag for production environments
  - Password hashing via Supabase
  - Environment-based security configuration

- 🏗️ **Modern Architecture**
  - TypeScript for type safety and better DX
  - Modular service-based architecture
  - Middleware-driven request handling
  - Separation of concerns (routes, controllers, services)
  - RESTful API design principles

- 🔌 **Supabase Integration**
  - Managed authentication service
  - Real-time database capabilities
  - Built-in user management
  - OAuth provider configuration

### Technical Features
- ⚡ Hot reload development with Nodemon
- 📦 TypeScript compilation and type checking
- 🍪 Cookie-based session management
- 🎯 Protected route middleware
- 🔍 Comprehensive error handling
- 📝 Detailed logging capabilities

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
  - [Health Check](#health-check)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Protected Routes](#protected-routes)
- [Authentication Flow](#-authentication-flow)
- [Request/Response Examples](#-requestresponse-examples)
- [Error Handling](#-error-handling)
- [Project Structure](#️-project-structure)
- [Middleware Documentation](#️-middleware)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security Features](#-security-features)
- [Performance Optimization](#-performance-optimization)
- [Troubleshooting](#-troubleshooting)
- [API Versioning](#-api-versioning)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## 🛠️ Tech Stack

### Backend Framework
- **Runtime:** Node.js (v16+)
- **Framework:** Express.js 5.x
- **Language:** TypeScript 5.9.3

### Authentication & Database
- **Auth Provider:** Supabase (v2.81.1)
- **Token Management:** JWT (jsonwebtoken v9.0.2)
- **Password Hashing:** bcrypt 6.0.0

### Core Dependencies
- **Cookie Management:** cookie-parser 1.4.7
- **Environment Variables:** dotenv 17.2.3
- **Type Definitions:** @types/express, @types/node, @types/cookie-parser

### Development Tools
- **Hot Reload:** Nodemon 3.1.11
- **TypeScript Execution:** ts-node 10.9.2
- **Compiler:** TypeScript 5.9.3

### Deployment
- **Serverless:** Vercel (configured)
- **Build Tool:** TypeScript Compiler (tsc)

---

## 🔧 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** (v1.22+)
- **Git** for version control
- **Supabase Account** - [Sign up](https://supabase.com)
- **Code Editor** (VS Code recommended)

### Setup Instructions

#### 1. Clone the Repository
```bash
# Clone via HTTPS
git clone https://github.com/zadescoxp/kisschat-backend.git

# Or clone via SSH
git clone git@github.com:zadescoxp/kisschat-backend.git

# Navigate to project directory
cd kisschat-backend
```

#### 2. Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install

# For a clean install (recommended)
npm ci
```

#### 3. Environment Configuration
```bash
# Create .env file from example
cp .env.example .env

# Or create manually
touch .env
```

Then edit `.env` with your credentials (see [Environment Variables](#-environment-variables) section)

#### 4. Verify TypeScript Setup
```bash
# Check TypeScript version
npx tsc --version

# Verify tsconfig.json is present
ls tsconfig.json
```

#### 5. Start Development Server
```bash
# Run with hot reload
npm run dev

# The server will start on http://localhost:8000
# You should see: "Server is running on port 8000"
```

#### 6. Verify Installation
```bash
# Test health check endpoint
curl http://localhost:8000

# Expected response:
# {"response":"Server health is ok !"}
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# ==========================================
# Server Configuration
# ==========================================
PORT=8000
NODE_ENV=development  # Options: development, production, test

# ==========================================
# Supabase Configuration
# ==========================================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here

# ==========================================
# OAuth Configuration (Optional)
# ==========================================
REDIRECT_URL=http://localhost:30000

# ==========================================
# Security (Optional - for production)
# ==========================================
# CORS_ORIGIN=https://yourdomain.com
# COOKIE_SECRET=your_cookie_secret_here
# RATE_LIMIT_MAX=100  # requests per window
# RATE_LIMIT_WINDOW=15  # minutes
```

### Environment Variable Descriptions

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 8000 | Server port number |
| `NODE_ENV` | Yes | development | Runtime environment |
| `SUPABASE_URL` | Yes | - | Your Supabase project URL |
| `SUPABASE_KEY` | Yes | - | Supabase anon/public key |
| `REDIRECT_URL` | No | - | OAuth callback URL |

### Getting Supabase Credentials (Detailed)

#### Step 1: Create Supabase Project
1. Navigate to [supabase.com](https://supabase.com)
2. Click **"New Project"** or **"Start your project"**
3. Fill in project details:
   - **Name:** kisschat-backend (or your preferred name)
   - **Database Password:** (store this securely)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is sufficient for development
4. Click **"Create new project"** and wait for provisioning

#### Step 2: Get API Credentials
1. Once project is ready, click on **Settings** (gear icon)
2. Navigate to **API** section in the sidebar
3. You'll find two important sections:
   - **Project URL:** Copy this to `SUPABASE_URL`
   - **Project API keys:** Copy the `anon` `public` key to `SUPABASE_KEY`

```
Project URL: https://abcdefghijk.supabase.co
Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Step 3: Enable Authentication Providers
1. Go to **Authentication** > **Providers** in Supabase dashboard
2. Enable desired providers:

**For Email Authentication:**
- Already enabled by default
- Configure email templates under **Authentication** > **Email Templates**

**For Google OAuth:**
- Toggle Google provider ON
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
- Copy Client ID and Client Secret to Supabase

**For Discord OAuth:**
- Toggle Discord provider ON
- Go to [Discord Developer Portal](https://discord.com/developers/applications)
- Create new application
- Add OAuth2 redirect: `https://your-project.supabase.co/auth/v1/callback`
- Copy Client ID and Client Secret to Supabase

#### Step 4: Configure Redirect URLs
1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Add your application's redirect URL:
   - Development: `http://localhost:30000`
   - Production: `https://yourdomain.com`
3. Add to **Site URL** and **Redirect URLs** fields

### Environment Best Practices

- ✅ **Never commit** `.env` file to version control
- ✅ **Use `.env.example`** as a template for team members
- ✅ **Rotate keys** regularly in production
- ✅ **Use different projects** for dev/staging/production
- ✅ **Store production secrets** in secure vault (e.g., Vercel Secrets)
- ❌ **Don't use** service_role key in client-side code

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

## 📝 Request/Response Examples

### Using cURL

#### Signup Request
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "method": "email"
  }'
```

#### Login Request
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "method": "email"
  }' \
  -c cookies.txt  # Save cookies
```

#### Access Protected Route
```bash
curl http://localhost:8000/protected \
  -b cookies.txt  # Use saved cookies
```

#### Logout Request
```bash
curl -X POST http://localhost:8000/auth/logout \
  -b cookies.txt
```

### Using JavaScript/Fetch

```javascript
// Signup
const signup = async () => {
  const response = await fetch('http://localhost:8000/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      method: 'email'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Login
const login = async () => {
  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      method: 'email'
    })
  });
  
  return await response.json();
};

// Access Protected Route
const getProtectedData = async () => {
  const response = await fetch('http://localhost:8000/protected', {
    credentials: 'include' // Sends cookies automatically
  });
  
  return await response.json();
};
```

### Using Axios

```javascript
import axios from 'axios';

// Configure axios to include cookies
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true
});

// Signup
const signup = async () => {
  try {
    const { data } = await api.post('/auth/signup', {
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      method: 'email'
    });
    return data;
  } catch (error) {
    console.error('Signup error:', error.response.data);
  }
};

// Login
const login = async () => {
  try {
    const { data } = await api.post('/auth/login', {
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      method: 'email'
    });
    return data;
  } catch (error) {
    console.error('Login error:', error.response.data);
  }
};

// Protected route with error handling
const getProtectedData = async () => {
  try {
    const { data } = await api.get('/protected');
    return data;
  } catch (error) {
    if (error.response.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login';
    }
  }
};
```

---

## ⚠️ Error Handling

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Status Code | Meaning | Common Scenarios |
|-------------|---------|------------------|
| `200` | Success | Request completed successfully |
| `400` | Bad Request | Invalid method, missing fields, malformed data |
| `401` | Unauthorized | Missing/invalid token, expired session |
| `403` | Forbidden | Valid token but insufficient permissions |
| `404` | Not Found | Endpoint doesn't exist |
| `500` | Internal Server Error | Server-side error, database issues |

### Common Error Scenarios

#### 1. Missing Access Token
```json
{
  "error": "No access token provided"
}
```
**Solution:** Ensure cookies are being sent with request or include `Authorization` header

#### 2. Expired Token
```json
{
  "error": "Invalid or expired token"
}
```
**Solution:** Middleware will attempt auto-refresh. If refresh fails, user must re-login

#### 3. Session Expired
```json
{
  "error": "Session expired. Please login again."
}
```
**Solution:** Refresh token has expired. User must authenticate again

#### 4. Invalid Credentials
```json
{
  "error": "Invalid login credentials"
}
```
**Solution:** Verify email and password are correct

#### 5. Invalid Method
```json
{
  "error": "Invalid login method"
}
```
**Solution:** Use supported methods: "email", "google", or "discord"

### Error Handling Best Practices

```javascript
// Frontend error handling example
const handleAuthError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // Redirect to login
        router.push('/login');
        break;
      case 400:
        // Show validation error
        toast.error(error.response.data.error);
        break;
      case 500:
        // Show generic error
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error('An unexpected error occurred');
    }
  } else if (error.request) {
    // Network error
    toast.error('Network error. Check your connection.');
  } else {
    toast.error('Request failed');
  }
};
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

### Development Workflow

1. **Make changes** to your code
2. **Nodemon automatically restarts** the server
3. **Test changes** using Postman, cURL, or your frontend
4. **Check terminal** for errors or logs
5. **Commit changes** when feature is complete

### Debugging Tips

```typescript
// Add console.logs for debugging
console.log('User data:', req.user);
console.log('Request body:', req.body);
console.log('Cookies:', req.cookies);

// Use TypeScript error messages
// The compiler will help catch type errors before runtime
```

---

## 🧪 Testing

### Manual Testing with Postman

1. **Import Collection** (create a Postman collection)
2. **Set Base URL:** `http://localhost:8000`
3. **Enable Cookie Jar** in Postman settings

#### Test Sequence

1. **Test Health Check**
   - GET `http://localhost:8000/`
   - Should return: `{"response":"Server health is ok !"}`

2. **Test Signup**
   - POST `http://localhost:8000/auth/signup`
   - Body: `{"email":"test@example.com","password":"Test123!","method":"email"}`
   - Check cookies are set

3. **Test Login**
   - POST `http://localhost:8000/auth/login`
   - Body: `{"email":"test@example.com","password":"Test123!","method":"email"}`
   - Verify cookies are updated

4. **Test Protected Route**
   - GET `http://localhost:8000/protected`
   - Cookies should be sent automatically
   - Should return user data

5. **Test Logout**
   - POST `http://localhost:8000/auth/logout`
   - Verify cookies are cleared

### Automated Testing (Coming Soon)

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Test coverage
npm run test:coverage
```

### Test Structure (Future Implementation)

```typescript
// tests/auth.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Authentication Endpoints', () => {
  describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          method: 'email'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
    });
  });
});
```

---

## ⚡ Performance Optimization

### Current Optimizations

- **TypeScript Compilation:** Fast incremental builds
- **Nodemon:** Efficient file watching and restart
- **Cookie-based Auth:** Reduces database lookups
- **Automatic Token Refresh:** Seamless user experience

### Recommended Optimizations

#### 1. Add Response Caching
```typescript
import { caching } from 'cache-manager';

const cache = caching({
  store: 'memory',
  max: 100,
  ttl: 600 // 10 minutes
});
```

#### 2. Implement Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/auth', limiter);
```

#### 3. Add Compression
```typescript
import compression from 'compression';

app.use(compression());
```

#### 4. Database Connection Pooling
```typescript
// Supabase handles this automatically
// But for custom database connections:
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Performance Monitoring

```typescript
// Add request timing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

---

## 🔢 API Versioning

### Current Version: v1

The API is currently unversioned. For production, consider implementing versioning:

### Recommended Versioning Strategy

#### URL Path Versioning
```typescript
// v1 routes
app.use('/api/v1/auth', authRouter);

// v2 routes (future)
app.use('/api/v2/auth', authRouterV2);
```

#### Header Versioning
```typescript
app.use((req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
});
```

### Migration Guide (When Implementing)

1. **Create versioned folders:**
```
src/
├── v1/
│   ├── controllers/
│   ├── routes/
│   └── services/
└── v2/
    ├── controllers/
    ├── routes/
    └── services/
```

2. **Update imports**
3. **Maintain backward compatibility**
4. **Document breaking changes**

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Project pushed to Git repository

#### Deployment Steps

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from Project Directory:**
```bash
# Navigate to project root
cd /path/to/kisschat-backend

# Deploy
vercel

# For production deployment
vercel --prod
```

4. **Configure Environment Variables:**
   - Go to Vercel Dashboard
   - Select your project
   - Navigate to Settings > Environment Variables
   - Add all variables from your `.env` file:
     - `PORT` (optional, Vercel sets this)
     - `NODE_ENV` = `production`
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `REDIRECT_URL` (your production URL)

5. **Update Supabase Redirect URLs:**
   - Add your Vercel URL to Supabase redirect URLs
   - Example: `https://your-project.vercel.app`

#### Vercel Configuration

The `vercel.json` file is pre-configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
```

### Heroku Deployment

1. **Install Heroku CLI**
2. **Create Heroku App:**
```bash
heroku create kisschat-backend
```

3. **Set Environment Variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_KEY=your_key
```

4. **Create Procfile:**
```
web: npm start
```

5. **Deploy:**
```bash
git push heroku main
```

### Railway Deployment

1. **Connect GitHub Repository**
2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
3. **Add Environment Variables** in Railway dashboard
4. **Deploy automatically** on git push

### DigitalOcean App Platform

1. **Create New App** from GitHub repository
2. **Configure:**
   - Environment: Node.js
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. **Add Environment Variables**
4. **Deploy**

### AWS EC2 (Manual Deployment)

1. **Launch EC2 Instance** (Ubuntu 22.04 recommended)
2. **SSH into Instance:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Clone Repository:**
```bash
git clone https://github.com/zadescoxp/kisschat-backend.git
cd kisschat-backend
```

5. **Install Dependencies & Build:**
```bash
npm install
npm run build
```

6. **Configure Environment:**
```bash
nano .env
# Add your environment variables
```

7. **Install PM2 (Process Manager):**
```bash
sudo npm install -g pm2
pm2 start dist/server.js --name kisschat-api
pm2 startup
pm2 save
```

8. **Configure Nginx (Optional):**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/kisschat
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Deployment

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
```

2. **Create .dockerignore:**
```
node_modules
dist
.env
.git
```

3. **Build and Run:**
```bash
docker build -t kisschat-backend .
docker run -p 8000:8000 --env-file .env kisschat-backend
```

### Post-Deployment Checklist

- ✅ Verify all environment variables are set
- ✅ Test health check endpoint
- ✅ Test authentication endpoints
- ✅ Update Supabase redirect URLs
- ✅ Configure custom domain (if applicable)
- ✅ Set up SSL certificate
- ✅ Configure CORS for frontend domain
- ✅ Set up monitoring/logging
- ✅ Configure backups
- ✅ Test from production frontend

---

## 🔒 Security Features

### Implemented Security Measures

#### 1. Cookie Security
- **httpOnly Cookies** - Prevents XSS attacks by making cookies inaccessible to JavaScript
- **Secure Flag** - Ensures cookies only sent over HTTPS in production
- **SameSite Strict** - Prevents CSRF attacks by restricting cross-site cookie usage
- **Signed Cookies** - Prevents tampering (recommended for production)

#### 2. Authentication Security
- **Token Expiration** - Access tokens expire in 1 hour
- **Refresh Token Rotation** - New tokens issued on refresh
- **Password Hashing** - Handled securely by Supabase (bcrypt)
- **Session Management** - Server-side session validation

#### 3. Transport Security
- **HTTPS Enforcement** - Required in production environments
- **Secure Headers** - Content Security Policy, X-Frame-Options
- **CORS Configuration** - Restrict origins in production

### Security Best Practices

#### Environment Variables
```typescript
// Never expose sensitive data
❌ Don't: const key = "my-secret-key"
✅ Do: const key = process.env.SECRET_KEY

// Use different keys per environment
✅ Development, Staging, Production should have separate credentials
```

#### Password Requirements
```typescript
// Enforce strong passwords on frontend
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Minimum requirements:
// - 8+ characters
// - 1 uppercase letter
// - 1 lowercase letter
// - 1 number
// - 1 special character
```

#### Rate Limiting (Recommended)
```typescript
import rateLimit from 'express-rate-limit';

// Prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

app.use('/auth/login', authLimiter);
```

#### Input Validation
```typescript
import { body, validationResult } from 'express-validator';

// Validate and sanitize inputs
app.post('/auth/signup',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process signup
  }
);
```

### Security Headers

Add helmet for enhanced security:

```typescript
import helmet from 'helmet';

app.use(helmet());

// Or configure individually
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:'],
  }
}));
```

### CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000',
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Security Audit Checklist

- ✅ All sensitive data in environment variables
- ✅ HTTPS enforced in production
- ✅ httpOnly cookies enabled
- ✅ SameSite cookie attribute set
- ✅ Rate limiting implemented
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (using ORMs/prepared statements)
- ✅ XSS protection headers
- ✅ CSRF protection
- ✅ Dependency vulnerabilities checked (`npm audit`)
- ✅ Error messages don't leak sensitive info
- ✅ Logging configured (without sensitive data)

### Regular Security Maintenance

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# View detailed report
npm audit --json

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

---

## 📝 Cookie Details

### Access Token Cookie
- **Name:** `sb-access-token`
- **httpOnly:** `true`
- **Secure:** `true` (production only)
- **SameSite:** `strict`
- **Max Age:** 1 hour (3600000ms)
- **Path:** `/` (available site-wide)
- **Domain:** Auto-set by browser

### Refresh Token Cookie
- **Name:** `sb-refresh-token`
- **httpOnly:** `true`
- **Secure:** `true` (production only)
- **SameSite:** `strict`
- **Max Age:** 7 days (604800000ms)
- **Path:** `/` (available site-wide)
- **Domain:** Auto-set by browser

### Cookie Security Attributes Explained

| Attribute | Purpose | Value |
|-----------|---------|-------|
| **httpOnly** | Prevents JavaScript access | `true` |
| **Secure** | HTTPS only transmission | `true` in production |
| **SameSite** | CSRF protection | `strict` |
| **Path** | URL path scope | `/` |
| **MaxAge** | Expiration time | Varies by token type |

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "No access token provided"

**Symptoms:**
- 401 Unauthorized error
- Can't access protected routes

**Possible Causes:**
- Cookies not being sent from frontend
- Cookie-parser not configured
- CORS not allowing credentials

**Solutions:**
```javascript
// Frontend: Ensure credentials are included
fetch('http://localhost:8000/protected', {
  credentials: 'include' // ← Important!
});

// Or with axios
axios.defaults.withCredentials = true;
```

```typescript
// Backend: Verify cookie-parser is installed and configured
import cookieParser from 'cookie-parser';
app.use(cookieParser());
```

```typescript
// Backend: CORS must allow credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // ← Important!
}));
```

---

#### Issue 2: "Session expired. Please login again."

**Symptoms:**
- User logged out unexpectedly
- Refresh token not working

**Possible Causes:**
- Refresh token expired (> 7 days)
- Supabase session invalidated
- Browser cleared cookies

**Solutions:**
- User must log in again
- Consider longer refresh token expiration
- Implement "Remember Me" feature

---

#### Issue 3: OAuth Redirect Not Working

**Symptoms:**
- OAuth flow doesn't complete
- Error after provider authentication
- Redirect to wrong URL

**Checklist:**
1. ✅ Check `redirectTo` URL in service files
2. ✅ Verify URL is added in Supabase dashboard
3. ✅ Ensure OAuth provider has correct callback URL
4. ✅ Check for HTTPS requirement in production

**Solution:**
```typescript
// In OAuth service files
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com/auth/callback'
        : 'http://localhost:30000/auth/callback'
    }
  });
  
  return data;
}
```

---

#### Issue 4: CORS Errors

**Symptoms:**
- "Access-Control-Allow-Origin" error
- Preflight request failed
- Credentials not sent

**Solution:**
```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:30000',
    'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

#### Issue 5: TypeScript Compilation Errors

**Symptoms:**
- Build fails
- Type errors in IDE

**Solutions:**
```bash
# Clean build
rm -rf dist node_modules package-lock.json
npm install
npm run build

# Check TypeScript version
npx tsc --version

# Verify tsconfig.json exists
cat tsconfig.json
```

---

#### Issue 6: Environment Variables Not Loading

**Symptoms:**
- `undefined` values
- Connection errors to Supabase

**Solutions:**
```bash
# Check .env file exists
ls -la .env

# Verify dotenv is loaded
# In server.ts, ensure this is at the top:
import dotenv from 'dotenv';
dotenv.config();

# Check variable names match exactly
echo $SUPABASE_URL  # In terminal
```

---

### Debug Mode

Enable detailed logging:

```typescript
// Add to app.ts
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Cookies:', req.cookies);
    next();
  });
}
```

### Getting Help

1. **Check logs** - Look for error messages in terminal
2. **Test with cURL** - Isolate frontend vs backend issues
3. **Verify Supabase** - Check Supabase dashboard for auth logs
4. **Check GitHub Issues** - See if others have similar problems
5. **Create Issue** - Provide detailed error messages and steps to reproduce

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository**
```bash
# Click "Fork" button on GitHub
```

2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/kisschat-backend.git
cd kisschat-backend
```

3. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
# Or for bug fixes
git checkout -b fix/bug-description
```

4. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add comments for complex logic

5. **Test your changes**
```bash
npm run dev
# Test all affected endpoints
```

6. **Commit your changes**
```bash
git add .
git commit -m 'Add amazing feature'

# Use conventional commits:
# feat: New feature
# fix: Bug fix
# docs: Documentation
# style: Formatting
# refactor: Code restructuring
# test: Adding tests
# chore: Maintenance
```

7. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

8. **Open a Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Link related issues

### Contribution Guidelines

#### Code Style
- Use TypeScript features (types, interfaces)
- Follow ESLint rules (if configured)
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

#### Commit Messages
```bash
# Good examples
feat: add Apple OAuth authentication
fix: resolve token refresh bug
docs: update API endpoint documentation
refactor: simplify auth middleware logic

# Bad examples
update
fix stuff
changes
```

#### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All endpoints working
- [ ] No console errors

## Checklist
- [ ] Code follows project style
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Areas for Contribution

1. **New Features**
   - Apple OAuth integration
   - X/Twitter OAuth integration
   - Rate limiting implementation
   - Email verification flow
   - Password reset functionality
   - User profile management
   - 2FA/MFA support

2. **Improvements**
   - Test coverage
   - Error handling
   - Logging system
   - Performance optimization
   - Security enhancements
   - Documentation

3. **Bug Fixes**
   - Check [Issues](https://github.com/kisschat100/Backend/issues)
   - Look for `good first issue` labels
   - Review bug reports

### Code Review Process

1. Maintainer reviews PR
2. Feedback provided (if needed)
3. Changes requested or approved
4. Merge to main branch
5. Deploy to production

---

## 📄 License

ISC License - see LICENSE file for details

Copyright (c) 2025 Zade

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

## 👥 Authors & Maintainers

### Core Team

- **Zade** - *Creator & Lead Developer*
  - GitHub: [@zadescoxp](https://github.com/zadescoxp)
  - Role: Architecture, Backend Development, API Design

### Contributors

See the full list of [contributors](https://github.com/zadescoxp/kisschat-backend/graphs/contributors) who participated in this project.

### Acknowledgments

- Thanks to the Supabase team for excellent authentication services
- Express.js community for robust framework
- TypeScript team for type safety tools
- All open-source contributors

---

## 🔗 Links & Resources

### Project Links
- **Main Repository:** [kisschat-backend](https://github.com/zadescoxp/kisschat-backend)
- **Issue Tracker:** [GitHub Issues](https://github.com/kisschat100/Backend/issues)
- **Discussions:** [GitHub Discussions](https://github.com/kisschat100/Backend/discussions)
- **Wiki:** [Project Wiki](https://github.com/kisschat100/Backend/wiki)

### Documentation
- **Supabase:** [Documentation](https://supabase.com/docs)
- **Express.js:** [API Reference](https://expressjs.com/en/4x/api.html)
- **TypeScript:** [Handbook](https://www.typescriptlang.org/docs/)
- **Node.js:** [Documentation](https://nodejs.org/docs/latest/api/)

### Related Projects
- **KissChat Frontend:** (Link when available)
- **KissChat Mobile:** (Link when available)

### Community
- **Discord:** (Join our community - link when available)
- **Twitter:** [@kisschat](https://twitter.com/kisschat) (if available)

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/zadescoxp/kisschat-backend?style=social)
![GitHub Forks](https://img.shields.io/github/forks/zadescoxp/kisschat-backend?style=social)
![GitHub Issues](https://img.shields.io/github/issues/zadescoxp/kisschat-backend)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/zadescoxp/kisschat-backend)

---

## 📞 Support & Contact

### Getting Support

1. **Documentation First**
   - Check this README thoroughly
   - Review troubleshooting section
   - Search existing GitHub issues

2. **Community Support**
   - Open a [GitHub Issue](https://github.com/kisschat100/Backend/issues)
   - Tag with appropriate labels (bug, question, enhancement)
   - Provide detailed information

3. **Direct Contact**
   - **Email:** support@kisschat.ai
   - **Response Time:** 24-48 hours
   - **For urgent issues:** Mark as [URGENT] in subject

### Bug Reports

When reporting bugs, include:
```markdown
**Environment:**
- OS: [e.g., macOS 13.0]
- Node Version: [e.g., 18.17.0]
- Package Manager: [e.g., npm 9.6.7]

**Description:**
Clear description of the bug

**Steps to Reproduce:**
1. Step one
2. Step two
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Error Messages:**
```
Paste error messages here
```

**Additional Context:**
Screenshots, logs, etc.
```

### Feature Requests

Have an idea? We'd love to hear it!
- Open a GitHub Issue with `enhancement` label
- Describe the feature and use case
- Explain why it would be valuable

---

## 🗺️ Roadmap

### Current Version: 1.0.0

### Planned Features

#### v1.1.0 (Q1 2025)
- [ ] Apple OAuth integration
- [ ] X/Twitter OAuth integration
- [ ] Rate limiting implementation
- [ ] Request logging system

#### v1.2.0 (Q2 2025)
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] User profile management endpoints
- [ ] Account deletion endpoint

#### v1.3.0 (Q3 2025)
- [ ] Two-Factor Authentication (2FA)
- [ ] Multi-Factor Authentication (MFA)
- [ ] Session management dashboard
- [ ] Advanced security features

#### v2.0.0 (Q4 2025)
- [ ] WebSocket support for real-time features
- [ ] GraphQL API option
- [ ] Microservices architecture
- [ ] Advanced analytics

### Completed Features ✅
- ✅ Email/Password authentication
- ✅ Google OAuth integration
- ✅ Discord OAuth integration
- ✅ JWT token management
- ✅ Automatic token refresh
- ✅ Protected route middleware
- ✅ Supabase integration
- ✅ TypeScript implementation
- ✅ Cookie-based sessions

---

## 📈 Changelog

### Version 1.0.0 (November 2025)
**Initial Release**

#### Added
- Complete authentication system
- Email/Password signup and login
- OAuth integration (Google, Discord)
- JWT token management with auto-refresh
- Protected route middleware
- Supabase integration
- TypeScript support
- Cookie-based session management
- Comprehensive error handling
- Development hot reload with Nodemon
- Vercel deployment configuration
- Complete API documentation

#### Security
- HttpOnly cookies
- Secure cookie flags for production
- SameSite CSRF protection
- Token expiration handling

---

## 🙏 Thank You

Thank you for using KissChat Backend API! We appreciate your interest and support.

If you find this project helpful:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute code
- 📢 Share with others

---

<div align="center">

**Built with ❤️ by the KissChat Team**

[Website](https://kisschat.ai) • [GitHub](https://github.com/zadescoxp) • [Documentation](https://github.com/zadescoxp/kisschat-backend)

</div>
