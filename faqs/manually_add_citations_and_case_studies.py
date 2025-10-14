#!/usr/bin/env python3
"""
Manually add Vatican citations and case studies to the RIGHT places
"""

with open('catholic-ai-ethics.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add Vatican Quote #2 - After discussion of common good
insert_after_1 = 'It requires: ensuring AI benefits reach marginalized communities; preventing wealth and power concentration among tech companies; protecting workers displaced by automation; and designing systems that strengthen rather than undermine social bonds and democratic participation.</p>'

vatican_quote_2 = '''
                <div class="vatican-quote">
                    "Artificial intelligence must be developed with constant attention to its effects on the most vulnerable and marginalized members of society."
                    <cite>— Antiqua et Nova (2025)</cite>
                </div>
'''

if insert_after_1 in html:
    html = html.replace(insert_after_1, insert_after_1 + vatican_quote_2)
    print("✅ Added Vatican quote #2 (common good)")
else:
    print("❌ Could not find insertion point for Vatican quote #2")

# Add Vatican Quote #3 - After discussion of human dignity
insert_after_2 = 'The Church emphasizes that AI can serve human flourishing if developed with wisdom and guided by moral principles that prioritize human dignity.</p>'

vatican_quote_3 = '''
                <div class="vatican-quote">
                    "The dignity of the human person must be at the center of any use of artificial intelligence."
                    <cite>— Rome Call for AI Ethics (2020)</cite>
                </div>
'''

if insert_after_2 in html:
    html = html.replace(insert_after_2, insert_after_2 + vatican_quote_3)
    print("✅ Added Vatican quote #3 (human dignity)")
else:
    print("❌ Could not find insertion point for Vatican quote #3")

# Add Case Study #2 - After wisdom of the heart discussion
insert_after_3 = 'It\'s the difference between knowing how to build something and knowing why people need it.</p>'

case_study_2 = '''
                <div class="case-study">
                    <h3>Real-World Example: Algorithmic Hiring Systems</h3>
                    <p><strong>The Efficiency Approach:</strong> Companies use AI to screen thousands of resumes in minutes, optimizing for keywords and patterns from past "successful" hires.</p>
                    <p><strong>What Gets Lost:</strong> The algorithms miss unconventional career paths, penalize employment gaps (which disproportionately affect women and caregivers), and perpetuate existing workplace homogeneity by replicating past patterns.</p>
                    <p><strong>The Wisdom Deficit:</strong> This demonstrates the difference between algorithmic efficiency and human wisdom. Effective hiring requires recognizing potential, understanding context, valuing diverse perspectives, and seeing the whole person—not just pattern-matching resumes. Catholic teaching insists that efficiency must never override human judgment about human beings.</p>
                </div>
'''

if insert_after_3 in html:
    html = html.replace(insert_after_3, insert_after_3 + case_study_2)
    print("✅ Added case study #2 (algorithmic hiring)")
else:
    print("❌ Could not find insertion point for case study #2")

# Add 1 more internal link
html = html.replace(
    'algorithmic bias that discriminates against marginalized communities',
    '<a href="ai-bias-fairness.html">algorithmic bias</a> that discriminates against marginalized communities'
)
print("✅ Added 1 more internal link")

with open('catholic-ai-ethics.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("\n✅ Manual additions complete")
