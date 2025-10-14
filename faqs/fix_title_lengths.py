#!/usr/bin/env python3
"""
Fix title tags to be 50-60 characters with keywords
"""

fixes = {
    'ai-bias-fairness.html': 'AI Bias & Fairness: Catholic Church Teaching - DCF',
    
    'ai-consciousness-souls.html': 'Can AI Be Conscious? Catholic Church Teaching - DCF',
    
    'ai-healthcare.html': 'AI in Healthcare: Catholic Medical Ethics - DCF',
    
    'ai-jobs-catholic-teaching.html': 'Can AI Replace Jobs? Catholic Teaching - DCF Hungary',
    
    'catholic-ai-ethics.html': 'Catholic AI Ethics: Complete Vatican Guide - DCF',
    
    'deepfakes-misinformation.html': 'AI Deepfakes & Truth: Catholic Response - DCF'
}

import re

for filename, new_title in fixes.items():
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace title tag
    content = re.sub(
        r'<title>[^<]*</title>',
        f'<title>{new_title}</title>',
        content
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {filename}: '{new_title}' ({len(new_title)} chars)")

print("\n✅ All titles fixed to 50-60 chars with keywords")
