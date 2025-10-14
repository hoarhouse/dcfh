#!/usr/bin/env python3
"""
MASTER FAQ BUILDER TEMPLATE
Copy this file and customize for each new FAQ topic
"""

# Read template
with open('_FAQ_TEMPLATE.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === METADATA ===
html = html.replace('[YOUR FAQ TITLE]', 'Catholic Church on [YOUR TOPIC]')
html = html.replace('[150-160 character description with target keywords]', 
    'Your 150-160 char SEO description with keywords')

# === HERO SECTION ===
html = html.replace('🤖', '🎯')  # Change icon
html = html.replace('Catholic Church on [Topic]', 'Your Display Title')
html = html.replace('Comprehensive answers about Catholic teaching on [topic description]', 
    'Your compelling subtitle')

# === FIX HERO PAGE-TITLE/SUBTITLE (CRITICAL - ALWAYS INCLUDE) ===
html = html.replace('<h1 class="page-title">[Your FAQ Title]</h1>', 
                   '<h1 class="page-title">Your Display Title</h1>')
html = html.replace('<p class="page-subtitle">[Brief description of what this FAQ covers - keep compelling and scannable]</p>',
                   '<p class="page-subtitle">Your compelling subtitle</p>')

# === TABLE OF CONTENTS ===
old_toc = '''                <li><a href="#section1">Section 1: Topic Name (X questions)</a></li>
                <li><a href="#section2">Section 2: Topic Name (X questions)</a></li>
                <li><a href="#section3">Section 3: Topic Name (X questions)</a></li>
                <!-- Add more sections as needed -->'''

new_toc = '''                <li><a href="#section1">Your Section 1 (3 questions)</a></li>
                <li><a href="#section2">Your Section 2 (3 questions)</a></li>
                <li><a href="#section3">Your Section 3 (3 questions)</a></li>'''

html = html.replace(old_toc, new_toc)

# === FAQ CONTENT ===
insert_point = html.find('        <!-- FAQ Section 1 -->')
end_point = html.find('        <!-- Related FAQs Section -->')

faq_content = '''        <!-- FAQ Section 1 -->
        <div class="faq-section" id="section1">
            <h2>Your Section Title</h2>

            <div class="faq-item">
                <h3 class="faq-question">Your question?</h3>
                <p class="faq-answer">Your answer.</p>
            </div>
        </div>
'''

html = html[:insert_point] + faq_content + '\n' + html[end_point:]

# === RELATED FAQS ===
html = html.replace('[FAQ Title 1]', 'Related FAQ 1')
html = html.replace('[FAQ Title 2]', 'Related FAQ 2')
html = html.replace('[FAQ Title 3]', 'Related FAQ 3')

# Write output
with open('your-topic-name.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ FAQ page created: your-topic-name.html")
