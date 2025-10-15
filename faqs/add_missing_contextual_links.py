#!/usr/bin/env python3
"""
Add contextual links to the 6 FAQ pages that are missing them
Using text that ACTUALLY exists in the files
"""

def add_link(content, search_text, url, link_text):
    """Add link after sentence"""
    if search_text in content and url not in content:
        replacement = search_text + f' <a href="{url}">{link_text}</a>'
        return content.replace(search_text, replacement, 1), True
    return content, False

# ============================================================================
# AI-CONSCIOUSNESS-SOULS.HTML (needs 3 links)
# ============================================================================
print("\n📝 ai-consciousness-souls.html")
with open('ai-consciousness-souls.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1
search = "No. According to Catholic teaching, AI cannot become conscious because consciousness requires a soul—something only God can create, not human engineers."
url = "../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html"
link = "Read Pope Francis's G7 address on AI"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2
search = "AI systems, no matter how sophisticated, are executing algorithms."
url = "../blog/domus-communis-foundation/coexistence-fraternity-in-the-age-of-ai.html"
link = "Explore human-AI coexistence"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog post")

# Link 3
search = "Consciousness isn't just processing information or responding intelligently."
url = "catholic-ai-ethics.html"
link = "See complete Catholic AI ethics framework"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('ai-consciousness-souls.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")
else:
    print(f"  ℹ️  No new links added")

# ============================================================================
# AI-HEALTHCARE.HTML (needs 3 links)
# ============================================================================
print("\n📝 ai-healthcare.html")
with open('ai-healthcare.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1
search = "No. According to Catholic teaching and medical ethics, AI should augment doctors, not replace them."
url = "../vatican-resources/liv-world-day-of-peace-2021-a-culture-of-care-as-a-path-to-peace.html"
link = "Read Vatican on culture of care"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2
search = "Medicine is more than diagnosis and treatment—it's a relationship of trust, care, and healing between persons."
url = "../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html"
link = "See practical AI ethics implementation guide"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog post")

# Link 3
search = "An AI can spot a tumor on an X-ray with remarkable accuracy."
url = "ai-bias-fairness.html"
link = "Learn about AI accuracy and bias issues"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('ai-healthcare.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")
else:
    print(f"  ℹ️  No new links added")

# ============================================================================
# DEEPFAKES-MISINFORMATION.HTML (needs 3 links)
# ============================================================================
print("\n📝 deepfakes-misinformation.html")
with open('deepfakes-misinformation.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1
search = "Deepfakes are AI-generated images, videos, or audio that convincingly depict people saying or doing things they never actually said or did."
url = "../vatican-resources/lii-world-communications-day-2018-the-truth-will-set-you-free-jn-832-fake-news-and-journalism-for-pe.html"
link = "Read Pope Francis on truth and fake news"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2
search = "Deepfakes matter because they attack something fundamental: our ability to trust what we see and hear."
url = "../blog/the-wisdom-brief/the-vaticans-ai-blueprint-how-rome-quietly-built-the-worlds-most-thoughtful-ethi.html"
link = "Discover Vatican's AI ethics blueprint"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog post")

# Link 3
search = "For all of human history, seeing was believing."
url = "catholic-ai-ethics.html"
link = "See Catholic AI ethics framework"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('deepfakes-misinformation.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")
else:
    print(f"  ℹ️  No new links added")

# ============================================================================
# AI-JOBS (needs 2 more - already has 1 blog link)
# ============================================================================
print("\n📝 ai-jobs-catholic-teaching.html")
with open('ai-jobs-catholic-teaching.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1
search = "The Church insists that human workers must never be treated as mere costs to be minimized or obstacles to efficiency."
url = "../vatican-resources/message-of-the-holy-father-to-the-world-economic-forum-2025-14-january-2025.html"
link = "Read Pope's message to World Economic Forum"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2
search = "Catholic Social Teaching emphasizes that technology must serve human flourishing, not replace it."
url = "catholic-ai-ethics.html"
link = "See complete Catholic AI ethics"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('ai-jobs-catholic-teaching.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")
else:
    print(f"  ℹ️  No new links added")

print("\n" + "="*80)
print("✅ COMPLETE")
print("="*80)
print("\nVerify all FAQs now have 3+ contextual links:")
print("  for f in ai-*.html catholic-*.html deepfakes-*.html; do")
print("    echo \"$f: $(grep -c '<a href=\"\\.\\./\\(vatican\\|blog\\)' $f) links\"")
print("  done")
