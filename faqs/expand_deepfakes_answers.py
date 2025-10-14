#!/usr/bin/env python3
"""
Expand 6 short answers in deepfakes-misinformation.html
"""
import re

filename = 'deepfakes-misinformation.html'

with open(filename, 'r', encoding='utf-8') as f:
    html = f.read()

# Q2: How does AI enable misinformation differently than traditional lies? (114 chars → 250+)
old_q2_pattern = r'(<h3 class="faq-question">How does AI enable misinformation differently than traditional lies\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q2_answer = r'\1Humans have always been capable of lying, but AI transforms misinformation in three critical ways that make it uniquely dangerous. First is scale—traditional misinformation required human effort to create and spread, but AI can generate thousands of fake articles, images, or videos in minutes and spread them across millions of accounts simultaneously. Second is speed—a fake video can go viral and influence an election before fact-checkers even identify it as false. Third is sophistication—old photo manipulation was detectable by experts, but modern deepfakes are often indistinguishable from reality even to trained observers using advanced detection tools. This combination makes AI-powered misinformation unprecedented in its potential to overwhelm truth.\2'

html = re.sub(old_q2_pattern, new_q2_answer, html, flags=re.DOTALL)

# Q3: What is "AI hallucination" and why is it dangerous? (164 chars → 250+)
old_q3_pattern = r'(<h3 class="faq-question">What is "AI hallucination" and why is it dangerous\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q3_answer = r'\1AI "hallucination" occurs when AI systems generate information that sounds plausible but is completely false—not intentionally lying, but producing confident-sounding fabrications because of how they\'re designed. Large language models are trained to produce probable-sounding responses based on patterns in their training data. They\'re not designed to verify truth—they\'re designed to complete text in ways that sound human-like and authoritative. This is dangerous because people trust AI outputs without verification, hallucinations often mix true and false information seamlessly making them hard to detect, the confident authoritative tone makes fabrications believable, and many users don\'t even know hallucination is possible so they accept AI statements as fact.\2'

html = re.sub(old_q3_pattern, new_q3_answer, html, flags=re.DOTALL)

# Q5: Why does Catholic teaching emphasize truth so strongly? (245 chars → 250+)
old_q5_pattern = r'(<h3 class="faq-question">Why does Catholic teaching emphasize truth so strongly\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q5_answer = r'\1Catholic theology grounds truth in the very nature of God himself. Jesus declared "I am the way, the truth, and the life" (John 14:6), revealing that truth isn\'t just accuracy—it\'s participation in divine reality. Truth matters because it reflects God\'s nature and character, respects human dignity by treating people as rational beings worthy of truth rather than objects to manipulate, enables the trust necessary for community and the common good, and connects us to reality as it actually exists rather than comfortable illusions. When AI-generated fiction replaces truth, we lose our grounding in what\'s real and our capacity for genuine wisdom that requires honest encounter with reality.\2'

html = re.sub(old_q5_pattern, new_q5_answer, html, flags=re.DOTALL)

# Q7: How are deepfakes being used to harm real people? (112 chars → 250+)
old_q7_pattern = r'(<h3 class="faq-question">How are deepfakes being used to harm real people\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q7_answer = r'\1The damage from deepfakes is not hypothetical—it\'s happening now with devastating real-world consequences. The Vatican specifically warns that "while the images or videos themselves may be artificial, the damage they cause is real." Deepfakes are being weaponized for political manipulation through fake videos of candidates making racist statements or accepting bribes that sway elections before they\'re debunked. Financial fraud uses deepfake audio of executives\' voices to authorize fraudulent wire transfers. Deepfake pornography places people\'s faces—overwhelmingly women—onto explicit content without consent, destroying reputations and careers. Scammers use AI voice cloning to fake kidnappings, calling elderly parents with their "child\'s" voice begging for ransom.\2'

html = re.sub(old_q7_pattern, new_q7_answer, html, flags=re.DOTALL)

# Q9: How does AI-generated misinformation threaten social trust? (111 chars → 250+)
old_q9_pattern = r'(<h3 class="faq-question">How does AI-generated misinformation threaten social trust\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q9_answer = r'\1The Vatican warns that AI deception poses an existential threat to the trust necessary for society to function, going beyond individual lies to risk systemic breakdown. This happens through a cascading crisis: first comes uncertainty as people encounter deepfakes and can\'t distinguish real from fake, creating widespread confusion. Then suspicion spreads—once people know deepfakes exist, they begin doubting everything, even authentic content. Next comes polarization as people without shared facts retreat into echo chambers that confirm their biases, with everyone accusing opponents of spreading "fake news." Finally, social collapse looms when no one can agree on basic reality, making cooperation, democratic discourse, and justice itself impossible.\2'

html = re.sub(old_q9_pattern, new_q9_answer, html, flags=re.DOTALL)

# Q11: What should I do if I encounter deepfakes or AI misinformation? (52 chars → 250+)
old_q11_pattern = r'(<h3 class="faq-question">What should I do if I encounter deepfakes or AI misinformation\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q11_answer = r'\1Catholic teaching calls us to be defenders of truth in the digital age. When you encounter suspected deepfakes or AI-generated misinformation, first and most importantly, don\'t share it—even to "debunk" it, as sharing gives harmful content wider reach and oxygen. Instead, verify information through multiple reputable sources before believing or acting on it. Report clearly harmful content through platform mechanisms, especially content targeting individuals. If someone you know has shared misinformation, correct them privately and respectfully rather than publicly shaming them, as shame rarely helps and often entrenches false beliefs. Model critical thinking in your own behavior by habitually asking "How do we know this is true?" and making verification a consistent practice before accepting or spreading information.\2'

html = re.sub(old_q11_pattern, new_q11_answer, html, flags=re.DOTALL)

# Write back
with open(filename, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Expanded 6 short answers in {filename}")
print("   Q2: 114 → 520+ chars")
print("   Q3: 164 → 480+ chars")
print("   Q5: 245 → 500+ chars")
print("   Q7: 112 → 550+ chars")
print("   Q9: 111 → 520+ chars")
print("   Q11: 52 → 620+ chars")
