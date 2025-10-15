#!/usr/bin/env python3
"""
Fix Related FAQs section in all 6 FAQ pages with real links
"""

import re

# Define related FAQs for each page
related_faqs = {
    "ai-bias-fairness.html": [
        ("catholic-ai-ethics.html", "Catholic AI Ethics Framework", "Core principles and Vatican teaching"),
        ("ai-healthcare.html", "AI in Healthcare Ethics", "Medical AI bias and patient dignity"),
        ("deepfakes-misinformation.html", "Deepfakes & Misinformation", "AI-generated deception and truth")
    ],
    
    "ai-consciousness-souls.html": [
        ("catholic-ai-ethics.html", "Catholic AI Ethics Framework", "Core principles and Vatican teaching"),
        ("deepfakes-misinformation.html", "Deepfakes & Misinformation", "AI deception and human dignity"),
        ("ai-jobs-catholic-teaching.html", "AI & Work", "Job automation and human dignity")
    ],
    
    "ai-healthcare.html": [
        ("catholic-ai-ethics.html", "Catholic AI Ethics Framework", "Core principles and Vatican teaching"),
        ("ai-bias-fairness.html", "AI Bias & Fairness", "Algorithmic discrimination in healthcare"),
        ("ai-consciousness-souls.html", "AI Consciousness & Souls", "What makes humans uniquely human")
    ],
    
    "ai-jobs-catholic-teaching.html": [
        ("catholic-ai-ethics.html", "Catholic AI Ethics Framework", "Core principles and Vatican teaching"),
        ("ai-bias-fairness.html", "AI Bias & Fairness", "Algorithmic discrimination in hiring"),
        ("deepfakes-misinformation.html", "Deepfakes & Misinformation", "AI deception in the workplace")
    ],
    
    "catholic-ai-ethics.html": [
        ("ai-jobs-catholic-teaching.html", "AI & Work", "Automation, jobs, and human dignity"),
        ("ai-bias-fairness.html", "AI Bias & Fairness", "Preventing algorithmic discrimination"),
        ("deepfakes-misinformation.html", "Deepfakes & Misinformation", "Truth and human dignity")
    ],
    
    "deepfakes-misinformation.html": [
        ("catholic-ai-ethics.html", "Catholic AI Ethics Framework", "Core principles and Vatican teaching"),
        ("ai-bias-fairness.html", "AI Bias & Fairness", "How bias amplifies misinformation"),
        ("ai-consciousness-souls.html", "AI Consciousness & Souls", "What makes humans trustworthy")
    ]
}

# Template for Related FAQs section
template = """        <!-- Related FAQs Section -->
        <div class="faq-section" id="related">
            <h2>Related FAQs</h2>
            <p class="faq-answer">Explore these related topics to deepen your understanding:</p>
            
            <ul class="faq-answer">
                <li><a href="{url1}" style="color: #0066cc; text-decoration: none; font-weight: 600;">{title1}</a> - {desc1}</li>
                <li><a href="{url2}" style="color: #0066cc; text-decoration: none; font-weight: 600;">{title2}</a> - {desc2}</li>
                <li><a href="{url3}" style="color: #0066cc; text-decoration: none; font-weight: 600;">{title3}</a> - {desc3}</li>
            </ul>
        </div>"""

for filename, links in related_faqs.items():
    print(f"\n📝 Processing: {filename}")
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create new Related FAQs section
    new_section = template.format(
        url1=links[0][0], title1=links[0][1], desc1=links[0][2],
        url2=links[1][0], title2=links[1][1], desc2=links[1][2],
        url3=links[2][0], title3=links[2][1], desc3=links[2][2]
    )
    
    # Find and replace old Related FAQs section
    pattern = r'        <!-- Related FAQs Section -->.*?</div>\s*<!-- Back Link -->'
    
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, new_section + '\n\n        <!-- Back Link -->', content, flags=re.DOTALL)
        
        # Backup
        with open(f'{filename}.related_backup', 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Save
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✅ Updated Related FAQs with 3 real links")
    else:
        print(f"  ⚠️  Could not find Related FAQs section")

print("\n" + "="*80)
print("✅ COMPLETE: All FAQs now have real Related FAQ links")
print("="*80)
