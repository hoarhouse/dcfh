#!/usr/bin/env python3
"""
Add internal links to ai-jobs-catholic-teaching.html
"""

import re

def add_link_after_text(content, search_text, link_html):
    """Add a link after finding specific text in an answer"""
    # Find the answer containing the search text
    pattern = rf'(<p class="faq-answer">)(.*?)({re.escape(search_text)})(.*?)(</p>)'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        # Add link right after the search text
        modified = (
            match.group(1) + 
            match.group(2) + 
            match.group(3) + 
            f' For the complete framework, see our <a href="{link_html[0]}">{link_html[1]}</a>.' +
            match.group(4) + 
            match.group(5)
        )
        return content.replace(match.group(0), modified), True
    return content, False

# Read file
with open('ai-jobs-catholic-teaching.html', 'r', encoding='utf-8') as f:
    content = f.read()

original_content = content
links_added = 0

# Link 1: Question #3 - link to catholic-ai-ethics.html
search1 = "Most businesses view automation through a purely economic lens"
link1 = ("catholic-ai-ethics.html#work", "Catholic AI ethics on work and automation")
content, success = add_link_after_text(content, search1, link1)
if success:
    links_added += 1
    print("✅ Added link to Catholic AI ethics")

# Link 2: Question #5 - link to blog post
search2 = "The Vatican teaches that human dignity cannot be outsourced"
link2 = ("../blog/the-wisdom-brief/the-vaticans-warning-about-ai-and-the-end-of-work.html", "Vatican's full warning on AI and work")
content, success = add_link_after_text(content, search2, link2)
if success:
    links_added += 1
    print("✅ Added link to Vatican warning blog")

# Link 3: Question #4 - link to Vatican resource
search3 = "issued by the Vatican's Dicastery for the Doctrine of the Faith"
link3 = ("../vatican-resources/lv-world-day-of-peace-2022-dialogue-between-generations-education-and-work-tools-for-building-lastin.html", "Vatican's teaching on work and dialogue")
content, success = add_link_after_text(content, search3, link3)
if success:
    links_added += 1
    print("✅ Added link to Vatican resource")

# Save if changes made
if content != original_content:
    # Backup
    with open('ai-jobs-catholic-teaching.html.prelink_backup2', 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    # Save modified
    with open('ai-jobs-catholic-teaching.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ Added {links_added} links successfully!")
    print("📦 Backup saved")
    print("\nRun analyzer to verify:")
    print("  python3 analyze_faq_llm_optimization.py")
else:
    print("⚠️ No changes made - check search text")
