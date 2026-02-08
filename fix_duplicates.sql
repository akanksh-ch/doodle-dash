-- Add a unique constraint to the username column
-- This ensures that the database rejects duplicate usernames if the code fails
ALTER TABLE public.leaderboard ADD CONSTRAINT unique_username UNIQUE (username);

-- Cleanup duplicates (Keep the one with the highest score)
-- WARNING: This is a bit complex, run only if you want to clean up existing duplicates
/*
DELETE FROM public.leaderboard a USING public.leaderboard b
WHERE a.id < b.id
AND a.username = b.username;
*/
