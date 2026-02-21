# API Documentation

## Base URL
All endpoints are prefixed with `/api/v1/` unless otherwise specified.

---

## Authentication Endpoints
**Base Path:** `/api/v1/auth`

### 1. Sign Up
- **Method:** `POST`
- **Path:** `/api/v1/auth/signup`
- **Description:** Register a new user account
- **Authentication:** Not required

### 2. Login
- **Method:** `POST`
- **Path:** `/api/v1/auth/login`
- **Description:** Authenticate user and create session
- **Authentication:** Not required

### 3. Logout
- **Method:** `POST`
- **Path:** `/api/v1/auth/logout`
- **Description:** Terminate user session
- **Authentication:** Not required

### 4. OAuth Callback
- **Method:** `GET`
- **Path:** `/api/v1/auth/callback`
- **Description:** Handle OAuth provider callback
- **Authentication:** Not required

### 5. OAuth Session
- **Method:** `POST`
- **Path:** `/api/v1/auth/session`
- **Description:** Create or validate OAuth session
- **Authentication:** Not required

### 6. Forgot Password
- **Method:** `POST`
- **Path:** `/api/v1/auth/forgot-password`
- **Description:** Request password reset link via email
- **Authentication:** Not required

### 7. Reset Password
- **Method:** `POST`
- **Path:** `/api/v1/auth/reset-password`
- **Description:** Reset user password using token from email
- **Authentication:** Not required

---

## User Endpoints
**Base Path:** `/api/v1/user`

### 1. Update User
- **Method:** `PUT`
- **Path:** `/api/v1/user/update`
- **Description:** Update user information
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 2. Delete User
- **Method:** `DELETE`
- **Path:** `/api/v1/user/delete/:id`
- **Description:** Delete user account by ID
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 3. Follow User
- **Method:** `POST`
- **Path:** `/api/v1/user/follow`
- **Description:** Follow or unfollow a user
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 4. Get User By ID
- **Method:** `GET`
- **Path:** `/api/v1/user/getByUserId/:id`
- **Description:** Retrieve user profile by user ID
- **Authentication:** Not required

### 5. Get Premium Status By User ID
- **Method:** `GET`
- **Path:** `/api/v1/user/getPremiumByUserId/:id`
- **Description:** Check premium status for a user
- **Authentication:** Not required

### 6. Update Social Media
- **Method:** `PUT`
- **Path:** `/api/v1/user/updateSocialMedia`
- **Description:** Update user's social media links
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 7. Update Profile Picture
- **Method:** `PUT`
- **Path:** `/api/v1/user/updateProfilePicture`
- **Description:** Upload and update user profile picture
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, uploadSingleImage

---

## Character Endpoints
**Base Path:** `/api/v1/character`

### 1. Create Character
- **Method:** `POST`
- **Path:** `/api/v1/character/create`
- **Description:** Create a new character
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware

### 2. Get Character By ID
- **Method:** `GET`
- **Path:** `/api/v1/character/get/:id`
- **Description:** Retrieve character details by ID
- **Authentication:** Not required

### 3. Get All Characters
- **Method:** `GET`
- **Path:** `/api/v1/character/getAll`
- **Description:** Retrieve all public characters
- **Authentication:** Not required

### 4. Character Operation
- **Method:** `POST`
- **Path:** `/api/v1/character/operation`
- **Description:** Perform operations on character (like, favorite, etc.)
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 5. Comment on Character
- **Method:** `POST`
- **Path:** `/api/v1/character/comment`
- **Description:** Add a comment to a character
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware

### 6. Delete Comment
- **Method:** `DELETE`
- **Path:** `/api/v1/character/comment`
- **Description:** Delete a character comment
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware

### 7. Edit Comment
- **Method:** `PUT`
- **Path:** `/api/v1/character/comment`
- **Description:** Edit an existing comment
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware

### 8. Get Characters By User ID
- **Method:** `GET`
- **Path:** `/api/v1/character/getByUserId`
- **Description:** Get all characters created by a specific user
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware

### 9. Get Comments By Character ID
- **Method:** `GET`
- **Path:** `/api/v1/character/comment/:id`
- **Description:** Retrieve all comments for a specific character
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 10. Comment Interaction
- **Method:** `POST`
- **Path:** `/api/v1/character/comment/operation`
- **Description:** Perform operations on comments (like, dislike, etc.)
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 11. Upload Character Avatar
- **Method:** `POST`
- **Path:** `/api/v1/character/uploadAvatar`
- **Description:** Upload custom avatar image for character
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

---

## Chat Endpoints
**Base Path:** `/api/v1/chat`

### 1. Chat Response (SSE)
- **Method:** `POST`
- **Path:** `/api/v1/chat/response`
- **Description:** Send message and receive streaming chat response (Server-Sent Events)
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware
- **Special:** Uses SSE for real-time streaming responses

