#!/usr/bin/env python3

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find deepfakes card and insert after it
deepfakes_card_end = html.find('</a>', html.find('deepfakes-misinformation.html'))

bias_card = '''

            <a href="ai-bias-fairness.html" class="faq-card">
                <div class="faq-card-icon">⚖️</div>
                <h2 class="faq-card-title">AI Bias & Algorithmic Fairness</h2>
                <p class="faq-card-description">Catholic teaching on preventing discrimination and ensuring justice in AI systems. Vatican guidance on bias and fairness.</p>
                <span class="faq-card-arrow">→</span>
            </a>'''

html = html[:deepfakes_card_end + 4] + bias_card + html[deepfakes_card_end + 4:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Added bias card to index")
