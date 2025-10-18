#!/usr/bin/env python3
"""
Add the 2 missing Vatican FAQ cards to index.html
"""

# The two missing cards to add
missing_cards = '''
            <a href="vatican-rome-call-ai-ethics-faq.html" class="faq-card">
                <div class="faq-icon">📜</div>
                <h2 class="faq-card-title">Rome Call for AI Ethics 2020</h2>
                <p class="faq-card-description">Vatican's foundational AI ethics framework signed by Microsoft, IBM, and global leaders. Six principles for ethical AI development and human dignity.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-peace-2022-education-work-faq.html" class="faq-card">
                <div class="faq-icon">🕊️</div>
                <h2 class="faq-card-title">World Day of Peace 2022: Education & Work</h2>
                <p class="faq-card-description">Pope Francis on dialogue between generations, education, and work as tools for building lasting peace in the age of technology and AI.</p>
                <span class="faq-card-arrow">→</span>
            </a>'''

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find a good insertion point - after the last Vatican FAQ card
# Let's insert after vatican-ai-question-of-meaning-faq.html which seems to be the last one
insertion_marker = 'vatican-ai-question-of-meaning-faq.html" class="faq-card">'
insertion_pos = html.rfind(insertion_marker)

if insertion_pos != -1:
    # Find the closing </a> tag after this position
    closing_a_pos = html.find('</a>', insertion_pos)
    if closing_a_pos != -1:
        # Insert after the closing </a>
        insertion_point = closing_a_pos + 4  # 4 = len('</a>')
        html = html[:insertion_point] + '\n' + missing_cards + html[insertion_point:]
        
        # Write back
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("✅ Successfully added 2 missing Vatican FAQ cards to index.html")
        print("   1. Rome Call for AI Ethics 2020")
        print("   2. World Day of Peace 2022: Education & Work")
    else:
        print("❌ Could not find closing tag")
else:
    print("❌ Could not find insertion marker")

# Verify all 12 are present
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
    
vatican_faqs = [
    'vatican-rome-call-ai-ethics-faq.html',
    'vatican-ai-peace-2024-faq.html',
    'vatican-communications-ai-wisdom-2024-faq.html',
    'vatican-g7-ai-address-2024-faq.html',
    'vatican-wef-ai-message-2025-faq.html',
    'vatican-child-dignity-digital-world-2019-faq.html',
    'vatican-common-good-digital-age-2019-faq.html',
    'vatican-minerva-dialogues-2023-faq.html',
    'vatican-un-security-council-ai-2025-faq.html',
    'vatican-peace-2022-education-work-faq.html',
    'vatican-ai-wisdom-faq.html',
    'vatican-ai-question-of-meaning-faq.html'
]

print("\n📊 Verification - All 12 Vatican FAQs present in index.html:")
for faq in vatican_faqs:
    if faq in content:
        print(f"   ✅ {faq}")
    else:
        print(f"   ❌ MISSING: {faq}")