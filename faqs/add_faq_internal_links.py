#!/usr/bin/env python3
"""
FAQ Internal Linking Automation Script
Adds contextual internal links to blog posts and resources across all FAQ pages
"""

import re
import os
from pathlib import Path

# Define linking strategy for each FAQ page with CORRECT URLs
LINKING_MAP = {
    "catholic-ai-ethics.html": {
        "blog_links": [
            {
                "anchor": "Vatican's 35-year journey preparing for AI",
                "url": "../blog/the-wisdom-brief/from-mushroom-clouds-to-machine-code-how-the-vatican-spent-35-years-preparing-fo.html",
                "insert_after": "When did the Vatican start working on AI ethics?",
                "context": "The Vatican's formal AI ethics work began around 2018-2019"
            },
            {
                "anchor": "how the Vatican got tech giants to sign the Rome Call",
                "url": "../blog/the-wisdom-brief/the-vaticans-ai-revolution-how-rome-got-big-tech-to-sign-a-moral-code.html",
                "insert_after": "Why did tech companies agree to sign the Rome Call?",
                "context": "Tech companies signed the Rome Call in February 2020"
            },
            {
                "anchor": "Pope Francis's warnings about AI and work",
                "url": "../blog/the-wisdom-brief/the-vaticans-warning-about-ai-and-the-end-of-work.html",
                "insert_after": "What does Catholic teaching say about job automation?",
                "context": "Catholic Social Teaching views work as essential to human dignity"
            },
            {
                "anchor": "practical implementation guide",
                "url": "../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html",
                "insert_after": "How can Catholic institutions implement AI ethics in practice?",
                "context": "Catholic institutions should start by establishing AI ethics review processes"
            }
        ],
        "resource_links": [
            {
                "anchor": "Pope Francis's 2024 World Day of Peace message on AI",
                "url": "../vatican-resources/lvii-world-day-of-peace-2024-artificial-intelligence-and-peace.html",
                "insert_after": "What is Catholic AI ethics?",
                "context": "Catholic AI ethics is the application of Catholic moral teaching"
            },
            {
                "anchor": "Pope Francis's address on AI at the G7 summit",
                "url": "../vatican-resources/participation-of-the-holy-father-francis-at-the-g7-in-borgo-egnazia-puglia-14-june-2024.html",
                "insert_after": "What role did Pope Francis personally play in the Rome Call?",
                "context": "Pope Francis was the driving intellectual and moral force"
            }
        ]
    },
    
    "ai-jobs-catholic-teaching.html": {
        "blog_links": [
            {
                "anchor": "Vatican's complete position on AI and work",
                "url": "../blog/the-wisdom-brief/the-vaticans-warning-about-ai-and-the-end-of-work.html",
                "insert_after": "What does Catholic Social Teaching say about job automation?",
                "context": "Catholic Social Teaching views work as essential"
            }
        ],
        "resource_links": [
            {
                "anchor": "Pope Francis's teaching on work and education",
                "url": "../vatican-resources/lv-world-day-of-peace-2022-dialogue-between-generations-education-and-work-tools-for-building-lastin.html",
                "insert_after": "How does Catholic teaching view the relationship between work and human dignity?",
                "context": "work is participation in creation"
            }
        ],
        "faq_links": [
            {
                "anchor": "Catholic AI ethics principles",
                "url": "catholic-ai-ethics.html#work",
                "insert_after": "What is the Catholic perspective on automation?",
                "context": "Catholic Social Teaching emphasizes"
            }
        ]
    },
    
    "ai-bias-fairness.html": {
        "faq_links": [
            {
                "anchor": "full Catholic AI ethics framework",
                "url": "catholic-ai-ethics.html",
                "insert_after": "What is algorithmic bias?",
                "context": "Algorithmic bias occurs when"
            },
            {
                "anchor": "AI-generated misinformation",
                "url": "deepfakes-misinformation.html",
                "insert_after": "Can biased AI spread misinformation?",
                "context": "biased AI systems can amplify"
            }
        ],
        "blog_links": [
            {
                "anchor": "implementing these principles in your organization",
                "url": "../blog/ethical-ai-educational-materials/implementing-vatican-ai-ethics-in-your-organization-a-practical-checklist.html",
                "insert_after": "How can we prevent AI bias in practice?",
                "context": "preventing bias requires"
            }
        ]
    },
    
    "ai-healthcare.html": {
        "faq_links": [
            {
                "anchor": "Catholic AI ethics principles",
                "url": "catholic-ai-ethics.html",
                "insert_after": "What are the ethical concerns with AI in healthcare?",
                "context": "AI in healthcare raises"
            },
            {
                "anchor": "algorithmic bias in medical AI",
                "url": "ai-bias-fairness.html",
                "insert_after": "Can AI be biased in healthcare decisions?",
                "context": "AI systems can perpetuate"
            }
        ],
        "resource_links": [
            {
                "anchor": "Vatican's teaching on care and dignity",
                "url": "../vatican-resources/liv-world-day-of-peace-2021-a-culture-of-care-as-a-path-to-peace.html",
                "insert_after": "How does Catholic teaching apply to healthcare AI?",
                "context": "Catholic teaching emphasizes"
            }
        ]
    },
    
    "ai-consciousness-souls.html": {
        "faq_links": [
            {
                "anchor": "broader Catholic AI ethics framework",
                "url": "catholic-ai-ethics.html",
                "insert_after": "Can AI have consciousness?",
                "context": "Catholic teaching holds that"
            }
        ],
        "blog_links": [
            {
                "anchor": "fraternity and coexistence with AI",
                "url": "../blog/domus-communis-foundation/coexistence-fraternity-in-the-age-of-ai.html",
                "insert_after": "What makes humans different from AI?",
                "context": "Humans possess consciousness"
            }
        ]
    },
    
    "deepfakes-misinformation.html": {
        "resource_links": [
            {
                "anchor": "Pope Francis's message on fake news and truth",
                "url": "../vatican-resources/lii-world-communications-day-2018-the-truth-will-set-you-free-jn-832-fake-news-and-journalism-for-pe.html",
                "insert_after": "What does the Catholic Church say about misinformation?",
                "context": "Catholic teaching emphasizes truth"
            }
        ]
    }
}


