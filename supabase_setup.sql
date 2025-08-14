-- =============================================
-- SUPABASE EVENT SOCIAL TABLES SETUP SCRIPT
-- =============================================
-- Run this script in your Supabase SQL Editor
-- This will create missing social tables and fix RLS policies

-- =============================================
-- 1. CREATE MISSING SOCIAL TABLES
-- =============================================

-- Create event_likes table
CREATE TABLE IF NOT EXISTS public.event_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_email)
);

-- Create event_comments table
CREATE TABLE IF NOT EXISTS public.event_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.event_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_shares table
CREATE TABLE IF NOT EXISTS public.event_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'linkedin', 'twitter', 'facebook', 'email', 'copy'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_follows table
CREATE TABLE IF NOT EXISTS public.event_follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_email)
);

-- =============================================
-- 2. FIX EVENT_REGISTRATIONS TABLE RLS POLICIES
-- =============================================

-- First, let's check if the table exists and what its structure is
-- If event_registrations doesn't exist, create it
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID, -- Optional: for authenticated users with Supabase auth
    attendee_email TEXT NOT NULL,
    attendee_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'registered', -- 'registered', 'going', 'interested', 'not_going'
    registration_data JSONB DEFAULT '{}', -- Additional form data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, attendee_email)
);

-- =============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_follows ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREATE RLS POLICIES FOR EVENT_REGISTRATIONS
-- =============================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view all event registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can insert their own event registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can update their own event registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can delete their own event registrations" ON public.event_registrations;

-- Allow everyone to view event registrations (for attendee counts)
CREATE POLICY "Users can view all event registrations"
ON public.event_registrations FOR SELECT
USING (true);

-- Allow authenticated users to insert registrations
CREATE POLICY "Users can insert their own event registrations"
ON public.event_registrations FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' OR 
    attendee_email IS NOT NULL
);

-- Allow users to update their own registrations
CREATE POLICY "Users can update their own event registrations"
ON public.event_registrations FOR UPDATE
USING (
    auth.email() = attendee_email OR
    auth.uid()::text = user_id::text
)
WITH CHECK (
    auth.email() = attendee_email OR
    auth.uid()::text = user_id::text
);

-- Allow users to delete their own registrations
CREATE POLICY "Users can delete their own event registrations"
ON public.event_registrations FOR DELETE
USING (
    auth.email() = attendee_email OR
    auth.uid()::text = user_id::text
);

-- =============================================
-- 5. CREATE RLS POLICIES FOR EVENT_LIKES
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all event likes" ON public.event_likes;
DROP POLICY IF EXISTS "Users can insert their own event likes" ON public.event_likes;
DROP POLICY IF EXISTS "Users can delete their own event likes" ON public.event_likes;

-- Allow everyone to view likes (for counts)
CREATE POLICY "Users can view all event likes"
ON public.event_likes FOR SELECT
USING (true);

-- Allow authenticated users to like events
CREATE POLICY "Users can insert their own event likes"
ON public.event_likes FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.email() = user_email
);

-- Allow users to remove their own likes
CREATE POLICY "Users can delete their own event likes"
ON public.event_likes FOR DELETE
USING (
    auth.email() = user_email
);

-- =============================================
-- 6. CREATE RLS POLICIES FOR EVENT_COMMENTS
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all event comments" ON public.event_comments;
DROP POLICY IF EXISTS "Users can insert their own event comments" ON public.event_comments;
DROP POLICY IF EXISTS "Users can update their own event comments" ON public.event_comments;
DROP POLICY IF EXISTS "Users can delete their own event comments" ON public.event_comments;

-- Allow everyone to view comments
CREATE POLICY "Users can view all event comments"
ON public.event_comments FOR SELECT
USING (true);

-- Allow authenticated users to post comments
CREATE POLICY "Users can insert their own event comments"
ON public.event_comments FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.email() = user_email
);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own event comments"
ON public.event_comments FOR UPDATE
USING (auth.email() = user_email)
WITH CHECK (auth.email() = user_email);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own event comments"
ON public.event_comments FOR DELETE
USING (auth.email() = user_email);

