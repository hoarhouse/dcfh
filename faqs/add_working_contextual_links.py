#!/usr/bin/env python3
"""
Add contextual links using TEXT THAT ACTUALLY EXISTS in the files
"""

def add_link(content, search_text, url, link_text):
    """Add link after sentence"""
    if search_text in content:
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

# Link 1
search = "When AI systems are biased, they can perpetuate and amplify existing societal discrimination at massive scale."
url = "catholic-ai-ethics.html"
link = "See our complete Catholic AI ethics framework"
content, success = add_link(content, search, url, link)
if success: 
    added += 1
    print(f"  ✅ Link 1")

# Link 2  
search = "AI systems learn from data—and if that data reflects historical discrimination, the AI will learn to discriminate."
url = "ai-healthcare.html"
link = "Learn how this affects healthcare AI"
content, success = add_link(content, search, url, link)
if success:
    added += 1
    print(f"  ✅ Link 2")

if content != original:
    with open('ai-bias-fairness.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} links")

# ============================================================================
# AI-CONSCIOUSNESS-SOULS.HTML  
# ============================================================================
print("\n📝 ai-consciousness-souls.html")
with open('ai-consciousness-souls.html', 'r') as f:
    content = f.read()

original = content
added = 0

# Find actual text
import re
matches = re.findall(r'<p class="faq-answer">([^<]{100,200})', content)
if matches:
    # Link to Catholic AI Ethics on a sentence about human dignity
    for match in matches:
        if 'human' in match.lower() and 'dignity' in match.lower():
            search = match
            url = "catholic-ai-ethics.html"
            link = "Read our complete Catholic AI ethics framework"
            content, success = add_link(content, search, url, link)
            if success:
                added += 1
                print(f"  ✅ Added link")
                break

if content != original:
    with open('ai-consciousness-souls.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} links")

# ============================================================================
# AI-HEALTHCARE.HTML
# ============================================================================
print("\n📝 ai-healthcare.html")
with open('ai-healthcare.html', 'r') as f:
    content = f.read()

original = content  
added = 0

matches = re.findall(r'<p class="faq-answer">([^<]{100,200})', content)
if matches:
    for match in matches:
        if 'bias' in match.lower() and 'AI' in match:
            search = match
            url = "ai-bias-fairness.html"
            link = "Learn more about AI bias and fairness"
            content, success = add_link(content, search, url, link)
            if success:
                added += 1
                print(f"  ✅ Added link")
                break

if content != original:
    with open('ai-healthcare.html', 'w') as f:
        f.write(content)
    print(f"  💾 Added {added} links")

print("\n✅ Done! Check files for new contextual links")
