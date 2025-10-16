with open('dcf_articles_library.html', 'r') as f:
    content = f.read()

# Replace articles-grid CSS with tight 4-column fixed grid
old_grid = '''        .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 2rem;
            align-items: stretch;
        }'''

new_grid = '''        .articles-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
        }'''

content = content.replace(old_grid, new_grid)

# Update mobile breakpoint to show 1 column
old_mobile = '''            .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 2rem;
            align-items: stretch;
        }'''

new_mobile = '''            .articles-grid {
                grid-template-columns: 1fr;
            }'''

content = content.replace(old_mobile, new_mobile)

# Make cards more compact
old_content = '''        .article-content {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }'''

new_content = '''        .article-content {
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }'''

content = content.replace(old_content, new_content)

# Smaller title
old_title = '''        .article-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #333;
            line-height: 1.4;
        }'''

new_title = '''        .article-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #333;
            line-height: 1.3;
        }'''

content = content.replace(old_title, new_title)

# Smaller excerpt
old_excerpt = '''        .article-excerpt {
            color: #666;
            line-height: 1.6;
            margin-bottom: 1rem;
            flex-grow: 1;
        }'''

new_excerpt = '''        .article-excerpt {
            color: #666;
            line-height: 1.5;
            margin-bottom: 0.75rem;
            flex-grow: 1;
            font-size: 0.9rem;
        }'''

content = content.replace(old_excerpt, new_excerpt)

with open('dcf_articles_library.html', 'w') as f:
    f.write(content)

print("✅ Created tight 4-column Figma-style grid")
