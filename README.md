# CarTinder 🚗🔥

**CarTinder** is a modern, full-stack car rental platform with a "Tinder-style" swiping experience. Users can swipe through available cars, like their favorites, chat with dealers, and book rides—all in a sleek, responsive interface.

---

## 🌟 Key Features

-   **Infinite Swiping Feed:** A Tinder-like experience to discover cars. The feed never ends—it intelligently re-shows "passed" cars if you run out of new options.
-   **Liked Rides Management:** Save cars you're interested in and manage them easily (including unliking/removing).
-   **Real-time Chat:** Communicate directly with car dealers to discuss details.
-   **Booking System:** Request and manage car rentals.
-   **Notifications:** Get updates on your bookings and messages.
-   **Full Auth System:** Secure registration, login, and "Forgot Password" functionality.
-   **Responsive Design:** Fully optimized for both desktop and mobile screens.

---

## 🛠️ Tech Stack

-   **Frontend:** React (TypeScript), Vite, Framer Motion (Animations), Lucide React (Icons).
-   **Backend:** Node.js, Express.js.
-   **Database:** MongoDB (Mongoose).
-   **Authentication:** JSON Web Tokens (JWT) & Bcrypt for hashing.

---

## 📂 Project Structure

```text
├── bruno/              # API Testing Collections (Bruno)
├── cartinder/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main view pages
│   │   ├── services/   # API communication
│   │   └── context/    # State management
├── server/             # Backend (Node + Express)
│   ├── src/
│   │   ├── controllers/# Business logic
│   │   ├── models/     # Database schemas
│   │   ├── routes/     # API endpoints
│   │   └── services/   # Supporting services
└── documentation/      # Data models and diagrams
```

---

## 🚀 Getting Started

### 1. Prerequisites
-   Node.js (v16+)
-   MongoDB Atlas account or local MongoDB.

### 2. Backend Setup
1.  Navigate to the `server` directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create a `.env` file based on the provided configuration:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```
4.  **Seed the Database:** Add sample cars to your DB:
    ```bash
    npx ts-node src/seed_cars.ts
    ```
5.  Start the server: `npm run dev`

### 3. Frontend Setup
1.  Navigate to the `cartinder` directory: `cd cartinder`
2.  Install dependencies: `npm install`
3.  Create a `.env` file:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
4.  Start the development server: `npm run dev`

---

## 🛣️ API Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password |
| **Cars** | | |
| GET | `/api/cars` | Fetch cars with filters (Infinite) |
| GET | `/api/cars/dealer` | Dealer's own listings |
| POST | `/api/cars` | List a new car (Dealer) |
| **Swipes** | | |
| POST | `/api/swipes` | Record a swipe (like/pass/superlike) |
| DELETE | `/api/swipes/:carId` | Remove a liked car |
| GET | `/api/swipes/likes` | Get saved rides |
| **Bookings** | | |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/my` | View my bookings |

*(And more for Chats, Reviews, and Notifications...)*

---

## 🌐 Deployment

### Database (MongoDB Atlas)
1.  Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Allow access from anywhere (0.0.0.0/0).
3.  Get your connection string and add it to `MONGO_URI`.

### Backend (Render)
1.  Root Directory: `server`
2.  Build Command: `npm install && npm run build`
3.  Start Command: `npm start`

### Frontend (Vercel)
1.  Root Directory: `cartinder`
2.  Build Command: `npm run build`
3.  Output Directory: `dist`
4.  Set `VITE_API_BASE_URL` to your Backend URL.

---

## 📄 License
This project is for educational purposes.
