#!/usr/bin/env python3
"""
Add 2 more contextual links to the 4 FAQ pages that need them
"""

def add_link(content, search_text, url, link_text):
    """Add link after sentence"""
    if search_text in content and url not in content:
        replacement = search_text + f' <a href="{url}">{link_text}</a>'
        return content.replace(search_text, replacement, 1), True
    return content, False

# ============================================================================
# AI-HEALTHCARE.HTML (has 1, needs 2 more = 3 total)
# ============================================================================
print("\n📝 ai-healthcare.html")
with open('ai-healthcare.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1
search = "Medicine is more than diagnosis and treatment—it's a relationship of trust, care, and healing between persons."
url = "../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html"
link = "See practical guide to implementing AI ethics in healthcare"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog link 1")

# Link 2
search = "Catholic medical ethics demands transparency and informed consent."
url = "ai-consciousness-souls.html"
link = "Learn what makes humans irreplaceable in healthcare"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link 2")

if content != original:
    with open('ai-healthcare.html', 'w') as f:
        f.write(content)
    print(f"  💾 Total: {added} new links added")

# ============================================================================
# AI-JOBS-CATHOLIC-TEACHING.HTML (has 1, needs 2 more = 3 total)
# ============================================================================
print("\n📝 ai-jobs-catholic-teaching.html")
with open('ai-jobs-catholic-teaching.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1
search = "Catholic Social Teaching emphasizes that technology must serve human flourishing, not replace it."
url = "../vatican-resources/message-of-the-holy-father-to-the-world-economic-forum-2025-14-january-2025.html"
link = "Read Pope's 2025 message on work and technology"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource 1")

# Link 2
search = "The Church insists that human workers must never be treated as mere costs to be minimized or obstacles to efficiency."
url = "ai-consciousness-souls.html"
link = "Understand human dignity in the age of AI"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link 2")

if content != original:
    with open('ai-jobs-catholic-teaching.html', 'w') as f:
        f.write(content)
    print(f"  💾 Total: {added} new links added")

# ============================================================================
# AI-PRIVACY-SURVEILLANCE.HTML (has 1, needs 2 more = 3 total)
# ============================================================================
print("\n📝 ai-privacy-surveillance.html")
with open('ai-privacy-surveillance.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1
search = "The Vatican adopted this term from scholar Shoshana Zuboff to describe how tech companies treat human experience as free raw material for profit."
url = "../blog/the-wisdom-brief/the-vaticans-ai-revolution-how-rome-got-big-tech-to-sign-a-moral-code.html"
link = "Learn how Vatican got tech giants to sign ethics code"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog link 1")

# Link 2
search = "Pope Francis has repeatedly warned about the dangers of surveillance technology."
url = "../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html"
link = "Read Pope Francis G7 address on AI"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource 2")

if content != original:
    with open('ai-privacy-surveillance.html', 'w') as f:
        f.write(content)
    print(f"  💾 Total: {added} new links added")

# ============================================================================
# DEEPFAKES-MISINFORMATION.HTML (has 1, needs 2 more = 3 total)
# ============================================================================
print("\n📝 deepfakes-misinformation.html")
with open('deepfakes-misinformation.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1
search = "For all of human history, seeing was believing."
url = "../blog/the-wisdom-brief/the-vaticans-ai-blueprint-how-rome-quietly-built-the-worlds-most-thoughtful-ethi.html"
link = "Discover Vatican comprehensive AI ethics framework"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog link 1")

# Link 2
search = "Catholic teaching holds that truth is not relative or subjective—it corresponds to reality and is essential for human flourishing."
url = "catholic-ai-ethics.html"
link = "See complete Catholic AI ethics framework"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link 2")

if content != original:
    with open('deepfakes-misinformation.html', 'w') as f:
        f.write(content)
    print(f"  💾 Total: {added} new links added")

print("\n" + "="*80)
print("✅ DONE! Verify final counts:")
print("="*80)
print("\nRun:")
print("  for f in ai-*.html catholic-*.html deepfakes-*.html; do")
print("    echo \"$f: $(grep -c '<a href=\"\\.\\./\\(vatican\\|blog\\)' $f) contextual links\"")
print("  done")
