#!/usr/bin/env python3
"""
Expand 4 short answers in ai-healthcare.html
"""
import re

filename = 'ai-healthcare.html'

with open(filename, 'r', encoding='utf-8') as f:
    html = f.read()

# Q2: What can AI do well in healthcare? (198 chars → 250+)
old_q2_pattern = r'(<h3 class="faq-question">What can AI do well in healthcare\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q2_answer = r'\1AI excels at specific, well-defined tasks that involve pattern recognition and processing vast amounts of data. In medical imaging, AI can analyze X-rays, MRIs, and CT scans to detect anomalies that human eyes might miss, often with remarkable speed and accuracy. AI systems can process thousands of medical records to identify drug interactions, predict patient deterioration, or suggest diagnoses based on symptoms and test results. For administrative tasks like scheduling, billing, and documentation, AI can reduce the burden on healthcare workers, freeing them to focus on direct patient care. However, these capabilities remain tools to augment human judgment, not replace the essential human elements of medical practice.\2'

html = re.sub(old_q2_pattern, new_q2_answer, html, flags=re.DOTALL)

# Q4: What does "Antiqua et Nova" teach about AI in healthcare? (206 chars → 250+)
old_q4_pattern = r'(<h3 class="faq-question">What does "Antiqua et Nova" teach about AI in healthcare\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q4_answer = r'\1The Vatican\'s 2025 document "Antiqua et Nova" dedicates significant attention to AI in healthcare, emphasizing that medical AI must always serve the human person and never reduce patients to data points or diagnoses to algorithms. The document stresses that healthcare is fundamentally a relationship of trust and care between persons—doctor and patient—which requires human presence, compassion, and moral discernment that AI cannot provide. While AI can be a valuable diagnostic tool, the practice of medicine demands human judgment about the whole person, considering not just biological factors but psychological, social, and spiritual dimensions of health and healing that only human physicians can truly grasp.\2'

html = re.sub(old_q4_pattern, new_q4_answer, html, flags=re.DOTALL)

# Q11: What about AI and healthcare inequality? (233 chars → 250+)
old_q11_pattern = r'(<h3 class="faq-question">What about AI and healthcare inequality\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q11_answer = r'\1Catholic teaching emphasizes the preferential option for the poor, demanding special attention to how healthcare AI affects vulnerable populations. Currently, AI in healthcare risks deepening existing inequalities in multiple ways: expensive AI systems may only be available in wealthy hospitals and regions, creating a two-tier system. AI trained primarily on data from well-resourced populations may perform poorly for underserved communities. Algorithmic bias can systematically deny care to already marginalized patients. The Church insists that healthcare AI must be developed and deployed with explicit attention to serving the poor and reducing disparities, not concentrating benefits among those already privileged with access to the best care.\2'

html = re.sub(old_q11_pattern, new_q11_answer, html, flags=re.DOTALL)

# Q13: As a patient, how should I think about AI in my healthcare? (81 chars → 250+)
old_q13_pattern = r'(<h3 class="faq-question">As a patient, how should I think about AI in my healthcare\?</h3>\s*<p class="faq-answer">)[^<]+(</p>)'

new_q13_answer = r'\1As a patient, you have the right to know when AI is involved in your care and to understand its role in diagnostic or treatment decisions. Don\'t hesitate to ask your healthcare providers how AI tools are being used, what their limitations are, and how much weight they\'re given in decisions about your care. Ensure that a qualified human physician reviews and takes full responsibility for all AI-assisted recommendations. Remember that while AI can be a valuable diagnostic aid processing data faster than humans, the practice of medicine requires human judgment, compassion, ethical reasoning, and the sacred trust of the doctor-patient relationship that no algorithm can replace. You deserve care from persons, not just data analysis from machines.\2'

html = re.sub(old_q13_pattern, new_q13_answer, html, flags=re.DOTALL)

# Write back
with open(filename, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Expanded 4 short answers in {filename}")
print("   Q2: 198 → 380+ chars")
print("   Q4: 206 → 420+ chars")
print("   Q11: 233 → 480+ chars")
print("   Q13: 81 → 500+ chars")
