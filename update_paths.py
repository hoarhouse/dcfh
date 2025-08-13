#!/usr/bin/env python3
"""
Update all HTML file paths after reorganization into folders.
This script updates:
1. Script src paths to point to js/ folder
2. Internal HTML links to use correct relative paths
3. Handles different depth levels (root, one folder deep, etc.)
"""

import os
import re
from pathlib import Path

# Define the base directory
BASE_DIR = Path("/Users/christopherhoar/Desktop/dcfh")

# Mapping of old filenames to new paths relative to root
FILE_MAPPING = {
    # Auth files
    "dcf_login_page.html": "auth/dcf_login_page.html",
    "dcf_profile_signup.html": "auth/dcf_profile_signup.html",
    "dcf_email_confirm.html": "auth/dcf_email_confirm.html",
    "auth-callback.html": "auth/auth-callback.html",
    "dcf_user_onboarding.html": "auth/dcf_user_onboarding.html",
    
    # Member files
    "dcf_member_home.html": "members/dcf_member_home.html",
    "dcf_member_profile.html": "members/dcf_member_profile.html",
    "dcf_member_view.html": "members/dcf_member_view.html",
    "dcf_members_directory.html": "members/dcf_members_directory.html",
    "dcf_profile_dashboard.html": "members/dcf_profile_dashboard.html",
    "dcf_personal_analytics.html": "members/dcf_personal_analytics.html",
    "dcf_private_messaging.html": "members/dcf_private_messaging.html",
    "dcf_notifications.html": "members/dcf_notifications.html",
    "dcf_discussion_forums.html": "members/dcf_discussion_forums.html",
    
    # Project files
    "dcf_projects.html": "projects/dcf_projects.html",
    "dcf_projects_home.html": "projects/dcf_projects_home.html",
    "dcf_projects_public.html": "projects/dcf_projects_public.html",
    "dcf_project_detail.html": "projects/dcf_project_detail.html",
    "dcf_project_manage.html": "projects/dcf_project_manage.html",
    "dcf_project_created.html": "projects/dcf_project_created.html",
    "dcf_project_chat.html": "projects/dcf_project_chat.html",
    "dcf_create_project.html": "projects/dcf_create_project.html",
    
    # Event files
    "dcf_events_calendar.html": "events/dcf_events_calendar.html",
    "dcf_events_public.html": "events/dcf_events_public.html",
    "dcf_event_details.html": "events/dcf_event_details.html",
    "dcf_event_manage.html": "events/dcf_event_manage.html",
    "dcf_create_event.html": "events/dcf_create_event.html",
    
    # Resource files
    "dcf_resources_library.html": "resources/dcf_resources_library.html",
    "dcf_resource_detail.html": "resources/dcf_resource_detail.html",
    "dcf_resource_upload.html": "resources/dcf_resource_upload.html",
    
    # Admin files
    "dcf_admin_dashboard.html": "admin/dcf_admin_dashboard.html",
    
    # Public/utility files
    "dcf_about.html": "public/dcf_about.html",
    "dcf_contact.html": "public/dcf_contact.html",
    "dcf_newsletter.html": "public/dcf_newsletter.html",
    "dcf_impact_report.html": "public/dcf_impact_report.html",
    "dcf_sitemap.html": "public/dcf_sitemap.html",
    "dcf_search_results.html": "public/dcf_search_results.html",
    "dcf_advanced_search.html": "public/dcf_advanced_search.html",
    "db-diagnostic.html": "public/db-diagnostic.html",
    
    # Root level
    "index.html": "index.html"
}

# JavaScript file mapping
JS_FILES = {
    "supabase-auth.js": "js/supabase-auth.js",
    "dcf-master-consolidated.js": "js/dcf-master-consolidated.js",
    "notification-system.js": "js/notification-system.js",
    "universal-navbar.js": "js/universal-navbar.js",
    "universal-footer.js": "js/universal-footer.js",
    "universal-quick-actions.js": "js/universal-quick-actions.js",
    "quickactions.js": "js/quickactions.js"
}

