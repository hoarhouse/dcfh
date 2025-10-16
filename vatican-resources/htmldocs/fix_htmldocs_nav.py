#!/usr/bin/env python3
import re
from pathlib import Path

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="main-header"' in content:
        return False
    
    nav_pattern = r'<nav class="nav-container">.*?</nav>'
    content = re.sub(nav_pattern, '', content, flags=re.DOTALL)
    
    content = re.sub(
        r'(<body[^>]*>)',
        r'\1\n    <header class="header" id="main-header"></header>\n',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

for filepath in Path('.').glob('*.html'):
    if fix_file(filepath):
        print(f"✅ Fixed: {filepath.name}")
