with open('dcf_articles_library.html', 'r') as f:
    content = f.read()

# Find the current filter buttons and replace with tag-based filtering
old_filters = '''                <button class="filter-btn active" data-category="all">All Articles</button>
                <button class="filter-btn" data-category="the-wisdom-brief">The Wisdom Brief</button>
                <button class="filter-btn" data-category="code-to-conscience">Code to Conscience</button>
                <button class="filter-btn" data-category="ethical-ai-educational-materials">Educational Materials</button>
                <button class="filter-btn" data-category="domus-communis-foundation">Domus Communis</button>
                <button class="filter-btn" data-category="ai_weapons_systems">AI & Weapons</button>
                <button class="filter-btn" data-category="dcf_nuclear_disarmament_blog">Nuclear Disarmament</button>'''

new_filters = '''                <button class="filter-btn active" data-filter-type="blog" data-category="all">All Articles</button>
                <button class="filter-btn" data-filter-type="blog" data-category="the-wisdom-brief">The Wisdom Brief</button>
                <button class="filter-btn" data-filter-type="blog" data-category="code-to-conscience">Code to Conscience</button>
                <button class="filter-btn" data-filter-type="blog" data-category="ethical-ai-educational-materials">Educational Materials</button>
                <button class="filter-btn" data-filter-type="blog" data-category="domus-communis-foundation">Domus Communis</button>
                <button class="filter-btn" data-filter-type="blog" data-category="ai_weapons_systems">AI & Weapons</button>
                <button class="filter-btn" data-filter-type="blog" data-category="dcf_nuclear_disarmament_blog">Nuclear Disarmament</button>
                <button class="filter-btn" data-filter-type="tag" data-category="ai-ethics-philosophy">AI Ethics</button>
                <button class="filter-btn" data-filter-type="tag" data-category="warfare-security">Security</button>
                <button class="filter-btn" data-filter-type="tag" data-category="education-formation">Education</button>'''

content = content.replace(old_filters, new_filters)

with open('dcf_articles_library.html', 'w') as f:
    f.write(content)

print("✅ Added tag-based filter buttons")
