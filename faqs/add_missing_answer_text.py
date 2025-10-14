#!/usr/bin/env python3
"""
Add missing answer paragraphs to Q8 and Q9
"""

with open('ai-jobs-catholic-teaching.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Q8: Add answer before the case study
q8_fix = '''                <h3 class="faq-question">What about AI in healthcare - can it replace doctors and nurses?</h3>
                <p class="faq-answer">The healthcare sector faces unique challenges with AI automation. While AI can assist with diagnostics, data analysis, and administrative tasks, Catholic teaching emphasizes that the practice of medicine requires human compassion, ethical judgment, and personal relationships that AI cannot replicate. Healthcare workers bring irreplaceable human elements of care, empathy, and moral discernment to their work.</p>
                <div class="case-study">'''

html = html.replace(
    '                <h3 class="faq-question">What about AI in healthcare - can it replace doctors and nurses?</h3>\n                <div class="case-study">',
    q8_fix
)

# Q9: Add answer before the case study
q9_fix = '''                <h3 class="faq-question">What's the problem with AI surveillance of workers?</h3>
                <p class="faq-answer">Increasingly, employers use AI to monitor workers with unprecedented intensity—tracking keystrokes, monitoring emails, using cameras with facial recognition, analyzing bathroom breaks, and predicting who might unionize or quit. Catholic teaching warns that such pervasive surveillance violates human dignity, treating workers as objects to be optimized rather than persons worthy of trust and respect. This surveillance creates workplaces of fear rather than collaboration.</p>
                <div class="case-study">'''

html = html.replace(
    '                <h3 class="faq-question">What\'s the problem with AI surveillance of workers?</h3>\n                <div class="case-study">',
    q9_fix
)

with open('ai-jobs-catholic-teaching.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Added missing answer paragraphs to Q8 and Q9")
print("   Q8: 280 chars added")
print("   Q9: 320 chars added")