### 2. New Chat
- **Method:** `POST`
- **Path:** `/api/v1/chat/new`
- **Description:** Create a new chat session
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 3. Delete Chat
- **Method:** `DELETE`
- **Path:** `/api/v1/chat/delete`
- **Description:** Delete a chat session
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 4. Get Chat By User ID
- **Method:** `POST`
- **Path:** `/api/v1/chat/get`
- **Description:** Retrieve chat history for the authenticated user
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 5. Check New Chat Limit
- **Method:** `GET`
- **Path:** `/api/v1/chat/check-new-chat-limit`
- **Description:** Check if user can create new chat (rate limiting)
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

---

## Image Endpoints
**Base Path:** `/api/v1/image`

### 1. Rate Image
- **Method:** `POST`
- **Path:** `/api/v1/image/rate`
- **Description:** Rate an image
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 2. Generate Image
- **Method:** `POST`
- **Path:** `/api/v1/image/generate`
- **Description:** Generate AI image from prompt
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware

### 3. Save Generated Image
- **Method:** `POST`
- **Path:** `/api/v1/image/save`
- **Description:** Save generated image to user gallery
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware

### 4. Get Images By User ID
- **Method:** `POST`
- **Path:** `/api/v1/image/getImageByUserId`
- **Description:** Retrieve all images for a specific user
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 5. Get Image By ID
- **Method:** `POST`
- **Path:** `/api/v1/image/getImageById`
- **Description:** Retrieve specific image details
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 6. Like Image
- **Method:** `POST`
- **Path:** `/api/v1/image/like`
- **Description:** Like or unlike an image
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 7. Change Image Visibility
- **Method:** `PUT`
- **Path:** `/api/v1/image/change-visibility`
- **Description:** Update image visibility (public/private)
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware

### 8. Delete Image
- **Method:** `DELETE`
- **Path:** `/api/v1/image/delete`
- **Description:** Delete an image
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware

### 9. Get All Public Images
- **Method:** `POST`
- **Path:** `/api/v1/image/getAllPublicImages`
- **Description:** Retrieve all public images with pagination
- **Authentication:** Not required

### 10. Photo Album Image Generation
- **Method:** `POST`
- **Path:** `/api/v1/image/photo-album-image-generate`
- **Description:** Generate character-specific images for photo album during chat conversations
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware
- **Request Body:** 
  - `character_id` (required): Character ID
  - `prompt` (required): Additional prompt details for image generation
  - `message_context` (optional): Message context ID for caching
- **Features:**
  - Checks for existing images with same message context (returns cached if found)
  - Generates image based on character's physical attributes (type, age, heritage, gender, skin tone, eye color, hair color, hairstyle, body type, occupation)
  - Automatically saves to character's photo album array
  - Adds generated image URL to chat history
  - Deducts KissCoins for generation
- **Response:** Returns `image_url`, `success` status, and `cached` boolean

### 11. Generate Character Image
- **Method:** `POST`
- **Path:** `/api/v1/image/generate-character-image`
- **Description:** Generate avatar image for new character creation based on physical attributes
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware
- **Request Body:**
  - `occupation` (optional): Character's occupation
  - `body_type` (required): Body type description
  - `type` (required): Character type
  - `age` (required): Character age
  - `heritage` (required): Character heritage/ethnicity
  - `gender` (required): Character gender
  - `skin_tone` (required): Skin tone description
  - `eye_color` (required): Eye color
  - `hair_color` (required): Hair color
  - `hairstyle` (required): Hairstyle description
- **Features:**
  - Auto-generates unique seed for character consistency
  - Creates initial character record in database
  - Deducts KissCoins for generation
- **Response:** Returns `image_url`, character data, and `success` status

---

## Memory Endpoints
**Base Path:** `/api/v1/memory`

### 1. Get Memory
- **Method:** `GET`
- **Path:** `/api/v1/memory/get/:id`
- **Description:** Retrieve memory by ID
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 2. Save Memory
- **Method:** `POST`
- **Path:** `/api/v1/memory/save`
- **Description:** Save new memory
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 3. Get Public Memories
- **Method:** `GET`
- **Path:** `/api/v1/memory/public`
- **Description:** Retrieve all public memories
- **Authentication:** Not required

### 4. Delete Memory
- **Method:** `DELETE`
- **Path:** `/api/v1/memory/delete`
- **Description:** Delete a memory
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 5. Update Memory
- **Method:** `PUT`
- **Path:** `/api/v1/memory/update`
- **Description:** Update existing memory
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

---

## Payment Endpoints
**Base Path:** `/api/v1/payment`

### 1. Crypto Payment Webhook
- **Method:** `POST`
- **Path:** `/api/v1/payment/crypto/webhook`
- **Description:** Handle crypto payment provider webhook callbacks
- **Authentication:** Not required

