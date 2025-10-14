#!/usr/bin/env python3
import re

with open('deepfakes-misinformation.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find and fix the hero section at the top
html = re.sub(
    r'<h1 class="page-title">\[Your FAQ Title\]</h1>',
    '<h1 class="page-title">Deepfakes, Misinformation & Truth</h1>',
    html
)

html = re.sub(
    r'<p class="page-subtitle">\[Core principles of Catholic AI ethics - keep compelling and scannable\]</p>',
    '<p class="page-subtitle">Catholic response to AI deception and protecting reality in the digital age</p>',
    html
)

with open('deepfakes-misinformation.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Fixed hero header")
