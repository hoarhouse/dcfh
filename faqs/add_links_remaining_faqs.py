#!/usr/bin/env python3
"""
Add internal links to the remaining 3 FAQ pages
"""

import re

def add_link_after_text(content, search_text, url, anchor_text):
    """Add a link after finding specific text"""
    if search_text in content:
        replacement = search_text + f' For more details, see our <a href="{url}">{anchor_text}</a>.'
        content = content.replace(search_text, replacement)
        return content, True
    return content, False

# ============================================================================
# AI-CONSCIOUSNESS-SOULS.HTML
# ============================================================================
print("\n📝 Processing: ai-consciousness-souls.html")

with open('ai-consciousness-souls.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
links_added = 0

# Link 1: To catholic-ai-ethics
search = "Catholic teaching holds that consciousness, free will, and moral agency are gifts from God that define human nature."
url = "catholic-ai-ethics.html"
anchor = "complete Catholic AI ethics framework"
content, success = add_link_after_text(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Catholic AI ethics")

# Link 2: To blog post on coexistence
search = "Humans are created in God's image (imago Dei), which means we possess inherent dignity, moral agency, and the capacity for relationship with God."
url = "../blog/domus-communis-foundation/coexistence-fraternity-in-the-age-of-ai.html"
anchor = "essay on human-AI coexistence and fraternity"
content, success = add_link_after_text(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to coexistence blog")

# Link 3: To Vatican resource
search = "The soul is the spiritual, immortal essence that animates the body and makes each person a unique, unrepeatable individual."
url = "../vatican-resources/lviii-world-communications-day-2024-artificial-intelligence-and-the-wisdom-of-the-heart-towards-a-fu.html"
anchor = "Vatican's teaching on AI and human wisdom"
content, success = add_link_after_text(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Vatican resource")

if content != original:
    with open('ai-consciousness-souls.html.prelink_backup3', 'w', encoding='utf-8') as f:
        f.write(original)
    with open('ai-consciousness-souls.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  💾 Saved {links_added} links")

# ============================================================================
# AI-HEALTHCARE.HTML
# ============================================================================
print("\n📝 Processing: ai-healthcare.html")

with open('ai-healthcare.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
links_added = 0

# Link 1: To catholic-ai-ethics
search = "Catholic medical ethics applies centuries-old principles of human dignity, informed consent, and do-no-harm to new AI technologies."
url = "catholic-ai-ethics.html"
anchor = "foundational Catholic AI ethics principles"
content, success = add_link_after_text(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Catholic AI ethics")

# Link 2: To ai-bias-fairness
search = "AI diagnostic systems can inherit and amplify biases from training data, leading to worse care for certain demographic groups."
url = "ai-bias-fairness.html"
anchor = "detailed analysis of AI bias in healthcare"
content, success = add_link_after_text(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to AI bias FAQ")

# Link 3: To Vatican resource on care
search = "Healthcare is a vocation of service to human dignity."
url = "../vatican-resources/liv-world-day-of-peace-2021-a-culture-of-care-as-a-path-to-peace.html"
anchor = "Vatican's teaching on culture of care"
content, success = add_link_after_text(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Vatican resource")

if content != original:
    with open('ai-healthcare.html.prelink_backup3', 'w', encoding='utf-8') as f:
        f.write(original)
    with open('ai-healthcare.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  💾 Saved {links_added} links")

# ============================================================================
# DEEPFAKES-MISINFORMATION.HTML
# ============================================================================
print("\n📝 Processing: deepfakes-misinformation.html")

with open('deepfakes-misinformation.html', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
links_added = 0

# Link 1: To catholic-ai-ethics
search = "Deepfakes and AI-generated misinformation pose fundamental threats to truth, trust, and human dignity."
url = "catholic-ai-ethics.html"
anchor = "Catholic framework for ethical AI"
content, success = add_link_after_text(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Catholic AI ethics")

# Link 2: To Vatican resource on truth
search = "Catholic teaching holds that truth is not relative or subjective—it corresponds to reality and is essential for human flourishing."
url = "../vatican-resources/lii-world-communications-day-2018-the-truth-will-set-you-free-jn-832-fake-news-and-journalism-for-pe.html"
anchor = "Pope Francis's message on truth and fake news"
content, success = add_link_after_text(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to Vatican resource")

# Link 3: To AI bias (relevant for algorithmic amplification)
search = "Social media algorithms amplify sensational content regardless of truthfulness because engagement drives revenue."
url = "ai-bias-fairness.html"
anchor = "how algorithmic bias shapes what we see"
content, success = add_link_after_text(content, search, url, anchor)
if success:
    links_added += 1
    print(f"  ✅ Added link to AI bias FAQ")

if content != original:
    with open('deepfakes-misinformation.html.prelink_backup3', 'w', encoding='utf-8') as f:
        f.write(original)
    with open('deepfakes-misinformation.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  💾 Saved {links_added} links")

print("\n" + "="*80)
print("✅ COMPLETE")
print("="*80)
print("\nRun analyzer to verify:")
print("  python3 analyze_faq_llm_optimization.py")
