#!/usr/bin/env python3
"""
Fix navigation links in JavaScript files after reorganization.
Updates hardcoded navigation paths to use dynamic path resolution.
"""

import os
import re
from pathlib import Path

BASE_DIR = Path("/Users/christopherhoar/Desktop/dcfh")

def fix_dcf_master_consolidated():
    """Fix navigation in dcf-master-consolidated.js"""
    js_file = BASE_DIR / "js" / "dcf-master-consolidated.js"
    
    with open(js_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # First, we need to make the navigation dynamic based on current location
    # Replace the addNavigationItems function
    old_nav_items = """    const navigationItems = [
        { href: 'dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: 'dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: 'dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: 'dcf_projects.html', icon: '📋', text: 'My Projects' },
        { href: 'dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: 'dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },

    ];"""
    
    new_nav_items = """    // Determine the base path based on current location
    const pathDepth = window.location.pathname.split('/').filter(p => p && p !== 'index.html').length - 1;
    const basePath = pathDepth > 0 ? '../'.repeat(pathDepth) : '';
    
    const navigationItems = [
        { href: basePath + 'members/dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: basePath + 'members/dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: basePath + 'members/dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: basePath + 'projects/dcf_projects.html', icon: '📋', text: 'My Projects' },
        { href: basePath + 'events/dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: basePath + 'members/dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },

    ];"""
    
    content = content.replace(old_nav_items, new_nav_items)
    
    # Fix populateTopNavigation function
    old_member_nav = """    // Member navigation
    const memberNav = [
        { href: 'dcf_member_home.html', text: 'Home' },
        { href: 'dcf_members_directory.html', text: 'Members' },
        { href: 'dcf_projects_home.html', text: 'Projects' },
        { href: 'dcf_events_calendar.html', text: 'Events' },
        { href: 'dcf_resources_library.html', text: 'Resources' },
        { href: 'dcf_contact.html', text: 'Contact' }
    ];"""
    
    new_member_nav = """    // Determine the base path based on current location
    const pathDepth = window.location.pathname.split('/').filter(p => p && p !== 'index.html').length - 1;
    const basePath = pathDepth > 0 ? '../'.repeat(pathDepth) : '';
    
    // Member navigation
    const memberNav = [
        { href: basePath + 'members/dcf_member_home.html', text: 'Home' },
        { href: basePath + 'members/dcf_members_directory.html', text: 'Members' },
        { href: basePath + 'projects/dcf_projects_home.html', text: 'Projects' },
        { href: basePath + 'events/dcf_events_calendar.html', text: 'Events' },
        { href: basePath + 'resources/dcf_resources_library.html', text: 'Resources' },
        { href: basePath + 'public/dcf_contact.html', text: 'Contact' }
    ];"""
    
    content = content.replace(old_member_nav, new_member_nav)
    
    # Fix logout redirect
    old_logout = "window.location.href = 'dcf_login_page.html';"
    new_logout = """// Navigate to login page with proper path
    const pathDepth = window.location.pathname.split('/').filter(p => p && p !== 'index.html').length - 1;
    const basePath = pathDepth > 0 ? '../'.repeat(pathDepth) : '';
    window.location.href = basePath + 'auth/dcf_login_page.html';"""
    
    content = content.replace(old_logout, new_logout)
    
    # Fix public navigation (if exists)
    old_public_nav = """        { href: 'dcf_projects_home.html', text: 'Projects' },
        { href: 'dcf_events_calendar.html', text: 'Events' },
        { href: 'dcf_about.html', text: 'About' },
        { href: 'dcf_contact.html', text: 'Contact' }"""
    
    new_public_nav = """        { href: basePath + 'projects/dcf_projects_home.html', text: 'Projects' },
        { href: basePath + 'events/dcf_events_calendar.html', text: 'Events' },
        { href: basePath + 'public/dcf_about.html', text: 'About' },
        { href: basePath + 'public/dcf_contact.html', text: 'Contact' }"""
    
    content = content.replace(old_public_nav, new_public_nav)
    
    # Fix any remaining standalone references in the navigation context
    navigation_fixes = {
        "'dcf_login_page.html'": "basePath + 'auth/dcf_login_page.html'",
        '"dcf_login_page.html"': "basePath + 'auth/dcf_login_page.html'",
        "'dcf_profile_signup.html'": "basePath + 'auth/dcf_profile_signup.html'",
        '"dcf_profile_signup.html"': "basePath + 'auth/dcf_profile_signup.html'",
    }
    
    # Apply fixes only in navigation contexts
    for old, new in navigation_fixes.items():
        if old in content and "basePath +" not in content.split(old)[0][-50:]:
            # Check context to avoid replacing already fixed items
            content = content.replace(old, new)
    
    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {js_file}")

def fix_universal_navbar():
    """Fix navigation in universal-navbar.js"""
    js_file = BASE_DIR / "js" / "universal-navbar.js"
    
    if not js_file.exists():
        print(f"Skipping: {js_file} (not found)")
        return
    
    with open(js_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace navigation items
    old_nav = """    const navigationItems = [
        { href: 'dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: 'dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: 'dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: 'dcf_projects_home.html', icon: '📋', text: 'My Projects' },
        { href: 'dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: 'dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },
        { href: 'dcf_account_settings.html', icon: '⚙️', text: 'Settings' }
    ];"""
    
    new_nav = """    // Determine the base path based on current location
    const pathDepth = window.location.pathname.split('/').filter(p => p && p !== 'index.html').length - 1;
    const basePath = pathDepth > 0 ? '../'.repeat(pathDepth) : '';
    
    const navigationItems = [
        { href: basePath + 'members/dcf_member_home.html', icon: '🏠', text: 'My Feed' },
        { href: basePath + 'members/dcf_member_profile.html', icon: '👤', text: 'My Profile' },
        { href: basePath + 'members/dcf_members_directory.html', icon: '👥', text: 'My Connections' },
        { href: basePath + 'projects/dcf_projects_home.html', icon: '📋', text: 'My Projects' },
        { href: basePath + 'events/dcf_events_calendar.html', icon: '📅', text: 'My Events' },
        { href: basePath + 'members/dcf_personal_analytics.html', icon: '📊', text: 'My Stats' },
        { href: basePath + 'members/dcf_account_settings.html', icon: '⚙️', text: 'Settings' }
    ];"""
    
    content = content.replace(old_nav, new_nav)
    
    # Fix logout redirect
    old_logout = "window.location.href = 'dcf_login_page.html';"
    new_logout = """// Navigate to login page with proper path
        const pathDepth = window.location.pathname.split('/').filter(p => p && p !== 'index.html').length - 1;
        const basePath = pathDepth > 0 ? '../'.repeat(pathDepth) : '';
        window.location.href = basePath + 'auth/dcf_login_page.html';"""
    
    content = content.replace(old_logout, new_logout)
    
    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {js_file}")

def fix_quickactions():
    """Fix navigation in quickactions.js"""
    js_file = BASE_DIR / "js" / "quickactions.js"
    
    if not js_file.exists():
        print(f"Skipping: {js_file} (not found)")
        return
    
    with open(js_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add dynamic path resolution at the beginning of the config
    new_header = """// Quick Actions Configuration for DCF Hungary
// Edit this file to modify quick actions for any page

// Dynamic path resolution
function getBasePath() {
    const pathDepth = window.location.pathname.split('/').filter(p => p && p !== 'index.html').length - 1;
    return pathDepth > 0 ? '../'.repeat(pathDepth) : '';
}

const basePath = getBasePath();

"""
    
    # Replace the header
    old_header = """// Quick Actions Configuration for DCF Hungary
// Edit this file to modify quick actions for any page

"""
    
    content = content.replace(old_header, new_header)
    
    # Update all action paths
    path_replacements = {
        "'dcf_create_project.html'": "basePath + 'projects/dcf_create_project.html'",
        "'dcf_projects.html'": "basePath + 'projects/dcf_projects.html'",
        "'dcf_projects_home.html'": "basePath + 'projects/dcf_projects_home.html'",
        "'dcf_project_detail.html'": "basePath + 'projects/dcf_project_detail.html'",
        "'dcf_create_event.html'": "basePath + 'events/dcf_create_event.html'",
        "'dcf_events.html'": "basePath + 'events/dcf_events.html'",
        "'dcf_events_home.html'": "basePath + 'events/dcf_events_home.html'",
        "'dcf_events_calendar.html'": "basePath + 'events/dcf_events_calendar.html'",
        "'dcf_event_analytics.html'": "basePath + 'events/dcf_event_analytics.html'",
        "'dcf_member_home.html'": "basePath + 'members/dcf_member_home.html'",
        "'dcf_member_profile.html'": "basePath + 'members/dcf_member_profile.html'",
        "'dcf_profile_dashboard.html'": "basePath + 'members/dcf_profile_dashboard.html'",
        "'dcf_personal_analytics.html'": "basePath + 'members/dcf_personal_analytics.html'",
        "'dcf_messages.html'": "basePath + 'members/dcf_messages.html'",
        "'dcf_notifications.html'": "basePath + 'members/dcf_notifications.html'",
        "'dcf_resources_library.html'": "basePath + 'resources/dcf_resources_library.html'",
        "'dcf_upload_resource.html'": "basePath + 'resources/dcf_upload_resource.html'",
        "'dcf_admin_dashboard.html'": "basePath + 'admin/dcf_admin_dashboard.html'",
        "'dcf_admin_members.html'": "basePath + 'admin/dcf_admin_members.html'",
        "'dcf_admin_analytics.html'": "basePath + 'admin/dcf_admin_analytics.html'",
        "'dcf_admin_settings.html'": "basePath + 'admin/dcf_admin_settings.html'",
        "'dcf_admin_messaging.html'": "basePath + 'admin/dcf_admin_messaging.html'",
        "'dcf_admin_security.html'": "basePath + 'admin/dcf_admin_security.html'",
    }
    
    for old, new in path_replacements.items():
        content = content.replace(f"action: {old}", f"action: {new}")
    
    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {js_file}")

def main():
    print("Fixing navigation links in JavaScript files...")
    print(f"Base directory: {BASE_DIR}")
    
    fix_dcf_master_consolidated()
    fix_universal_navbar()
    fix_quickactions()
    
    print("\nNavigation fixes complete!")
    print("All navigation links now use dynamic path resolution based on current location.")

if __name__ == "__main__":
    main()