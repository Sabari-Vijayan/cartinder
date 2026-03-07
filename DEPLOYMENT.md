# Deployment Guide: CarTinder (Full Stack)

Follow these steps to deploy your project for free using industry-standard tools.

## 1. Database: MongoDB Atlas (Cloud)
*   **Sign up:** Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register).
*   **Create Cluster:** Choose the **M0 FREE** tier.
*   **Network Access:** Go to "Network Access" and click **Add IP Address**. Choose **Allow Access from Anywhere** (0.0.0.0/0) so your Render server can connect.
*   **Database User:** Create a user with a password (save these!).
*   **Connection String:** Click **Connect** -> **Drivers** -> Copy the `mongodb+srv://...` URI.

## 2. Backend: Render (Node.js API)
*   **Connect:** Sign in to [Render](https://render.com) and click **New** -> **Web Service**.
*   **GitHub:** Connect your repository.
*   **Settings:**
    *   **Name:** `cartinder-api`
    *   **Root Directory:** `server`
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`
*   **Environment Variables:**
    *   `PORT`: `10000` (Render's default)
    *   `MONGO_URI`: (Your Atlas connection string)
    *   `JWT_SECRET`: (Any long random string)
    *   `FRONTEND_URL`: (The URL Vercel gives you later)

## 3. Frontend: Vercel (React + Vite)
*   **Connect:** Sign in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
*   **GitHub:** Import your repository.
*   **Settings:**
    *   **Framework Preset:** `Vite`
    *   **Root Directory:** `cartinder`
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
*   **Environment Variables:**
    *   `VITE_API_BASE_URL`: (Your Render API URL + `/api`) 
        *   *Example:* `https://cartinder-api.onrender.com/api`

---

## Required Code Adjustments (Action Items)

Before you push to GitHub, ensure these files are updated to handle production environments:

### A. Update `server/src/server.ts` (CORS)
Allow your frontend to talk to your backend securely.
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### B. Update `cartinder/src/services/api.ts` (Dynamic URL)
Ensure the frontend knows where to find the API.
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});
```

## Troubleshooting
*   **Cold Starts:** On the free tier of Render, the API will "sleep" after 15 mins of inactivity. The first request might take 30 seconds to wake up.
*   **Mixed Content:** Always use `https` for both your Render and Vercel URLs.
*   **Env Vars:** If you change an environment variable, you must **re-deploy** the service for it to take effect.
