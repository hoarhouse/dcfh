#!/usr/bin/env python3
"""
Remove hardcoded nav from blog posts and ensure proper injection setup.
"""
import re
import os
from pathlib import Path

def fix_blog_file(filepath):
    """Remove hardcoded nav, ensure injection setup"""
    print(f"Fixing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has injection point
    if 'id="main-header"' in content:
        print(f"  ✅ Already has injection point")
        return False
    
    # Find and remove hardcoded <nav> block
    # Pattern: <nav class="nav-container">...</nav>
    nav_pattern = r'<nav class="nav-container">.*?</nav>'
    content = re.sub(nav_pattern, '', content, flags=re.DOTALL)
    
    # Add injection point after <body>
    content = re.sub(
        r'(<body[^>]*>)',
        r'\1\n    <header class="header" id="main-header"></header>\n',
        content
    )
    
    # Save
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✅ Fixed")
    return True

# Process all blog post HTML files
count = 0
for filepath in Path('.').rglob('*.html'):
    if 'backup' in str(filepath) or 'bak' in str(filepath):
        continue
    if fix_blog_file(filepath):
        count += 1

print(f"\n✅ Fixed {count} files")