-- =============================================
-- 7. CREATE RLS POLICIES FOR EVENT_SHARES
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all event shares" ON public.event_shares;
DROP POLICY IF EXISTS "Users can insert event shares" ON public.event_shares;

-- Allow everyone to view shares (for counts)
CREATE POLICY "Users can view all event shares"
ON public.event_shares FOR SELECT
USING (true);

-- Allow anyone to record shares (including anonymous users)
CREATE POLICY "Users can insert event shares"
ON public.event_shares FOR INSERT
WITH CHECK (true);

-- =============================================
-- 8. CREATE RLS POLICIES FOR EVENT_FOLLOWS
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all event follows" ON public.event_follows;
DROP POLICY IF EXISTS "Users can insert their own event follows" ON public.event_follows;
DROP POLICY IF EXISTS "Users can delete their own event follows" ON public.event_follows;

-- Allow everyone to view follows (for counts)
CREATE POLICY "Users can view all event follows"
ON public.event_follows FOR SELECT
USING (true);

-- Allow authenticated users to follow events
CREATE POLICY "Users can insert their own event follows"
ON public.event_follows FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.email() = user_email
);

-- Allow users to unfollow events
CREATE POLICY "Users can delete their own event follows"
ON public.event_follows FOR DELETE
USING (auth.email() = user_email);

-- =============================================
-- 9. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes for event_registrations
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON public.event_registrations(attendee_email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);

-- Indexes for event_likes
CREATE INDEX IF NOT EXISTS idx_event_likes_event_id ON public.event_likes(event_id);
CREATE INDEX IF NOT EXISTS idx_event_likes_user_email ON public.event_likes(user_email);

-- Indexes for event_comments
CREATE INDEX IF NOT EXISTS idx_event_comments_event_id ON public.event_comments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_comments_user_email ON public.event_comments(user_email);
CREATE INDEX IF NOT EXISTS idx_event_comments_parent ON public.event_comments(parent_comment_id);

-- Indexes for event_shares
CREATE INDEX IF NOT EXISTS idx_event_shares_event_id ON public.event_shares(event_id);
CREATE INDEX IF NOT EXISTS idx_event_shares_platform ON public.event_shares(platform);

-- Indexes for event_follows
CREATE INDEX IF NOT EXISTS idx_event_follows_event_id ON public.event_follows(event_id);
CREATE INDEX IF NOT EXISTS idx_event_follows_user_email ON public.event_follows(user_email);

-- =============================================
-- 10. CREATE HELPER FUNCTIONS (OPTIONAL)
-- =============================================

-- Function to get event stats
CREATE OR REPLACE FUNCTION get_event_stats(event_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'likes', (SELECT COUNT(*) FROM public.event_likes WHERE event_id = event_uuid),
        'comments', (SELECT COUNT(*) FROM public.event_comments WHERE event_id = event_uuid),
        'shares', (SELECT COUNT(*) FROM public.event_shares WHERE event_id = event_uuid),
        'follows', (SELECT COUNT(*) FROM public.event_follows WHERE event_id = event_uuid),
        'registrations', (SELECT COUNT(*) FROM public.event_registrations WHERE event_id = event_uuid)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 11. GRANT PERMISSIONS
-- =============================================

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_registrations TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.event_likes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_comments TO authenticated;
GRANT SELECT, INSERT ON public.event_shares TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.event_follows TO authenticated;

-- Grant select permissions to anonymous users for viewing counts
GRANT SELECT ON public.event_likes TO anon;
GRANT SELECT ON public.event_comments TO anon;
GRANT SELECT ON public.event_shares TO anon;
GRANT SELECT ON public.event_follows TO anon;
GRANT SELECT ON public.event_registrations TO anon;

-- =============================================
-- SETUP COMPLETE!
-- =============================================

-- Verify the setup by running these queries:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%event%';
-- SELECT COUNT(*) FROM public.event_registrations;
-- SELECT * FROM get_event_stats('your-event-id-here');