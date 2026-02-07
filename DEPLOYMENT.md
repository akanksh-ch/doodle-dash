# Deployment Guide 🚀

## 1. Backend (Render.com)

1.  **Create New**: Select **"Web Service"**.
2.  **Connect Repo**: Connect your `doodle-dash` repo.
3.  **Root Directory**: Set to `server`.
4.  **Build Command**: `npm install`
5.  **Start Command**: `node index.js`
6.  **Environment Variables**:
    - `GEMINI_API_KEY`: Your Google Gemini API Key.
    - `CLIENT_URL`: Your Vercel frontend URL (e.g., `https://doodle-dash.vercel.app`). *You can add this after deploying the frontend.*
    - `PORT`: `3001` (Render usually sets a PORT automatically, but good to have).

## 2. Frontend (Vercel)

1.  **Import Project**: Select the `doodle-dash` repo.
2.  **Root Directory**: Edit and select `client`.
3.  **Environment Variables**:
    - `NEXT_PUBLIC_SERVER_URL`: The URL of your deployed Render backend (e.g., `https://doodle-dash-backend.onrender.com`).

## 3. Final Link
Once both are deployed:
1.  Copy the Vercel URL.
2.  Go back to Render Dashboard -> Environment Variables.
3.  Update `CLIENT_URL` with the Vercel URL.
4.  Redeploy Render (if it doesn't auto-restart).
