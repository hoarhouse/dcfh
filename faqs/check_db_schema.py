#!/usr/bin/env python3
"""
Check database schema to understand table structures
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
    print("DATABASE SCHEMA INSPECTION")
    print("=" * 80)
    
    # Check resources table
    print("\n1. RESOURCES TABLE SCHEMA:")
    print("-" * 40)
    try:
        result = supabase.table('resources').select('*').limit(1).execute()
        if result.data and len(result.data) > 0:
            columns = list(result.data[0].keys())
            print(f"Columns: {columns}")
            # Now search for FAQs with correct columns
            result = supabase.table('resources').select('*').or_('slug.ilike.%faq%,title.ilike.%FAQ%').limit(10).execute()
            if result.data:
                print(f"\nFound {len(result.data)} FAQ-related resources:")
                for item in result.data:
                    print(f"  - Title: {item.get('title', 'N/A')[:60]}...")
                    print(f"    Slug: {item.get('slug', 'N/A')}")
                    print(f"    Type: {item.get('type', item.get('resource_type', 'N/A'))}")
            else:
                print("No FAQ resources found")
        else:
            print("Resources table is empty")
    except Exception as e:
        print(f"Error: {e}")
    
    # Check blog_posts table
    print("\n2. BLOG_POSTS TABLE SCHEMA:")
    print("-" * 40)
    try:
        result = supabase.table('blog_posts').select('*').limit(1).execute()
        if result.data and len(result.data) > 0:
            columns = list(result.data[0].keys())
            print(f"Columns: {columns}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Check cms_sections
    print("\n3. CMS_SECTIONS TABLE:")
    print("-" * 40)
    try:
        result = supabase.table('cms_sections').select('*').execute()
        if result.data:
            print(f"Found {len(result.data)} sections:")
            for item in result.data:
                print(f"  - Section: {item.get('section_name')}")
                slugs = item.get('slugs', [])
                if slugs and any('faq' in str(s).lower() for s in slugs):
                    print(f"    FAQ-related slugs: {[s for s in slugs if 'faq' in str(s).lower()]}")
        else:
            print("No sections found")
    except Exception as e:
        print(f"Error: {e}")
    
    # Check for any FAQ-specific tables
    print("\n4. SEARCHING FOR FAQ-SPECIFIC CONTENT:")
    print("-" * 40)
    try:
        # Search in resources description/excerpt
        result = supabase.table('resources').select('title, slug, description').or_('description.ilike.%frequently asked%,excerpt.ilike.%frequently asked%').limit(5).execute()
        if result.data:
            print(f"Resources with FAQ-like descriptions: {len(result.data)}")
            for item in result.data:
                print(f"  - {item.get('title', 'N/A')[:50]}...")
        
        # Search blog posts
        result = supabase.table('blog_posts').select('title, slug').or_('content.ilike.%frequently asked questions%,title.ilike.%FAQ%').limit(5).execute()
        if result.data:
            print(f"\nBlog posts with FAQ content: {len(result.data)}")
            for item in result.data:
                print(f"  - {item.get('title', 'N/A')[:50]}...")
    except Exception as e:
        print(f"Error searching for FAQs: {e}")

if __name__ == "__main__":
    main()