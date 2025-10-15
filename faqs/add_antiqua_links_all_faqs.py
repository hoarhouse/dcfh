#!/usr/bin/env python3
"""Add links to Antiqua et Nova document across all FAQ pages"""

import glob

# List of FAQ files that mention Antiqua et Nova
faq_files = [
    'ai-bias-fairness.html',
    'ai-consciousness-souls.html', 
    'ai-healthcare.html',
    'ai-jobs-catholic-teaching.html',
    'ai-privacy-surveillance.html',
    'ai-warfare-weapons.html',
    'catholic-ai-ethics.html',
    'deepfakes-misinformation.html'
]

links_added = 0

for filename in faq_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Add link after first mention of "Antiqua et Nova" in body content (not schema)
    # Pattern: "Antiqua et Nova" -> "Antiqua et Nova" <a href...>Read the full document</a>
    
    # Find first occurrence in body (after line 500 to skip schema)
    lines = content.split('\n')
    modified = False
    
    for i, line in enumerate(lines):
        if i > 500 and '"Antiqua et Nova"' in line and '<a href=' not in line and 'application/ld+json' not in line:
            # Add link right after the phrase
            lines[i] = line.replace(
                '"Antiqua et Nova"',
                '"Antiqua et Nova" <a href="../vatican-resources/htmldocs/antiqua-et-nova-2025.html">Read the complete document</a>'
            )
            modified = True
            links_added += 1
            print(f"✅ {filename}: Added link at line {i+1}")
            break
    
    if modified:
        content = '\n'.join(lines)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

print(f"\n✅ Total links added: {links_added}")
