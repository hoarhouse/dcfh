#!/usr/bin/env python3
import os
import re

# Get the correct header from template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    template = f.read()

# Extract everything from <!DOCTYPE html> to </head>
head_match = re.search(r'(<!DOCTYPE html>.*?</head>)', template, re.DOTALL)
if not head_match:
    print("❌ Could not extract head from template")
    exit(1)

correct_head = head_match.group(1)

# Extract the correct header HTML (empty header that dcf-ui.js fills)
header_match = re.search(r'(<header class="header" id="main-header"></header>)', template)
if not header_match:
    print("❌ Could not extract header from template")
    exit(1)

correct_header = header_match.group(1)

# Extract the correct scripts at the bottom
scripts_match = re.search(r'(<script src="https://cdn\.jsdelivr\.net/npm/@supabase.*?</body>\s*</html>)', template, re.DOTALL)
if not scripts_match:
    print("❌ Could not extract scripts from template")
    exit(1)

correct_scripts = scripts_match.group(1)

# Get all HTML files except template, index, and deepfakes (which is correct)
files_to_fix = [f for f in os.listdir('.') if f.endswith('.html') 
                and f not in ['_FAQ_TEMPLATE.html', 'index.html', 'deepfakes-misinformation.html']]

print(f"Found {len(files_to_fix)} FAQ pages to fix")

for filename in files_to_fix:
    print(f"\n🔧 Fixing {filename}...")
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace everything before <body> with correct head from template
        # But preserve the specific title and description
        title_match = re.search(r'<title>(.*?)</title>', content)
        desc_match = re.search(r'<meta name="description" content="(.*?)"', content)
        
        if title_match:
            page_title = title_match.group(1)
        else:
            page_title = "Catholic Church FAQ"
            
        if desc_match:
            page_desc = desc_match.group(1)
        else:
            page_desc = "Catholic teaching on AI and technology"
        
        # Build new head with preserved title/desc
        new_head = correct_head
        new_head = re.sub(r'<title>.*?</title>', f'<title>{page_title}</title>', new_head)
        new_head = re.sub(r'<meta name="description" content=".*?"', f'<meta name="description" content="{page_desc}"', new_head)
        
        # Replace from <!DOCTYPE to </head>
        content = re.sub(r'<!DOCTYPE html>.*?</head>', new_head, content, flags=re.DOTALL)
        
        # Replace the header element (after <body> tag)
        # Find any existing header and replace with correct one
        content = re.sub(r'<header.*?</header>', correct_header, content, flags=re.DOTALL)
        
        # Replace scripts at bottom (from supabase script to end)
        content = re.sub(r'<script src="https://cdn\.jsdelivr\.net/npm/@supabase.*?</html>', correct_scripts, content, flags=re.DOTALL)
        
        # Write back
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✅ Fixed {filename}")
        
    except Exception as e:
        print(f"  ❌ Error fixing {filename}: {e}")

print("\n✅ All FAQ pages processed")
