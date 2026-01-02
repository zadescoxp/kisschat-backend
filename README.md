# KissChat Backend API - Technical Documentation

## Project Overview

KissChat Backend is a production-ready Node.js/Express API built with TypeScript that powers the KissChat.ai platform. The application provides comprehensive user authentication, character management, AI-powered chat functionality with streaming responses, and asynchronous message processing using a job queue system.

**Version:** 1.0.0  
**Author:** zade  
**Repository:** https://github.com/kisschat100/Backend  
**License:** ISC

## Architecture Overview

The backend follows a modular, service-oriented architecture with clear separation of concerns:

- **Controllers**: Handle HTTP request/response logic
- **Services**: Implement business logic and external integrations
- **Middleware**: Process requests before reaching controllers
- **Routes**: Define API endpoints and associate them with controllers
- **Workers**: Background job processors for asynchronous tasks
- **Utils**: Shared utility functions and helpers
- **Config**: Configuration files for external services

## Technology Stack

### Core Dependencies

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.9.3
- **Module System**: ES Modules (ESNext)

### Database and Authentication

- **Database**: Supabase 2.81.1 (PostgreSQL with authentication layer)
- **Password Hashing**: bcrypt 6.0.0
- **Token Management**: jsonwebtoken 9.0.2

### AI and External Services

- **AI Model Provider**: OpenRouter SDK 0.2.9
- **Custom GPU Service**: VastAI hosted model endpoints

### Queue and Cache

- **Job Queue**: BullMQ 5.66.3
- **Cache/Message Broker**: Redis (ioredis 5.8.2)

### Development Tools

- **Hot Reload**: Nodemon 3.1.11
- **TypeScript Execution**: ts-node 10.9.2
- **CORS**: cors 2.8.5
- **Cookie Management**: cookie-parser 1.4.7
- **Environment Variables**: dotenv 17.2.3

## Project Structure

```
Backend/
├── api/
│   └── index.ts                    # Vercel serverless entry point
├── src/
│   ├── app.ts                      # Express app initialization
│   ├── server.ts                   # Server configuration and routing
│   ├── config/                     # External service configurations
│   │   ├── openrouter.config.ts    # OpenRouter AI SDK setup
│   │   ├── redis.config.ts         # Redis connection configuration
│   │   └── supabase.config.ts      # Supabase client initialization
│   ├── controllers/                # Request handlers
│   │   ├── auth.controllers.ts     # Authentication endpoints
│   │   ├── character.controllers.ts # Character CRUD operations
│   │   ├── chat.controllers.ts     # Chat message handling
│   │   ├── job.controllers.ts      # Job status monitoring
│   │   └── user.controllers.ts     # User profile management
│   ├── middlewares/                # Request processing middleware
│   │   ├── verifyAuth.middlewares.ts   # JWT authentication
│   │   └── verifyOwner.middlewares.ts  # Resource ownership validation
│   ├── routes/                     # API route definitions
│   │   ├── auth.routes.ts          # Authentication routes
│   │   ├── characters.routes.ts    # Character routes
│   │   ├── chat.routes.ts          # Chat routes
│   │   ├── job.routes.ts           # Job status routes
│   │   ├── test.routes.ts          # Testing routes
│   │   └── user.routes.ts          # User routes
│   ├── services/                   # Business logic layer
│   │   ├── auth/                   # Authentication services
│   │   │   ├── apple.services.ts   # Apple OAuth (placeholder)
│   │   │   ├── discord.services.ts # Discord OAuth integration
│   │   │   ├── email.services.ts   # Email/password authentication
│   │   │   ├── google.services.ts  # Google OAuth integration
│   │   │   └── x.services.ts       # X/Twitter OAuth (placeholder)
│   │   └── chat_models/            # AI model services
│   │       ├── chat.services.ts    # Chat logic and queue management
│   │       └── gpu.services.ts     # Custom GPU model API client
│   ├── utils/                      # Utility functions
│   │   ├── check.util.ts           # User existence validation
│   │   ├── queue.util.ts           # BullMQ queue initialization
│   │   ├── sse.publisher.ts        # SSE message publishing via Redis
│   │   └── sse.util.ts             # SSE connection management
│   └── workers/                    # Background job processors
│       └── message.worker.ts       # AI message processing worker
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── nodemon.json                    # Development server configuration
└── vercel.json                     # Vercel deployment configuration
```

