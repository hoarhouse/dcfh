from pathlib import Path
import re

html_dir = Path('/Users/christopherhoar/Desktop/dcfh/vatican-resources')
html_files = [f for f in html_dir.glob('*.html') if not f.name.startswith(('test', 'SAMPLE'))]

print(f"Removing duplicate arrow CSS from {len(html_files)} pages...\n")

for html_file in html_files:
    with open(html_file, 'r') as f:
        content = f.read()
    
    # Find all .lang-dropdown-btn::after blocks
    matches = list(re.finditer(r'\.lang-dropdown-btn::after\s*\{[^}]+\}', content, re.DOTALL))
    
    if len(matches) > 1:
        # Keep the first one, remove the rest
        for match in reversed(matches[1:]):
            content = content[:match.start()] + content[match.end():]
        
        with open(html_file, 'w') as f:
            f.write(content)
        
        print(f"✅ {html_file.name} - removed {len(matches)-1} duplicate(s)")

print(f"\n🎉 All duplicates removed!")
