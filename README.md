# KissChat.ai Backend

Backend API service for KissChat.ai built with Express.js and TypeScript.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Language:** TypeScript
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcrypt for password hashing
- **Development:** Nodemon + ts-node for hot reloading

## 📁 Project Structure

```
Backend/
├── api/              # Vercel serverless function entry point
├── src/
│   ├── app.ts        # Express app configuration
│   ├── server.ts     # Server initialization
│   ├── controllers/  # Route controllers
│   ├── middlewares/  # Custom middleware
│   ├── models/       # Data models
│   ├── routes/       # API routes
│   └── utils/        # Utility functions
├── dist/             # Compiled JavaScript (build output)
├── package.json
├── tsconfig.json
└── nodemon.json
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kisschat100/Backend.git
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
# Add other environment variables as needed
```

### Development

Run the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Production

Run the compiled code:
```bash
npm start
```

## 🌐 Deployment

### Vercel Deployment

This project is configured for Vercel serverless deployment:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy (Vercel auto-detects the configuration)

**Key files for Vercel:**
- `api/index.ts` - Serverless function entry point
- `vercel.json` - Vercel configuration

### Environment Variables

Set these in your Vercel dashboard:
- `PORT` - Server port (handled automatically by Vercel)
- `JWT_SECRET` - Secret key for JWT tokens
- Add any other required variables

## 📝 API Endpoints

### Health Check
```
GET /
Response: { "server": "Server is running just fine" }
```

_Additional endpoints will be documented as they are implemented._

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable configuration
- TypeScript for type safety

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC License - see LICENSE file for details

## 👤 Author

**zade**

- GitHub: [@kisschat100](https://github.com/kisschat100)
- Repository: [Backend](https://github.com/kisschat100/Backend)

## 🐛 Issues

Report bugs and issues [here](https://github.com/kisschat100/Backend/issues)
