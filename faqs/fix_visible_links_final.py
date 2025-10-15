#!/usr/bin/env python3
"""
Add visible contextual links - NOT in JSON schema
Strategy: Find text in HTML body AFTER all script tags
"""

import re

def add_visible_link(html, search_text, url, link_text):
    """Add link in visible content only"""
    # Find the search text in visible content (after </script> tags)
    if search_text in html and url not in html:
        # Make sure we're not in a script tag
        parts = html.split('</script>')
        if len(parts) > 1:
            # Work on the part after scripts
            visible_part = parts[-1]
            if search_text in visible_part:
                replacement = search_text + f' <a href="{url}">{link_text}</a>'
                visible_part = visible_part.replace(search_text, replacement, 1)
                parts[-1] = visible_part
                return '</script>'.join(parts), True
    return html, False

files_to_fix = [
    ('ai-bias-fairness.html', [
        ("AI appears objective because it uses math and data, but this appearance masks the human choices embedded in every AI system.", 
         "../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html",
         "Read Pope Francis on AI and peace"),
        ("The Vatican warns that presenting biased AI as \"objective\" is particularly dangerous because it gives discrimination the veneer of mathematical neutrality.",
         "../blog/the-wisdom-brief/the-vaticans-ai-revolution-how-rome-got-big-tech-to-sign-a-moral-code.html",
         "See how Vatican got tech giants to sign ethics code"),
        ("People have a right to know when algorithms make consequential decisions about their lives.",
         "catholic-ai-ethics.html",
         "Read complete Catholic AI ethics")
    ]),
    
    ('ai-consciousness-souls.html', [
        ("Consciousness requires a soul—something only God can create, not human engineers.",
         "../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html",
         "Read Pope Francis G7 address on AI"),
        ("Humans possess self-awareness—the ability to reflect on our own thoughts, experiences, and existence.",
         "../blog/domus-communis-foundation/coexistence-fraternity-in-the-age-of-ai.html",
         "Explore fraternity in age of AI"),
        ("AI lacks the interiority necessary for genuine consciousness.",
         "catholic-ai-ethics.html",
         "See Catholic AI ethics framework")
    ]),
    
    ('ai-healthcare.html', [
        ("Doctors provide empathy, moral judgment, and the ability to see patients as whole persons.",
         "../vatican-resources/liv-world-day-of-peace-2021-a-culture-of-care-as-a-path-to-peace.html",
         "Read Vatican on culture of care"),
        ("But it cannot sit with a frightened patient, explain what the diagnosis means for their life.",
         "../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html",
         "See practical AI ethics guide"),
        ("Healthcare is fundamentally relational, not merely technical.",
         "ai-consciousness-souls.html",
         "Learn what makes humans irreplaceable")
    ]),
    
    ('ai-jobs-catholic-teaching.html', [
        ("Work gives people not just income, but identity, purpose, and community belonging.",
         "../vatican-resources/message-of-the-holy-father-to-the-world-economic-forum-2025-14-january-2025.html",
         "Read Pope's World Economic Forum message"),
        ("When automation eliminates jobs without providing alternatives, it violates this fundamental dignity.",
         "../blog/the-wisdom-brief/the-vaticans-warning-about-ai-and-the-end-of-work.html",
         "See Vatican's complete warning on AI and work"),
        ("Catholic teaching identifies three essential principles that must guide AI's impact on work.",
         "catholic-ai-ethics.html",
         "Read Catholic AI ethics principles")
    ]),
    
    ('ai-privacy-surveillance.html', [
        ("Privacy is essential to human dignity.",
         "../vatican-resources/to-participants-in-the-congress-on-child-dignity-in-the-digital-world-14-november-2019.html",
         "Read Vatican on digital dignity"),
        ("Tech companies collect vast amounts of data: every search query, every website visited, every video watched.",
         "../blog/the-wisdom-brief/the-vaticans-ai-revolution-how-rome-got-big-tech-to-sign-a-moral-code.html",
         "Learn how Vatican got tech giants to sign ethics code"),
        ("The Vatican calls this \"surveillance capitalism\".",
         "catholic-ai-ethics.html",
         "See Catholic AI ethics framework")
    ]),
    
    ('ai-warfare-weapons.html', [
        ("Pope Francis has repeatedly stated that the decision to take human life must never be delegated to machines.",
         "../vatican-resources/high-level-segment-of-the-2025-session-of-the-conference-of-disarmament.html",
         "Read Vatican statement on disarmament"),
        ("The Vatican's engagement intensified around 2017-2018 when discussions began at the United Nations.",
         "../blog/the-wisdom-brief/from-mushroom-clouds-to-machine-code-how-the-vatican-spent-35-years-preparing-fo.html",
         "See Vatican's 35-year journey preparing for AI"),
        ("Just War Theory requires that those who wage war possess moral virtues.",
         "ai-consciousness-souls.html",
         "Learn why only humans have moral agency")
    ]),
    
    ('deepfakes-misinformation.html', [
        ("For all of human history, seeing was believing.",
         "../vatican-resources/lii-world-communications-day-2018-the-truth-will-set-you-free-jn-832-fake-news-and-journalism-for-pe.html",
         "Read Pope Francis on truth and fake news"),
        ("The Eighth Commandment directly addresses deception.",
         "../blog/the-wisdom-brief/the-vaticans-ai-blueprint-how-rome-quietly-built-the-worlds-most-thoughtful-ethi.html",
         "Discover Vatican's AI ethics blueprint"),
        ("Truth reflects God's nature and respects human dignity.",
         "catholic-ai-ethics.html",
         "See Catholic AI ethics framework")
    ])
]

for filename, links_to_add in files_to_fix:
    print(f"\n📝 {filename}")
    
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()
    
    original = html
    added = 0
    
    for search, url, link_text in links_to_add:
        html, success = add_visible_link(html, search, url, link_text)
        if success:
            added += 1
            print(f"  ✅ Added link: {link_text[:50]}")
        else:
            print(f"  ⚠️  Failed: {search[:50]}")
    
    if html != original:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"  💾 Saved {added} visible links")
    else:
        print(f"  ℹ️  No changes")

print("\n" + "="*80)
print("✅ VERIFYING VISIBLE LINKS:")
print("="*80)

import subprocess
for filename, _ in files_to_fix:
    result = subprocess.run(
        f"sed '/<script/,/<\\/script>/d' {filename} | grep -c '<a href=\"\\.\\./\\(vatican\\|blog\\)'",
        shell=True, capture_output=True, text=True
    )
    count = result.stdout.strip() if result.returncode == 0 else "0"
    print(f"{filename}: {count} visible contextual links")
