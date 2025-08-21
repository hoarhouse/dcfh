#!/usr/bin/env python3
"""
Fix user avatar styling to ensure proper circular shape and appropriate colors
for different login states.
"""

import os
import re
from pathlib import Path

BASE_DIR = Path("/Users/christopherhoar/Desktop/dcfh")

def get_improved_avatar_css():
    """Return improved CSS for avatars."""
    return {
        'user-avatar': """        .user-avatar {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 2px solid rgba(255, 255, 255, 0.1);
            box-sizing: border-box;
            overflow: hidden;
        }""",
        
        'user-avatar-hover': """        .user-avatar:hover {
            transform: scale(1.05);
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }""",
        
        'dropdown-avatar': """        .dropdown-avatar {
            width: 48px;
            height: 48px;
            min-width: 48px;
            min-height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 1rem;
            flex-shrink: 0;
            box-sizing: border-box;
            overflow: hidden;
        }""",
        
        'logged-out-avatar': """        .user-avatar.logged-out {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            border-color: rgba(107, 114, 128, 0.2);
        }
        
        .user-avatar.logged-out:hover {
            border-color: rgba(107, 114, 128, 0.4);
            box-shadow: 0 2px 8px rgba(107, 114, 128, 0.2);
        }"""
    }

def fix_avatar_css_in_file(file_path):
    """Fix avatar CSS in a single HTML file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    improved_css = get_improved_avatar_css()
    
    # Replace .user-avatar CSS block
    user_avatar_pattern = r'\.user-avatar\s*\{[^}]+\}'
    if re.search(user_avatar_pattern, content, re.DOTALL):
        content = re.sub(user_avatar_pattern, improved_css['user-avatar'], content, flags=re.DOTALL)
        modified = True
        print(f"  Updated .user-avatar CSS")
    
    # Replace .user-avatar:hover CSS block
    hover_pattern = r'\.user-avatar:hover\s*\{[^}]+\}'
    if re.search(hover_pattern, content, re.DOTALL):
        content = re.sub(hover_pattern, improved_css['user-avatar-hover'], content, flags=re.DOTALL)
        modified = True
        print(f"  Updated .user-avatar:hover CSS")
    
    # Replace .dropdown-avatar CSS block
    dropdown_pattern = r'\.dropdown-avatar\s*\{[^}]+\}'
    if re.search(dropdown_pattern, content, re.DOTALL):
        content = re.sub(dropdown_pattern, improved_css['dropdown-avatar'], content, flags=re.DOTALL)
        modified = True
        print(f"  Updated .dropdown-avatar CSS")
    
    # Add logged-out state CSS if user-avatar exists but logged-out doesn't
    if '.user-avatar' in content and '.logged-out' not in content:
        # Find where to insert the logged-out CSS (after user-avatar:hover)
        insertion_point = content.find('.user-avatar:hover')
        if insertion_point != -1:
            # Find the end of the hover rule
            brace_count = 0
            i = content.find('{', insertion_point)
            if i != -1:
                i += 1
                while i < len(content) and (brace_count > 0 or content[i] != '}'):
                    if content[i] == '{':
                        brace_count += 1
                    elif content[i] == '}':
                        brace_count -= 1
                    i += 1
                if i < len(content):
                    i += 1  # Move past the closing brace
                    # Find the next line break
                    while i < len(content) and content[i] != '\n':
                        i += 1
                    if i < len(content):
                        i += 1  # Move past the newline
                    
                    # Insert logged-out CSS
                    content = content[:i] + '\n' + improved_css['logged-out-avatar'] + '\n' + content[i:]
                    modified = True
                    print(f"  Added logged-out avatar CSS")
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def update_js_avatar_logic():
    """Update JavaScript to handle avatar states properly."""
    js_file = BASE_DIR / 'js' / 'dcf-master-consolidated.js'
    
    with open(js_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update the updateUserInfo function to handle avatar states better
    old_avatar_logic = """    // Set avatars
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
    
    new_avatar_logic = """    // Set avatars
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
    
    content = content.replace(old_avatar_logic, new_avatar_logic)
    
    # Update dropdown avatar logic too
    old_dropdown_logic = """    if (dropdownAvatarElement) {
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
    
    new_dropdown_logic = """    if (dropdownAvatarElement) {
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
    
    content = content.replace(old_dropdown_logic, new_dropdown_logic)
    
    # Add function to handle logged out state
    logout_function = """
function updateAvatarForLoggedOutState() {
    const avatarElement = document.getElementById('userAvatar');
    if (avatarElement) {
        avatarElement.className = 'user-avatar logged-out';
        avatarElement.textContent = '👤';
        avatarElement.style.backgroundImage = '';
        avatarElement.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
        avatarElement.removeAttribute('onclick');
        avatarElement.style.cursor = 'default';
    }
}

"""
    
    # Insert the function before the main initialization
    content = content.replace('// =============================================================================\n// 9. MAIN INITIALIZATION', logout_function + '// =============================================================================\n// 9. MAIN INITIALIZATION')
    
    # Update the public page auth handling
    old_auth_update = """function updateNavForAuthState(isLoggedIn) {
    const navActions = document.querySelector('.nav-actions') || document.querySelector('.user-menu');
    
    if (navActions) {
        if (!isLoggedIn) {
            navActions.innerHTML = `
                <a href=basePath + 'auth/dcf_login_page.html' class="login-btn" style="color: #333; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px;">Login</a>
                <a href=basePath + 'auth/dcf_profile_signup.html' class="join-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; text-decoration: none; display: inline-block;">Join Us</a>
            `;
        }
    }
}"""
    
    new_auth_update = """function updateNavForAuthState(isLoggedIn) {
    const navActions = document.querySelector('.nav-actions') || document.querySelector('.user-menu');
    
    if (navActions) {
        if (!isLoggedIn) {
            // Update avatar for logged out state
            updateAvatarForLoggedOutState();
            
            navActions.innerHTML = `
                <a href="auth/dcf_login_page.html" class="login-btn" style="color: #333; text-decoration: none; font-size: 0.9rem; padding: 0.5rem 1rem; border-radius: 6px;">Login</a>
                <a href="auth/dcf_profile_signup.html" class="join-btn" style="background: #000; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 6px; font-size: 0.9rem; text-decoration: none; display: inline-block;">Join Us</a>
            `;
        }
    }
}"""
    
    content = content.replace(old_auth_update, new_auth_update)
    
    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Updated JavaScript avatar logic")

def main():
    print("Fixing avatar styling for proper circular shape and colors...")
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
    
    # Update JavaScript
    update_js_avatar_logic()
    
    print(f"\nFixed avatar styling in {fixed_count} HTML files")
    print("Updated JavaScript avatar logic")
    print("\nChanges made:")
    print("- Fixed avatar dimensions with min-width/min-height for perfect circles")
    print("- Added box-sizing: border-box and overflow: hidden")
    print("- Changed color scheme to blue gradient for logged-in users")
    print("- Added gray color scheme for logged-out state")
    print("- Improved hover effects with shadows")
    print("- Fixed backgroundSize to 'cover' for profile images")

if __name__ == "__main__":
    main()