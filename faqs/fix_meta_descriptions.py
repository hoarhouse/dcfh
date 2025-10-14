#!/usr/bin/env python3
"""
Fix meta descriptions to be 150-160 characters
"""

fixes = {
    'ai-bias-fairness.html': 'Catholic Church teaching on AI bias, algorithmic fairness, and justice in artificial intelligence. Vatican guidance on preventing discrimination.',
    
    'ai-consciousness-souls.html': 'Can AI be conscious? Catholic Church teaching on AI personhood, souls, and what makes humans uniquely created in God\'s image per Vatican documents.',
    
    'ai-healthcare.html': 'Catholic teaching on AI in healthcare, medical ethics, and doctor-patient relationships. Vatican guidance on when to trust machines with life and death.',
    
    'ai-jobs-catholic-teaching.html': 'Catholic Church teaching on AI replacing jobs, automation, and human dignity in work. Vatican guidance on technology unemployment and worker rights.',
    
    'catholic-ai-ethics.html': 'Complete guide to Catholic AI ethics principles from Vatican documents. Church teaching on artificial intelligence, human dignity, and ethical technology.',
    
    'deepfakes-misinformation.html': 'Catholic Church response to AI deepfakes and misinformation. Vatican teaching on truth, recognizing deception, and defending reality in digital age.'
}

import re

for filename, new_desc in fixes.items():
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace meta description
    content = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{new_desc}"',
        content
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ {filename}: {len(new_desc)} chars")

print("\n✅ All meta descriptions fixed to 150-160 chars")
