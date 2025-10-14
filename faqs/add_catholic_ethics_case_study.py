#!/usr/bin/env python3

ethics_case_study = '''
                <div class="case-study">
                    <h3>Real-World Example: Clearview AI Facial Recognition</h3>
                    <p><strong>What Happened:</strong> Clearview AI scraped billions of photos from social media without consent to build a massive facial recognition database sold to law enforcement and private companies.</p>
                    <p><strong>The Ethical Violations:</strong> This violated privacy rights, dignity (reducing persons to biometric data points), and consent. People's faces were harvested and commodified without their knowledge or permission.</p>
                    <p><strong>The Catholic Response:</strong> This demonstrates multiple violations of Catholic AI ethics—lack of informed consent, treating persons as mere data, enabling surveillance that threatens freedom, and prioritizing profit over dignity. Facial recognition requires strict ethical guardrails and must never be deployed without robust protections for privacy and human rights.</p>
                </div>
'''

print("Adding case study to catholic-ai-ethics.html...")

try:
    with open('catholic-ai-ethics.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Find the FAQ section about human dignity and add after it
    # Search for a paragraph that discusses human dignity
    insert_after = 'AI must respect each person as a subject with agency, not an object to be manipulated.</p>'
    
    if insert_after in html:
        html = html.replace(insert_after, insert_after + '\n' + ethics_case_study)
        print("  ✅ Added Clearview AI case study")
    else:
        # Try alternate insertion point
        insert_after_alt = 'human moral reasoning cannot be outsourced to algorithms'
        if insert_after_alt in html:
            # Find the end of that paragraph
            idx = html.find(insert_after_alt)
            end_para = html.find('</p>', idx)
            if end_para > 0:
                html = html[:end_para+4] + '\n' + ethics_case_study + html[end_para+4:]
                print("  ✅ Added Clearview AI case study (alternate location)")
        else:
            print("  ⚠️  Could not find insertion point - will add manually")
    
    with open('catholic-ai-ethics.html', 'w', encoding='utf-8') as f:
        f.write(html)

except Exception as e:
    print(f"  ❌ Error: {e}")

print("✅ Done")
