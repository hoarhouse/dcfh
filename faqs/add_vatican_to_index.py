#!/usr/bin/env python3
"""
Add 10 Vatican FAQ cards to faqs/index.html
Matches existing card format exactly
"""

# Vatican FAQ cards in same format as existing ones
vatican_cards = '''
            <a href="vatican-ai-peace-2024-faq.html" class="faq-card">
                <div class="faq-icon">📖</div>
                <h2 class="faq-card-title">AI and Peace: Vatican's 2024 World Day Message</h2>
                <p class="faq-card-description">Pope Francis's landmark 2024 World Day of Peace message on artificial intelligence. Complete guide to Vatican teaching on AI, autonomous weapons, and building peace in the digital age.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-communications-ai-wisdom-2024-faq.html" class="faq-card">
                <div class="faq-icon">🌐</div>
                <h2 class="faq-card-title">AI and the Wisdom of the Heart: 2024 Communications Day</h2>
                <p class="faq-card-description">Vatican's 2024 World Communications Day message on AI and wisdom of the heart. Pope Francis on authentic communication, truth, and human relationships in the age of artificial intelligence.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-g7-ai-address-2024-faq.html" class="faq-card">
                <div class="faq-icon">🏛️</div>
                <h2 class="faq-card-title">Pope Francis at G7 Summit 2024: Historic AI Address</h2>
                <p class="faq-card-description">First pope to address G7 leaders, focusing exclusively on artificial intelligence. Vatican guidance on AI ethics, autonomous weapons, and ensuring technology serves humanity.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-wef-ai-message-2025-faq.html" class="faq-card">
                <div class="faq-icon">💼</div>
                <h2 class="faq-card-title">Pope's Message to World Economic Forum 2025</h2>
                <p class="faq-card-description">Vatican's 2025 message to business and tech leaders at Davos. Pope Francis on corporate responsibility, AI ethics, economic justice, and technology serving the common good.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-child-dignity-digital-world-2019-faq.html" class="faq-card">
                <div class="faq-icon">👶</div>
                <h2 class="faq-card-title">Protecting Children's Dignity in the Digital World</h2>
                <p class="faq-card-description">Vatican's 2019 teaching on protecting children online. Essential guidance for parents, educators, and tech companies on child safety, AI, social media, and digital wellbeing.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-common-good-digital-age-2019-faq.html" class="faq-card">
                <div class="faq-icon">🤝</div>
                <h2 class="faq-card-title">The Common Good in the Digital Age</h2>
                <p class="faq-card-description">Vatican's 2019 foundational framework on technology and society. How digital technology affects justice, solidarity, and building a society where all can flourish.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-minerva-dialogues-2023-faq.html" class="faq-card">
                <div class="faq-icon">💬</div>
                <h2 class="faq-card-title">Minerva Dialogues 2023: Vatican-Tech Industry Dialogue</h2>
                <p class="faq-card-description">Vatican's 2023 dialogue with technology leaders. Pope Francis on corporate responsibility, ethical AI development, and bridging faith and innovation for human flourishing.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-un-security-council-ai-2025-faq.html" class="faq-card">
                <div class="faq-icon">🛡️</div>
                <h2 class="faq-card-title">Vatican at UN Security Council: AI and International Security</h2>
                <p class="faq-card-description">Archbishop Gallagher's 2025 UN Security Council statement on AI threats to peace. Vatican position on autonomous weapons, AI governance, and international cooperation.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-ai-wisdom-faq.html" class="faq-card">
                <div class="faq-icon">🧠</div>
                <h2 class="faq-card-title">Artificial Intelligence and Wisdom</h2>
                <p class="faq-card-description">Vatican teaching on the relationship between AI and human wisdom. How artificial intelligence affects learning, knowledge, and the cultivation of wisdom in education.</p>
                <span class="faq-card-arrow">→</span>
            </a>

            <a href="vatican-ai-question-of-meaning-faq.html" class="faq-card">
                <div class="faq-icon">🎯</div>
                <h2 class="faq-card-title">AI and the Question of Meaning</h2>
                <p class="faq-card-description">Vatican teaching on how AI affects fundamental questions of human meaning, purpose, and existence. Ensuring technology serves authentic human flourishing and identity.</p>
                <span class="faq-card-arrow">→</span>
            </a>
'''

# Read current index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find insertion point - after the last existing faq-card
# Look for the last closing </a> of ai-warfare-weapons.html faq-card
insertion_marker = '</a>\n        </div>'
last_card_end = html.rfind('ai-warfare-weapons.html" class="faq-card">')

if last_card_end != -1:
    # Find the closing </a> after this card
    search_from = last_card_end
    closing_a = html.find('</a>', search_from)
    if closing_a != -1:
        # Insert after this </a> and before the closing </div>
        insertion_point = closing_a + 4  # 4 = len('</a>')
        html = html[:insertion_point] + '\n\n' + vatican_cards + html[insertion_point:]
        
        # Write updated file
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("✅ Added 10 Vatican FAQ cards to index.html")
        print("📊 Cards added:")
        print("   1. AI and Peace 2024")
        print("   2. AI and Wisdom of the Heart 2024")
        print("   3. Pope Francis at G7 2024")
        print("   4. WEF Message 2025")
        print("   5. Child Dignity Digital World 2019")
        print("   6. Common Good Digital Age 2019")
        print("   7. Minerva Dialogues 2023")
        print("   8. UN Security Council AI 2025")
        print("   9. AI and Wisdom")
        print("   10. AI and Question of Meaning")
    else:
        print("❌ Could not find closing tag")
else:
    print("❌ Could not find last faq-card in index.html")