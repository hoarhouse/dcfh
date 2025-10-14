#!/usr/bin/env python3
"""
Add internal links to FAQ pages that need more (ai-consciousness-souls, ai-jobs, catholic-ai-ethics)
"""
import re

# Define which pages need links and where to add them
internal_link_additions = {
    'ai-consciousness-souls.html': [
        {
            'find': 'AI is a tool—powerful, impressive, but ultimately just an instrument serving human purposes.',
            'replace': 'AI is a tool—powerful, impressive, but ultimately just an instrument serving human purposes. For more on how Catholic teaching guides AI development, see our guide to <a href="catholic-ai-ethics.html">Catholic AI Ethics</a>.'
        },
        {
            'find': 'Humans possess rational souls directly created by God',
            'replace': 'Humans possess rational souls directly created by God, giving us unique moral status that <a href="ai-bias-fairness.html">must be protected when AI systems make decisions about us</a>'
        },
        {
            'find': 'Use AI tools when they genuinely serve human flourishing',
            'replace': 'Use AI tools when they genuinely serve human flourishing—whether in <a href="ai-healthcare.html">healthcare</a>, <a href="ai-jobs-catholic-teaching.html">work</a>, or other domains'
        }
    ],
    
    'ai-jobs-catholic-teaching.html': [
        {
            'find': 'technology should benefit everyone fairly, not just the privileged',
            'replace': 'technology should benefit everyone fairly, not just the privileged, avoiding the <a href="ai-bias-fairness.html">bias and discrimination</a> that often accompanies AI systems'
        },
        {
            'find': 'AI systems that monitor workers with unprecedented intensity',
            'replace': 'AI systems that monitor workers with unprecedented intensity—related concerns are explored in our <a href="ai-privacy-surveillance.html">privacy and surveillance FAQ</a> (coming soon)'
        },
        {
            'find': 'Healthcare workers bring irreplaceable human elements of care',
            'replace': '<a href="ai-healthcare.html">Healthcare workers</a> bring irreplaceable human elements of care'
        }
    ],
    
    'catholic-ai-ethics.html': [
        {
            'find': 'AI systems making decisions about employment, healthcare, criminal justice',
            'replace': 'AI systems making decisions about <a href="ai-jobs-catholic-teaching.html">employment</a>, <a href="ai-healthcare.html">healthcare</a>, criminal justice'
        },
        {
            'find': 'algorithmic bias that discriminates against marginalized communities',
            'replace': '<a href="ai-bias-fairness.html">algorithmic bias</a> that discriminates against marginalized communities'
        },
        {
            'find': 'AI-generated deepfakes and misinformation that undermine truth',
            'replace': '<a href="deepfakes-misinformation.html">AI-generated deepfakes and misinformation</a> that undermine truth'
        },
        {
            'find': 'debates about whether AI could be conscious or possess personhood',
            'replace': 'debates about <a href="ai-consciousness-souls.html">whether AI could be conscious or possess personhood</a>'
        }
    ]
}

for filename, replacements in internal_link_additions.items():
    print(f"\n🔗 Adding internal links to {filename}...")
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            html = f.read()
        
        links_added = 0
        for replacement in replacements:
            if replacement['find'] in html:
                html = html.replace(replacement['find'], replacement['replace'], 1)
                links_added += 1
            else:
                print(f"  ⚠️  Could not find text: '{replacement['find'][:50]}...'")
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"  ✅ Added {links_added} internal links")
        
    except FileNotFoundError:
        print(f"  ⚠️  File not found: {filename}")
    except Exception as e:
        print(f"  ❌ Error: {e}")

print("\n" + "="*80)
print("✅ Internal links added to all 3 pages")
print("="*80)
