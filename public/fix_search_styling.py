#!/usr/bin/env python3
import re

with open('dcf_ai_resources.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the .search-bar CSS
old_search_css = r'\.search-bar \{[^}]*\}'

new_search_css = '''.search-bar {
            max-width: 600px;
            margin: 2rem auto 0;
            position: relative;
        }'''

content = re.sub(old_search_css, new_search_css, content, flags=re.DOTALL)

# Update search input styling
old_input_css = r'\.search-input \{[^}]*\}'

new_input_css = '''.search-input {
            width: 100%;
            padding: 1rem 3rem 1rem 1.5rem;
            border: 2px solid #e5e5e5;
            border-radius: 50px;
            font-size: 1rem;
            background: #f8f9fa;
            transition: all 0.3s ease;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #333;
            background: white;
        }'''

content = re.sub(old_input_css, new_input_css, content, flags=re.DOTALL)

with open('dcf_ai_resources.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Updated search bar styling")
