#!/usr/bin/env python3
"""Add Related FAQs section to catholic-ai-ethics.html"""

with open('catholic-ai-ethics.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Related FAQs section to insert
related_section = """
        <!-- Related FAQs Section -->
        <div class="faq-section" id="related">
            <h2>Related FAQs</h2>
            <p class="faq-answer">Explore these related topics to deepen your understanding:</p>
            
            <ul class="faq-answer">
                <li><a href="ai-jobs-catholic-teaching.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI & Work</a> - Automation, jobs, and human dignity</li>
                <li><a href="ai-bias-fairness.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">AI Bias & Fairness</a> - Preventing algorithmic discrimination</li>
                <li><a href="deepfakes-misinformation.html" style="color: #0066cc; text-decoration: none; font-weight: 600;">Deepfakes & Misinformation</a> - Truth and human dignity</li>
            </ul>
        </div>
"""

# Find where to insert (before the back link section)
back_link_pos = content.find('        <div class="faq-section">\n            <a href="../index.html"')

if back_link_pos > 0:
    # Insert Related FAQs section before back link
    content = content[:back_link_pos] + related_section + '\n' + content[back_link_pos:]
    
    # Backup
    with open('catholic-ai-ethics.html.related_backup', 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Save
    with open('catholic-ai-ethics.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Added Related FAQs section to catholic-ai-ethics.html")
else:
    print("⚠️ Could not find insertion point")
