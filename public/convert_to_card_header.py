#!/usr/bin/env python3
"""
Convert hero header to card-style header in dcf_ai_resources.html
"""
import re

with open('dcf_ai_resources.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove hero CSS
hero_css_pattern = r'\.hero-section \{.*?\}'
content = re.sub(hero_css_pattern, '', content, flags=re.DOTALL)

hero_content_pattern = r'\.hero-content \{.*?\}'
content = re.sub(hero_content_pattern, '', content, flags=re.DOTALL)

hero_title_pattern = r'\.hero-title \{.*?\}'
content = re.sub(hero_title_pattern, '', content, flags=re.DOTALL)

hero_subtitle_pattern = r'\.hero-subtitle \{.*?\}'
content = re.sub(hero_subtitle_pattern, '', content, flags=re.DOTALL)

# Add card-style CSS before .main-container
card_css = """
        /* Page Header - Card Style */
        .page-header {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            margin-bottom: 3rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            text-align: center;
        }

        .page-title {
            font-size: 3rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 1rem;
            line-height: 1.2;
        }

        .page-subtitle {
            font-size: 1.25rem;
            color: #666;
            margin-bottom: 2rem;
        }

        """

content = content.replace('.main-container {', card_css + '.main-container {')

# Replace hero HTML with card header HTML
old_hero = r'<section class="hero-section">.*?</section>'
new_header = '''<main class="main-container">
        <div class="page-header">
            <h1 class="page-title">DCF Library</h1>
            <p class="page-subtitle">Your comprehensive resource center for AI ethics, Vatican documents, research, and educational materials</p>
            <div class="search-bar">
                <input type="text" class="search-input" placeholder="Search resources, articles, documents...">
                <span class="search-icon">🔍</span>
            </div>
        </div>'''

content = re.sub(old_hero, new_header, content, flags=re.DOTALL)

# Remove duplicate <main class="main-container"> if it exists
content = re.sub(r'<main class="main-container">\s*<main class="main-container">', '<main class="main-container">', content)

# Save
with open('dcf_ai_resources.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Converted to card-style header")
