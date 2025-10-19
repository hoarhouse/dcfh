#!/usr/bin/env python3
"""
Check for FAQ references in the Supabase database
"""

import os
import sys
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = "https://atzommnkkwzgbktuzjti.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0em9tbW5ra3d6Z2JrdHV6anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzAyMzIsImV4cCI6MjA2ODk0NjIzMn0.9mh2A5A5mLbo408S9g7k76VRzSJE0QWdiYTTOPLEiks"

def main():
    # Initialize Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("=" * 80)
    print("CHECKING FOR FAQs IN DATABASE")
    print("=" * 80)
    
    # STEP 1: Check resources table
    print("\n1. CHECKING RESOURCES TABLE:")
    print("-" * 40)
    try:
        result = supabase.table('resources').select('id, title, slug, resource_type').or_('slug.ilike.%faq%,title.ilike.%FAQ%').limit(20).execute()
        if result.data:
            print(f"Found {len(result.data)} FAQ entries in resources table:")
            for item in result.data:
                print(f"  - ID: {item['id']}, Title: {item['title'][:50]}...")
                print(f"    Slug: {item['slug']}, Type: {item['resource_type']}")
        else:
            print("No FAQ entries found in resources table")
    except Exception as e:
        print(f"Error querying resources table: {e}")
    
    # STEP 2: Check blog_posts table
    print("\n2. CHECKING BLOG_POSTS TABLE:")
    print("-" * 40)
    try:
        result = supabase.table('blog_posts').select('id, title, slug, news_category').or_('slug.ilike.%faq%,title.ilike.%FAQ%').limit(20).execute()
        if result.data:
            print(f"Found {len(result.data)} FAQ entries in blog_posts table:")
            for item in result.data:
                print(f"  - ID: {item['id']}, Title: {item['title'][:50]}...")
                print(f"    Slug: {item['slug']}, Category: {item['news_category']}")
        else:
            print("No FAQ entries found in blog_posts table")
    except Exception as e:
        print(f"Error querying blog_posts table: {e}")
    
    # STEP 3: Check cms_sections table
    print("\n3. CHECKING CMS_SECTIONS TABLE:")
    print("-" * 40)
    try:
        # First check if table exists
        result = supabase.table('cms_sections').select('*').limit(1).execute()
        # If we get here, table exists, now check columns
        if result.data and len(result.data) > 0:
            columns = list(result.data[0].keys())
            print(f"cms_sections columns: {columns}")
            # Search for FAQs in any text field
            text_cols = [col for col in columns if 'title' in col.lower() or 'text' in col.lower() or 'body' in col.lower()]
            if text_cols:
                for col in text_cols:
                    result = supabase.table('cms_sections').select('*').ilike(col, '%faq%').limit(5).execute()
                    if result.data:
                        print(f"Found {len(result.data)} FAQ entries in cms_sections.{col}")
                        for item in result.data[:2]:  # Show first 2
                            print(f"  - {col}: {str(item.get(col))[:100]}...")
        else:
            print("cms_sections table is empty or doesn't exist")
    except Exception as e:
        if "relation" in str(e).lower() and "does not exist" in str(e).lower():
            print("cms_sections table does not exist")
        else:
            print(f"Error querying cms_sections table: {e}")
    
    # STEP 4: List all tables with content fields
    print("\n4. TABLES WITH CONTENT FIELDS:")
    print("-" * 40)
    try:
        # Get all tables first
        result = supabase.rpc('get_tables_with_content_fields', {}).execute()
        print("Tables with content-related fields:")
        for item in result.data:
            print(f"  - {item}")
    except:
        # If RPC doesn't exist, try a different approach
        print("Checking known tables for content fields...")
        tables_to_check = ['resources', 'blog_posts', 'pages', 'sections', 'content']
        for table in tables_to_check:
            try:
                result = supabase.table(table).select('*').limit(1).execute()
                if result.data and len(result.data) > 0:
                    columns = list(result.data[0].keys())
                    content_cols = [col for col in columns if col in ['content', 'description', 'body', 'text', 'html', 'excerpt']]
                    if content_cols:
                        print(f"  - Table '{table}' has content fields: {content_cols}")
            except:
                pass
    
    print("\n" + "=" * 80)
    print("SEARCH COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    main()