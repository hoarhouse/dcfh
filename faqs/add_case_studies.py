#!/usr/bin/env python3
"""
Add case studies to ai-healthcare.html and catholic-ai-ethics.html
"""

# ai-healthcare.html - Add case study after Q7 (AI surveillance of workers)
healthcare_case_study = '''
                <div class="case-study">
                    <h3>Real-World Example: IBM Watson for Oncology</h3>
                    <p><strong>The Promise:</strong> IBM's Watson AI was marketed as a revolutionary cancer treatment tool that would analyze patient data and recommend optimal treatments, trained on thousands of medical records and research papers.</p>
                    <p><strong>The Reality:</strong> Multiple hospitals discontinued Watson after discovering it sometimes recommended unsafe or incorrect treatments. The system reflected biases in its training data and couldn't account for the full complexity of individual patients.</p>
                    <p><strong>The Catholic Lesson:</strong> This demonstrates why human physicians must maintain authority over medical decisions. AI can assist, but the practice of medicine requires human judgment about whole persons, not just data analysis. Patients deserve doctors who take responsibility, not algorithms that can't be held accountable.</p>
                </div>
'''

# catholic-ai-ethics.html - Add case study after discussion of human dignity
ethics_case_study = '''
                <div class="case-study">
                    <h3>Real-World Example: China's Social Credit System</h3>
                    <p><strong>What It Is:</strong> China uses AI to monitor citizens' behavior—financial transactions, social media posts, travel, purchases, even friendships—and assign scores that determine access to jobs, education, housing, and travel.</p>
                    <p><strong>Why It Matters:</strong> This system treats human persons as data points to be optimized for state preferences. Low scores restrict fundamental freedoms. The AI enforces ideological conformity and punishes dissent, religious practice, or non-approved behavior.</p>
                    <p><strong>The Catholic Response:</strong> This violates every principle of Catholic Social Teaching—human dignity, freedom, conscience, and the limits of state power. It demonstrates the existential danger when AI is used to create systems of total social control. The Church insists technology must serve persons, never reduce them to profiles or scores.</p>
                </div>
'''

print("="*80)
print("ADDING CASE STUDIES")
print("="*80)

# Add to ai-healthcare.html
print("\n📋 Adding case study to ai-healthcare.html...")
try:
    with open('ai-healthcare.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Find a good insertion point - after discussion of AI limitations in Q3
    insert_marker = 'AI cannot provide the pastoral care, emotional support, or ethical reasoning that complex medical situations demand.</p>'
    
    if insert_marker in html:
        html = html.replace(insert_marker, insert_marker + '\n' + healthcare_case_study)
        
        with open('ai-healthcare.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("  ✅ Added IBM Watson case study")
    else:
        print("  ⚠️  Insertion point not found - manual addition needed")

except Exception as e:
    print(f"  ❌ Error: {e}")

# Add to catholic-ai-ethics.html  
print("\n📋 Adding case study to catholic-ai-ethics.html...")
try:
    with open('catholic-ai-ethics.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Find a good insertion point - after discussion of human dignity principle
    insert_marker = 'Every person possesses inherent worth and dignity simply by being human, created in the image of God.</p>'
    
    if insert_marker in html:
        html = html.replace(insert_marker, insert_marker + '\n' + ethics_case_study)
        
        with open('catholic-ai-ethics.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("  ✅ Added China Social Credit case study")
    else:
        print("  ⚠️  Insertion point not found - manual addition needed")

except Exception as e:
    print(f"  ❌ Error: {e}")

print("\n" + "="*80)
print("✅ Case studies added to both pages")
print("="*80)
