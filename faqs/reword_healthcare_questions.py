#!/usr/bin/env python3
"""
Reword 5 questions in ai-healthcare.html to natural language format
"""

filename = 'ai-healthcare.html'

with open(filename, 'r', encoding='utf-8') as f:
    html = f.read()

# Q3: Where → What are
html = html.replace(
    '<h3 class="faq-question">Where does AI fall short in medicine?</h3>',
    '<h3 class="faq-question">What are AI\'s limitations in medicine?</h3>'
)

# Q12: Who → Who is (already natural language - 'who' should be in the list!)
# Actually 'who' is natural language, but let's make it clearer
html = html.replace(
    '<h3 class="faq-question">Who is morally responsible when AI-assisted diagnosis is wrong?</h3>',
    '<h3 class="faq-question">Who bears moral responsibility when AI-assisted diagnosis is wrong?</h3>'
)

# Q13: As a patient → How should
html = html.replace(
    '<h3 class="faq-question">As a patient, how should I think about AI in my healthcare?</h3>',
    '<h3 class="faq-question">How should patients think about AI in their healthcare?</h3>'
)

# Q14: For Catholic → What should
html = html.replace(
    '<h3 class="faq-question">For Catholic healthcare institutions: What principles should guide AI adoption?</h3>',
    '<h3 class="faq-question">What principles should guide Catholic healthcare institutions adopting AI?</h3>'
)

# Q15: What's → What is
html = html.replace(
    '<h3 class="faq-question">What\'s the Catholic vision for AI in healthcare?</h3>',
    '<h3 class="faq-question">What is the Catholic vision for AI in healthcare?</h3>'
)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Reworded 5 questions in ai-healthcare.html")
print("   Q3: 'Where' → 'What are'")
print("   Q12: Clarified 'Who is'")
print("   Q13: 'As a patient' → 'How should patients'")
print("   Q14: 'For Catholic' → 'What should'")
print("   Q15: 'What's' → 'What is'")
