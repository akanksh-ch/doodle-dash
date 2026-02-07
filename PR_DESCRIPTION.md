# Milestone 1: The Foundation

## Summary
Initialized the repository structure with a Next.js 14 client and an Express/Node.js server. Configured the root `package.json` to manage both applications concurrently.

## Technical Implementation
- **Client**: Created using `create-next-app` with Tailwind CSS, TypeScript, and App Router.
- **Server**: initialized with `npm init`, installed `express`, `socket.io`, `cors`, `dotenv`.
- **Root**: Added `concurrently` to run both client (`npm run start:client`) and server (`npm run start:server`) in parallel via `npm run dev`.

## Testing
1. Run `npm install` in root.
2. Run `npm run dev`.
3. Verify Client at `http://localhost:3000`.
4. Verify Server at `http://localhost:3001` (logs "Server running on port 3001").
