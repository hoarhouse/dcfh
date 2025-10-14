#!/usr/bin/env python3

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the correct insertion point - right before </div> that closes the grid and </main>
insert_point = html.find('        </div>\n\n    </main>')

# The new card matching the existing structure
deepfakes_card = '''
            <a href="deepfakes-misinformation.html" class="faq-card">
                <div class="faq-card-icon">🎭</div>
                <h2 class="faq-card-title">Deepfakes, Misinformation & Truth</h2>
                <p class="faq-card-description">Catholic response to AI deception and protecting reality in the digital age. Vatican guidance on recognizing deepfakes and defending truth.</p>
                <span class="faq-card-arrow">→</span>
            </a>
'''

# Insert before the closing tags
html = html[:insert_point] + deepfakes_card + '\n' + html[insert_point:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Added deepfakes card to index")
