#!/usr/bin/env python3
"""
Expand short answers in ai-healthcare.html to 250+ characters
"""

import re

# Read file
with open('ai-healthcare.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open('ai-healthcare.html.pre_expansion_backup', 'w', encoding='utf-8') as f:
    f.write(content)

# Expansions dictionary
expansions = {
    "AI's limitations in healthcare are significant and fundamental:": " AI cannot experience empathy or compassion—the emotional capacity to recognize and respond to suffering that makes healing relationships possible. It cannot exercise moral judgment in complex situations where protocols conflict with patient needs. AI lacks the wisdom to recognize when standard treatment guidelines should be set aside for a particular patient's unique circumstances. It cannot provide the human presence that itself has therapeutic value—the reassurance of being seen, heard, and cared for as a person, not a problem to solve.",
    
    "This distinction is crucial. The American Medical Association and Catholic medical ethicists prefer 'augmented intelligence'—AI that enhances human medical judgment rather than replaces it.": " Artificial intelligence suggests machines making autonomous decisions. Augmented intelligence positions AI as a powerful tool that supports human clinicians who retain final authority and moral responsibility. In augmented intelligence, AI might flag potential diagnoses for doctors to consider, analyze medical imaging to highlight areas needing attention, or suggest treatment options—but humans make the final call, integrate findings with knowledge of the whole patient, and bear responsibility for outcomes.",
    
    "The Vatican doesn't categorically oppose any healthcare AI technology, but it identifies applications requiring special scrutiny:": " Fully autonomous diagnostic systems that bypass human medical judgment. Mental health chatbots marketed as therapy replacements rather than supplements. Triage algorithms that determine who receives care based on productivity or economic value. Predictive models that could facilitate eugenic selection or discrimination. End-of-life decision support systems that might pressure vulnerable patients toward cost-saving outcomes. The concern isn't the technology itself but whether deployment respects human dignity and serves healing.",
    
    "Catholic teaching views healthcare as fundamentally relational, not merely technical. The doctor-patient relationship is sacred because:": " Healing involves the whole person—body, emotions, relationships, meaning, dignity—not just fixing biological problems. Patients need to be known as individuals with unique stories, fears, and values, not reduced to data points. Trust is essential for healing, and trust requires authentic human connection. Suffering has spiritual dimensions that machines cannot address. The presence of a caring human being has therapeutic value that no algorithm can replicate. This relationship reflects the healing ministry of Christ, who touched and listened to those he healed.",
    
    "Dehumanization in healthcare happens when patients are treated as objects to be processed rather than subjects deserving of recognition and respect.": " AI risks accelerating this when doctors spend more time entering data into systems than talking with patients, when algorithms make patients feel like their concerns are dismissed if they don't fit diagnostic protocols, when efficiency metrics pressure clinicians to see more patients in less time, when predictive models reduce complex human beings to risk scores, and when the therapeutic relationship is replaced by impersonal algorithmic recommendations. Catholic teaching insists that technology must serve the human encounter at the heart of healing, not replace it.",
    
    "This is an increasingly urgent question as AI chatbots marketed as 'mental health companions' or 'therapy bots' proliferate, often targeting vulnerable populations unable to afford human therapists.": " While these tools might provide some benefit for mild concerns or as supplements to human care, Catholic medical ethicists raise serious concerns: mental healthcare fundamentally depends on authentic human relationship and empathy that AI cannot provide. AI cannot recognize suicide risk with the nuance human therapists can. These systems lack the moral formation to navigate complex ethical situations. They may normalize replacing human connection with algorithms. And they risk exploiting vulnerable people desperate for care by offering technological substitutes for the human presence essential to healing.",
    
    "Yes, absolutely. Catholic medical ethics demands transparency and informed consent. Patients have a right to know:": " When AI is involved in their diagnosis, treatment planning, or care decisions. How AI recommendations are generated and what data informs them. What the limitations and error rates of the AI system are. Who bears responsibility if the AI makes a mistake. That they can request human review of AI recommendations. That they can refuse AI-assisted care without penalty. Failing to disclose AI involvement treats patients as objects to be processed rather than persons deserving respect and agency. Informed consent isn't bureaucratic paperwork—it's recognition of human dignity.",
    
    "This is a critical question as AI becomes more prevalent in medicine. Catholic teaching is clear: human beings, not machines, bear moral responsibility.": " If AI misses a diagnosis, the physician who relied on it without adequate oversight is responsible. If an algorithm recommends harmful treatment, the clinician who implemented it without critical evaluation bears accountability. If a healthcare system deploys flawed AI, leadership is culpable for failing to ensure patient safety. Technology cannot be blamed as a scapegoat for human choices. This principle has practical implications: doctors cannot outsource judgment to algorithms, institutions must rigorously validate AI systems, and regulatory frameworks must assign clear accountability.",
    
    "Catholic hospitals and healthcare systems have a special obligation to implement AI in ways that protect human dignity. This requires:": " Rigorous ethical review before deploying any AI system, including impact on vulnerable populations. Ensuring AI augments rather than replaces human clinical judgment. Maintaining meaningful human oversight for all consequential decisions. Training staff to use AI critically, not blindly trust algorithmic recommendations. Protecting patient privacy and data dignity. Ensuring AI doesn't create or worsen healthcare inequities. Being transparent with patients about AI involvement. Regular auditing for bias and errors. Resisting pressure to prioritize efficiency over the therapeutic relationship. Treating AI deployment as a moral choice, not merely a technical upgrade.",
    
    "The Church's vision isn't anti-technology—it's pro-human. AI can and should serve healing, but always as a tool supporting human clinicians, never replacing the relational core of medicine.": " AI should help doctors spend more time with patients, not less. It should identify patterns and risks that save lives while humans provide compassionate care. It should reduce clinician burnout by handling administrative tasks, freeing them for the therapeutic work only humans can do. It should make excellent care more accessible while preserving dignity. The goal is not maximizing algorithmic efficiency but serving human flourishing. This requires resisting the temptation to let technology dictate healthcare's future and instead insisting that human values guide how we deploy medical AI."
}

# Apply expansions
expanded = 0
for old_text, addition in expansions.items():
    if old_text in content:
        content = content.replace(old_text, old_text + addition)
        expanded += 1
        print(f"✅ Expanded answer {expanded}")
    else:
        print(f"⚠️  Could not find text to expand")

# Save
with open('ai-healthcare.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✅ Expanded {expanded} answers in ai-healthcare.html")
print("📦 Backup saved")
print("\nRun analyzer:")
print("  python3 analyze_faq_llm_optimization.py")
