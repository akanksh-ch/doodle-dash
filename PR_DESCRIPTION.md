# Milestone 3: The AI Judge

## Summary
Integrated Google's Gemini 1.5 Flash AI to analyze player drawings and provide a guess.

## Technical Implementation
- **Server**:
    - Added `/api/guess` endpoint.
    - Integrated `@google/generative-ai` SDK.
    - Handles Base64 image uploads (limit set to 10mb).
    - Uses `gemini-1.5-flash` model with a prompt to "guess what this drawing represents in 1-3 words".
- **Client**:
    - Added "Guess!" button to `DrawingCanvas`.
    - Converts canvas to Base64 and POSTs to `/api/guess`.
    - Displays the AI's response in an alert.

## Testing
1. Ensure `GEMINI_API_KEY` is set in `server/.env`.
2. Run `npm run dev`.
3. Draw something on the canvas.
4. Click "Guess!".
5. Verify the alert shows a relevant guess (or a funny failure).
