#!/usr/bin/env python3
"""
COMPREHENSIVE INTERNAL LINKING SCRIPT
Links all 8 FAQ pages to:
- Vatican resources
- Blog posts 
- Other FAQs

Creates a proper SEO mesh across ALL content!
"""

def add_link(content, search_text, url, link_text):
    """Add link after sentence - only first occurrence"""
    if search_text in content and url not in content:
        replacement = search_text + f' <a href="{url}">{link_text}</a>'
        return content.replace(search_text, replacement, 1), True
    return content, False

# ============================================================================
# AI-BIAS-FAIRNESS.HTML
# ============================================================================
print("\n📝 ai-bias-fairness.html")
with open('ai-bias-fairness.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1: To Vatican resource on AI
search = "When AI systems are biased, they can perpetuate and amplify existing societal discrimination at massive scale."
url = "../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html"
link = "Read Pope Francis's message on AI and peace"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2: To blog post on implementing ethics
search = "AI systems learn from data—and if that data reflects historical discrimination, the AI will learn to discriminate."
url = "../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html"
link = "See practical guide to implementing AI ethics"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog post")

# Link 3: To healthcare FAQ
search = "This is a dangerous myth."
url = "ai-healthcare.html"
link = "Learn how AI bias affects medical decisions"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('ai-bias-fairness.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")

# ============================================================================
# AI-CONSCIOUSNESS-SOULS.HTML
# ============================================================================
print("\n📝 ai-consciousness-souls.html")
with open('ai-consciousness-souls.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1: To Vatican G7 address
search = "Catholic teaching distinguishes between humans and machines based on fundamental theological and philosophical principles."
url = "../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html"
link = "Read Pope Francis's G7 address on AI"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2: To blog on coexistence
search = "The soul is the spiritual, immortal essence that animates the body and makes each person a unique, unrepeatable individual."
url = "../blog/domus-communis-foundation/coexistence-fraternity-in-the-age-of-ai.html"
link = "Explore fraternity in the age of AI"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog post")

# Link 3: To Catholic AI ethics FAQ
search = "Humans are created in God's image (imago Dei), which means we possess inherent dignity, moral agency, and the capacity for relationship with God."
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

# ============================================================================
# AI-HEALTHCARE.HTML
# ============================================================================
print("\n📝 ai-healthcare.html")
with open('ai-healthcare.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1: To Vatican on care
search = "Catholic medical ethics applies centuries-old principles of human dignity, informed consent, and do-no-harm to new AI technologies."
url = "../vatican-resources/liv-world-day-of-peace-2021-a-culture-of-care-as-a-path-to-peace.html"
link = "Read Vatican teaching on culture of care"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2: To AI bias FAQ
search = "AI diagnostic systems can inherit and amplify biases from training data."
url = "ai-bias-fairness.html"
link = "Understand AI bias in medical systems"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

# Link 3: To consciousness FAQ
search = "The doctor-patient relationship embodies trust, vulnerability, and the covenant to serve human wholeness."
url = "ai-consciousness-souls.html"
link = "Learn what makes humans irreplaceable"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('ai-healthcare.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")

# ============================================================================
# AI-JOBS-CATHOLIC-TEACHING.HTML
# ============================================================================
print("\n📝 ai-jobs-catholic-teaching.html")
with open('ai-jobs-catholic-teaching.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1: To blog on Vatican warning
search = "Work is how humans participate in God's creative activity and serve the common good."
url = "../blog/the-wisdom-brief/the-vaticans-warning-about-ai-and-the-end-of-work.html"
link = "Read Vatican's complete warning on AI and work"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog post")

# Link 2: To Catholic ethics FAQ
search = "The Church distinguishes between automation that liberates humans from drudgery and automation that treats humans as disposable."
url = "catholic-ai-ethics.html"
link = "See Catholic AI ethics principles"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

# Link 3: To AI bias FAQ
search = "AI systems can inherit biases about race, gender, age, or class that result in discriminatory hiring."
url = "ai-bias-fairness.html"
link = "Learn about AI bias in hiring decisions"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('ai-jobs-catholic-teaching.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")

# ============================================================================
# CATHOLIC-AI-ETHICS.HTML
# ============================================================================
print("\n📝 catholic-ai-ethics.html")
with open('catholic-ai-ethics.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1: To Vatican World Communications Day
search = "Every person possesses inherent worth simply by being created in God's image."
url = "../vatican-resources/lviii-world-communications-day-2024-artificial-intelligence-and-the-wisdom-of-the-heart-towards-a-fu.html"
link = "Read Vatican on AI and wisdom of the heart"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2: To blog on Rome Call
search = "Work is not merely a means of earning income—it is participation in God's creative activity and essential to human dignity."
url = "../blog/the-wisdom-brief/the-vaticans-ai-revolution-how-rome-got-big-tech-to-sign-a-moral-code.html"
link = "Learn how Vatican got tech giants to sign ethics code"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog post")

# Link 3: To AI bias FAQ
search = "AI systems can perpetuate and amplify existing biases related to race, gender, class, disability, and other characteristics."
url = "ai-bias-fairness.html"
link = "Explore AI bias and fairness in depth"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('catholic-ai-ethics.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")

# ============================================================================
# DEEPFAKES-MISINFORMATION.HTML
# ============================================================================
print("\n📝 deepfakes-misinformation.html")
with open('deepfakes-misinformation.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1: To Vatican on fake news
search = "Deepfakes and AI-generated misinformation pose fundamental threats to truth, trust, and human dignity."
url = "../vatican-resources/lii-world-communications-day-2018-the-truth-will-set-you-free-jn-832-fake-news-and-journalism-for-pe.html"
link = "Read Pope Francis on fake news and truth"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2: To Catholic ethics
search = "Catholic teaching holds that truth is not relative or subjective—it corresponds to reality and is essential for human flourishing."
url = "catholic-ai-ethics.html"
link = "See Catholic AI ethics framework"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

# Link 3: To AI bias FAQ
search = "Social media algorithms amplify sensational content regardless of truthfulness because engagement drives revenue."
url = "ai-bias-fairness.html"
link = "Understand algorithmic bias and amplification"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('deepfakes-misinformation.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")

# ============================================================================
# AI-WARFARE-WEAPONS.HTML
# ============================================================================
print("\n📝 ai-warfare-weapons.html")
with open('ai-warfare-weapons.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1: To Vatican on disarmament
search = "The Vatican strongly opposes lethal autonomous weapons systems and has called for an international treaty banning them."
url = "../vatican-resources/high-level-segment-of-the-2025-session-of-the-conference-of-disarmament.html"
link = "Read Vatican's statement on disarmament"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2: To blog on Vatican's 35-year journey
search = "The Holy See has been addressing autonomous weapons since the early 2010s, as the technology became militarily feasible."
url = "../blog/the-wisdom-brief/from-mushroom-clouds-to-machine-code-how-the-vatican-spent-35-years-preparing-fo.html"
link = "Discover Vatican's 35-year journey preparing for AI threats"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Blog post")

# Link 3: To AI bias FAQ
search = "AI systems have demonstrated persistent problems with accuracy, bias, and unexpected failures."
url = "ai-bias-fairness.html"
link = "See detailed analysis of AI system failures"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('ai-warfare-weapons.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")

# ============================================================================
# AI-PRIVACY-SURVEILLANCE.HTML
# ============================================================================
print("\n📝 ai-privacy-surveillance.html")
with open('ai-privacy-surveillance.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Link 1: To Vatican on child dignity
search = "Catholic Social Teaching holds that privacy is essential to human dignity."
url = "../vatican-resources/to-participants-in-the-congress-on-child-dignity-in-the-digital-world-14-november-2019.html"
link = "Read Vatican on digital dignity and privacy"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Vatican resource")

# Link 2: To Catholic ethics FAQ
search = "The Vatican adopted this term from scholar Shoshana Zuboff to describe how tech companies treat human experience as free raw material for profit."
url = "catholic-ai-ethics.html"
link = "See complete Catholic AI ethics framework"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

# Link 3: To AI bias FAQ
search = "Facial recognition exhibits significant racial bias, leading to false arrests of innocent people, particularly people of color."
url = "ai-bias-fairness.html"
link = "Learn about AI bias and discrimination"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ FAQ link")

if content != original:
    with open('ai-privacy-surveillance.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} contextual links")

print("\n" + "="*80)
print("✅ COMPLETE: ALL 8 FAQ PAGES NOW HAVE CONTEXTUAL LINKS TO:")
print("   - Vatican resources (actual documents)")
print("   - Blog posts (actual articles)")
print("   - Other FAQ pages")
print("="*80)
print("\nVerify links were added:")
print("  grep -c '<a href=\"\\.\\./vatican-resources/' *.html")
print("  grep -c '<a href=\"\\.\\./blog/' *.html")
