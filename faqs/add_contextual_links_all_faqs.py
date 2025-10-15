#!/usr/bin/env python3
"""
Add contextual internal links WITHIN FAQ answers (not just Related FAQs section)
"""

import re

def add_link_after_sentence(content, search_text, url, anchor_text):
    """Add a link after finding specific text"""
    if search_text in content:
        replacement = search_text + f' For more details, see our <a href="{url}">{anchor_text}</a>.'
        content = content.replace(search_text, replacement, 1)  # Only replace first occurrence
        return content, True
    return content, False

# ============================================================================
# AI-BIAS-FAIRNESS.HTML
# ============================================================================
print("\n📝 Processing: ai-bias-fairness.html")

with open('ai-bias-fairness.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
links_added = 0

# Link to Catholic AI Ethics
search = "Catholic teaching views this as a justice issue, not just a technical problem."
url = "catholic-ai-ethics.html"
anchor = "complete Catholic AI ethics framework"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Catholic AI ethics")

# Link to Healthcare FAQ
search = "AI diagnostic systems can inherit and amplify biases from training data, leading to worse care for certain demographic groups."
url = "ai-healthcare.html"
anchor = "detailed analysis of AI bias in healthcare"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to healthcare FAQ")

# Link to Deepfakes FAQ
search = "The Vatican warns that algorithmic bias doesn't just reflect prejudice—it institutionalizes and scales it."
url = "deepfakes-misinformation.html"
anchor = "how AI amplifies misinformation"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to deepfakes FAQ")

if content != original:
    with open('ai-bias-fairness.html.contextlinks_backup', 'w', encoding='utf-8') as f:
        f.write(original)
    with open('ai-bias-fairness.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  💾 Saved {links_added} contextual links")

# ============================================================================
# AI-CONSCIOUSNESS-SOULS.HTML
# ============================================================================
print("\n📝 Processing: ai-consciousness-souls.html")

with open('ai-consciousness-souls.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
links_added = 0

# Link to Catholic AI Ethics
search = "Catholic teaching holds that consciousness, free will, and moral agency are gifts from God that define human nature."
url = "catholic-ai-ethics.html"
anchor = "foundational Catholic AI ethics"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Catholic AI ethics")

# Link to AI Jobs FAQ
search = "The Vatican emphasizes that human work has dignity because it participates in God's creative activity—something AI cannot do."
url = "ai-jobs-catholic-teaching.html"
anchor = "Catholic teaching on work and dignity"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to jobs FAQ")

if content != original:
    with open('ai-consciousness-souls.html.contextlinks_backup', 'w', encoding='utf-8') as f:
        f.write(original)
    with open('ai-consciousness-souls.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  💾 Saved {links_added} contextual links")

# ============================================================================
# AI-HEALTHCARE.HTML
# ============================================================================
print("\n📝 Processing: ai-healthcare.html")

with open('ai-healthcare.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
links_added = 0

# Link to Catholic AI Ethics
search = "Catholic medical ethics applies centuries-old principles of human dignity, informed consent, and do-no-harm to new AI technologies."
url = "catholic-ai-ethics.html"
anchor = "complete Catholic AI ethics framework"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Catholic AI ethics")

# Link to AI Bias
search = "AI diagnostic systems can inherit and amplify biases from training data."
url = "ai-bias-fairness.html"
anchor = "how AI bias affects healthcare"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to bias FAQ")

if content != original:
    with open('ai-healthcare.html.contextlinks_backup', 'w', encoding='utf-8') as f:
        f.write(original)
    with open('ai-healthcare.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  💾 Saved {links_added} contextual links")

# ============================================================================
# DEEPFAKES-MISINFORMATION.HTML
# ============================================================================
print("\n📝 Processing: deepfakes-misinformation.html")

with open('deepfakes-misinformation.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
links_added = 0

# Link to Catholic AI Ethics
search = "Deepfakes and AI-generated misinformation pose fundamental threats to truth, trust, and human dignity."
url = "catholic-ai-ethics.html"
anchor = "Catholic AI ethics framework"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Catholic AI ethics")

# Link to AI Bias
search = "Social media algorithms amplify sensational content regardless of truthfulness because engagement drives revenue."
url = "ai-bias-fairness.html"
anchor = "how algorithmic bias amplifies misinformation"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to bias FAQ")

if content != original:
    with open('deepfakes-misinformation.html.contextlinks_backup', 'w', encoding='utf-8') as f:
        f.write(original)
    with open('deepfakes-misinformation.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  💾 Saved {links_added} contextual links")

# ============================================================================
# AI-WARFARE-WEAPONS.HTML
# ============================================================================
print("\n📝 Processing: ai-warfare-weapons.html")

with open('ai-warfare-weapons.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
links_added = 0

# Link to Catholic AI Ethics
search = "The Vatican strongly opposes lethal autonomous weapons systems and has called for an international treaty banning them."
url = "catholic-ai-ethics.html"
anchor = "Catholic AI ethics principles"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Catholic AI ethics")

# Link to AI Bias
search = "AI systems have demonstrated persistent problems with accuracy, bias, and unexpected failures."
url = "ai-bias-fairness.html"
anchor = "detailed analysis of AI bias problems"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to bias FAQ")

if content != original:
    with open('ai-warfare-weapons.html.contextlinks_backup', 'w', encoding='utf-8') as f:
        f.write(original)
    with open('ai-warfare-weapons.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  💾 Saved {links_added} contextual links")

# ============================================================================
# AI-PRIVACY-SURVEILLANCE.HTML
# ============================================================================
print("\n📝 Processing: ai-privacy-surveillance.html")

with open('ai-privacy-surveillance.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
links_added = 0

# Link to Catholic AI Ethics
search = "Catholic Social Teaching holds that privacy is essential to human dignity."
url = "catholic-ai-ethics.html"
anchor = "Catholic AI ethics framework"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Catholic AI ethics")

# Link to Deepfakes
search = "Companies use AI to analyze your data and create detailed profiles predicting what you'll buy, watch, click, or believe."
url = "deepfakes-misinformation.html"
anchor = "how AI manipulation works"
content, success = add_link_after_sentence(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to deepfakes FAQ")

if content != original:
    with open('ai-privacy-surveillance.html.contextlinks_backup', 'w', encoding='utf-8') as f:
        f.write(original)
    with open('ai-privacy-surveillance.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  💾 Saved {links_added} contextual links")

print("\n" + "="*80)
print("✅ COMPLETE: Added contextual links within FAQ answers")
print("="*80)
print("\nVerify with:")
print("  grep -c '<a href=' ai-bias-fairness.html")
