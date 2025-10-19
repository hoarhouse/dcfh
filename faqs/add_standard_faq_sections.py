#!/usr/bin/env python3
"""
Add standardized bottom sections to all 21 FAQ pages
Intelligently matches Vatican resources and related FAQs to each topic
"""

import os
import re
from pathlib import Path

# Define intelligent content matching for each FAQ
FAQ_CONTENT_MAPPING = {
    'ai-bias-fairness-faq.html': {
        'topic': 'AI Bias and Fairness',
        'vatican_resources': [
            ('pope-francis-world-communications-day-2024.html', 'Pope Francis on AI and Communication (2024)', 'Addresses algorithmic bias and digital discrimination'),
            ('pope-francis-minerva-dialogues-2023.html', 'Pope Francis: Minerva Dialogues on AI (2023)', 'Vatican dialogue on AI fairness and justice'),
            ('ethics-in-internet-2002.html', 'Ethics in Internet (2002)', 'Foundational principles for digital equity'),
            ('towards-full-presence-social-media-2023.html', 'Towards Full Presence (2023)', 'Social media ethics and algorithmic influence')
        ],
        'related_faqs': [
            ('ai-healthcare-faq.html', 'AI in Healthcare Ethics', 'Bias in medical AI systems'),
            ('deepfakes-misinformation-faq.html', 'Deepfakes & Misinformation', 'How bias affects synthetic media'),
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Comprehensive ethical framework')
        ]
    },
    
    'ai-companions-relationships-faq.html': {
        'topic': 'AI Companions and Digital Relationships',
        'vatican_resources': [
            ('towards-full-presence-social-media-2023.html', 'Towards Full Presence (2023)', 'Authentic relationships in digital spaces'),
            ('pope-francis-world-communications-day-2023.html', 'Speaking with the Heart (2023)', 'Truth and kindness in digital communication'),
            ('church-and-internet-2002.html', 'Church and Internet (2002)', 'Human relationships in digital age'),
            ('benedict-xvi-digital-culture-2011.html', 'Benedict XVI on Digital Culture (2011)', 'Maintaining humanity in digital interactions')
        ],
        'related_faqs': [
            ('ai-consciousness-souls-faq.html', 'Can AI Have a Soul?', 'Understanding AI consciousness claims'),
            ('deepfakes-misinformation-faq.html', 'Deepfakes & Misinformation', 'Synthetic relationships and deception'),
            ('ai-privacy-surveillance-faq.html', 'AI Privacy & Surveillance', 'Data collection in AI relationships')
        ]
    },
    
    'ai-consciousness-souls-faq.html': {
        'topic': 'AI Consciousness and Souls',
        'vatican_resources': [
            ('pope-francis-minerva-dialogues-2023.html', 'Minerva Dialogues on AI (2023)', 'Vatican position on AI consciousness'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Theological perspectives on AI and soul'),
            ('pope-leo-xiv-ai-ethics-conference-june-2025.html', 'Pope Leo XIV AI Ethics Conference (2025)', 'Latest Church teaching on AI consciousness'),
            ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI (2024)', 'Human uniqueness in the AI age')
        ],
        'related_faqs': [
            ('ai-companions-relationships-faq.html', 'AI Companions & Relationships', 'Emotional bonds with non-conscious entities'),
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Theological foundations'),
            ('ai-healthcare-faq.html', 'AI in Healthcare', 'Medical ethics and AI decision-making')
        ]
    },
    
    'ai-healthcare-faq.html': {
        'topic': 'AI in Healthcare and Medical Ethics',
        'vatican_resources': [
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Latest Vatican guidance on medical AI'),
            ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI (2024)', 'Human dignity in healthcare technology'),
            ('pope-leo-xiv-tech-executives-vatican-june-2025.html', 'Pope Leo XIV to Tech Leaders (2025)', 'Ethical AI in medical applications'),
            ('towards-full-presence-social-media-2023.html', 'Towards Full Presence (2023)', 'Human presence in digital healthcare')
        ],
        'related_faqs': [
            ('ai-consciousness-souls-faq.html', 'Can AI Have a Soul?', 'AI decision-making in life and death'),
            ('ai-bias-fairness-faq.html', 'AI Bias & Fairness', 'Healthcare algorithmic discrimination'),
            ('ai-privacy-surveillance-faq.html', 'AI Privacy & Surveillance', 'Medical data protection')
        ]
    },
    
    'ai-jobs-workplace-faq.html': {
        'topic': 'AI, Jobs, and the Future of Work',
        'vatican_resources': [
            ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI (2024)', 'Work, dignity, and automation'),
            ('pope-leo-xiv-cardinals-address-may-2025.html', 'Pope Leo XIV to Cardinals (2025)', 'Church response to AI unemployment'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Theological perspectives on human labor'),
            ('pope-francis-minerva-dialogues-2023.html', 'Minerva Dialogues (2023)', 'Education and work in AI age')
        ],
        'related_faqs': [
            ('ai-bias-fairness-faq.html', 'AI Bias & Fairness', 'Workplace algorithmic discrimination'),
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Catholic social teaching on work'),
            ('vatican-peace-2022-education-work-faq.html', 'Vatican on Education and Work (2022)', 'Intergenerational dialogue on automation')
        ]
    },
    
    'ai-privacy-surveillance-faq.html': {
        'topic': 'AI Privacy and Surveillance Ethics',
        'vatican_resources': [
            ('ethics-in-internet-2002.html', 'Ethics in Internet (2002)', 'Early Vatican guidance on digital privacy'),
            ('church-and-internet-2002.html', 'Church and Internet (2002)', 'Human dignity in digital spaces'),
            ('pope-francis-world-communications-day-2024.html', 'AI and Wisdom of the Heart (2024)', 'Privacy as human right'),
            ('pope-leo-xiv-digital-missionaries-influencers-july-2025.html', 'Pope Leo XIV on Digital Mission (2025)', 'Evangelization respecting privacy')
        ],
        'related_faqs': [
            ('ai-companions-relationships-faq.html', 'AI Companions & Relationships', 'Data collection in AI relationships'),
            ('deepfakes-misinformation-faq.html', 'Deepfakes & Misinformation', 'Privacy violations through synthetic media'),
            ('vatican-child-dignity-digital-world-2019-faq.html', 'Child Dignity in Digital World', 'Protecting vulnerable populations')
        ]
    },
    
    'ai-warfare-weapons-faq.html': {
        'topic': 'AI in Warfare and Autonomous Weapons',
        'vatican_resources': [
            ('pope-francis-paris-ai-summit-february-2025.html', 'Pope Francis at Paris AI Summit (2025)', 'Latest call against autonomous weapons'),
            ('pope-leo-xiv-un-ai-summit-july-2025.html', 'Pope Leo XIV at UN AI Summit (2025)', 'International cooperation on AI weapons ban'),
            ('pope-francis-rome-call-ai-ethics-january-2023.html', 'Rome Call for AI Ethics (2023)', 'Ethical framework against weaponized AI'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Just war theory and autonomous systems')
        ],
        'related_faqs': [
            ('ai-consciousness-souls-faq.html', 'Can AI Have a Soul?', 'Moral agency in lethal decisions'),
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Peace and human dignity'),
            ('vatican-un-security-council-ai-2025-faq.html', 'Vatican at UN Security Council (2025)', 'International peace and AI')
        ]
    },
    
    'catholic-ai-ethics-faq.html': {
        'topic': 'Complete Catholic AI Ethics Framework',
        'vatican_resources': [
            ('pope-francis-rome-call-ai-ethics-january-2023.html', 'Rome Call for AI Ethics (2023)', 'Foundational ethical framework'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Comprehensive theological treatment'),
            ('pope-leo-xiv-ai-ethics-conference-june-2025.html', 'Pope Leo XIV AI Ethics Conference (2025)', 'Latest magisterial teaching'),
            ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI (2024)', 'Social doctrine applied to AI')
        ],
        'related_faqs': [
            ('vatican-rome-call-ai-ethics-faq.html', 'Rome Call for AI Ethics', 'The six principles explained'),
            ('ai-consciousness-souls-faq.html', 'Can AI Have a Soul?', 'Theological foundations'),
            ('ai-jobs-workplace-faq.html', 'AI and the Future of Work', 'Catholic social teaching applied')
        ]
    },
    
    'deepfakes-misinformation-faq.html': {
        'topic': 'Deepfakes and Digital Misinformation',
        'vatican_resources': [
            ('pope-francis-world-communications-day-2024.html', 'AI and Wisdom of the Heart (2024)', 'Truth in the age of synthetic media'),
            ('pope-francis-world-communications-day-2023.html', 'Speaking with the Heart (2023)', 'Truth and kindness in communication'),
            ('towards-full-presence-social-media-2023.html', 'Towards Full Presence (2023)', 'Authenticity in digital spaces'),
            ('ethics-in-internet-2002.html', 'Ethics in Internet (2002)', 'Truth as fundamental principle')
        ],
        'related_faqs': [
            ('ai-bias-fairness-faq.html', 'AI Bias & Fairness', 'How bias shapes synthetic content'),
            ('ai-privacy-surveillance-faq.html', 'AI Privacy & Surveillance', 'Deepfakes and privacy violations'),
            ('vatican-communications-ai-wisdom-2024-faq.html', 'Vatican on AI and Communication', 'Official Church guidance')
        ]
    },
    
    'dcf_faq_ai_wisdom.html': {
        'topic': 'DCF Resources on AI and Wisdom',
        'vatican_resources': [
            ('pope-francis-world-communications-day-2024.html', 'AI and Wisdom of the Heart (2024)', 'Core Vatican teaching on AI wisdom'),
            ('pope-francis-minerva-dialogues-2023.html', 'Minerva Dialogues (2023)', 'Wisdom traditions and AI'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Ancient wisdom for modern technology'),
            ('pope-leo-xiv-media-address-may-2025.html', 'Pope Leo XIV Media Address (2025)', 'Communicating wisdom in digital age')
        ],
        'related_faqs': [
            ('vatican-ai-wisdom-faq.html', 'Vatican on AI and Wisdom', 'Official Church teaching'),
            ('vatican-communications-ai-wisdom-2024-faq.html', 'World Communications Day 2024', 'AI and the wisdom of the heart'),
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Comprehensive framework')
        ]
    },
    
    # Vatican FAQs
    'vatican-ai-peace-2024-faq.html': {
        'topic': 'Vatican World Day of Peace 2024 on AI',
        'vatican_resources': [
            ('pope-francis-paris-ai-summit-february-2025.html', 'Paris AI Summit (2025)', 'Building on Peace Day message'),
            ('pope-francis-rome-call-ai-ethics-january-2023.html', 'Rome Call for AI Ethics (2023)', 'Ethical framework for peace'),
            ('pope-leo-xiv-un-ai-summit-july-2025.html', 'UN AI Summit (2025)', 'International cooperation'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Theological foundations for AI peace')
        ],
        'related_faqs': [
            ('ai-warfare-weapons-faq.html', 'AI Warfare & Weapons', 'Autonomous weapons concerns'),
            ('vatican-un-security-council-ai-2025-faq.html', 'Vatican at UN Security Council', 'International peace efforts'),
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Peace as core principle')
        ]
    },
    
    'vatican-ai-question-of-meaning-faq.html': {
        'topic': 'Vatican on AI and the Question of Meaning',
        'vatican_resources': [
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Meaning and purpose in AI age'),
            ('pope-francis-minerva-dialogues-2023.html', 'Minerva Dialogues (2023)', 'Philosophy and AI'),
            ('pope-leo-xiv-ai-ethics-conference-june-2025.html', 'AI Ethics Conference (2025)', 'Human meaning vs machine processing'),
            ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI (2024)', 'Work and meaning')
        ],
        'related_faqs': [
            ('ai-consciousness-souls-faq.html', 'Can AI Have a Soul?', 'Consciousness and meaning'),
            ('ai-jobs-workplace-faq.html', 'AI and Future of Work', 'Meaningful human labor'),
            ('vatican-ai-wisdom-faq.html', 'Vatican on AI and Wisdom', 'Wisdom vs information')
        ]
    },
    
    'vatican-ai-wisdom-faq.html': {
        'topic': 'Vatican on AI and Human Wisdom',
        'vatican_resources': [
            ('pope-francis-world-communications-day-2024.html', 'AI and Wisdom of the Heart (2024)', 'Core teaching on AI wisdom'),
            ('towards-full-presence-social-media-2023.html', 'Towards Full Presence (2023)', 'Wisdom in digital spaces'),
            ('pope-francis-minerva-dialogues-2023.html', 'Minerva Dialogues (2023)', 'Dialogue on wisdom and AI'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Ancient wisdom for modern age')
        ],
        'related_faqs': [
            ('vatican-communications-ai-wisdom-2024-faq.html', 'World Communications Day 2024', 'Wisdom of the heart'),
            ('ai-consciousness-souls-faq.html', 'Can AI Have a Soul?', 'Wisdom vs intelligence'),
            ('vatican-ai-question-of-meaning-faq.html', 'AI and Question of Meaning', 'Finding meaning through wisdom')
        ]
    },
    
    'vatican-child-dignity-digital-world-2019-faq.html': {
        'topic': 'Vatican on Child Dignity in Digital World',
        'vatican_resources': [
            ('church-and-internet-2002.html', 'Church and Internet (2002)', 'Protecting vulnerable online'),
            ('ethics-in-internet-2002.html', 'Ethics in Internet (2002)', 'Ethical principles for digital spaces'),
            ('pope-francis-world-communications-day-2023.html', 'Speaking with the Heart (2023)', 'Kind communication protecting children'),
            ('pope-leo-xiv-digital-missionaries-influencers-july-2025.html', 'Digital Missionaries (2025)', 'Responsible digital influence')
        ],
        'related_faqs': [
            ('ai-privacy-surveillance-faq.html', 'AI Privacy & Surveillance', 'Protecting children\'s data'),
            ('deepfakes-misinformation-faq.html', 'Deepfakes & Misinformation', 'Protecting minors from synthetic media'),
            ('ai-companions-relationships-faq.html', 'AI Companions & Relationships', 'Children and AI relationships')
        ]
    },
    
    'vatican-common-good-digital-age-2019-faq.html': {
        'topic': 'Vatican on Common Good in Digital Age',
        'vatican_resources': [
            ('church-and-internet-2002.html', 'Church and Internet (2002)', 'Digital common good foundations'),
            ('ethics-in-internet-2002.html', 'Ethics in Internet (2002)', 'Ethical framework for digital commons'),
            ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI (2024)', 'Social doctrine in digital age'),
            ('towards-full-presence-social-media-2023.html', 'Towards Full Presence (2023)', 'Building digital community')
        ],
        'related_faqs': [
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Common good principle'),
            ('ai-bias-fairness-faq.html', 'AI Bias & Fairness', 'Digital equity and common good'),
            ('ai-privacy-surveillance-faq.html', 'AI Privacy & Surveillance', 'Balancing privacy and common good')
        ]
    },
    
    'vatican-communications-ai-wisdom-2024-faq.html': {
        'topic': 'Vatican World Communications Day 2024',
        'vatican_resources': [
            ('pope-francis-world-communications-day-2023.html', 'World Communications 2023', 'Previous year\'s message'),
            ('towards-full-presence-social-media-2023.html', 'Towards Full Presence (2023)', 'Related teaching on digital presence'),
            ('pope-francis-minerva-dialogues-2023.html', 'Minerva Dialogues (2023)', 'Wisdom dialogue foundation'),
            ('pope-leo-xiv-media-address-may-2025.html', 'Pope Leo XIV Media Address (2025)', 'Continuing the conversation')
        ],
        'related_faqs': [
            ('vatican-ai-wisdom-faq.html', 'Vatican on AI and Wisdom', 'Expanded wisdom teaching'),
            ('deepfakes-misinformation-faq.html', 'Deepfakes & Misinformation', 'Truth in communication'),
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Communication ethics')
        ]
    },
    
    'vatican-g7-ai-address-2024-faq.html': {
        'topic': 'Pope Francis at G7 Summit on AI',
        'vatican_resources': [
            ('pope-francis-paris-ai-summit-february-2025.html', 'Paris AI Summit (2025)', 'Follow-up international engagement'),
            ('pope-francis-rome-call-ai-ethics-january-2023.html', 'Rome Call for AI Ethics (2023)', 'Ethical framework presented'),
            ('pope-leo-xiv-un-ai-summit-july-2025.html', 'UN AI Summit (2025)', 'Continued global dialogue'),
            ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI (2024)', 'Economic justice themes')
        ],
        'related_faqs': [
            ('vatican-wef-ai-message-2025-faq.html', 'Vatican at World Economic Forum', 'Economic leadership on AI'),
            ('ai-warfare-weapons-faq.html', 'AI Warfare & Weapons', 'G7 security concerns'),
            ('vatican-un-security-council-ai-2025-faq.html', 'Vatican at UN Security Council', 'International cooperation')
        ]
    },
    
    'vatican-minerva-dialogues-2023-faq.html': {
        'topic': 'Vatican Minerva Dialogues on AI',
        'vatican_resources': [
            ('pope-francis-minerva-dialogues-2023.html', 'Full Minerva Dialogues Text (2023)', 'Complete dialogue proceedings'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Building on Minerva insights'),
            ('pope-francis-world-communications-day-2024.html', 'World Communications 2024', 'Wisdom themes continued'),
            ('pope-leo-xiv-ai-ethics-conference-june-2025.html', 'AI Ethics Conference (2025)', 'Academic dialogue continues')
        ],
        'related_faqs': [
            ('vatican-ai-wisdom-faq.html', 'Vatican on AI and Wisdom', 'Wisdom dialogue outcomes'),
            ('ai-consciousness-souls-faq.html', 'Can AI Have a Soul?', 'Philosophical questions explored'),
            ('vatican-ai-question-of-meaning-faq.html', 'AI and Question of Meaning', 'Meaning dialogue')
        ]
    },
    
    'vatican-peace-2022-education-work-faq.html': {
        'topic': 'Vatican Peace Day 2022: Education and Work',
        'vatican_resources': [
            ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI (2024)', 'Work dignity expanded'),
            ('pope-francis-minerva-dialogues-2023.html', 'Minerva Dialogues (2023)', 'Education for AI age'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Intergenerational wisdom'),
            ('pope-leo-xiv-cardinals-address-may-2025.html', 'Cardinals Address (2025)', 'Church education response')
        ],
        'related_faqs': [
            ('ai-jobs-workplace-faq.html', 'AI and Future of Work', 'Automation and employment'),
            ('vatican-ai-peace-2024-faq.html', 'World Day of Peace 2024', 'Continued peace message'),
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Work and education ethics')
        ]
    },
    
    'vatican-rome-call-ai-ethics-faq.html': {
        'topic': 'Rome Call for AI Ethics Framework',
        'vatican_resources': [
            ('pope-francis-rome-call-ai-ethics-january-2023.html', 'Rome Call Meeting 2023', 'Latest Rome Call developments'),
            ('pope-francis-rome-call-meeting-january-2023.html', 'Rome Call Signatories Meeting', 'Industry commitments'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Theological grounding'),
            ('pope-leo-xiv-tech-executives-vatican-june-2025.html', 'Tech Executives Meeting (2025)', 'Ongoing industry dialogue')
        ],
        'related_faqs': [
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Comprehensive framework'),
            ('vatican-g7-ai-address-2024-faq.html', 'Pope at G7 Summit', 'Rome Call in global context'),
            ('ai-bias-fairness-faq.html', 'AI Bias & Fairness', 'Algorethics principle explained')
        ]
    },
    
    'vatican-un-security-council-ai-2025-faq.html': {
        'topic': 'Vatican at UN Security Council on AI',
        'vatican_resources': [
            ('pope-leo-xiv-un-ai-summit-july-2025.html', 'Pope Leo XIV at UN Summit (2025)', 'Expanded UN engagement'),
            ('pope-francis-paris-ai-summit-february-2025.html', 'Paris AI Summit (2025)', 'International cooperation'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Peace theology and AI'),
            ('pope-francis-rome-call-ai-ethics-january-2023.html', 'Rome Call for AI Ethics (2023)', 'Ethical framework for peace')
        ],
        'related_faqs': [
            ('ai-warfare-weapons-faq.html', 'AI Warfare & Weapons', 'Security Council concerns'),
            ('vatican-ai-peace-2024-faq.html', 'World Day of Peace 2024', 'Peace and AI message'),
            ('vatican-g7-ai-address-2024-faq.html', 'Pope at G7 Summit', 'Global leadership on AI')
        ]
    },
    
    'vatican-wef-ai-message-2025-faq.html': {
        'topic': 'Vatican Message to World Economic Forum',
        'vatican_resources': [
            ('pope-francis-centesimus-annus-ai-june-2024.html', 'Centesimus Annus and AI (2024)', 'Economic justice and AI'),
            ('pope-leo-xiv-tech-executives-vatican-june-2025.html', 'Tech Executives Meeting (2025)', 'Industry engagement'),
            ('pope-francis-paris-ai-summit-february-2025.html', 'Paris AI Summit (2025)', 'Global economic cooperation'),
            ('antiqua-et-nova-2025.html', 'Antiqua et Nova (2025)', 'Economic theology and technology')
        ],
        'related_faqs': [
            ('ai-jobs-workplace-faq.html', 'AI and Future of Work', 'Economic impact of automation'),
            ('vatican-g7-ai-address-2024-faq.html', 'Pope at G7 Summit', 'Economic leadership forums'),
            ('catholic-ai-ethics-faq.html', 'Complete Catholic AI Ethics Guide', 'Economic justice principles')
        ]
    }
}

def get_standard_sections(faq_file, mapping):
    """Generate the standard bottom sections for a FAQ file"""
    
    if faq_file not in mapping:
        print(f"Warning: No mapping found for {faq_file}")
        return ""
    
    info = mapping[faq_file]
    
    # Build Vatican Resources section
    vatican_html = '''
        <!-- Additional Resources from Vatican Archives -->
        <div class="faq-section" id="additional-resources">
            <h2>📚 Additional Vatican Resources</h2>
            
            <div class="faq-item">
                <h3 class="faq-question">Where can I find more Vatican documents on this topic?</h3>
                <p class="faq-answer">For deeper understanding from official Vatican sources, explore these documents:</p>
                
                <ul class="faq-answer">'''
    
    for resource in info['vatican_resources']:
        vatican_html += f'''
                    <li><a href="../vatican-resources/htmldocs/{resource[0]}" style="color: #0066cc; text-decoration: none; font-weight: 600;">{resource[1]}</a> - {resource[2]}</li>'''
    
    vatican_html += '''
                </ul>
                
                <p class="faq-answer">These documents provide official Vatican perspectives, historical context, and theological foundations for understanding AI ethics from a Catholic perspective.</p>
            </div>
        </div>'''
    
    # Build Related FAQs section
    related_html = '''

        <!-- Related FAQs Section -->
        <div class="faq-section" id="related">
            <h2>Related FAQs</h2>
            <p class="faq-answer">Explore these related topics to deepen your understanding:</p>
            
            <ul class="faq-answer">'''
    
    for faq in info['related_faqs']:
        related_html += f'''
                <li><a href="{faq[0]}" style="color: #0066cc; text-decoration: none; font-weight: 600;">{faq[1]}</a> - {faq[2]}</li>'''
    
    related_html += '''
            </ul>
        </div>'''
    
    # Back link
    back_html = '''

        <!-- Back Link -->
        <div class="faq-section">
            <a href="https://hoarhouse.github.io/dcfh/faqs/index.html" class="back-link">← Back to All FAQs</a>
        </div>'''
    
    return vatican_html + related_html + back_html

def clean_existing_sections(content):
    """Remove any existing bottom sections to avoid duplication"""
    
    # Find where to cut off existing content
    markers = [
        '<!-- Additional Resources from Vatican Archives -->',
        '<div class="faq-section" id="additional-resources">',
        '<!-- Related FAQs Section -->',
        '<div class="faq-section" id="related">',
        '<!-- Back Link -->'
    ]
    
    cut_position = len(content)
    for marker in markers:
        pos = content.find(marker)
        if pos != -1 and pos < cut_position:
            cut_position = pos
    
    # Also check for closing main tag
    main_close = content.rfind('</main>')
    if main_close != -1 and main_close < cut_position:
        return content[:main_close]
    
    return content[:cut_position].rstrip()

def update_faq_file(filepath, mapping):
    """Update a single FAQ file with standard sections"""
    
    filename = filepath.name
    
    if filename not in mapping:
        print(f"  ⚠️  No mapping for {filename}")
        return False
    
    try:
        # Read current content
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Clean any existing sections
        content = clean_existing_sections(content)
        
        # Get new sections
        new_sections = get_standard_sections(filename, mapping)
        
        # Find where to insert (before </main> and footer)
        main_close = content.rfind('</main>')
        
        if main_close == -1:
            # No </main> tag, append at end before </body>
            body_close = content.rfind('</body>')
            if body_close != -1:
                new_content = content[:body_close] + new_sections + '\n    </main>\n' + content[body_close:]
            else:
                new_content = content + new_sections + '\n    </main>\n</body>\n</html>'
        else:
            # Insert before </main>
            new_content = content[:main_close] + new_sections + '\n    ' + content[main_close:]
        
        # Write updated content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✓ Updated {filename}")
        return True
        
    except Exception as e:
        print(f"  ✗ Error updating {filename}: {e}")
        return False

def show_sample_mappings():
    """Show the mapping plan for first 3 FAQs"""
    
    print("\n" + "="*80)
    print("SAMPLE CONTENT MATCHING (First 3 FAQs)")
    print("="*80)
    
    sample_faqs = [
        'ai-bias-fairness-faq.html',
        'ai-companions-relationships-faq.html', 
        'ai-consciousness-souls-faq.html'
    ]
    
    for i, faq_file in enumerate(sample_faqs, 1):
        if faq_file in FAQ_CONTENT_MAPPING:
            info = FAQ_CONTENT_MAPPING[faq_file]
            
            print(f"\n{i}. {faq_file}")
            print(f"   Topic: {info['topic']}")
            print("   " + "-"*60)
            
            print("   Vatican Resources (4):")
            for resource in info['vatican_resources']:
                print(f"   • {resource[1]}")
                print(f"     File: {resource[0]}")
                print(f"     Relevance: {resource[2]}")
            
            print("\n   Related FAQs (3):")
            for related in info['related_faqs']:
                print(f"   • {related[1]}")
                print(f"     File: {related[0]}")
                print(f"     Connection: {related[2]}")

def main():
    """Main execution"""
    
    print("\n" + "="*80)
    print("ADD STANDARD FAQ SECTIONS")
    print("="*80)
    
    # Show sample mappings first
    show_sample_mappings()
    
    print("\n" + "="*80)
    print("READY TO UPDATE ALL 21 FAQ FILES")
    print("="*80)
    
    print("\nThis will add standardized bottom sections to each FAQ:")
    print("• Additional Vatican Resources (4 intelligently matched documents)")
    print("• Related FAQs (3-4 topically related FAQ pages)")
    print("• Back to All FAQs link")
    
    response = input("\nProceed with updating all FAQ files? [y/n]: ")
    
    if response.lower() != 'y':
        print("Cancelled.")
        return
    
    print("\n" + "="*80)
    print("UPDATING FAQ FILES")
    print("="*80)
    
    # Process all FAQ files
    faq_dir = Path('.')
    success_count = 0
    
    for faq_file in sorted(faq_dir.glob('*-faq.html')):
        if update_faq_file(faq_file, FAQ_CONTENT_MAPPING):
            success_count += 1
    
    # Also process dcf_faq_ai_wisdom.html (doesn't follow naming convention)
    special_file = faq_dir / 'dcf_faq_ai_wisdom.html'
    if special_file.exists():
        if update_faq_file(special_file, FAQ_CONTENT_MAPPING):
            success_count += 1
    
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    print(f"✓ Successfully updated: {success_count} files")
    print(f"Total FAQ files: 21")
    
    if success_count == 21:
        print("\n✅ All FAQ files have been updated with standard sections!")
    else:
        print(f"\n⚠️  Some files may need manual review ({21 - success_count} not updated)")

if __name__ == "__main__":
    main()