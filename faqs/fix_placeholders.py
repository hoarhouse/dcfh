#!/usr/bin/env python3

with open('deepfakes-misinformation.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix remaining placeholders in Related FAQs section
html = html.replace('[FAQ Title 1]', 'Catholic Church on AI Ethics')
html = html.replace('[FAQ Title 2]', 'Vatican AI Guidelines')
html = html.replace('[FAQ Title 3]', 'Catholic Social Teaching & Technology')

# Fix the descriptions
html = html.replace('Brief description of what this FAQ covers', 'Core principles of Catholic AI ethics')

# Remove the duplicate header section that shouldn't be there
# Find and remove everything from the second occurrence of page-header
import re
# Remove duplicate hero if it exists after the main content
html = re.sub(r'(</div>\s*<!-- Related FAQs Section -->.*?<div class="page-header">.*?</div>)', 
              r'\1', html, flags=re.DOTALL)

with open('deepfakes-misinformation.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Fixed remaining placeholders")