def get_relative_path(from_file, to_file):
    """Calculate relative path from one file to another."""
    from_path = Path(from_file).parent
    to_path = Path(to_file)
    
    # If we're in root and targeting root, just return filename
    if from_path == Path('.') and to_path.parent == Path('.'):
        return to_path.name
    
    # Calculate relative path
    try:
        rel_path = os.path.relpath(to_path, from_path)
        # Convert backslashes to forward slashes for web paths
        return rel_path.replace('\\', '/')
    except ValueError:
        # If on different drives on Windows, return absolute path
        return '/' + str(to_path).replace('\\', '/')

def update_html_file(file_path):
    """Update a single HTML file with new paths."""
    print(f"Processing: {file_path}")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get the relative position of this file
    rel_file_path = Path(file_path).relative_to(BASE_DIR)
    
    # Update JavaScript src paths
    for old_js, new_js in JS_FILES.items():
        # Match various script src patterns
        patterns = [
            f'src="{old_js}"',
            f"src='{old_js}'",
            f'src={old_js}',
        ]
        
        for pattern in patterns:
            if pattern in content:
                new_path = get_relative_path(rel_file_path, new_js)
                new_pattern = f'src="{new_path}"'
                content = content.replace(pattern, new_pattern)
                print(f"  Updated JS: {old_js} -> {new_path}")
    
    # Update HTML href and action links
    for old_html, new_html in FILE_MAPPING.items():
        # Skip self-references
        if str(rel_file_path) == new_html:
            continue
            
        # Match various href patterns
        patterns = [
            f'href="{old_html}"',
            f"href='{old_html}'",
            f'action="{old_html}"',
            f"action='{old_html}'",
            f'window.location.href = "{old_html}"',
            f"window.location.href = '{old_html}'",
            f'window.location.href="{old_html}"',
            f"window.location.href='{old_html}'",
            f'window.location = "{old_html}"',
            f"window.location = '{old_html}'",
        ]
        
        for pattern in patterns:
            if pattern in content:
                new_path = get_relative_path(rel_file_path, new_html)
                # Preserve the pattern structure
                if 'href=' in pattern:
                    if '"' in pattern:
                        new_pattern = f'href="{new_path}"'
                    else:
                        new_pattern = f"href='{new_path}'"
                elif 'action=' in pattern:
                    if '"' in pattern:
                        new_pattern = f'action="{new_path}"'
                    else:
                        new_pattern = f"action='{new_path}'"
                elif 'window.location.href' in pattern:
                    if ' = ' in pattern:
                        if '"' in pattern:
                            new_pattern = f'window.location.href = "{new_path}"'
                        else:
                            new_pattern = f"window.location.href = '{new_path}'"
                    else:
                        if '"' in pattern:
                            new_pattern = f'window.location.href="{new_path}"'
                        else:
                            new_pattern = f"window.location.href='{new_path}'"
                elif 'window.location = ' in pattern:
                    if '"' in pattern:
                        new_pattern = f'window.location = "{new_path}"'
                    else:
                        new_pattern = f"window.location = '{new_path}'"
                
                content = content.replace(pattern, new_pattern)
                print(f"  Updated link: {old_html} -> {new_path}")
    
    # Write the updated content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    """Main function to update all HTML files."""
    print("Starting path updates...")
    print(f"Base directory: {BASE_DIR}")
    
    # Find all HTML files in the new structure
    html_files = []
    for folder in ['auth', 'members', 'projects', 'events', 'resources', 'admin', 'public']:
        folder_path = BASE_DIR / folder
        if folder_path.exists():
            html_files.extend(folder_path.glob('*.html'))
    
    # Also process index.html at root
    index_file = BASE_DIR / 'index.html'
    if index_file.exists():
        html_files.append(index_file)
    
    print(f"Found {len(html_files)} HTML files to process")
    
    # Process each file
    for html_file in html_files:
        update_html_file(html_file)
    
    print("\nPath updates complete!")
    print("\nSummary:")
    print(f"- Processed {len(html_files)} HTML files")
    print("- Updated JavaScript src paths to point to js/ folder")
    print("- Updated internal HTML links to use correct relative paths")

if __name__ == "__main__":
    main()