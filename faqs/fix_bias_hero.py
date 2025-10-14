#!/usr/bin/env python3

with open('ai-bias-fairness.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the hero section placeholders
html = html.replace('<h1 class="page-title">[Your FAQ Title]</h1>', 
                   '<h1 class="page-title">AI Bias & Algorithmic Fairness</h1>')

html = html.replace('<p class="page-subtitle">[Brief description of what this FAQ covers - keep compelling and scannable]</p>',
                   '<p class="page-subtitle">Catholic teaching on preventing discrimination and ensuring justice in AI systems</p>')

with open('ai-bias-fairness.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Fixed hero section")
