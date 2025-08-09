-- Migration to update from old schema to new unified user_profiles schema
-- This adds missing fields to user_profiles table and migrates existing data

-- Add missing fields to user_profiles table if they don't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_check_in TIMESTAMP WITH TIME ZONE;

-- If you have existing user_streaks table, migrate that data
-- (This will only run if the table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_streaks') THEN
    -- Migrate streak data from user_streaks table
    UPDATE public.user_profiles 
    SET 
      current_streak = COALESCE(us.current_streak, 0),
      longest_streak = COALESCE(us.longest_streak, 0),
      last_check_in = us.last_check_in
    FROM public.user_streaks us
    WHERE user_profiles.user_id = us.user_id;
    
    -- Drop the old user_streaks table after migration
    DROP TABLE IF EXISTS public.user_streaks CASCADE;
  END IF;
END $$;

-- Mark existing users who have names as having completed onboarding
-- This prevents them from being stuck in the onboarding loop
UPDATE public.user_profiles 
SET onboarding_completed = true 
WHERE name IS NOT NULL 
  AND name != '' 
  AND onboarding_completed = false;

-- If you have separate users table, we can also migrate from there
-- (This handles the case where you might have the old setup)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    -- This means you have the old schema, let's migrate what we can
    INSERT INTO public.user_profiles (user_id, created_at, updated_at)
    SELECT id, created_at, updated_at
    FROM public.users u
    WHERE NOT EXISTS (
      SELECT 1 FROM public.user_profiles up WHERE up.user_id = u.id
    );
  END IF;
END $$;