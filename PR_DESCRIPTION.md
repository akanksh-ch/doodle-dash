# Milestone 2: Real-time Sync

## Summary
Implemented the real-time multiplayer drawing feature using HTML5 Canvas and Socket.io.

## Technical Implementation
- **Client**:
    - Created `DrawingCanvas` component with `useDraw` hook for handling mouse/touch events.
    - Integrated `socket.io-client` to emit `draw-line` events.
    - Updated `page.tsx` to render the canvas.
- **Server**:
    - Updated `index.js` to listen for `draw-line` events and broadcast them to other connected clients.
    - Configured CORS to allow connections from `localhost:3000`, `3001`, and `3002`.

## Testing
1. Run `npm run dev` in root.
2. Open two browser windows at `http://localhost:3000` (or `3002` if 3000 is busy).
3. Draw in one window and verify it appears in the other window in real-time.
4. Verify `Clear canvas` button clears both screens.
