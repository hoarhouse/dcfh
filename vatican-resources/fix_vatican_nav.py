#!/usr/bin/env python3
"""
Remove hardcoded nav from vatican resource pages.
"""
import re
from pathlib import Path

def fix_file(filepath):
    """Remove hardcoded nav, ensure injection setup"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has injection point
    if 'id="main-header"' in content:
        return False
    
    # Remove hardcoded <nav> block
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
    
    return True

# Process all HTML files in current directory only (not htmldocs subfolder)
count = 0
for filepath in Path('.').glob('*.html'):
    if fix_file(filepath):
        print(f"✅ Fixed: {filepath.name}")
        count += 1
    else:
        print(f"ℹ️  Skipped: {filepath.name} (already has injection)")

print(f"\n✅ Fixed {count} files")
