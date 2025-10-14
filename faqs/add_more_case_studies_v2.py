#!/usr/bin/env python3
"""
Add case studies using actual text from the files
"""

print("="*80)
print("ADDING CASE STUDIES")
print("="*80)

# ============================================================================
# AI-HEALTHCARE.HTML
# ============================================================================
print("\n📋 Adding case study to ai-healthcare.html...")

healthcare_case_study = '''
                <div class="case-study">
                    <h3>Real-World Example: Epic's Sepsis Prediction Algorithm</h3>
                    <p><strong>The Promise:</strong> Epic Systems deployed an AI algorithm across hundreds of hospitals to predict which patients would develop sepsis, a life-threatening condition requiring urgent treatment.</p>
                    <p><strong>The Problem:</strong> Investigation revealed the algorithm missed most sepsis cases while generating numerous false alarms, leading to alert fatigue where doctors began ignoring warnings.</p>
                    <p><strong>The Catholic Lesson:</strong> This demonstrates the danger of over-reliance on AI in life-or-death medical decisions. Healthcare AI must be rigorously validated, continuously monitored, and always subject to experienced clinical judgment. Human physicians must maintain ultimate responsibility for patient care.</p>
                </div>
'''

try:
    with open('ai-healthcare.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Insert after the Antiqua et Nova paragraph
    insert_after = 'While AI can be a valuable diagnostic tool, the practice of medicine demands human judgment about the whole person, considering not just biological factors but psychological, social, and spiritual dimensions of health and healing that only human physicians can truly grasp.</p>'
    
    if insert_after in html:
        html = html.replace(insert_after, insert_after + '\n' + healthcare_case_study)
        print("  ✅ Added Epic Sepsis case study")
    else:
        print("  ⚠️  Could not find insertion point")
    
    with open('ai-healthcare.html', 'w', encoding='utf-8') as f:
        f.write(html)

except Exception as e:
    print(f"  ❌ Error: {e}")

# ============================================================================
# CATHOLIC-AI-ETHICS.HTML
# ============================================================================
print("\n📋 Adding case study to catholic-ai-ethics.html...")

ethics_case_study = '''
                <div class="case-study">
                    <h3>Real-World Example: Clearview AI Facial Recognition</h3>
                    <p><strong>What Happened:</strong> Clearview AI scraped billions of photos from social media without consent to build a massive facial recognition database sold to law enforcement and private companies.</p>
                    <p><strong>The Ethical Violations:</strong> This violated privacy rights, dignity (reducing persons to biometric data points), and consent. People's faces were harvested and commodified without knowledge or permission.</p>
                    <p><strong>The Catholic Response:</strong> This demonstrates multiple violations of Catholic AI ethics—lack of informed consent, treating persons as mere data, enabling surveillance that threatens freedom, and prioritizing profit over dignity. Facial recognition requires strict ethical guardrails and must never be deployed without robust protections for privacy and human rights.</p>
                </div>
'''

try:
    with open('catholic-ai-ethics.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Insert after social credit system discussion
    insert_after = 'This system treats human persons as data points to be optimized for state preferences. Low scores restrict fundamental freedoms. The AI enforces ideological conformity and punishes dissent, religious practice, or non-approved behavior.</p>'
    
    if insert_after in html:
        html = html.replace(insert_after, insert_after + '\n' + ethics_case_study)
        print("  ✅ Added Clearview AI case study")
    else:
        print("  ⚠️  Could not find insertion point")
    
    with open('catholic-ai-ethics.html', 'w', encoding='utf-8') as f:
        f.write(html)

except Exception as e:
    print(f"  ❌ Error: {e}")

print("\n" + "="*80)
print("✅ Process complete")
print("="*80)
