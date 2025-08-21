#!/usr/bin/env python3
"""
Fix avatar CSS in all HTML files to ensure they have background colors.
"""

import os
import re
from pathlib import Path

BASE_DIR = Path("/Users/christopherhoar/Desktop/dcfh")

def fix_avatar_css_in_file(file_path):
    """Fix avatar CSS in a single HTML file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # Pattern 1: Fix .user-avatar without background
    pattern1 = r'(\.user-avatar\s*\{[^}]*?)(\n\s*)(width:\s*\d+px;)'
    if '.user-avatar' in content and 'background:' not in content[content.find('.user-avatar'):content.find('.user-avatar') + 500]:
        # Check if this section doesn't have background
        def add_background1(match):
            return match.group(1) + match.group(2) + 'background: linear-gradient(135deg, #000, #333);' + match.group(2) + match.group(3)
        
        new_content = re.sub(pattern1, add_background1, content)
        if new_content != content:
            content = new_content
            modified = True
            print(f"  Added background to .user-avatar")
    
    # Pattern 2: Fix .dropdown-avatar without background
    pattern2 = r'(\.dropdown-avatar\s*\{[^}]*?)(\n\s*)(width:\s*\d+px;)'
    if '.dropdown-avatar' in content and 'background:' not in content[content.find('.dropdown-avatar'):content.find('.dropdown-avatar') + 500] if '.dropdown-avatar' in content else False:
        def add_background2(match):
            return match.group(1) + match.group(2) + 'background: linear-gradient(135deg, #000, #333);' + match.group(2) + match.group(3)
        
        new_content = re.sub(pattern2, add_background2, content)
        if new_content != content:
            content = new_content
            modified = True
            print(f"  Added background to .dropdown-avatar")
    
    # Alternative approach: Add background after border-radius if not present
    if '.user-avatar' in content:
        # Find .user-avatar blocks
        user_avatar_blocks = re.findall(r'\.user-avatar\s*\{[^}]+\}', content, re.DOTALL)
        for block in user_avatar_blocks:
            if 'background:' not in block and 'background-' not in block:
                # Add background after border-radius
                new_block = re.sub(
                    r'(border-radius:[^;]+;)',
                    r'\1\n            background: linear-gradient(135deg, #000, #333);',
                    block
                )
                if new_block != block:
                    content = content.replace(block, new_block)
                    modified = True
                    print(f"  Added background to .user-avatar block")
    
    if '.dropdown-avatar' in content:
        # Find .dropdown-avatar blocks
        dropdown_avatar_blocks = re.findall(r'\.dropdown-avatar\s*\{[^}]+\}', content, re.DOTALL)
        for block in dropdown_avatar_blocks:
            if 'background:' not in block and 'background-' not in block:
                # Add background after border-radius
                new_block = re.sub(
                    r'(border-radius:[^;]+;)',
                    r'\1\n            background: linear-gradient(135deg, #000, #333);',
                    block
                )
                if new_block != block:
                    content = content.replace(block, new_block)
                    modified = True
                    print(f"  Added background to .dropdown-avatar block")
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    print("Fixing avatar CSS in all HTML files...")
    print(f"Base directory: {BASE_DIR}")
    
    # Find all HTML files
    html_files = []
    for folder in ['auth', 'members', 'projects', 'events', 'resources', 'admin', 'public']:
        folder_path = BASE_DIR / folder
        if folder_path.exists():
            html_files.extend(folder_path.glob('*.html'))
    
    # Also check index.html
    index_file = BASE_DIR / 'index.html'
    if index_file.exists():
        html_files.append(index_file)
    
    print(f"Found {len(html_files)} HTML files to check")
    
    fixed_count = 0
    for html_file in html_files:
        print(f"Checking: {html_file.relative_to(BASE_DIR)}")
        if fix_avatar_css_in_file(html_file):
            fixed_count += 1
    
    print(f"\nFixed avatar CSS in {fixed_count} files")

if __name__ == "__main__":
    main()