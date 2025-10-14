#!/usr/bin/env python3
import re

# Read current broken file
with open('deepfakes-misinformation.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the hero section - find and replace
content = re.sub(
    r'<h1 class="page-title">\[Your FAQ Title\]</h1>',
    '<h1 class="page-title">Deepfakes, Misinformation & Truth</h1>',
    content
)

content = re.sub(
    r'<p class="page-subtitle">\[Brief description.*?\]</p>',
    '<p class="page-subtitle">Catholic response to AI deception and protecting reality in the digital age</p>',
    content
)

# Remove ALL the template placeholder sections
# Find from "<!-- FAQ Section 1 -->" with "Section 1: Topic Name" to "<!-- Related FAQs Section -->"
template_section_pattern = r'<!-- FAQ Section 1 -->.*?<h2>Section 1: Topic Name</h2>.*?<!-- Related FAQs Section -->'
content = re.sub(template_section_pattern, '', content, flags=re.DOTALL)

# Now the real FAQ sections should still be there from the previous script
# Just need to verify they're properly positioned

# Write back
with open('deepfakes-misinformation.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed hero section and removed template placeholders")
