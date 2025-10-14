#!/usr/bin/env python3
import re

fixes = {
    'ai-bias-fairness.html': {
        'meta': 'Catholic Church teaching on AI bias, algorithmic fairness, and justice in artificial intelligence systems. Vatican guidance on preventing discrimination.',
    },
    'ai-consciousness-souls.html': {
        'meta': 'Can AI be conscious? Catholic Church teaching on AI personhood, souls, and what makes humans uniquely created in God\'s image according to Vatican.',
    },
    'ai-healthcare.html': {
        'title': 'AI in Healthcare: Catholic Medical Ethics Guide - DCF',
    },
    'ai-jobs-catholic-teaching.html': {
        'meta': 'Catholic Church teaching on AI replacing jobs, automation, and human dignity in work. Complete Vatican guidance on technology unemployment and rights.',
    },
    'catholic-ai-ethics.html': {
        'title': 'Catholic AI Ethics: Complete Vatican Ethics Guide - DCF',
    },
    'deepfakes-misinformation.html': {
        'title': 'AI Deepfakes & Misinformation: Catholic Response - DCF',
        'meta': 'Catholic Church response to AI deepfakes and misinformation. Vatican teaching on truth, recognizing deception, and defending reality in the digital age.',
    }
}

for filename, changes in fixes.items():
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'meta' in changes:
        content = re.sub(
            r'<meta name="description" content="[^"]*"',
            f'<meta name="description" content="{changes["meta"]}"',
            content
        )
        print(f"✅ {filename}: Meta = {len(changes['meta'])} chars")
    
    if 'title' in changes:
        content = re.sub(
            r'<title>[^<]*</title>',
            f'<title>{changes["title"]}</title>',
            content
        )
        print(f"✅ {filename}: Title = {len(changes['title'])} chars")
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("\n✅ Final tweaks complete - all pages now 150-160 char metas and 50-60 char titles")
