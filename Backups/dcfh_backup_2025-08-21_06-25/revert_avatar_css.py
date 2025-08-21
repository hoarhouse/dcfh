#!/usr/bin/env python3
"""
URGENT: Revert all avatar styling changes back to original working version.
Restore the exact original CSS that was working before reorganization.
"""

import os
import re
from pathlib import Path

BASE_DIR = Path("/Users/christopherhoar/Desktop/dcfh")

def get_original_avatar_css():
    """Return the original working avatar CSS."""
    return {
        'user-avatar': """        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #000, #333);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 2px solid transparent;
        }""",
        
        'user-avatar-hover': """        .user-avatar:hover {
            transform: scale(1.05);
            border-color: rgba(255, 255, 255, 0.2);
        }""",
        
        'dropdown-avatar': """        .dropdown-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #000, #333);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
            flex-shrink: 0;
        }"""
    }

def revert_avatar_css_in_file(file_path):
    """Revert avatar CSS in a single HTML file to original working version."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    original_css = get_original_avatar_css()
    
    # Replace .user-avatar CSS block
    user_avatar_pattern = r'\.user-avatar\s*\{[^}]+\}'
    if re.search(user_avatar_pattern, content, re.DOTALL):
        content = re.sub(user_avatar_pattern, original_css['user-avatar'], content, flags=re.DOTALL)
        modified = True
        print(f"  Reverted .user-avatar CSS")
    
    # Replace .user-avatar:hover CSS block
    hover_pattern = r'\.user-avatar:hover\s*\{[^}]+\}'
    if re.search(hover_pattern, content, re.DOTALL):
        content = re.sub(hover_pattern, original_css['user-avatar-hover'], content, flags=re.DOTALL)
        modified = True
        print(f"  Reverted .user-avatar:hover CSS")
    
    # Replace .dropdown-avatar CSS block
    dropdown_pattern = r'\.dropdown-avatar\s*\{[^}]+\}'
    if re.search(dropdown_pattern, content, re.DOTALL):
        content = re.sub(dropdown_pattern, original_css['dropdown-avatar'], content, flags=re.DOTALL)
        modified = True
        print(f"  Reverted .dropdown-avatar CSS")
    
    # Remove any logged-out avatar CSS that was added
    logged_out_pattern = r'\.user-avatar\.logged-out\s*\{[^}]+\}\s*\.user-avatar\.logged-out:hover\s*\{[^}]+\}'
    if re.search(logged_out_pattern, content, re.DOTALL):
        content = re.sub(logged_out_pattern, '', content, flags=re.DOTALL)
        modified = True
        print(f"  Removed logged-out avatar CSS")
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def revert_js_avatar_logic():
    """Revert JavaScript avatar logic to original working version."""
    js_file = BASE_DIR / 'js' / 'dcf-master-consolidated.js'
    
    with open(js_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Revert the avatar logic to original working version
    new_avatar_logic = """    // Set avatars
    if (avatarElement) {
        if (avatarUrl) {
            avatarElement.className = 'dropdown-avatar';
            avatarElement.style.backgroundImage = `url(${avatarUrl})`;
            avatarElement.textContent = '';
        } else {
            avatarElement.textContent = initials;
            avatarElement.style.backgroundImage = '';
            avatarElement.style.background = 'linear-gradient(135deg, #000, #333)';
        }
    }"""
    
    current_avatar_logic = """    // Set avatars
    if (avatarElement) {
        if (avatarUrl) {
            avatarElement.className = 'user-avatar';
            avatarElement.style.backgroundImage = `url(${avatarUrl})`;
            avatarElement.style.backgroundSize = 'cover';
            avatarElement.style.backgroundPosition = 'center';
            avatarElement.textContent = '';
        } else {
            avatarElement.className = 'user-avatar';
            avatarElement.textContent = initials || '?';
            avatarElement.style.backgroundImage = '';
            avatarElement.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
        }
    }"""
    
    content = content.replace(current_avatar_logic, new_avatar_logic)
    
    # Revert dropdown avatar logic
    new_dropdown_logic = """    if (dropdownAvatarElement) {
        if (avatarUrl) {
            dropdownAvatarElement.style.backgroundImage = `url(${avatarUrl})`;
            dropdownAvatarElement.style.backgroundSize = 'contain';
            dropdownAvatarElement.style.backgroundPosition = 'center';
            dropdownAvatarElement.textContent = '';
        } else {
            dropdownAvatarElement.textContent = initials;
            dropdownAvatarElement.style.backgroundImage = '';
            dropdownAvatarElement.style.background = 'linear-gradient(135deg, #000, #333)';
        }
    }"""
    
    current_dropdown_logic = """    if (dropdownAvatarElement) {
        if (avatarUrl) {
            dropdownAvatarElement.style.backgroundImage = `url(${avatarUrl})`;
            dropdownAvatarElement.style.backgroundSize = 'cover';
            dropdownAvatarElement.style.backgroundPosition = 'center';
            dropdownAvatarElement.textContent = '';
        } else {
            dropdownAvatarElement.textContent = initials || '?';
            dropdownAvatarElement.style.backgroundImage = '';
            dropdownAvatarElement.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
        }
    }"""
    
    content = content.replace(current_dropdown_logic, new_dropdown_logic)
    
    # Remove the updateAvatarForLoggedOutState function and its call
    logout_function_pattern = r'\nfunction updateAvatarForLoggedOutState\(\) \{[^}]*\n\}\n'
    content = re.sub(logout_function_pattern, '', content, flags=re.DOTALL)
    
    # Remove call to updateAvatarForLoggedOutState
    content = content.replace('            updateAvatarForLoggedOutState();\n            \n            ', '')
    
    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Reverted JavaScript avatar logic to original")

def main():
    print("URGENT: Reverting avatar styling back to original working version...")
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
    
    print(f"Found {len(html_files)} HTML files to revert")
    
    reverted_count = 0
    for html_file in html_files:
        print(f"Reverting: {html_file.relative_to(BASE_DIR)}")
        if revert_avatar_css_in_file(html_file):
            reverted_count += 1
    
    # Revert JavaScript
    revert_js_avatar_logic()
    
    print(f"\nReverted avatar styling in {reverted_count} HTML files")
    print("Reverted JavaScript avatar logic")
    print("\nChanges reverted:")
    print("- Restored original black gradient background (#000 to #333)")
    print("- Removed min-width/min-height constraints")
    print("- Removed box-sizing and overflow properties")
    print("- Removed blue color scheme")
    print("- Removed logged-out state styling")
    print("- Restored original hover effects")
    print("- Fixed JavaScript avatar logic")

if __name__ == "__main__":
    main()