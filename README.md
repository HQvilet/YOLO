# YOLO 🚀

YOLO is a modern, real-time social media and chat application featuring real-time messaging, WebRTC voice/video calling, interactive posts, and media uploads. Built on a robust, type-safe stack, it offers a fast, fluid user experience with secure authentication and instant updates.

---

## 🛠️ Tech Stack

The application is built using a modern decoupled architecture:

### Frontend
*   **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool & HMR:** [Vite](https://vite.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Lightweight client-side state)
*   **Server State & Caching:** [TanStack React Query v5](https://tanstack.com/query/latest)
*   **Routing:** [React Router DOM v7](https://reactrouter.com/)
*   **Real-time & Calling:** WebSockets ([Socket.io-client](https://socket.io/docs/v4/client-api/)) & WebRTC
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

### Backend
*   **Runtime:** [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
*   **Real-time & Signaling:** WebSockets ([Socket.io](https://socket.io/)) for WebRTC signaling
*   **Media Management:** [Cloudinary SDK](https://cloudinary.com/)
*   **Security & Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
*   **Development Tools:** [Nodemon](https://nodemon.io/) & [tsx](https://github.com/privatenumber/tsx)

---

## ✨ Features

*   💬 **Real-time Messaging & Chats:** Instant private messaging and conversations powered by WebSockets.
*   📞 **Voice & Video Calling:** Peer-to-peer real-time calls built directly using WebRTC.
*   📝 **Interactive Social Posts:** Create media-rich or text-based posts, like, and comment with dynamic feeds.
*   🔐 **Secure JWT Authentication:** Token-based security using cookies to protect state and authorization.
*   ☁️ **Cloud Media Storage:** Direct media upload support powered by Cloudinary.

---

## 📂 Project Structure

```text
YOLO/
├── backend/          # Express + Node.js server with WebSocket handling
└── frontend/         # React + TypeScript + Tailwind + Vite client
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   [npm](https://www.npmjs.com/) (usually packaged with Node.js)
*   A running [MongoDB](https://www.mongodb.com/) instance (local or Mongo Atlas cluster)
*   A [Cloudinary](https://cloudinary.com/) developer account

---

### 1. Backend Setup & Configuration

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend/` directory and populate it with the following configuration:
    ```env
    PORT=5000
    NODE_ENV=development
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    CLIENT_URL=http://localhost:5001
    ```
4.  Start the development server (uses `nodemon` with hot reloading):
    ```bash
    npm run dev
    ```
    Alternatively, you can run the production-like build directly via:
    ```bash
    npm start
    ```

The backend server will run by default on `http://localhost:5000`.

---

### 2. Frontend Setup & Configuration

1.  Open a new terminal window/tab and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.development` file in the `frontend/` directory and add the backend endpoint configurations:
    ```env
    VITE_SOCKET_URL=http://localhost:5000
    VITE_API_URL=http://localhost:5000/api/
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```

The Vite dev server will run and display a URL (usually `http://localhost:5173` or similar, depending on availability). You can now open it in your browser.

---

## 🐳 Docker Deployment (Optional)

Both folders are equipped with `docker-compose.yaml` configurations if you prefer to run services in containers.

### Run Backend Container
```bash
cd backend
docker-compose up -d --build
```

### Run Frontend Container
```bash
cd frontend
docker-compose up -d --build
```
This runs the frontend container on port `5001` (proxied internally via Nginx as defined in [nginx.conf](file:///d:/vs%20projects/Webs/Yolo/YOLO/frontend/nginx.conf)).
