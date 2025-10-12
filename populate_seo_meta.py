#!/usr/bin/env python3
from supabase import create_client

SUPABASE_URL = "https://atzommnkkwzgbktuzjti.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get all blog posts
response = supabase.table('blog_posts').select('*').execute()
posts = response.data

print(f"Found {len(posts)} posts")
print()

updated = 0
skipped = 0

for post in posts:
    # Check if seo_meta is empty or None
    if not post.get('seo_meta') or not post['seo_meta'].get('title'):
        title = post['title']
        description = post.get('excerpt', '')[:160] if post.get('excerpt') else f"{title[:100]}..."
        
        seo_meta = {
            'title': title,
            'description': description
        }
        
        # Update the post
        supabase.table('blog_posts').update({
            'seo_meta': seo_meta
        }).eq('id', post['id']).execute()
        
        print(f"✅ Updated: {title[:50]}...")
        updated += 1
    else:
        print(f"⏭️  Skipped (already has SEO): {post['title'][:50]}...")
        skipped += 1

print()
print(f"📊 Summary:")
print(f"   Updated: {updated}")
print(f"   Skipped: {skipped}")
print(f"   Total: {len(posts)}")
