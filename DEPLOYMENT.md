# Deployment Guide 🚀

## 1. Backend (Render.com)

1.  **Create New**: Select **"Web Service"**.
2.  **Connect Repo**: Connect your `doodle-dash` repo.
3.  **Root Directory**: Set to `server`.
4.  **Build Command**: `npm install`
5.  **Start Command**: `node index.js`
6.  **Environment Variables**:
    - `GEMINI_API_KEY`: Your Google Gemini API Key.
    - `CLIENT_URL`: Your Vercel frontend URL (e.g., `https://doodle-dash.vercel.app`).
    - `PORT`: `3001`
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
    - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (preferred) OR Anon Key.

## 2. Frontend (Vercel)

1.  **Import Project**: Select the `doodle-dash` repo.
2.  **Root Directory**: Edit and select `client`.
3.  **Environment Variables**:
    - `NEXT_PUBLIC_SERVER_URL`: The URL of your deployed Render backend (e.g., `https://doodle-dash-backend.onrender.com`).

## 3. Auth0 Configuration (CRITICAL)
1.  Go to your [Auth0 Dashboard](https://manage.auth0.com/).
2.  Navigate to **Applications** -> **Your Application**.
3.  Scroll down to the **Application URIs** section.
4.  Update the following fields with your **Vercel Frontend URL** (e.g., `https://doodle-dash.vercel.app`):
    - **Allowed Callback URLs**: `https://doodle-dash.vercel.app`, `http://localhost:3000`
    - **Allowed Logout URLs**: `https://doodle-dash.vercel.app`, `http://localhost:3000`
    - **Allowed Web Origins**: `https://doodle-dash.vercel.app`, `http://localhost:3000`
5.  **Save Changes**.

## 4. Final Link
Once both are deployed:
1.  Copy the Vercel URL.
2.  Go back to Render Dashboard -> Environment Variables.
3.  Update `CLIENT_URL` with the Vercel URL.
4.  Redeploy Render (if it doesn't auto-restart).