### 2. Initiate Crypto Payment
- **Method:** `POST`
- **Path:** `/api/v1/payment/crypto/generate`
- **Description:** Generate crypto payment link for premium subscription
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 3. Kiss Coins Crypto Payment Webhook
- **Method:** `POST`
- **Path:** `/api/v1/payment/crypto/kiss-coins/webhook`
- **Description:** Handle KissCoins crypto payment webhook
- **Authentication:** Not required

### 4. Initiate Kiss Coins Crypto Payment
- **Method:** `POST`
- **Path:** `/api/v1/payment/crypto/kiss-coins/generate`
- **Description:** Generate crypto payment link for KissCoins
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 5. Get Payment History
- **Method:** `GET`
- **Path:** `/api/v1/payment/getPaymentHistory`
- **Description:** Retrieve user's payment transaction history
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

---

## Referral Endpoints
**Base Path:** `/api/v1/referral`

### 1. Referral Code
- **Method:** `POST`
- **Path:** `/api/v1/referral/code`
- **Description:** Create or validate referral code
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

---

## Gift Endpoints
**Base Path:** `/api/v1/gift`

### 1. Give Gift
- **Method:** `POST`
- **Path:** `/api/v1/gift/give`
- **Description:** Send gift to another user
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

---

## Rewards Endpoints
**Base Path:** `/api/v1/rewards`

### 1. Get Rewards
- **Method:** `GET`
- **Path:** `/api/v1/rewards/get-rewards`
- **Description:** Claim daily reward and receive KissCoins
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware
- **Rewards:** Day 1: 50, Day 2: 100, Day 3: 150, Day 4: 200, Day 5: 250, Day 6: 300, Day 7: 350 KissCoins
- **Notes:** 
  - Validates streak day matches user's actual streak before awarding
  - Automatically handles streak reset after 48 hours or completing 7-day cycle
  - 24-hour cooldown between claims

---

## Automate Endpoints
**Base Path:** `/api/v1/automate`

### 1. Fill Automate
- **Method:** `POST`
- **Path:** `/api/v1/automate/fill-automate`
- **Description:** Auto-fill character creation form using AI
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

### 2. Enhance Image Prompt
- **Method:** `POST`
- **Path:** `/api/v1/automate/enhance-image-prompt`
- **Description:** Enhance user's image generation prompt using AI
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

---

## Job Endpoints
**Base Path:** `/api/v1/job`

### 1. Get Job Status
- **Method:** `GET`
- **Path:** `/api/v1/job/status/:jobId`
- **Description:** Check the status of an asynchronous job
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

---

## Test Endpoints
**Base Path:** `/api/v1/test`

### 1. Echo Test
- **Method:** `GET`
- **Path:** `/api/v1/test/echo`
- **Description:** Test endpoint that returns user profile data
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware, userMetaDataMiddleware
- **Response:** Returns echo message and user profile information

---

## General Endpoints

### 1. Health Check
- **Method:** `GET`
- **Path:** `/`
- **Description:** Check if server is running
- **Authentication:** Not required
- **Response:** `{ response: 'Server health is ok !' }`

### 2. Protected Route (Example)
- **Method:** `GET`
- **Path:** `/protected`
- **Description:** Example of a protected route
- **Authentication:** Required
- **Middleware:** verifyAuthMiddleware

---

## Middleware Summary

### Authentication Middleware
- **verifyAuthMiddleware:** Validates JWT token and attaches user to request
- **userMetaDataMiddleware:** Fetches and attaches user metadata
- **premiumMetaDataMiddleware:** Validates premium user status
- **verifyOwnerMiddleware:** Ensures user owns the resource

### Upload Middleware
- **uploadSingleImage:** Handles single image file upload

---

## Configuration & Services

### External Services
- **Supabase:** Database and authentication
- **Redis/Upstash:** Caching layer
- **OpenRouter:** AI model routing
- **Cloudflare R2:** Object storage

### Key Features
1. **Server-Sent Events (SSE):** Real-time streaming for chat responses
2. **Crypto Payments:** Support for cryptocurrency transactions
3. **Image Generation:** AI-powered image creation
4. **Character System:** User-created AI characters
5. **Memory System:** Persistent conversation context
6. **Referral System:** User referral tracking
7. **Gift System:** In-app gifting
8. **Premium Subscriptions:** Tiered user access
9. **KissCoins:** In-app currency system
10. **Daily Rewards:** 7-day streak system with escalating rewards

---

## API Response Patterns

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### SSE Response Format
```
data: { "message": "streaming content" }

data: [DONE]
```

---

## Notes
- All authenticated endpoints require a valid JWT token in the Authorization header or cookies
- SSE endpoints (`/chat/response`, `/test/echo`) use Server-Sent Events for streaming
- Webhook endpoints are designed to receive callbacks from external payment providers
- File uploads use multipart/form-data encoding
- All endpoints support CORS with credentials

---

**Last Updated:** February 21, 2026  
**API Version:** v1
