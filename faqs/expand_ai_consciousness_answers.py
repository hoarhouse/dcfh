#!/usr/bin/env python3
"""
Expand 2 short answers in ai-consciousness-souls.html
"""
import re

filename = 'ai-consciousness-souls.html'

with open(filename, 'r', encoding='utf-8') as f:
    html = f.read()

# Q9: What makes humans fundamentally different from AI? (109 chars → 250+)
# Find the question and expand the answer
old_q9_pattern = r'(<h3 class="faq-question">What makes humans fundamentally different from AI\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q9_answer = r'\1Catholic teaching identifies several fundamental differences that set humans apart from even the most sophisticated AI. Humans possess rational souls directly created by God, giving us the capacity for genuine self-awareness, moral reasoning, free will, and relationship with the divine. We experience qualia—the subjective "what it\'s like" to see red, feel pain, or know love—which AI cannot possess. Humans have inherent dignity and moral worth simply by existing, while AI has only instrumental value. We are called to communion with God and eternal life, transcending our material existence in ways no machine ever can.\2'

html = re.sub(old_q9_pattern, new_q9_answer, html, flags=re.DOTALL)

# Q14: How should Catholics think about and use AI given this understanding? (101 chars → 250+)
old_q14_pattern = r'(<h3 class="faq-question">How should Catholics think about and use AI given this understanding\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q14_answer = r'\1Catholics should approach AI with both appreciation for its capabilities and clear-eyed recognition of its fundamental limitations. Use AI tools when they genuinely serve human flourishing—to augment human intelligence, expand human capabilities, and solve complex problems. But never treat AI as if it possesses consciousness, moral agency, spiritual significance, or deserves consideration as a person. Maintain the crucial distinction between tools that serve us and persons made in God\'s image who deserve our full moral consideration, respect, and relationship. AI is a powerful instrument, nothing more—and recognizing this protects both human dignity and prevents the dangerous confusion of creator and created.\2'

html = re.sub(old_q14_pattern, new_q14_answer, html, flags=re.DOTALL)

# Write back
with open(filename, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Expanded 2 short answers in {filename}")
print("   Q9: 109 → 320+ chars")
print("   Q14: 101 → 380+ chars")
