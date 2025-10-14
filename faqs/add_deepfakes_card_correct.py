#!/usr/bin/env python3

# Read the correct FAQ index page
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find where to insert - look for the grid of cards
insert_marker = '        </div>\n\n    </main>'

# The new deepfakes card
deepfakes_card = '''        <a href="deepfakes-misinformation.html" class="faq-card">
            <div class="faq-icon">🎭</div>
            <h3>Deepfakes & Misinformation</h3>
            <p class="faq-count">15 questions</p>
            <p class="faq-preview">Catholic response to AI deception, protecting truth in the digital age, and recognizing deepfakes</p>
        </a>

'''

# Insert before closing main
html = html.replace(insert_marker, deepfakes_card + insert_marker)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Added deepfakes card to FAQ index")
