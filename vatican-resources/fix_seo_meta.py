import os
import re
from pathlib import Path

# Get all HTML files
html_files = list(Path('.').glob('*.html'))

print(f"Found {len(html_files)} HTML files to fix\n")

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Update og:url from /resources/ to /vatican-resources/
    content = content.replace(
        'https://hoarhouse.github.io/dcfh/resources/',
        'https://hoarhouse.github.io/dcfh/vatican-resources/'
    )
    
    # Fix 2: Update canonical URL
    content = re.sub(
        r'<link rel="canonical" href="https://hoarhouse\.github\.io/dcfh/resources/',
        '<link rel="canonical" href="https://hoarhouse.github.io/dcfh/vatican-resources/',
        content
    )
    
    # Fix 3: Add default OG image if missing
    if 'og:image' not in content:
        # Add after og:site_name
        content = content.replace(
            '<meta property="og:site_name" content="DCF Hungary">',
            '''<meta property="og:site_name" content="DCF Hungary">
    <meta property="og:image" content="https://hoarhouse.github.io/dcfh/images/dcf-vatican-resources-og.jpg">'''
        )
    
    # Write back
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed: {html_file.name}")

print("\n🎉 All files updated! Now commit and push via GitHub Desktop.")