## Core Components

### Application Initialization

#### app.ts
Basic Express application setup with middleware:
- JSON body parsing
- Cookie parsing for authentication tokens

#### server.ts
Main server file that:
- Loads environment variables
- Configures CORS with credentials support
- Registers all API routes under `/api/v1/` prefix
- Provides health check endpoint at root `/`
- Includes protected route example at `/protected`

### Configuration Files

#### supabase.config.ts
Initializes Supabase client using environment variables:
- `SUPABASE_URL`: Project URL
- `SUPABASE_KEY`: Service role or anon key

#### redis.config.ts
Redis connection configuration with:
- Runtime evaluation of connection options
- Support for username/password authentication
- Separate client for general operations
- Connection event logging

#### openrouter.config.ts
OpenRouter SDK configuration:
- Model: `cognitivecomputations/dolphin-mistral-24b-venice-edition:free`
- Max tokens: 1024
- Temperature: 0.7
- Returns completion responses for chat messages

### Authentication System

#### Authentication Services

**email.services.ts**
Handles email/password authentication:
- `signUpWithEmail()`: Creates new user account
- `loginWithEmail()`: Authenticates user with credentials
- `logout()`: Terminates user session

**google.services.ts**
Google OAuth integration:
- Redirects to Google for authentication
- Callback URL: `http://localhost:30000`

**discord.services.ts**
Discord OAuth integration:
- Similar flow to Google OAuth
- Callback URL: `http://localhost:30000`

**apple.services.ts** and **x.services.ts**
Placeholder files for future OAuth implementations.

#### auth.controllers.ts

**loginController**
Handles multi-method authentication:
- Email/password login
- Discord OAuth
- Google OAuth
- Sets httpOnly cookies for access and refresh tokens
- Access token: 1-hour expiration
- Refresh token: 7-day expiration

**signUpController**
User registration with automatic profile creation:
- Creates user account via Supabase Auth
- Inserts profile record in `profiles` table
- Initializes premium status in `premium` table
- Default values:
  - Username: email prefix
  - Avatar: default SVG
  - Image credits: 2
  - Kiss coins: 50
  - Premium status: false

**logoutController**
Session termination:
- Calls Supabase logout
- Clears authentication cookies

#### verifyAuth.middlewares.ts

JWT authentication middleware with automatic token refresh:

1. Extracts access token from cookie or Authorization header
2. Validates token with Supabase
3. If token expired, attempts refresh using refresh token
4. Updates cookies with new tokens
5. Attaches user object to `req.user`
6. Returns 401 if authentication fails

Security features:
- HttpOnly cookies
- Secure flag in production
- SameSite strict policy
- Automatic token rotation

### Character Management

#### character.controllers.ts

**createCharacterController**
Creates AI character with extensive customization:

Physical attributes:
- Gender, heritage, age
- Skin tone, eye color, hair color, hairstyle
- Body type, breast size, butt size

Personality and behavior:
- Public description
- Tags for categorization
- Voice characteristics
- Personality traits
- Occupation and hobbies
- Scenario and greeting message
- Backstory
- System instruction for AI behavior
- AI-generated behavior toggle
- Behavior preferences

Additional fields:
- Avatar URL
- Custom physical traits
- Custom descriptions

**getCharacterByIdController**
Retrieves character by ID:
- Returns 404 if not found
- Returns character data object

#### verifyOwner.middlewares.ts

Ensures authenticated user owns the requested character:
- Fetches character from database
- Compares `character_user_id` with authenticated user ID
- Returns 403 if ownership check fails

### Chat System

The chat system implements asynchronous message processing with real-time streaming responses using Server-Sent Events (SSE).

#### chat.controllers.ts

**chatController**
Handles incoming chat messages:
- Receives chat_id and prompt
- Delegates to chat service for processing

**newChatController**
Initializes new chat session:
- Creates chat record with character context
- Returns new chat_id for subsequent messages