def add_link_to_answer(html_content, search_text, link_html, context_check):
    """
    Add a link within an FAQ answer, checking for context match
    """
    # Find the FAQ item containing the search text
    pattern = rf'(<div class="faq-item">.*?<h3 class="faq-question">{re.escape(search_text)}.*?</h3>.*?<p class="faq-answer">)(.*?)(</p>)'
    
    match = re.search(pattern, html_content, re.DOTALL)
    
    if match and context_check in match.group(2):
        # Add link at end of first sentence
        answer_text = match.group(2)
        first_sentence_end = answer_text.find('. ') + 1
        
        if first_sentence_end > 0:
            modified_answer = (
                answer_text[:first_sentence_end] + 
                f' For more details, see our {link_html}.' +
                answer_text[first_sentence_end:]
            )
            
            modified_html = match.group(1) + modified_answer + match.group(3)
            html_content = html_content.replace(match.group(0), modified_html)
            return html_content, True
    
    return html_content, False


def process_faq_file(filename, links_config):
    """
    Process a single FAQ file and add internal links
    """
    filepath = Path(filename)
    
    if not filepath.exists():
        print(f"⚠️  File not found: {filename}")
        return False
    
    print(f"\n📝 Processing: {filename}")
    
    # Read file
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    links_added = 0
    
    # Add blog links
    for link in links_config.get('blog_links', []):
        link_html = f'<a href="{link["url"]}">{link["anchor"]}</a>'
        content, success = add_link_to_answer(
            content,
            link['insert_after'],
            link_html,
            link['context']
        )
        if success:
            links_added += 1
            print(f"  ✅ Added blog link: {link['anchor']}")
        else:
            print(f"  ⚠️  Could not add blog link: {link['anchor']}")
    
    # Add resource links
    for link in links_config.get('resource_links', []):
        link_html = f'<a href="{link["url"]}">{link["anchor"]}</a>'
        content, success = add_link_to_answer(
            content,
            link['insert_after'],
            link_html,
            link['context']
        )
        if success:
            links_added += 1
            print(f"  ✅ Added resource link: {link['anchor']}")
        else:
            print(f"  ⚠️  Could not add resource link: {link['anchor']}")
    
    # Add FAQ cross-links
    for link in links_config.get('faq_links', []):
        link_html = f'<a href="{link["url"]}">{link["anchor"]}</a>'
        content, success = add_link_to_answer(
            content,
            link['insert_after'],
            link_html,
            link['context']
        )
        if success:
            links_added += 1
            print(f"  ✅ Added FAQ link: {link['anchor']}")
        else:
            print(f"  ⚠️  Could not add FAQ link: {link['anchor']}")
    
    # Save if changes were made
    if content != original_content:
        # Backup original
        backup_path = filepath.with_suffix('.html.prelink_backup')
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)
        
        # Save modified
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  💾 Saved {links_added} new links")
        print(f"  📦 Backup saved to: {backup_path.name}")
        return True
    else:
        print(f"  ℹ️  No changes made")
        return False


def main():
    print("=" * 80)
    print("FAQ INTERNAL LINKING AUTOMATION")
    print("=" * 80)
    
    files_modified = 0
    
    for filename, links_config in LINKING_MAP.items():
        if process_faq_file(filename, links_config):
            files_modified += 1
    
    print("\n" + "=" * 80)
    print(f"✅ COMPLETE: Modified {files_modified} files")
    print("=" * 80)
    print("\nRun the analyzer to see improvement:")
    print("  python3 analyze_faq_llm_optimization.py")


if __name__ == "__main__":
    main()
