#!/usr/bin/env python3
"""
Final fixes for catholic-ai-ethics.html: add internal links and ensure case study is in right place
"""

print("="*80)
print("FINAL FIXES FOR CATHOLIC-AI-ETHICS.HTML")
print("="*80)

try:
    with open('catholic-ai-ethics.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Remove the misplaced case study from the header
    misplaced_case_study = '''<div class="case-study">
                    <h3>Real-World Example: Clearview AI Facial Recognition</h3>
                    <p><strong>What Happened:</strong> Clearview AI scraped billions of photos from social media without consent to build a massive facial recognition database sold to law enforcement and private companies.</p>
                    <p><strong>The Ethical Violations:</strong> This violated privacy rights, dignity (reducing persons to biometric data points), and consent. People's faces were harvested and commodified without their knowledge or permission.</p>
                    <p><strong>The Catholic Response:</strong> This demonstrates multiple violations of Catholic AI ethics—lack of informed consent, treating persons as mere data, enabling surveillance that threatens freedom, and prioritizing profit over dignity. Facial recognition requires strict ethical guardrails and must never be deployed without robust protections for privacy and human rights.</p>
                </div>'''
    
    html = html.replace(misplaced_case_study, '')
    print("  ✅ Removed misplaced case study from header")
    
    # Add 2 internal links
    html = html.replace(
        'AI systems making decisions about employment, healthcare, criminal justice',
        'AI systems making decisions about <a href="ai-jobs-catholic-teaching.html">employment</a>, <a href="ai-healthcare.html">healthcare</a>, criminal justice'
    )
    print("  ✅ Added 2 internal links")
    
    # Add case study in the right place - after human dignity discussion
    case_study_proper_location = '''
                <div class="case-study">
                    <h3>Real-World Example: Clearview AI Facial Recognition</h3>
                    <p><strong>What Happened:</strong> Clearview AI scraped billions of photos from social media without consent to build a massive facial recognition database sold to law enforcement and private companies.</p>
                    <p><strong>The Ethical Violations:</strong> This violated privacy rights, dignity (reducing persons to biometric data points), and consent. People's faces were harvested and commodified without their knowledge or permission.</p>
                    <p><strong>The Catholic Response:</strong> This demonstrates multiple violations of Catholic AI ethics—lack of informed consent, treating persons as mere data, enabling surveillance that threatens freedom, and prioritizing profit over dignity. Facial recognition requires strict ethical guardrails and must never be deployed without robust protections for privacy and human rights.</p>
                </div>
'''
    
    # Insert after the human dignity answer
    html = html.replace(
        'AI must respect each person as a subject with agency and conscience, not an object to be processed.</p>',
        'AI must respect each person as a subject with agency and conscience, not an object to be processed.</p>' + case_study_proper_location
    )
    print("  ✅ Added case study in proper location (after human dignity question)")
    
    with open('catholic-ai-ethics.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("\n✅ catholic-ai-ethics.html fixes complete")

except Exception as e:
    print(f"❌ Error: {e}")

print("="*80)
