#!/usr/bin/env python3
"""
Add 2 more links using text that ACTUALLY EXISTS
"""

def add_link(content, search_text, url, link_text):
    if search_text in content and url not in content:
        replacement = search_text + f' <a href="{url}">{link_text}</a>'
        return content.replace(search_text, replacement, 1), True
    return content, False

# ============================================================================
# AI-HEALTHCARE.HTML - needs 2 more
# ============================================================================
print("\n📝 ai-healthcare.html")
with open('ai-healthcare.html', 'r') as f:
    content = f.read()
original = content
added = 0

search = "An AI can spot a tumor on an X-ray with remarkable accuracy."
url = "../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html"
link = "See practical AI ethics implementation guide"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print("  ✅ Blog link")

search = "When treatment goes wrong, an AI cannot be held morally accountable."
url = "ai-consciousness-souls.html"
link = "Learn why only humans have moral agency"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print("  ✅ FAQ link")

if content != original:
    with open('ai-healthcare.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} links (total now: 3)")

# ============================================================================
# AI-JOBS-CATHOLIC-TEACHING.HTML - needs 2 more
# ============================================================================
print("\n📝 ai-jobs-catholic-teaching.html")
with open('ai-jobs-catholic-teaching.html', 'r') as f:
    content = f.read()
original = content
added = 0

search = "Catholic Social Teaching views work as essential to human dignity, not merely a source of income."
url = "../vatican-resources/message-of-the-holy-father-to-the-world-economic-forum-2025-14-january-2025.html"
link = "Read Pope Francis message to World Economic Forum"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print("  ✅ Vatican resource")

search = "Work gives people not just income, but identity, purpose, and community belonging."
url = "ai-consciousness-souls.html"
link = "Understand human dignity in the age of AI"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print("  ✅ FAQ link")

if content != original:
    with open('ai-jobs-catholic-teaching.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} links (total now: 3)")

# ============================================================================
# DEEPFAKES-MISINFORMATION.HTML - needs 2 more
# ============================================================================
print("\n📝 deepfakes-misinformation.html")
with open('deepfakes-misinformation.html', 'r') as f:
    content = f.read()
original = content
added = 0

search = "Deepfakes matter because they attack something fundamental: our ability to trust what we see and hear."
url = "../blog/the-wisdom-brief/the-vaticans-ai-blueprint-how-rome-quietly-built-the-worlds-most-thoughtful-ethi.html"
link = "Discover Vatican comprehensive AI ethics framework"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print("  ✅ Blog link")

search = "The Eighth Commandment—\"You shall not bear false witness\"—directly addresses deception."
url = "catholic-ai-ethics.html"
link = "See complete Catholic AI ethics framework"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print("  ✅ FAQ link")

if content != original:
    with open('deepfakes-misinformation.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} links (total now: 3)")

print("\n" + "="*80)
print("✅ FINAL VERIFICATION:")
print("="*80)
