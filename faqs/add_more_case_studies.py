#!/usr/bin/env python3
"""
Add additional case studies to bring both pages to 2+ case studies
"""

print("="*80)
print("ADDING ADDITIONAL CASE STUDIES")
print("="*80)

# ============================================================================
# AI-HEALTHCARE.HTML - Add 1 more case study
# ============================================================================
print("\n📋 Adding case study to ai-healthcare.html...")

healthcare_case_study = '''
                <div class="case-study">
                    <h3>Real-World Example: Epic's Sepsis Prediction Algorithm</h3>
                    <p><strong>The Promise:</strong> Epic Systems deployed an AI algorithm across hundreds of hospitals to predict which patients would develop sepsis, a life-threatening condition requiring urgent treatment.</p>
                    <p><strong>The Problem:</strong> Investigation revealed the algorithm missed most sepsis cases (poor sensitivity) while generating numerous false alarms (poor specificity), leading to alert fatigue where doctors began ignoring warnings.</p>
                    <p><strong>The Catholic Lesson:</strong> This demonstrates the danger of over-reliance on AI in life-or-death medical decisions. Healthcare AI must be rigorously validated, continuously monitored, and always subject to experienced clinical judgment. Human physicians must maintain ultimate responsibility for patient care.</p>
                </div>
'''

try:
    with open('ai-healthcare.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Insert after discussion of AI limitations
    insert_marker = 'AI cannot replace the moral discernment required when medical decisions involve competing values and uncertain outcomes.</p>'
    
    if insert_marker in html:
        html = html.replace(insert_marker, insert_marker + '\n' + healthcare_case_study)
        print("  ✅ Added Epic Sepsis Algorithm case study")
    else:
        print("  ⚠️  Insertion point not found")
    
    with open('ai-healthcare.html', 'w', encoding='utf-8') as f:
        f.write(html)

except Exception as e:
    print(f"  ❌ Error: {e}")

# ============================================================================
# CATHOLIC-AI-ETHICS.HTML - Add 1 more case study
# ============================================================================
print("\n📋 Adding case study to catholic-ai-ethics.html...")

ethics_case_study = '''
                <div class="case-study">
                    <h3>Real-World Example: Clearview AI Facial Recognition</h3>
                    <p><strong>What Happened:</strong> Clearview AI scraped billions of photos from social media without consent to build a massive facial recognition database sold to law enforcement and private companies.</p>
                    <p><strong>The Ethical Violations:</strong> This violated privacy rights, dignity (reducing persons to biometric data points), and consent. People's faces were harvested and commodified without their knowledge or permission. The technology enabled mass surveillance capabilities.</p>
                    <p><strong>The Catholic Response:</strong> This case demonstrates multiple violations of Catholic AI ethics: lack of informed consent, treating persons as mere data, enabling surveillance that threatens freedom, and prioritizing profit over human dignity. The Church teaches that facial recognition technology requires strict ethical guardrails and must never be deployed without robust protections for privacy and human rights.</p>
                </div>
'''

try:
    with open('catholic-ai-ethics.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Insert after discussion of privacy/surveillance
    insert_marker = 'The system treats human persons as data points to be optimized for state preferences.</p>'
    
    if insert_marker in html:
        html = html.replace(insert_marker, insert_marker + '\n' + ethics_case_study)
        print("  ✅ Added Clearview AI case study")
    else:
        print("  ⚠️  Insertion point not found")
    
    with open('catholic-ai-ethics.html', 'w', encoding='utf-8') as f:
        f.write(html)

except Exception as e:
    print(f"  ❌ Error: {e}")

print("\n" + "="*80)
print("✅ Case studies addition complete")
print("="*80)
