#!/usr/bin/env python3
"""
Remove escaped apostrophes (backslashes before quotes) from all FAQ files
"""

files = [
    'ai-bias-fairness.html',
    'ai-consciousness-souls.html', 
    'ai-healthcare.html',
    'ai-jobs-catholic-teaching.html',
    'deepfakes-misinformation.html',
    'catholic-ai-ethics.html',
    'ai-warfare-weapons.html',
    'ai-privacy-surveillance.html'
]

for filename in files:
    print(f"Fixing {filename}...")
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count before
        before = content.count("\\'")
        
        # Fix escaped apostrophes
        content = content.replace("\\'", "'")
        
        # Write back
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✅ Removed {before} escaped apostrophes")
        
    except Exception as e:
        print(f"  ❌ Error: {e}")

print("\n✅ All files fixed!")
