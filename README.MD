# CipherChat | Secure Real-Time Messaging Platform

A modern, feature-rich messaging application enabling secure, one-on-one real-time conversations, built with the MERN stack and WebSockets.

### Key Functionalities
- **Instant Messaging**: Enables bi-directional, real-time text and image messaging.
- **User Presence**: Provides live tracking and display of online/offline status.

### Technical Highlights
- **Real-Time Core**: Engineered using Socket.io with secure, authenticated WebSocket connections.
- **Security Fortification**: APIs hardened with Arcjet, configuring a WAF and rate-limiter to protect against XSS, SQLi, and bot attacks.

---

### Environment Setup

Create a `.env` file in the `/backend` directory:

```bash
PORT=3000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
ARCJET_KEY=your_arcjet_key
CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
```

### Installation

1. **Backend**
   ```bash
   cd backend && npm install && npm run dev
   ```

2. **Frontend**
   ```bash
   cd frontend && npm install && npm run dev
   ```
