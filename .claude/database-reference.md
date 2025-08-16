# DCF Hungary - Complete Database Reference

## Overview
- **Database Type**: Supabase PostgreSQL
- **Total Tables**: 29
- **Storage Buckets**: 5
- **All data stored in Supabase only** - NO localStorage, sessionStorage, or other storage systems

## Supabase Connection Details
```javascript
const SUPABASE_URL = 'https://atzommnkkwzgbktuzjti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks';

// Client initialization:
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

## Core Tables

### user_profiles
The main user table - all user information
```sql
- id (uuid, PK)
- email (text, unique)
- username (varchar)
- name (text)
- avatar_url (text)
- created_at (timestamp)
```

### posts
Main content posts in the community feed
```sql
- id (uuid, PK)
- content (text)
- media_url (text) ← Single URL, not plural
- media_type (text)
- created_at (timestamp)
- username (varchar) ← NOT author_email
- status (text)
- like_count (integer)
- comment_count (integer)
- view_count (integer)
- author_id (uuid, FK → user_profiles.id)
```

### post_comments
Comments on posts
```sql
- id (uuid, PK)
- post_id (uuid, FK → posts.id)
- content (text) ← NOT ccontent
- created_at (timestamp)
- username (varchar) ← Match posts by username
- parent_id (uuid, FK → post_comments.id)
- like_count (integer)
- user_id (uuid, FK → user_profiles.id)
```

### notifications
User notifications system
```sql
- id (uuid, PK)
- type (text) ← 'post_like', 'post_comment', 'connection_request'
- title (text)
- message (text)
- recipient_email (text) ← Use for filtering user notifications
- recipient_name (text)
- sender_email (text)
- sender_name (text)
- related_id (uuid) ← ID of related post/event/etc
- related_type (text) ← 'post', 'event', 'project'
- is_read (boolean, default: false)
- created_at (timestamp)
- sender_username (varchar)
- recipient_username (varchar)
```

---

## Engagement Tables

### post_likes
Likes on posts
```sql
- id (uuid, PK)
- post_id (uuid, FK → posts.id)
- user_email (text) ← NOT user_id
- user_name (text)
- created_at (timestamp)
```

### comment_likes
Likes on comments
```sql
- id (uuid, PK)
- comment_id (uuid, FK → post_comments.id)
- user_email (text)
- user_name (text)
- created_at (timestamp)
```

### connections
User connections/friendships
```sql
- id (uuid, PK)
- requester_id (uuid, FK → user_profiles.id)
- recipient_id (uuid, FK → user_profiles.id)
- status (varchar, default: 'pending')
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Events System

### events
Main events table
```sql
- id (uuid, PK)
- title (text)
- description (text)
- category (text)
- event_type (text)
- visibility (text, default: 'public')
- event_date (date)
- start_time (time)
- timezone (text, default: 'UTC')
- location (text)
- meeting_link (text)
- additional_instructions (text)
- max_attendees (integer)
- requires_registration (boolean, default: true)
- target_audience (text)
- topics (ARRAY)
- additional_resources (text)
- organizer_notes (text)
- contact_email (text)
- organizer_id (uuid, FK → user_profiles.id)
- created_at (timestamp)
- updated_at (timestamp)
- status (text, default: 'active')
- featured (boolean, default: false)
- image_urls (ARRAY) ← Array of image URLs
- duration_hours (integer)
```

### event_registrations
Event sign-ups
```sql
- id (uuid, PK)
- event_id (uuid, FK → events.id)
- user_id (uuid, FK → user_profiles.id)
- attendee_name (text)
- attendee_email (text)
- organization (text)
- role (text)
- experience_level (text)
- interests (text)
- registered_at (timestamp)
- status (text, default: 'registered')
```

### event_comments, event_likes, event_follows, event_shares
Similar structures to post engagement tables, but for events

---

## Projects System

### projects
Main projects table
```sql
- id (uuid, PK)
- title (text)
- description (text)
- category (text)
- status (text)
- author_id (uuid, FK → user_profiles.id)
- created_at (timestamp)
- updated_at (timestamp)
- [Additional project fields from full schema]
```

### project_members
Project team members
```sql
- id (uuid, PK)
- project_id (uuid, FK → projects.id)
- user_id (uuid, FK → user_profiles.id)
- role (text)
- joined_at (timestamp)
```

### project_join_requests, project_follows, project_activity, project_files, project_metrics, project_tasks
Supporting project tables

---

## Resources System

### resources
Resource library items
```sql
- id (uuid, PK)
- title (text)
- description (text)
- category (text)
- file_url (text)
- author_id (uuid, FK → user_profiles.id)
- created_at (timestamp)
- [Additional resource fields]
```

### resource_bookmarks, resource_comments, resource_ratings, resource_downloads, resource_analytics, resource_daily_stats, resource_stats_view
Supporting resource tables

---

## Storage Buckets

### Supabase Storage Buckets
1. **media** - General media files (public)
2. **avatars** - User profile pictures (public, 2MB limit, images only)
3. **project-files** - Project attachments (public)
4. **resource-files** - Resource library files (public)
5. **resource-thumbnails** - Thumbnail images for resources (public)

---

## Key Patterns & Rules

### ⚠️ CRITICAL NAMING CONVENTIONS

1. **Posts Table**:
   - Use `media_url` (singular) NOT `media_urls`
   - Use `username` NOT `author_email`
   - Use `content` NOT `ccontent`

2. **Comments Table**:
   - Table name: `post_comments` NOT `comments`
   - Use `content` NOT `ccontent`
   - Match with posts by `username` field

3. **User Matching**:
   - Posts: Match by `username` field
   - Comments: Match by `username` field
   - Notifications: Filter by `recipient_email`

4. **Foreign Keys**:
   - Always use UUID references
   - Most tables link back to `user_profiles.id`
   - Comments link to parent posts/comments via `parent_id`

### 🚫 WHAT NOT TO USE
- NO localStorage, sessionStorage, or browser storage
- NO `author_email` field (use `username`)
- NO `media_urls` plural (use `media_url` singular)
- NO direct SQL - always use Supabase client methods

### ✅ SUPABASE QUERY PATTERNS
```javascript
// Correct patterns:
await supabase.from('posts').select('*').eq('username', user.username)
await supabase.from('notifications').select('*').eq('recipient_email', user.email)
await supabase.from('post_comments').select('*').eq('post_id', postId)

// Media URLs - handle as JSON array in single column:
const images = JSON.parse(post.media_url || '[]')
```

---

## Last Updated
August 16, 2025 - Based on current production database structure