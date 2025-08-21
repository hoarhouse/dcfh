# 🚀 Supabase Event Tables Setup Instructions

## 📋 Overview
This guide will help you set up the missing event social tables and fix RLS policies in your Supabase database to enable full functionality for the DCF Hungary event system.

## 🔧 What This Fixes
- ✅ Creates missing social interaction tables (`event_likes`, `event_comments`, `event_shares`, `event_follows`)
- ✅ Fixes RLS policies on `event_registrations` table to allow proper access
- ✅ Re-enables all social features in `dcf_event_details.html`
- ✅ Adds proper security policies for authenticated and anonymous users
- ✅ Includes performance indexes and helper functions

## 📝 Step-by-Step Instructions

### Step 1: Run the SQL Setup Script

1. **Open your Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Navigate to your DCF Hungary project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the SQL Script**
   - Open the file `supabase_setup.sql` (in this directory)
   - Copy the entire contents
   - Paste it into the SQL Editor

4. **Execute the Script**
   - Click "Run" to execute the script
   - Wait for all commands to complete successfully

### Step 2: Verify the Setup

After running the script, verify that everything was created correctly:

```sql
-- Check that all tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE '%event%'
ORDER BY tablename;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE '%event%';

-- Test the helper function (replace with actual event ID)
SELECT * FROM get_event_stats('your-event-id-here');
```

### Step 3: Test the Functionality

1. **Test Event Registration**
   - Go to an event details page
   - Try registering for the event
   - Verify registration status is saved and displayed

2. **Test Social Features**
   - Try liking an event
   - Add a comment
   - Share an event
   - Follow an event
   - Verify counts update in real-time

## 🗂️ Database Schema Created

### `event_registrations`
```sql
- id (UUID, Primary Key)
- event_id (UUID, Foreign Key → events.id)
- user_id (UUID, Optional)
- attendee_email (TEXT, Required)
- attendee_name (TEXT, Required)
- status (TEXT, Default: 'registered')
- registration_data (JSONB, Optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `event_likes`
```sql
- id (UUID, Primary Key)
- event_id (UUID, Foreign Key → events.id)
- user_email (TEXT, Required)
- user_name (TEXT, Required)
- created_at (TIMESTAMP)
```

### `event_comments`
```sql
- id (UUID, Primary Key)
- event_id (UUID, Foreign Key → events.id)
- user_email (TEXT, Required)
- user_name (TEXT, Required)
- comment_text (TEXT, Required)
- parent_comment_id (UUID, Optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `event_shares`
```sql
- id (UUID, Primary Key)
- event_id (UUID, Foreign Key → events.id)
- user_email (TEXT, Required)
- platform (TEXT, Required)
- created_at (TIMESTAMP)
```

### `event_follows`
```sql
- id (UUID, Primary Key)
- event_id (UUID, Foreign Key → events.id)
- user_email (TEXT, Required)
- user_name (TEXT, Required)
- created_at (TIMESTAMP)
```

## 🔒 Security Policies (RLS)

### For All Tables:
- **Anonymous Users**: Can read (view counts, comments, etc.)
- **Authenticated Users**: Can create, read, update, and delete their own records
- **Data Protection**: Users can only modify their own likes, comments, follows, registrations

### Specific Policies:
- **Registrations**: Users can manage their own registrations
- **Likes/Follows**: Users can like/follow events and remove their own likes/follows  
- **Comments**: Users can post, edit, and delete their own comments
- **Shares**: Anyone can record shares (for analytics)

## 🎯 Features Enabled

### Event Registration System
- ✅ Register for events with status (Going, Interested, Not Going)
- ✅ Update registration status
- ✅ Cancel registrations
- ✅ View attendee counts
- ✅ Ownership-based management access

### Social Interaction Features  
- ✅ Like/Unlike events
- ✅ Follow/Unfollow events for updates
- ✅ Comment on events (with replies support)
- ✅ Share events to social platforms
- ✅ Real-time count updates
- ✅ User-specific interaction states

### Analytics & Insights
- ✅ Track engagement metrics
- ✅ Monitor sharing patterns
- ✅ Analyze user participation
- ✅ Helper function for event statistics

## 🚨 Troubleshooting

### If you get RLS policy errors:
```sql
-- Check current policies
SELECT * FROM pg_policies WHERE tablename LIKE '%event%';

-- If needed, disable RLS temporarily for testing
ALTER TABLE public.event_registrations DISABLE ROW LEVEL SECURITY;
```

### If tables already exist:
The script uses `CREATE TABLE IF NOT EXISTS` so it won't overwrite existing data.

### If you need to reset everything:
```sql
-- WARNING: This will delete all data!
DROP TABLE IF EXISTS public.event_follows CASCADE;
DROP TABLE IF EXISTS public.event_shares CASCADE; 
DROP TABLE IF EXISTS public.event_comments CASCADE;
DROP TABLE IF EXISTS public.event_likes CASCADE;
-- Don't drop event_registrations if it has data you want to keep
```

## ✅ Success Indicators

After setup, you should see:

1. **In Supabase Dashboard**:
   - 5 event-related tables in your database
   - RLS enabled on all tables
   - Proper indexes created

2. **In Your Application**:
   - No more 404/406 database errors
   - Event registration works
   - Social buttons are functional
   - Real-time count updates
   - Proper ownership detection

## 🔧 Files Modified

1. **`supabase_setup.sql`** - Complete database setup script
2. **`events/dcf_event_details.html`** - Re-enabled all social features
3. **`SETUP_INSTRUCTIONS.md`** - This instruction file

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase project URL and API keys
3. Ensure RLS policies are correctly applied
4. Test with both authenticated and anonymous users

The system is now ready for full event management with social features! 🎉