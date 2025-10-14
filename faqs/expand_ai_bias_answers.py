#!/usr/bin/env python3
"""
Expand 6 short answers in ai-bias-fairness.html
"""
import re

filename = 'ai-bias-fairness.html'

with open(filename, 'r', encoding='utf-8') as f:
    html = f.read()

# Q2: How does bias get into AI systems? (153 chars → 250+)
html = re.sub(
    r'(<h3 class="faq-question">How does bias get into AI systems\?</h3>\s*<p class="faq-answer">)Humans have always been capable of lying\. But AI changes three critical factors: scale, speed, and sophistication\.(</p>)',
    r'\1AI systems learn from data—and if that data reflects historical discrimination, the AI will learn to discriminate. There are multiple pathways through which bias enters AI systems, from biased training data that reflects past injustices, to sampling bias where certain groups are underrepresented, to measurement bias where proxies inadvertently encode discrimination. Even well-intentioned developers can introduce bias through their own blind spots and assumptions about how systems will be used.\2',
    html,
    flags=re.DOTALL
)

# Q4: What does Catholic Social Teaching say about AI bias? (117 chars → 250+)
old_q4 = r'(<h3 class="faq-question">What does Catholic Social Teaching say about AI bias\?</h3>\s*<p class="faq-answer">)Catholic Social Teaching provides a clear moral framework for addressing AI bias, grounded in fundamental principles:(</p>)'

new_q4 = r'\1Catholic Social Teaching provides a clear moral framework for addressing AI bias, rooted in the fundamental principles of human dignity, justice, and the preferential option for the poor. Every person possesses inherent worth as created in God\'s image, and AI systems that treat people differently based on race, gender, or class violate this fundamental equality. The Church\'s emphasis on distributive justice demands that technology benefits everyone fairly, not just the privileged, while the preferential option for the poor requires special attention to how AI affects already marginalized communities who typically bear the heaviest burden of algorithmic discrimination.\2'

html = re.sub(old_q4, new_q4, html, flags=re.DOTALL)

# Q5: Is AI bias a sin? (194 chars → 250+)
old_q5 = r'(<h3 class="faq-question">Is AI bias a sin\?</h3>\s*<p class="faq-answer">)The moral culpability depends on knowledge and intent, but Catholic teaching is clear that unjust discrimination—whether by humans or AI systems they create—is morally wrong\.(</p>)'

new_q5 = r'\1The moral culpability depends on knowledge and intent, but Catholic teaching is clear that unjust discrimination—whether by humans or AI systems they create—is morally wrong. Creating biased AI knowingly is morally culpable, as you\'re building systems that discriminate. Deploying AI without testing for bias constitutes negligence, since you\'re responsible for foreseeable harms. Continuing to use biased AI after learning of its discrimination makes you complicit in injustice. Hiding behind "the algorithm decided" represents moral evasion, as humans made the system and remain responsible for its impacts.\2'

html = re.sub(old_q5, new_q5, html, flags=re.DOTALL)

# Q7: What are concrete examples of AI bias causing real harm? (89 chars → 250+)
old_q7 = r'(<h3 class="faq-question">What are concrete examples of AI bias causing real harm\?</h3>\s*<p class="faq-answer">)The Vatican warns that "while the images or videos themselves may be artificial, the damage they cause is real\."(</p>)'

new_q7 = r'\1AI bias isn\'t theoretical—it\'s causing measurable harm right now across multiple domains affecting real people\'s lives, livelihoods, and fundamental rights. From criminal justice algorithms that wrongly flag Black defendants as high-risk at twice the rate of white defendants with identical histories, to healthcare systems that systematically deny Black patients needed care, to hiring algorithms that filter out women\'s resumes, to housing screening tools that perpetuate redlining—biased AI is actively discriminating at massive scale. The Vatican specifically warns that these harms are real and often irreversible, destroying opportunities and reinforcing systemic injustice.\2'

html = re.sub(old_q7, new_q7, html, flags=re.DOTALL)

# Q10: What technical steps can reduce AI bias? (149 chars → 250+)
old_q10 = r'(<h3 class="faq-question">What technical steps can reduce AI bias\?</h3>\s*<p class="faq-answer">)The Vatican emphasizes that addressing AI bias requires both technical and ethical approaches:(</p>)'

new_q10 = r'\1The Vatican emphasizes that addressing AI bias requires both technical and ethical approaches working together. Technical solutions alone cannot solve what is fundamentally a moral problem, but they are necessary tools in the pursuit of justice. This includes assembling diverse development teams who can identify potential harms, carefully auditing training data for historical bias, implementing fairness testing across demographic groups, using adversarial testing to actively search for discrimination, conducting regular algorithmic audits by independent parties, maintaining ongoing monitoring after deployment to catch emerging bias, and preserving meaningful human oversight for all high-stakes decisions.\2'

html = re.sub(old_q10, new_q10, html, flags=re.DOTALL)

# Q14: How can individuals recognize and resist biased AI? (113 chars → 250+)
old_q14 = r'(<h3 class="faq-question">How can individuals recognize and resist biased AI\?</h3>\s*<p class="faq-answer">)Catholic teaching calls us to be defenders of truth\. When you encounter AI deception:(</p>)'

new_q14 = r'\1Catholic teaching calls us to be active participants in justice, not passive recipients of algorithmic decisions. This means recognizing when AI is involved in important decisions about your life, demanding explanations when you\'re denied opportunities, documenting patterns of potential discrimination, advocating for transparency policies and accountability mechanisms, and standing in solidarity with marginalized communities who bear the heaviest burden of biased AI. You have a moral obligation to question systems that seem unfair and to push for justice even—especially—when you personally benefit from current arrangements.\2'

html = re.sub(old_q14, new_q14, html, flags=re.DOTALL)

# Write back
with open(filename, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Expanded 6 short answers in {filename}")
print("   Q2: 153 → 280+ chars")
print("   Q4: 117 → 320+ chars")  
print("   Q5: 194 → 290+ chars")
print("   Q7: 89 → 350+ chars")
print("   Q10: 149 → 340+ chars")
print("   Q14: 113 → 330+ chars")
