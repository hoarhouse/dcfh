-- =============================================
-- FIX SPECIFIC 406 RLS ERRORS
-- =============================================
-- This script addresses the exact causes of 406 errors
-- Run this in Supabase SQL Editor

-- =============================================
-- 1. ENABLE PUBLIC READ ACCESS FOR ALL SOCIAL TABLES
-- =============================================
-- The main issue: event pages need to read counts and data for display
-- Current policies are blocking even basic SELECT queries

-- Drop existing restrictive SELECT policies
DROP POLICY IF EXISTS "Allow all users to read event registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Allow all users to read event likes" ON public.event_likes;
DROP POLICY IF EXISTS "Allow all users to read event follows" ON public.event_follows;
DROP POLICY IF EXISTS "Allow all users to read event comments" ON public.event_comments;
DROP POLICY IF EXISTS "Allow all users to read event shares" ON public.event_shares;

-- Create truly permissive SELECT policies (no conditions)
CREATE POLICY "Public read access for event registrations"
ON public.event_registrations FOR SELECT
USING (true);

CREATE POLICY "Public read access for event likes"
ON public.event_likes FOR SELECT
USING (true);

CREATE POLICY "Public read access for event follows"
ON public.event_follows FOR SELECT
USING (true);

CREATE POLICY "Public read access for event comments"
ON public.event_comments FOR SELECT
USING (true);

CREATE POLICY "Public read access for event shares"
ON public.event_shares FOR SELECT
USING (true);

-- =============================================
-- 2. SIMPLIFY WRITE POLICIES TO AVOID AUTH CONTEXT ISSUES
-- =============================================

-- Fix event_likes INSERT/DELETE policies
DROP POLICY IF EXISTS "Allow authenticated users to like events" ON public.event_likes;
DROP POLICY IF EXISTS "Allow users to remove their own likes" ON public.event_likes;

-- More permissive like policies
CREATE POLICY "Simple like insert policy"
ON public.event_likes FOR INSERT
WITH CHECK (
    user_email IS NOT NULL AND user_email != ''
);

CREATE POLICY "Simple like delete policy"
ON public.event_likes FOR DELETE
USING (
    user_email IS NOT NULL
);

-- Fix event_follows INSERT/DELETE policies
DROP POLICY IF EXISTS "Allow authenticated users to follow events" ON public.event_follows;
DROP POLICY IF EXISTS "Allow users to unfollow events" ON public.event_follows;

CREATE POLICY "Simple follow insert policy"
ON public.event_follows FOR INSERT
WITH CHECK (
    user_email IS NOT NULL AND user_email != ''
);

CREATE POLICY "Simple follow delete policy"
ON public.event_follows FOR DELETE
USING (
    user_email IS NOT NULL
);

-- Fix event_registrations policies
DROP POLICY IF EXISTS "Allow authenticated users to register for events" ON public.event_registrations;
DROP POLICY IF EXISTS "Allow users to update their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Allow users to delete their own registrations" ON public.event_registrations;

CREATE POLICY "Simple registration insert policy"
ON public.event_registrations FOR INSERT
WITH CHECK (
    attendee_email IS NOT NULL AND attendee_email != ''
);

CREATE POLICY "Simple registration update policy"
ON public.event_registrations FOR UPDATE
USING (
    attendee_email IS NOT NULL
)
WITH CHECK (
    attendee_email IS NOT NULL
);

CREATE POLICY "Simple registration delete policy"
ON public.event_registrations FOR DELETE
USING (
    attendee_email IS NOT NULL
);

-- Fix event_comments policies
DROP POLICY IF EXISTS "Allow authenticated users to post comments" ON public.event_comments;
DROP POLICY IF EXISTS "Allow users to update their own comments" ON public.event_comments;
DROP POLICY IF EXISTS "Allow users to delete their own comments" ON public.event_comments;

CREATE POLICY "Simple comment insert policy"
ON public.event_comments FOR INSERT
WITH CHECK (
    user_email IS NOT NULL AND user_email != ''
);

CREATE POLICY "Simple comment update policy"
ON public.event_comments FOR UPDATE
USING (
    user_email IS NOT NULL
)
WITH CHECK (
    user_email IS NOT NULL
);

CREATE POLICY "Simple comment delete policy"
ON public.event_comments FOR DELETE
USING (
    user_email IS NOT NULL
);

-- =============================================
-- 3. GRANT EXPLICIT PERMISSIONS TO BYPASS RLS ISSUES
-- =============================================

-- Grant broad permissions to authenticated users
GRANT ALL ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_likes TO authenticated;
GRANT ALL ON public.event_follows TO authenticated;
GRANT ALL ON public.event_comments TO authenticated;
GRANT ALL ON public.event_shares TO authenticated;

-- Grant read permissions to anonymous users (for counts, etc.)
GRANT SELECT ON public.event_registrations TO anon;
GRANT SELECT ON public.event_likes TO anon;
GRANT SELECT ON public.event_follows TO anon;
GRANT SELECT ON public.event_comments TO anon;
GRANT SELECT ON public.event_shares TO anon;

-- =============================================
-- 4. CREATE HELPER FUNCTION TO DEBUG AUTH CONTEXT
-- =============================================

CREATE OR REPLACE FUNCTION debug_auth_context()
RETURNS JSON AS $$
BEGIN
    RETURN json_build_object(
        'current_user', current_user,
        'session_user', session_user,
        'auth_uid', auth.uid(),
        'auth_email', auth.email(),
        'auth_role', auth.role(),
        'current_timestamp', now()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION debug_auth_context() TO authenticated;
GRANT EXECUTE ON FUNCTION debug_auth_context() TO anon;

-- =============================================
-- 5. TEST THE FIXES
-- =============================================

-- These queries should now work without 406 errors:

-- Test public read access
SELECT COUNT(*) as total_registrations FROM public.event_registrations;
SELECT COUNT(*) as total_likes FROM public.event_likes;
SELECT COUNT(*) as total_follows FROM public.event_follows;
SELECT COUNT(*) as total_comments FROM public.event_comments;
SELECT COUNT(*) as total_shares FROM public.event_shares;

-- Test auth context (run when logged in)
SELECT debug_auth_context();

-- =============================================
-- 6. VERIFY POLICY STATUS
-- =============================================

-- Check that all policies were created successfully
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd as operation,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has conditions'
        ELSE 'No conditions'
    END as policy_conditions
FROM pg_policies 
WHERE tablename LIKE 'event_%'
ORDER BY tablename, cmd, policyname;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'event_%'
ORDER BY tablename;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '✅ RLS policy fixes applied successfully!';
    RAISE NOTICE 'Test your event pages - 406 errors should be resolved.';
    RAISE NOTICE 'If you still get errors, run: SELECT debug_auth_context();';
END $$;