#### chat.services.ts

**getCharacterResponse**
Main chat processing function:

1. Fetches chat history from database
2. Appends user message to conversation
3. Creates job in message queue
4. Establishes SSE connection
5. Returns job ID for status tracking

**getNewChatID**
Creates new chat session:
- Retrieves character details
- Initializes chat with system message containing character information
- Returns chat object with chat_id

#### gpu.services.ts

Custom GPU model API client for VastAI:

Configuration:
- Model: `huihui_ai/qwen3-abliterated:8b`
- Max tokens: 1024
- Temperature: 0.7
- Non-streaming mode

Environment variables:
- `VASTAI_INSTANCE_IP`: GPU instance IP
- `VASTAI_INSTANCE_PORT`: API port
- `VASTAI_OPEN_BUTTON_TOKEN`: Authorization token

**generateResponse**
Sends message array to model endpoint and returns completion.

### Job Queue System

#### queue.util.ts

Initializes BullMQ queue:
- Queue name: `message-queue`
- Uses Redis connection for job storage

#### message.worker.ts

Background worker for AI message processing:

Process flow:
1. Receives job with messages and chat_id
2. Calls GPU service to generate AI response
3. Parses response (supports multiple formats)
4. Updates chat history in database
5. Publishes result via SSE
6. Handles errors and publishes failure status

Worker configuration:
- Concurrency: 5 jobs simultaneously
- Lock duration: 30 seconds
- Graceful shutdown on SIGINT

Response format handling:
- OpenAI-compatible: `choices[0].message.content`
- Direct message: `message.content`
- Simple content: `content`

#### job.controllers.ts

**getJobStatus**
Monitors job execution status:
- Returns job state: waiting, active, completed, failed
- Provides progress information
- Returns result when completed
- Returns error when failed

### Server-Sent Events (SSE)

Real-time communication system using Redis pub/sub pattern.

#### sse.util.ts

SSE connection management:

**addSSEConnection**
- Establishes SSE connection with proper headers
- Stores connection mapped by jobId
- Sends initial connection confirmation
- Handles client disconnection cleanup

**sendSSEMessage**
- Sends data to specific job connection
- Returns false if connection not found
- Handles write errors

**closeSSEConnection**
- Sends `[DONE]` signal
- Ends response stream
- Removes connection from map

**hasSSEConnection**
- Checks if connection exists for job

Redis subscriber:
- Listens on `sse-messages` channel
- Processes messages from workers
- Routes data to correct SSE connection

#### sse.publisher.ts

Worker-side message publishing:

**publishSSEMessage**
- Publishes data to Redis channel
- Workers use this to send updates to API server

**publishSSEClose**
- Signals connection closure
- Indicates job completion or failure

### User Management

#### user.controllers.ts

**updateUserController**
Updates user profile:
- Username
- Avatar URL
- Status
- Last login timestamp

**deleteUserController**
Permanently deletes user account:
- Removes record from users table
- Returns confirmation message

### Utility Functions

#### check.util.ts

**checkUser**
Validates user existence:
- Queries users table by email
- Returns user data if found
- Returns false if not found
- Non-throwing error handling

### Routes

All routes are prefixed with `/api/v1/`

#### auth.routes.ts
- `POST /signup` - User registration
- `POST /login` - User authentication
- `POST /logout` - Session termination

#### user.routes.ts
Protected routes requiring authentication:
- `PUT /update/:id` - Update user profile
- `DELETE /delete/:id` - Delete user account

#### characters.routes.ts
Protected character management:
- `POST /create` - Create new character
- `GET /get/:id` - Retrieve character by ID

#### chat.routes.ts
Protected chat functionality:
- `POST /response` - Send message and get AI response
- `POST /new` - Initialize new chat session

#### job.routes.ts
Protected job monitoring:
- `GET /status/:jobId` - Get job execution status

#### test.routes.ts
Testing endpoint for SSE functionality:
- `POST /echo` - Simple SSE echo test

## Database Schema

The application uses Supabase with the following key tables:

### profiles
User profile information:
- `user_id` (references auth.users)
- `email`
- `username`
- `avatar_url`
- `status`
- `is_premium`
- `created_at`
- `last_login`

### premium
User premium status and credits:
- `user_id` (references auth.users)
- `is_premium`
- `image_credits`
- `kiss_coins`

### characters
AI character definitions:
- `character_id` (primary key)
- `character_user_id` (owner)
- Physical attributes
- Personality traits
- System instructions
- Avatar and media

### chats
Conversation history:
- `chat_id` (primary key)
- `user_id`
- `character_id`
- `chats` (JSONB array of messages)

## Environment Variables

Required environment variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional_password
REDIS_USERNAME=optional_username

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key

# VastAI GPU Service
VASTAI_INSTANCE_IP=your_instance_ip
VASTAI_INSTANCE_PORT=5000
VASTAI_OPEN_BUTTON_TOKEN=your_authorization_token
```

## API Endpoints

### Health Check

**GET /**
```json
{
  "response": "Server health is ok !"
}
```

### Authentication

**POST /api/v1/auth/signup**
Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "method": "email"
}
```

Response:
```json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": { "access_token": "...", "refresh_token": "..." }
  }
}
```

**POST /api/v1/auth/login**
Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "method": "email"
}
```

Methods: `email`, `google`, `discord`

**POST /api/v1/auth/logout**
No request body required. Clears authentication cookies.

### Characters

**POST /api/v1/character/create**
Requires authentication. Creates new AI character.

Request body includes all character attributes (physical, personality, etc.)

**GET /api/v1/character/get/:id**
Requires authentication. Retrieves character by ID.

### Chat

**POST /api/v1/chat/new**
Requires authentication. Initializes new chat session.

Request:
```json
{
  "character_id": "uuid"
}
```

Response:
```json
{
  "newChatID": "uuid"
}
```

**POST /api/v1/chat/response**
Requires authentication. Sends message and receives streaming AI response.

Request:
```json
{
  "chat_id": "uuid",
  "prompt": "Hello, how are you?"
}
```

Response: Server-Sent Events stream
```
data: {"status":"connected","jobId":"1"}

data: {"status":"completed","response":"I'm doing great!","chatHistory":[...]}

