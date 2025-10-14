#!/usr/bin/env python3
"""
Expand 8 short answers in ai-jobs-catholic-teaching.html
NOTE: Q8 and Q9 already fixed earlier (had 0 chars, now have intro paragraphs)
"""
import re

filename = 'ai-jobs-catholic-teaching.html'

with open(filename, 'r', encoding='utf-8') as f:
    html = f.read()

# Q2: What are the three essential principles for AI and work? (84 chars → 250+)
old_q2_pattern = r'(<h3 class="faq-question">What are the three essential principles for AI and work\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q2_answer = r'\1Catholic teaching identifies three essential principles that must guide AI\'s impact on work. First, human dignity must be protected—workers are persons with inherent worth, not mere resources to be optimized for profit. Second, work serves the common good, not just economic efficiency or shareholder returns. Technology should benefit all of society, especially the vulnerable. Third, AI should augment human capabilities rather than simply replace human workers wherever possible. These principles demand that AI implementation consider not just efficiency gains but the full human and social costs of automation, ensuring technology serves justice and human flourishing rather than just maximizing corporate profit.\2'

html = re.sub(old_q2_pattern, new_q2_answer, html, flags=re.DOTALL)

# Q10: What can individual workers do to prepare for AI? (131 chars → 250+)
old_q10_pattern = r'(<h3 class="faq-question">What can individual workers do to prepare for AI\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q10_answer = r'\1The Catholic response to AI isn\'t passive resignation—it\'s active preparation while demanding justice. Workers should develop skills that complement AI rather than compete with it: creative problem-solving, ethical reasoning, emotional intelligence, and relationship-building that machines cannot replicate. Stay informed about how AI affects your industry and advocate collectively through unions or professional associations for fair transitions. Build financial resilience and explore portable benefits not tied to specific employers. But crucially, don\'t accept the narrative that worker displacement is inevitable—demand that companies share automation gains, provide retraining, and that governments create policies ensuring technology serves workers, not just capital.\2'

html = re.sub(old_q10_pattern, new_q10_answer, html, flags=re.DOTALL)

# Q11: How should Catholic employers approach AI automation? (146 chars → 250+)
old_q11_pattern = r'(<h3 class="faq-question">How should Catholic employers approach AI automation\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q11_answer = r'\1Catholic employers bear special moral obligations when implementing AI automation. They must measure not just economic gains but the full human cost of workforce changes. This means providing generous advance notice, comprehensive retraining programs, outplacement support, and considering job redesign that preserves employment rather than automatic replacement. Catholic Social Teaching demands that employers share automation productivity gains with workers through wage increases or profit-sharing, not just enriching executives and shareholders. Employers should prioritize augmentation strategies that enhance human workers over pure replacement, maintain meaningful human oversight and decision-making authority, and consider the impact on local communities whose economic health depends on stable employment.\2'

html = re.sub(old_q11_pattern, new_q11_answer, html, flags=re.DOTALL)

# Q12: What policies should governments adopt for AI and work? (138 chars → 250+)
old_q12_pattern = r'(<h3 class="faq-question">What policies should governments adopt for AI and work\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q12_answer = r'\1Catholic teaching calls governments to actively shape AI\'s labor impact toward justice rather than accepting market outcomes as inevitable. Essential policies include: requiring advance notice and worker consultation before major automation; mandating that companies share productivity gains through higher wages or reduced hours rather than pure job elimination; investing heavily in education, retraining, and lifelong learning programs; creating portable benefits and strong social safety nets that recognize work\'s centrality to dignity even when traditional employment is disrupted; strengthening collective bargaining rights so workers have power to negotiate AI implementation; and potentially exploring ideas like robot taxes to fund transition support or universal basic services ensuring everyone can live with dignity.\2'

html = re.sub(old_q12_pattern, new_q12_answer, html, flags=re.DOTALL)

# Q13: What must we resist in the AI revolution? (160 chars → 250+)
old_q13_pattern = r'(<h3 class="faq-question">What must we resist in the AI revolution\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q13_answer = r'\1We must resist several dangerous narratives that serve to concentrate power and wealth while abandoning workers. First, reject technological determinism—the claim that job displacement is inevitable and we must simply accept it. Technology\'s impact depends on human choices about how to develop and deploy it. Second, resist the reduction of work to mere economic transaction, ignoring its role in human dignity, community, and meaning. Third, oppose the narrative that displaced workers are personally responsible for their obsolescence through failure to "adapt." Fourth, reject the concentration of automation benefits among capital owners and executives while workers bear all the costs. The Catholic vision insists we can and must shape technology toward justice.\2'

html = re.sub(old_q13_pattern, new_q13_answer, html, flags=re.DOTALL)

# Q14: What should we choose instead? (20 chars → 250+)
old_q14_pattern = r'(<h3 class="faq-question">What should we choose instead\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q14_answer = r'\1We should choose a vision of AI that augments rather than replaces human work, distributes benefits broadly rather than concentrating wealth, and prioritizes human dignity over pure efficiency. This means supporting policies that require companies to share automation gains with workers through higher wages, shorter hours, or profit-sharing. It means investing in education and retraining that treats workers as persons with potential, not disposable resources. It means creating portable benefits and social safety nets that recognize work\'s centrality to human dignity even as employment patterns shift. It means empowering workers through strong unions to negotiate technology implementation. The Catholic vision calls us to actively shape technology\'s development toward justice rather than passively accepting whatever outcomes maximize profit.\2'

html = re.sub(old_q14_pattern, new_q14_answer, html, flags=re.DOTALL)

# Write back
with open(filename, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Expanded 6 short answers in {filename}")
print("   Q2: 84 → 450+ chars")
print("   Q10: 131 → 500+ chars")
print("   Q11: 146 → 520+ chars")
print("   Q12: 138 → 580+ chars")
print("   Q13: 160 → 520+ chars")
print("   Q14: 20 → 580+ chars")
print("   (Q8 & Q9 already fixed earlier)")
