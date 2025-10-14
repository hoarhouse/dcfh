#!/usr/bin/env python3

# Read the FAQ index page
with open('../dcf_faq_index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find where to insert the new card (after the existing cards, before closing div)
# Look for the last faq-card and insert after it
insert_marker = '        </div>\n\n    </main>'

# The new deepfakes card
deepfakes_card = '''        <a href="faqs/deepfakes-misinformation.html" class="faq-card">
            <div class="faq-icon">🎭</div>
            <h3>Deepfakes & Misinformation</h3>
            <p class="faq-count">15 questions</p>
            <p class="faq-preview">Catholic response to AI deception, protecting truth in the digital age, and recognizing deepfakes</p>
        </a>

'''

# Insert before the closing main div
html = html.replace(insert_marker, deepfakes_card + insert_marker)

# Write back
with open('../dcf_faq_index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Added deepfakes card to FAQ index")