data: [DONE]
```

### Jobs

**GET /api/v1/job/status/:jobId**
Requires authentication. Monitors job execution status.

Response:
```json
{
  "status": "completed",
  "result": {
    "success": true,
    "response": "AI response text",
    "chatHistory": [...]
  }
}
```

### User Management

**PUT /api/v1/user/update/:id**
Requires authentication. Updates user profile.

**DELETE /api/v1/user/delete/:id**
Requires authentication. Deletes user account.

## Security Features

### Authentication
- JWT-based session management
- Automatic token refresh
- HttpOnly cookies prevent XSS attacks
- Secure flag enabled in production
- SameSite strict policy prevents CSRF

### Authorization
- Route-level authentication middleware
- Resource ownership verification
- User-scoped data access

### CORS Configuration
- Origin whitelist
- Credentials support
- Method restrictions
- Header controls

## Development

### Prerequisites
- Node.js v16 or higher
- Redis server
- Supabase account
- OpenRouter API key (optional)
- VastAI GPU instance (optional)

### Installation

```bash
npm install
```

### Running Development Server

```bash
npm run dev
```

Uses nodemon with ts-node for hot reload.

### Running Worker

```bash
node --loader ts-node/esm ./src/workers/message.worker.ts
```

### Building for Production

```bash
npm run build
```

Compiles TypeScript to `dist/` directory.

### Starting Production Server

```bash
npm start
```

Runs compiled JavaScript from `dist/server.js`.

## Deployment

### Vercel Configuration

The application is configured for Vercel serverless deployment:

- Entry point: `dist/server.js`
- Build output: `dist/` directory
- Routes all requests to the Express app

Note: Worker processes cannot run on Vercel and require separate hosting.

### Deployment Checklist

1. Set all environment variables in deployment platform
2. Deploy worker process to separate service
3. Ensure Redis is accessible from both API and worker
4. Configure CORS with production frontend URL
5. Enable secure cookies (`NODE_ENV=production`)
6. Set up monitoring and logging

## Monitoring and Debugging

### Logging

The application includes console logging for:
- Server startup
- Redis connection status
- Worker job processing
- SSE connection lifecycle
- Error conditions

### Job Queue Monitoring

Monitor job states through BullMQ:
- Waiting
- Active
- Completed
- Failed

Access job counts and status via Redis or BullMQ UI.

### SSE Debugging

SSE connections log:
- Connection establishment
- Message transmission
- Connection closure
- Error conditions

## Error Handling

### Controller Level
Controllers catch errors from services and return appropriate HTTP status codes:
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Internal server error

### Middleware Level
Authentication middleware handles:
- Missing tokens
- Expired tokens
- Invalid tokens
- Refresh token rotation

### Worker Level
Workers catch processing errors and:
- Log error details
- Publish error status via SSE
- Mark job as failed
- Continue processing other jobs

## Performance Considerations

### Queue System
- Concurrent job processing (5 workers)
- Asynchronous message handling
- Non-blocking API responses

### Database
- Indexed queries by user_id and character_id
- JSONB storage for flexible chat history
- Efficient Supabase client usage

### Caching
- Redis for job queue and pub/sub
- Potential for response caching

### Connection Management
- Persistent Redis connections
- Connection pooling
- Graceful shutdown handling

## Change Log

### Recent Updates (Last 50 Commits)

**January 2026**
- Added general testing route for experimentation
- Implemented SSE connections for workers and API
- Integrated SSE utility functions
- Added CORS policy for testing
- Updated package dependencies

**December 2024**
- Added message worker for background processing
- Implemented message queuing utilities
- Configured GPU and model services
- Added job queuing system
- Created job routes and controllers
- Implemented Redis configuration
- Added uncensored model to OpenRouter
- Updated TypeScript configuration

**November 2024**
- Initiated chat service implementation
- Added chat routes (/new and /response)
- Created chat controllers for character generation
- Configured AI model integration
- Mapped characters with user IDs
- Configured OpenRouter SDK

**October 2024**
- Implemented trigger function for automatic user signup
- Removed manual user creation
- Updated documentation
- Added user existence validation utility
- Initialized user and character routes
- Implemented ownership verification middleware
- Created CRUD controllers for users and characters

**September 2024**
- Added authentication routes
- Implemented verify auth middleware
- Created authentication controllers
- Added OAuth services (Google, Discord)
- Implemented email authentication service
- Created placeholder services for Apple and X/Twitter

## API Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

### SSE Data Format
```
data: {"status":"processing","jobId":"1"}

data: {"status":"completed","response":"...","chatHistory":[...]}

data: [DONE]
```

## Testing

### Test Endpoint

The `/api/v1/test/echo` endpoint provides SSE testing:

```bash
curl -X POST http://localhost:3000/api/v1/test/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

Response will be an SSE stream echoing the message.

## Best Practices

### Code Organization
- Modular architecture with clear separation
- Service layer for business logic
- Controllers handle HTTP concerns only
- Middleware for cross-cutting concerns

### Error Handling
- Try-catch blocks in async functions
- Proper HTTP status codes
- Descriptive error messages
- Error logging for debugging

### Security
- Environment variables for secrets
- HttpOnly cookies for tokens
- Input validation
- Authentication on protected routes
- Resource ownership verification

### Performance
- Asynchronous processing
- Job queue for long-running tasks
- Connection pooling
- Efficient database queries

## Future Enhancements

Note: The following are potential future features not currently implemented:

- Apple OAuth integration
- X/Twitter OAuth integration
- Rate limiting
- Request validation with schema validation library
- Unit and integration tests
- API documentation with Swagger/OpenAPI
- Metrics and monitoring integration
- Caching layer for frequently accessed data
- WebSocket support for real-time features
- File upload for character avatars
- Multi-language support
- Admin dashboard
- User notification system

## Support and Contribution

For issues and feature requests, please use the GitHub issue tracker:
https://github.com/kisschat100/Backend/issues

## License

This project is licensed under the ISC License.

---

**Last Updated:** January 2026  
**Documentation Version:** 1.0.0
