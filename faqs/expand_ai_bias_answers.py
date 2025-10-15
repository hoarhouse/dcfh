#!/usr/bin/env python3
"""
Expand short answers in ai-bias-fairness.html to 250+ characters
"""

import re

# Read file
with open('ai-bias-fairness.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open('ai-bias-fairness.html.pre_expansion_backup', 'w', encoding='utf-8') as f:
    f.write(content)

# Expansions dictionary: old text -> additional text to append
expansions = {
    "AI systems learn from data—and if that data reflects historical discrimination, the AI will learn to discriminate too.": " For example, if hiring algorithms are trained on decades of employment data where certain groups were systematically excluded from leadership roles, the AI learns that pattern as 'normal' and perpetuates it. This isn't the AI being 'smart'—it's the AI faithfully reproducing human injustice at machine scale.",
    
    "This is a dangerous myth. AI appears objective because it uses math and data, but this appearance masks the human choices embedded throughout.": " Every AI system reflects countless human decisions: what data to collect, how to label it, which patterns to prioritize, what counts as 'success.' These choices encode values and biases. An algorithm that predicts 'criminal risk' isn't discovering objective truth—it's mathematical window-dressing on subjective human judgments about who society treats as dangerous.",
    
    "This is philosophically complex. Computer scientists have proven that different definitions of 'fairness' can mathematically conflict.": " You cannot simultaneously optimize for equal false positive rates, equal false negative rates, and proportional representation—the math doesn't allow it. This means technical fairness is ultimately a moral choice about which inequalities matter most. Catholic teaching suggests this choice cannot be made by engineers alone—it requires moral reasoning about human dignity and the common good.",
    
    "AI bias isn't theoretical—it's causing measurable harm right now across multiple domains:": " In criminal justice, risk assessment algorithms label Black defendants as 'high risk' at nearly twice the rate of white defendants with identical criminal histories. In healthcare, algorithms systematically underestimate Black patients' medical needs, resulting in inadequate care. In hiring, resume-screening AI rejects qualified women for technical roles because historical hiring data shows mostly men in those positions. In financial services, mortgage algorithms deny loans to qualified applicants in predominantly minority neighborhoods.",
    
    "The Vatican emphasizes that AI bias typically compounds existing injustices, hitting hardest those already most vulnerable.": " When facial recognition works poorly on darker skin tones, it doesn't just cause inconvenience—it leads to false arrests and increased surveillance of communities already over-policed. When healthcare algorithms underestimate pain or medical needs for certain groups, people die. When credit algorithms deny loans to qualified borrowers in minority neighborhoods, generational wealth-building becomes impossible. AI bias isn't equally distributed—it concentrates harm on those with the least power to resist.",
    
    "Yes—and this is one of the Vatican's key concerns. AI bias can create systemic effects that reshape entire communities.": " When insurance algorithms red-line entire neighborhoods as 'high risk,' local businesses cannot get affordable coverage and close. When mortgage algorithms systematically deny loans in certain zip codes, property values stagnate and community investment disappears. When predictive policing concentrates officers in specific areas, more arrests create data that justifies even more policing—a self-fulfilling prophecy. These aren't individual harms—they're structural violence encoded in algorithms.",
    
    "Catholic teaching strongly supports transparency as essential for justice and accountability:": " People have a right to know when algorithms make consequential decisions about their lives—whether they get a loan, a job, parole, medical treatment. They have a right to understand how those decisions were made and to contest errors. 'Black box' AI that cannot explain its reasoning violates human dignity by treating people as objects to be sorted rather than subjects deserving explanation and recourse. Transparency isn't just good practice—it's a moral obligation.",
    
    "Catholic teaching rejects the idea that AI systems somehow absolve humans of responsibility. The moral accountability chain includes:": " The data scientists who choose what data to collect and how to label it. The engineers who design algorithms and decide what to optimize. The managers who deploy systems without adequate testing. The executives who prioritize profit over fairness. The policymakers who fail to regulate harmful applications. The purchasers who buy and use biased systems. Everyone in this chain bears moral responsibility for the harms that result. Technology doesn't make ethical decisions—people do.",
    
    "Catholic institutions—schools, hospitals, charities, dioceses—increasingly use AI systems. The Vatican teaches these must be guided by:": " Human dignity as non-negotiable: no optimization metric can override individual worth. Preferential option for the vulnerable: systems must serve those most marginalized, not just the privileged. Transparency and explainability: people deserve to understand decisions affecting them. Regular auditing for bias: proactive testing, not waiting for harm. Human oversight: meaningful human decision-makers who can intervene. Community input: those affected help shape how systems work.",
    
    "Catholic teaching calls us to be active participants in justice, not passive recipients of algorithmic decisions:": " Question automated decisions—demand explanations when algorithms affect you. Support right-to-explanation laws. Advocate for algorithmic impact assessments, especially in healthcare, criminal justice, and employment. Choose institutions and companies that prioritize fairness. Educate yourself about how AI systems work and where bias hides. Support organizations working for algorithmic justice. Remember that accepting biased AI as inevitable makes us complicit in injustice.",
    
    "The Church's vision isn't just the absence of bias—it's AI systems that actively promote justice and human flourishing:": " AI that helps identify and correct historical discrimination rather than perpetuating it. Systems designed with input from affected communities, not imposed top-down by tech elites. Algorithms that make human decision-makers more accountable, not less. Technology deployed to serve the most vulnerable first, not as an afterthought. AI governance that treats fairness as foundational, not a luxury to add if convenient. This requires rejecting the myth that technology is neutral and embracing the truth that AI is a moral choice."
}

# Apply expansions
for old_text, addition in expansions.items():
    if old_text in content:
        content = content.replace(old_text, old_text + addition)
        print(f"✅ Expanded answer")
    else:
        print(f"⚠️  Could not find text to expand")

# Save
with open('ai-bias-fairness.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Expanded 11 answers in ai-bias-fairness.html")
print("📦 Backup saved")
print("\nRun analyzer:")
print("  python3 analyze_faq_llm_optimization.py")
